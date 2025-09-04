import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = (import.meta as any).env?.VITE_QDRANT_URL as string | undefined;
const QDRANT_KEY = (import.meta as any).env?.VITE_QDRANT_KEY as string | undefined;
const IS_DEV = (import.meta as any).env?.DEV as boolean | undefined;

function assertConfig() {
  if (!QDRANT_URL || !QDRANT_KEY) {
    throw new Error('Missing VITE_QDRANT_URL or VITE_QDRANT_KEY. Please set them in your env to use Qdrant features.');
  }
}

async function qdrantFetch(path: string, init?: RequestInit): Promise<Response> {
  assertConfig();
  const useProxy = IS_DEV && QDRANT_URL;
  const url = useProxy ? `/qdrant${path}` : `${QDRANT_URL}${path}`;
  const headers = useProxy
    ? { 'content-type': 'application/json', ...(init?.headers || {}) }
    : { 'api-key': QDRANT_KEY!, 'content-type': 'application/json', ...(init?.headers || {}) };

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    let body: any = undefined;
    try { body = await res.json(); } catch {}
    const message = body?.status?.error || body?.error || body?.result || res.statusText || `HTTP ${res.status}`;
    // eslint-disable-next-line no-console
    console.error('Qdrant error details:', { url, status: res.status, body: JSON.stringify(body, null, 2) });
    throw new Error(`Qdrant request failed: ${message}`);
  }
  return res;
}

export async function listCollections(): Promise<string[]> {
  const res = await qdrantFetch('/collections');
  const data = await res.json();
  const collections = (data?.result?.collections ?? data?.collections ?? []) as Array<{ name: string } | string>;
  return collections.map((c: any) => typeof c === 'string' ? c : c?.name).filter(Boolean);
}

export async function deleteCollection(name: string): Promise<void> {
  await qdrantFetch(`/collections/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

type ScrollResponse = { points: any[]; next: any | null };

async function scrollOnce(collection: string, offset?: any, limit = 100, withVector = false): Promise<ScrollResponse> {
  const res = await qdrantFetch(`/collections/${encodeURIComponent(collection)}/points/scroll`, {
    method: 'POST',
    body: JSON.stringify({
      with_payload: true,
      with_vector: withVector,
      limit,
      offset,
    }),
  });
  const data = await res.json();
  const result = data?.result ?? data;
  const points = (result?.points ?? []) as any[];
  const next = result?.next_page_offset ?? result?.next_offset ?? result?.offset ?? null;
  return { points, next };
}

export async function getPointsFirstN(collection: string, maxPoints = 200): Promise<any[]> {
  const acc: any[] = [];
  let offset: any = undefined;
  while (acc.length < maxPoints) {
    const { points, next } = await scrollOnce(collection, offset);
    acc.push(...points);
    if (!next) break;
    offset = next;
  }
  return acc.slice(0, maxPoints);
}

export function pickDisplayFields(point: any): Record<string, any> {
  const payload = point?.payload ?? {};
  const id = payload?.originalId ?? point?.id; // Use original ID from payload
  const category = payload?.category ?? payload?.qdrant?.category;
  const tags = payload?.tags ?? payload?.qdrant?.tags;
  const description = payload?.description ?? payload?.qdrant?.description;
  return { id, category, tags, description };
}

// Vector search (expects embedding array)
export async function searchTopK(collection: string, vector: number[], topK = 20): Promise<any[]> {
  const res = await qdrantFetch(`/collections/${encodeURIComponent(collection)}/points/search`, {
    method: 'POST',
    body: JSON.stringify({
      vector,
      limit: topK,
      with_payload: true,
      with_vector: false,
    }),
  });
  const data = await res.json();
  return data?.result ?? [];
}

// Filtered search by category/tags
export async function searchWithFilters(collection: string, opts: { category?: string; tagsMust?: string[]; tagsShould?: string[]; limit?: number }): Promise<any[]> {
  const must: any[] = [];
  const should: any[] = [];
  if (opts.category) must.push({ key: 'category', match: { value: opts.category } });
  for (const t of opts.tagsMust ?? []) must.push({ key: 'tags', match: { value: t } });
  for (const t of opts.tagsShould ?? []) should.push({ key: 'tags', match: { value: t } });
  const filter = { ...(must.length ? { must } : {}), ...(should.length ? { should } : {}) };
  const res = await qdrantFetch(`/collections/${encodeURIComponent(collection)}/points/scroll`, {
    method: 'POST',
    body: JSON.stringify({ with_payload: true, limit: opts.limit ?? 100, filter }),
  });
  const data = await res.json();
  return data?.result?.points ?? [];
}

export async function ensureCollection(name: string, vectorSize: number): Promise<void> {
  if (IS_DEV) {
    // Pre-check by listing collections to avoid 404/409 noise
    try {
      const existing = await listCollections();
      if (existing.includes(name)) return;
    } catch {}
    await qdrantFetch(`/collections/${encodeURIComponent(name)}`, {
      method: 'PUT',
      body: JSON.stringify({ vectors: { size: vectorSize, distance: 'Cosine' } }),
    });
    return;
  }
  const client = new QdrantClient({ url: QDRANT_URL!, apiKey: QDRANT_KEY, checkCompatibility: false });
  try {
    await client.getCollection(name);
  } catch {
    await client.createCollection(name, { vectors: { size: vectorSize, distance: 'Cosine' } } as any);
  }
}

// Simple hash to number conversion for Qdrant compatibility
function stringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash); // Always positive integer
}

export async function upsertPoints(collection: string, points: Array<{ id: string; vector: number[]; payload?: Record<string, any> }>): Promise<void> {
  if (IS_DEV) {
    const safePoints = points.map(p => ({ 
      id: stringToNumber(p.id), 
      vector: p.vector, 
      payload: { ...p.payload, originalId: p.id } // Keep original ID in payload
    }));
    console.log('Upsert payload:', { collection, pointsCount: safePoints.length, firstPoint: safePoints[0], vectorDim: safePoints[0]?.vector?.length });
    await qdrantFetch(`/collections/${encodeURIComponent(collection)}/points?wait=true`, {
      method: 'PUT',
      body: JSON.stringify({ points: safePoints }),
    });
    return;
  }
  const client = new QdrantClient({ url: QDRANT_URL!, apiKey: QDRANT_KEY, checkCompatibility: false });
  const safePoints = points.map(p => ({ 
    id: stringToNumber(p.id), 
    vector: p.vector, 
    payload: { ...p.payload, originalId: p.id }
  }));
  await client.upsert(collection, { points: safePoints } as any);
}

export async function deleteAllPoints(collection: string): Promise<void> {
  if (IS_DEV) {
    await qdrantFetch(`/collections/${encodeURIComponent(collection)}/points/delete`, {
      method: 'POST',
      body: JSON.stringify({ filter: {} }),
    });
    return;
  }
  const client = new QdrantClient({ url: QDRANT_URL!, apiKey: QDRANT_KEY, checkCompatibility: false });
  await client.delete(collection, { filter: {} } as any);
}

// Recommend similar points by original ids using Qdrant 'recommend'
export async function recommendByOriginalIds(collection: string, originals: string[], limit = 10): Promise<any[]> {
  const positive = originals.map((id) => stringToNumber(String(id)));
  const res = await qdrantFetch(`/collections/${encodeURIComponent(collection)}/points/recommend`, {
    method: 'POST',
    body: JSON.stringify({ positive, limit, with_payload: true, with_vector: false }),
  });
  const data = await res.json();
  return data?.result ?? [];
}


