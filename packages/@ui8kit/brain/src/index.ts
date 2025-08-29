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
import { extractGraphComponents } from './application/extract';
import { createEmbeddings } from './infrastructure/llm/openai';
import { retrieverSearch } from './application/retriever';
import { formatGraphContext, graphRAGRun, setPrompt, getPrompt, listPrompts, deletePrompt } from './application/graphrag';
import { GraphRepository } from './infrastructure/graph/neo4j';
import type { IngestRequestDTO, QdrantItemDTO, ComponentDTO } from './domain/types';

/**
 * This is the main entry point for the application.
 * It will extract the graph components from the raw text,
 * ingest them to Neo4j,
 * create embeddings for the graph components,
 * upsert them to Qdrant,
 * and then run the GraphRAG algorithm to answer the query.
 */
async function main() {
  console.log('Script started');
  const collectionName = 'graphRAGtw'; // This is the name of the collection in Qdrant

  // Example raw text to extract graph components from
  const raw = `Дизайн систем упрощает совместную разработку.
Компоненты React работают с Tailwind.
Shadcn обеспечивает модульность компонентов дизайна.
Tailwind ускоряет прототипирование визуальных решений.
Компонентам нужно единое соглашение стилей.
Система кода описывает принципы использования.
Компоненты должны быть переиспользуемыми и доступными.
Увеличение повторного использования снижает дубликаты.
Tailwind позволяет описывать стиль в классы.
Шаблоны компонентов ускоряют общую разработку.
Shadcn обеспечивает совместные стили в проектах.
Компоненты должны документироваться внутри системы.
Гайдлайны дизайна описывают оттенки и контрасты.
Реактивные UI обновляются гладко благодаря абстракциям.
Взгляд на Tailwind упрощает верстку.
Конструктивные принципы помогают масштабировать UX.
Реиспользуемые хуки улучшают производительность приложений.
Паттерны дизайна ускоряют принятие решения.
Тестирование интерфейсов важно для стабильности.
Архитектура компонентов упорядочивает кодовую базу.
Обратная совместимость важна при обновлениях.
Документация ускоряет вхождение новых разработчиков.
Стили из Tailwind можно централизовать.
Shadcn упрощает стилизацию повторных компонентов.
Итоговый подход объединяет дизайн и код.`;

  console.log('Extracting graph components...');
  // Extract graph components from the raw text
  const { nodes, relationships } = await extractGraphComponents(raw);
  console.log('Nodes:', nodes);
  console.log('Relationships:', relationships);

  console.log('Ingesting to Neo4j...');
  // Ingest the graph components to Neo4j
  const nodeIdMapping = await ingestToNeo4j(nodes, relationships);
  console.log('Neo4j ingestion complete');

  /**
   * This is the embedding creation and upsertion to Qdrant.
   * It will create embeddings for the graph components,
   * and then upsert them to Qdrant.
   */
  console.log('Creating embeddings for Qdrant...');
  // Create embeddings for the graph components
  const paragraphs = raw.split('\n');
  const vectors = await createEmbeddings(paragraphs);
  const detectedDim = vectors[0]?.length ?? 0;
  if (!detectedDim) {
    throw new Error('Failed to create embeddings: first vector is missing or empty.');
  }
  // Ensure collection exists in Qdrant with detected vector dimension
  console.log('Creating/ensuring collection...');
  await ensureCollection(collectionName, detectedDim);
  const ids = Object.values(nodeIdMapping).slice(0, vectors.length);
  console.log('Upserting into Qdrant...');
  // Upsert the embeddings to Qdrant with payloads for richer queries
  const items = ids.map((id, i) => ({ id, vector: vectors[i], payload: { id, source: 'demo', paragraph: paragraphs[i] } }));
  await upsertVectorsWithPayload(collectionName, items);
  console.log('Qdrant ingestion complete');

  /**
   * This is the GraphRAG algorithm.
   * It will use the retriever to find the most relevant graph components,
   * format the graph context for the GraphRAG algorithm,
   * and then run the GraphRAG algorithm to answer the query.
   */
  const query = 'How is tailwind connected to shadcn?'; // This is the query to ask the graph

  /**
   * This is the retriever search.
   * It will use the retriever to find the most relevant graph components,
   * and then format the graph context for the GraphRAG algorithm.
   */
  console.log('Starting retriever search...');
  const ret = await retrieverSearch(collectionName, query, 5);
  console.log('Retriever ids:', ret.ids);

  // Format the graph context for the GraphRAG algorithm
  console.log('Formatting graph context...');
  const graphContext = formatGraphContext(ret.subgraph);
  console.log('Graph context:', graphContext);

  /**
   * This is the GraphRAG algorithm.
   * It will use the retriever to find the most relevant graph components,
   * format the graph context for the GraphRAG algorithm,
   * and then run the GraphRAG algorithm to answer the query.
   */
  console.log('Running GraphRAG...');
  const answer = await graphRAGRun(graphContext, query);
  console.log('Final Answer:', answer); // This is the final answer

  // Clean up Neo4j driver on exit
  await getNeo4jDriver().close();
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

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
