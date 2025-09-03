const EMB_URL = (import.meta as any).env?.VITE_EMBEDDING_URL as string | undefined;
const EMB_KEY = (import.meta as any).env?.VITE_EMBEDDING_KEY as string | undefined;
const EMB_MODEL = (import.meta as any).env?.VITE_EMBEDDING_MODEL as string | undefined;
const IS_DEV = (import.meta as any).env?.DEV as boolean | undefined;

function assertConfig() {
  if (!EMB_URL) throw new Error('Missing VITE_EMBEDDING_URL');
}

async function embFetch(path: string, body: any): Promise<Response> {
  assertConfig();
  const useProxy = IS_DEV && EMB_URL;
  const url = useProxy ? `/emb${path}` : `${EMB_URL}${path}`;
  const headers = useProxy ? { 'content-type': 'application/json' } : { 'content-type': 'application/json', 'authorization': `Bearer ${EMB_KEY}` };
  const res = await fetch(url, { method: 'POST', headers: headers as any, body: JSON.stringify(body) });
  if (!res.ok) {
    let data: any = undefined;
    try { data = await res.json(); } catch {}
    throw new Error(data?.error?.message || res.statusText);
  }
  return res;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  // OpenAI-compatible /embeddings
  // IMPORTANT: some providers (e.g., OpenAI) require a model param. For OpenRouter use e.g. 'openai/text-embedding-3-small'
  const body: any = { input: texts };
  body.model = EMB_MODEL || 'text-embedding-3-small';
  const res = await embFetch('/embeddings', body);
  const data = await res.json();
  const vectors = (data?.data ?? []).map((d: any) => d.embedding as number[]);
  return vectors;
}


