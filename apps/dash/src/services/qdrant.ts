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
    const message = body?.status || body?.error || res.statusText || `HTTP ${res.status}`;
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
  const id = point?.id;
  const payload = point?.payload ?? {};
  const category = payload?.category ?? payload?.qdrant?.category;
  const tags = payload?.tags ?? payload?.qdrant?.tags;
  const description = payload?.description ?? payload?.qdrant?.description;
  return { id, category, tags, description };
}


