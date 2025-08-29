/**
 * Build a GraphRAG agent with Neo4j and Qdrant
 * This idea is from Qdrant documentation for Python
 * https://qdrant.tech/documentation/examples/graphrag-qdrant-neo4j/#build-a-graphrag-agent-with-neo4j-and-qdrant
 *
 * This is the implementation for Node.js
 */
import {
  ensureCollection,
  upsertEmbeddings,
  upsertVectorsWithPayload,
  retrieveExistingIds,
  listCollections,
  getCollectionInfo,
  deleteCollection,
  getPoints,
  deletePoints,
  deleteAllPoints,
  upsertIfMissing,
} from './infrastructure/vector/qdrant';
import { getNeo4jDriver, ingestToNeo4j, upsertEntity, upsertRelationship } from './infrastructure/graph/neo4j';
import { createEmbeddings } from './infrastructure/llm/openai';
import { setPrompt, getPrompt, listPrompts, deletePrompt } from './application/graphrag';
import { GraphRepository, AdvancedGraphRepository, ingestBulkTransactional } from './infrastructure/graph/neo4j';
import type { IngestRequestDTO, QdrantItemDTO, ComponentDTO, FragmentJSON } from './domain/types';
import { IngestRequestSchema, QdrantItemSchema, ComponentSchema, RelationshipSchema, FragmentSchema } from './domain/types';

export {
  ensureCollection,
  upsertEmbeddings,
  upsertVectorsWithPayload,
  retrieveExistingIds,
  getNeo4jDriver,
  ingestToNeo4j,
  upsertEntity,
  upsertRelationship,
  // Qdrant collection/points helpers
  listCollections,
  getCollectionInfo,
  deleteCollection,
  getPoints,
  deletePoints,
  deleteAllPoints,
  upsertIfMissing,
  // Prompt registry
  setPrompt,
  getPrompt,
  listPrompts,
  deletePrompt,
  // Repository
  GraphRepository,
  AdvancedGraphRepository,
  ingestBulkTransactional,
  // zod validators
  IngestRequestSchema,
  QdrantItemSchema,
  ComponentSchema,
  RelationshipSchema,
  FragmentSchema,
};

// ------- Ingest utilities -------
export async function ingestQdrantItems(collection: string, items: QdrantItemDTO[]): Promise<void> {
  if (items.length === 0) return;
  const vectors = await createEmbeddings(items.map((i) => i.description));
  const upsertItems = items.map((i, idx) => ({ id: i.id, vector: vectors[idx], payload: i.payload ?? { id: i.id } }));
  await upsertIfMissing(collection, upsertItems);
}

export async function ingestComponentsToNeo4j(components: ComponentDTO[], relationships?: Array<{ sourceId: string; targetId: string; type: string; props?: Record<string, any> }>): Promise<void> {
  const repo = new GraphRepository();
  await repo.ensureUniqueIdConstraint('Entity');
  for (const c of components) {
    await upsertEntity(c.id, c.name, ['Entity', 'Component'], { category: c.category, tags: c.tags, ...(c.props ?? {}) });
  }
  if (relationships && relationships.length) {
    for (const r of relationships) {
      await upsertRelationship(r.sourceId, r.targetId, r.type, r.props ?? {});
    }
  }
}

export async function ingest(request: IngestRequestDTO): Promise<void> {
  const { collection, qdrant, components, relationships } = request;
  if (qdrant && qdrant.length) {
    await ingestQdrantItems(collection, qdrant);
  }
  if (components && components.length) {
    await ingestComponentsToNeo4j(components, relationships);
  }
}

// ------- Fragment helpers -------
// Minimal helper: ingest a single fragment into both stores with the same id
export async function ingestFragment(
  collection: string,
  id: string,
  fragment: FragmentJSON,
  component: { name: string; category?: string; tags?: string[]; props?: Record<string, any> } = { name: id }
): Promise<void> {
  FragmentSchema.parse(fragment);
  const vectors = await createEmbeddings([fragment.description]);
  await ensureCollection(collection, vectors[0].length);
  await upsertIfMissing(collection, [
    { id, vector: vectors[0], payload: { id, category: fragment.category, tags: fragment.tags } },
  ]);
  await upsertEntity(id, component.name, ['Entity', 'Component'], {
    category: component.category ?? fragment.category,
    tags: component.tags ?? fragment.tags,
    ...(component.props ?? {}),
  });
}

// Batch helper for multiple fragments
export async function ingestFragments(
  collection: string,
  items: Array<{ id: string; fragment: FragmentJSON; component?: { name: string; category?: string; tags?: string[]; props?: Record<string, any> } }>
): Promise<void> {
  if (items.length === 0) return;
  items.forEach((i) => FragmentSchema.parse(i.fragment));
  const texts = items.map((i) => i.fragment.description);
  const vectors = await createEmbeddings(texts);
  await ensureCollection(collection, vectors[0].length);
  const upserts = items.map((i, idx) => ({
    id: i.id,
    vector: vectors[idx],
    payload: { id: i.id, category: i.fragment.category, tags: i.fragment.tags },
  }));
  await upsertIfMissing(collection, upserts);
  for (const i of items) {
    const comp = i.component ?? { name: i.id };
    await upsertEntity(i.id, comp.name, ['Entity', 'Component'], {
      category: comp.category ?? i.fragment.category,
      tags: comp.tags ?? i.fragment.tags,
      ...(comp.props ?? {}),
    });
  }
}

export class BrainEngine {
  async ensureQdrantCollection(name: string, dimension: number): Promise<void> {
    await ensureCollection(name, dimension);
  }

  async upsertVectors(
    collection: string,
    items: Array<{ id: string; vector: number[]; payload?: Record<string, any> }>
  ): Promise<void> {
    await upsertVectorsWithPayload(collection, items);
  }

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    return createEmbeddings(texts);
  }

  async upsertEntity(id: string, name: string, labels: string[] = ['Entity'], props: Record<string, any> = {}): Promise<void> {
    await upsertEntity(id, name, labels, props);
  }

  async upsertRelationship(sourceId: string, targetId: string, type: string, props: Record<string, any> = {}): Promise<void> {
    await upsertRelationship(sourceId, targetId, type, props);
  }
}
