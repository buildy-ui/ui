import { QdrantClient } from '@qdrant/js-client-rest';
import { ENV } from '../../config/env';

let qdrantSingleton: QdrantClient | null = null;

export function getQdrantClient(): QdrantClient {
  if (!qdrantSingleton) {
    qdrantSingleton = new QdrantClient({ url: ENV.QDRANT_URL, apiKey: ENV.QDRANT_KEY });
  }
  return qdrantSingleton;
}

export async function ensureCollection(collectionName: string, vectorSize: number): Promise<void> {
  const client = getQdrantClient();
  try {
    const existing = await client.getCollection(collectionName);
    // Try to discover configured vector size across possible response shapes
    // @ts-ignore best-effort probing of response
    const configuredDim = existing?.result?.config?.params?.vectors?.size
      // @ts-ignore legacy path
      ?? existing?.result?.params?.vectors?.size
      // @ts-ignore sometimes vectors may be an object with named vectors
      ?? (typeof existing?.result?.config?.params?.vectors === 'object' && existing?.result?.config?.params?.vectors?.size)
      ?? undefined;
    if (configuredDim && configuredDim !== vectorSize) {
      console.warn(
        `Collection '${collectionName}' exists with dim=${configuredDim}, but required=${vectorSize}. Recreating collection...`
      );
      await client.deleteCollection(collectionName);
      await client.createCollection(collectionName, {
        vectors: { size: vectorSize, distance: 'Cosine' },
      } as any);
      console.log(`Collection '${collectionName}' recreated with size=${vectorSize}.`);
    } else {
      console.log(`Skipping creating collection; '${collectionName}' already exists${configuredDim ? ` (dim=${configuredDim})` : ''}.`);
    }
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status;
    const statusText = String(e?.statusText || e?.response?.statusText || '');
    const msg = String(e?.message || e);
    if (status === 404 || statusText.toLowerCase() === 'not found' || msg.toLowerCase().includes('not found')) {
      console.log(`Collection '${collectionName}' not found. Creating it now...`);
      await client.createCollection(collectionName, {
        vectors: { size: vectorSize, distance: 'Cosine' },
      } as any);
      console.log(`Collection '${collectionName}' created successfully.`);
    } else {
      console.error('Error while checking collection:', e);
      throw e;
    }
  }
}

function assertVectorsValid(ids: string[], vectors: number[][]): { usedIds: string[]; usedVectors: number[][]; dim: number } {
  const minLen = Math.min(ids.length, vectors.length);
  const usedIds = ids.slice(0, minLen);
  const usedVectors = vectors.slice(0, minLen);
  if (usedIds.length === 0) {
    throw new Error('No ids provided for upsert.');
  }
  if (usedVectors.length === 0) {
    throw new Error('No vectors provided for upsert.');
  }
  const dim = usedVectors[0]?.length ?? 0;
  if (!dim) throw new Error('First vector is empty or undefined.');
  for (let i = 0; i < usedVectors.length; i++) {
    const v = usedVectors[i];
    const id = usedIds[i];
    if (!id) throw new Error(`Missing id at index ${i}.`);
    if (!Array.isArray(v) || v.length !== dim) {
      throw new Error(`Vector at index ${i} has invalid dimension ${Array.isArray(v) ? v.length : 'N/A'} (expected ${dim}).`);
    }
    if (v.some((n) => typeof n !== 'number' || Number.isNaN(n))) {
      throw new Error(`Vector at index ${i} contains non-number/NaN values.`);
    }
  }
  return { usedIds, usedVectors, dim };
}

export async function upsertEmbeddings(collectionName: string, ids: string[], vectors: number[][]): Promise<void> {
  const client = getQdrantClient();
  const { usedIds, usedVectors, dim } = assertVectorsValid(ids, vectors);
  const points = usedIds.map((id, i) => ({ id, vector: usedVectors[i], payload: { id } }));
  try {
    await client.upsert(collectionName, { points } as any);
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.error('Qdrant upsert failed:', msg);
    try {
      const col = await client.getCollection(collectionName);
      // @ts-ignore shape may vary; best-effort logging only
      const configuredDim = col?.result?.config?.params?.vectors?.size ?? col?.result?.vectors?.size;
      console.error(`Collection '${collectionName}' configured dimension: ${configuredDim}, first vector dim: ${dim}, points: ${points.length}`);
    } catch {}
    throw e;
  }
}

export async function searchTopK(collectionName: string, queryVector: number[], topK: number) {
  const client = getQdrantClient();
  const res = await client.search(collectionName, {
    vector: queryVector,
    limit: topK,
    with_payload: true,
  } as any);
  return res;
}

export async function retrieveExistingIds(collectionName: string, ids: string[]): Promise<Set<string>> {
  const client = getQdrantClient();
  if (ids.length === 0) return new Set();
  const res = await client.retrieve(collectionName, { ids } as any);
  const existing = new Set<string>();
  for (const p of res) {
    // @ts-ignore
    if (p?.id != null) existing.add(String(p.id));
  }
  return existing;
}

export async function upsertVectorsWithPayload(
  collectionName: string,
  items: Array<{ id: string; vector: number[]; payload?: Record<string, any> }>
): Promise<void> {
  if (items.length === 0) return;
  const dim = items[0].vector.length;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!Array.isArray(it.vector) || it.vector.length !== dim) {
      throw new Error(`Vector at index ${i} has invalid dimension ${Array.isArray(it.vector) ? it.vector.length : 'N/A'} (expected ${dim}).`);
    }
  }
  const client = getQdrantClient();
  const points = items.map((it) => ({ id: it.id, vector: it.vector, payload: it.payload ?? { id: it.id } }));
  await client.upsert(collectionName, { points } as any);
}

// ------- Qdrant Collections CRUD -------
export async function listCollections(): Promise<string[]> {
  const client = getQdrantClient();
  const res = await client.getCollections();
  // @ts-ignore shape varies by client version
  const names = (res?.collections ?? res?.result?.collections ?? []).map((c: any) => c.name);
  return names;
}

export async function getCollectionInfo(collectionName: string): Promise<any> {
  const client = getQdrantClient();
  const res = await client.getCollection(collectionName);
  return res;
}

export async function deleteCollection(collectionName: string): Promise<void> {
  const client = getQdrantClient();
  await client.deleteCollection(collectionName);
}

// ------- Qdrant Points CRUD -------
export async function getPoints(collectionName: string, ids: string[]): Promise<any[]> {
  const client = getQdrantClient();
  if (ids.length === 0) return [];
  const res = await client.retrieve(collectionName, { ids } as any);
  return res as any[];
}

export async function deletePoints(collectionName: string, ids: string[]): Promise<void> {
  const client = getQdrantClient();
  if (ids.length === 0) return;
  await client.delete(collectionName, { points: ids } as any);
}

export async function deleteAllPoints(collectionName: string): Promise<void> {
  const client = getQdrantClient();
  await client.delete(collectionName, { filter: {} } as any);
}

// Upsert only items that do not already exist (matching by id)
export async function upsertIfMissing(
  collectionName: string,
  items: Array<{ id: string; vector: number[]; payload?: Record<string, any> }>
): Promise<{ inserted: number; skipped: number }> {
  const existing = await retrieveExistingIds(collectionName, items.map((i) => i.id));
  const missing = items.filter((i) => !existing.has(i.id));
  if (missing.length > 0) {
    await upsertVectorsWithPayload(collectionName, missing);
  }
  return { inserted: missing.length, skipped: items.length - missing.length };
}