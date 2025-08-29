### Overview
Use `@ui8kit/brain` as a pluggable RAG engine: embed text into Qdrant, model relationships in Neo4j, and retrieve by blending vector relevance with graph context. Import only what you need; nothing auto-runs on import.

### Install and Configure
- Set required environment variables (`QDRANT_URL`, `QDRANT_KEY`, `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `OPENROUTER_URL`, `OPENROUTER_API_KEY`, `EMBEDDING_URL`, `EMBEDDING_API_KEY`).
- Ensure your Neo4j instance has APOC available if you plan to use bulk ingest.

### Quick Start
```ts
import {
  BrainEngine,
  ensureCollection,
  upsertIfMissing,
  createEmbeddings, // via engine or direct import
} from '@ui8kit/brain';

const engine = new BrainEngine();

async function boot() {
  const texts = ['hero.centered...', 'cta.banner...'];
  const vectors = await engine.createEmbeddings(texts);
  await engine.ensureQdrantCollection('components', vectors[0].length);
  await upsertIfMissing(
    'components',
    vectors.map((v, i) => ({ id: `comp_${i}`, vector: v, payload: { category: 'hero' } }))
  );
}
```

### Embeddings and Qdrant
- create vectors:
  - `createEmbeddings(texts: string[]): Promise<number[][]>` — token-aware batching (<=7000 tokens per request).
- collections:
  - `ensureCollection(name: string, dimension: number): Promise<void>` — creates or recreates if dimension mismatch.
  - `listCollections(): Promise<string[]>`
  - `getCollectionInfo(name: string): Promise<any>`
  - `deleteCollection(name: string): Promise<void>`
- points:
  - `upsertVectorsWithPayload(collection, items)` — `{ id, vector, payload? }[]`
  - `retrieveExistingIds(collection, ids): Promise<Set<string>>`
  - `upsertIfMissing(collection, items): Promise<{ inserted, skipped }>`
  - `getPoints(collection, ids): Promise<any[]>`
  - `deletePoints(collection, ids): Promise<void>`
  - `deleteAllPoints(collection): Promise<void>`

Typical ingestion:
```ts
import { ensureCollection, upsertIfMissing, createEmbeddings } from '@ui8kit/brain';

const collection = 'components';
const items = [
  { id: 'hero_1', description: 'Hero block with centered header', payload: { category: 'hero', tags: ['layout:stack'] } },
  { id: 'hero_2', description: 'Hero with background image', payload: { category: 'hero', tags: ['variant:image'] } },
];

const vectors = await createEmbeddings(items.map(i => i.description));
await ensureCollection(collection, vectors[0].length);
await upsertIfMissing(collection, items.map((i, idx) => ({ id: i.id, vector: vectors[idx], payload: i.payload })));
```

### Neo4j: Upserts, CRUD, and Queries
- basic upserts:
  - `upsertEntity(id, name, labels?=['Entity'], props?)` — MERGE node, safe labels.
  - `upsertRelationship(sourceId, targetId, type, props?)` — MERGE relationship.
  - `ingestToNeo4j(nodesMap, relationships)` — legacy batch ingest.
- repository (simple):
  - `GraphRepository`:
    - `getNodeById(id, label='Entity'): Promise<any|null>`
    - `listNodes({ label?, props?, limit?, offset? }): Promise<any[]>`
    - `deleteNode(id, detach=true, label='Entity')`
    - `deleteRelationship(sourceId, targetId, type)`
    - `ensureUniqueIdConstraint(label='Entity')`
    - `findByName(name, label='Entity', limit=25)`
- advanced queries:
  - `AdvancedGraphRepository`:
    - `listNodesAdvanced({ labels?, where?, orderBy?, limit?, offset? })`
    - `listRelationships({ type?, sourceLabel?, targetLabel?, sourceWhere?, relWhere?, targetWhere?, orderBy?, limit?, offset? })`
    - `listNeighborsByDepth(id, minDepth=1, maxDepth=1)`
- bulk transactional ingest:
  - `ingestBulkTransactional(nodes, relationships)` — executes in a write transaction; uses APOC for node merges.

Example:
```ts
import { GraphRepository, AdvancedGraphRepository, upsertEntity, upsertRelationship, ingestBulkTransactional } from '@ui8kit/brain';

await new GraphRepository().ensureUniqueIdConstraint('Entity');
await upsertEntity('hero', 'Hero', ['Entity', 'Component'], { category: 'hero', tags: ['layout:stack'] });
await upsertEntity('header', 'Header', ['Entity', 'Component']);
await upsertRelationship('hero', 'header', 'HAS_ELEMENT');

const adv = new AdvancedGraphRepository();
const comps = await adv.listNodesAdvanced({
  labels: ['Entity', 'Component'],
  where: { category: { op: 'eq', value: 'hero' } },
  orderBy: { key: 'name', direction: 'ASC' },
  limit: 50,
});

await ingestBulkTransactional(
  [{ id: 'cta', name: 'CTA', labels: ['Entity', 'Component'] }],
  [{ sourceId: 'hero', targetId: 'cta', type: 'HAS_ELEMENT' }],
);
```

### Prompt Registry
Customize prompts per task and use them in RAG.
- API:
  - `setPrompt(kind: string, prompt: string)`
  - `getPrompt(kind: string): string | undefined`
  - `listPrompts(): { kind, prompt }[]`
  - `deletePrompt(kind: string)`
- RAG uses `getPrompt('rag')` if set.

Example:
```ts
import { setPrompt, getPrompt } from '@ui8kit/brain';

setPrompt('rag', 'Use the following graph data to answer precisely and concisely.');
console.log(getPrompt('rag'));
```

### End-to-End Ingest DTOs and Utilities
- types:
  - `QdrantItemDTO { id, description, payload? }`
  - `ComponentDTO { id, name, category?, tags?, props? }`
  - `IngestRequestDTO { collection, qdrant?, components?, relationships? }`
- zod validators:
  - `QdrantItemSchema`, `ComponentSchema`, `RelationshipSchema`, `IngestRequestSchema`
- ingest utilities:
  - `ingestQdrantItems(collection, items: QdrantItemDTO[])`
  - `ingestComponentsToNeo4j(components: ComponentDTO[], relationships?)`
  - `ingest(request: IngestRequestDTO)`

Example:
```ts
import { ingest, IngestRequestSchema } from '@ui8kit/brain';

const req = {
  collection: 'components',
  qdrant: [
    { id: 'hero_1', description: 'Hero block...', payload: { category: 'hero', tags: ['layout:stack'] } },
  ],
  components: [
    { id: 'hero', name: 'Hero', category: 'hero', tags: ['layout:stack'] },
    { id: 'header', name: 'Header' },
  ],
  relationships: [
    { sourceId: 'hero', targetId: 'header', type: 'HAS_ELEMENT' },
  ],
};

IngestRequestSchema.parse(req);
await ingest(req);
```

### Fragment JSON Helpers (Qdrant + Neo4j)
For a minimal JSON fragment like:
```json
{
  "description": "hero.centered for focused messaging...",
  "tags": ["category:hero", "layout:stack", "element:header"],
  "category": "hero"
}
```
Use helpers to store vectors in Qdrant and structure in Neo4j under the same id.

```ts
import { ingestFragment, ingestFragments } from '@ui8kit/brain';

await ingestFragment('components', 'hero_centered', {
  description: 'hero.centered for focused messaging...',
  tags: ['category:hero', 'layout:stack', 'element:header'],
  category: 'hero',
});

await ingestFragments('components', [
  {
    id: 'hero_image',
    fragment: {
      description: 'hero with background image',
      tags: ['category:hero', 'variant:image'],
      category: 'hero',
    },
    component: { name: 'HeroImage' },
  },
]);
```

### Retrieval Flow
- Use vector search, then expand graph:
  - `retrieverSearch(collection, query, topK)` embeds the query, searches Qdrant, returns `{ ids, subgraph }` where `ids` originate from Qdrant `payload.id`.
  - `formatGraphContext(subgraph)` shapes nodes/edges.
  - `graphRAGRun(graphContext, userQuery)` calls the LLM using your optional `rag` prompt.

### Engine Facade (optional)
```ts
import { BrainEngine } from '@ui8kit/brain';

const brain = new BrainEngine();
await brain.ensureQdrantCollection('components', 384);
const vectors = await brain.createEmbeddings(['some text']);
await brain.upsertVectors('components', [{ id: 'x1', vector: vectors[0], payload: { topic: 'ui' } }]);
```

### Best Practices
- Keep IDs consistent across Qdrant and Neo4j.
- Add unique constraints on `(:Entity {id})` and any new labels using `GraphRepository.ensureUniqueIdConstraint`.
- Store descriptive text in Qdrant; store structure (category, tags, relations) in Neo4j.
- Use `upsertIfMissing` to avoid exceeding RPS when re-ingesting.