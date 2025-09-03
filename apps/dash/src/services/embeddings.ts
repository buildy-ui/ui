import OpenAI from 'openai';

const EMB_URL = (import.meta as any).env?.VITE_EMBEDDING_URL as string | undefined;
const EMB_KEY = (import.meta as any).env?.VITE_EMBEDDING_KEY as string | undefined;
const EMB_MODEL = (import.meta as any).env?.VITE_EMBEDDING_MODEL as string | undefined;
const IS_DEV = (import.meta as any).env?.DEV as boolean | undefined;

// Create OpenAI client only on server to avoid browser base64/atob issues
function createEmbeddingClient() {
  return new OpenAI({
    baseURL: EMB_URL,
    apiKey: EMB_KEY,
  });
}

// Exported token count (last embeddings call)
export let lastEmbeddingTokenCount = 0;

// Token encoder (lazy) + heuristic fallback
let tokenEncoder: { encode: (text: string) => number[]; free?: () => void } | null = null;
let encoderInitialized = false;
async function ensureTokenEncoder(): Promise<void> {
  if (encoderInitialized) return;
  encoderInitialized = true;
  try {
    const moduleName = '@dqbd/tiktoken';
    const importer: (m: string) => Promise<any> = new Function('m', 'return import(m)') as any;
    const tiktoken: any = await importer(moduleName);
    const maybeModelEncoder = tiktoken?.encoding_for_model?.('text-embedding-3-small');
    tokenEncoder = maybeModelEncoder ?? tiktoken?.get_encoding?.('cl100k_base') ?? null;
  } catch {
    tokenEncoder = null;
  }
}

async function countTokens(text: string): Promise<number> {
  await ensureTokenEncoder();
  if (tokenEncoder) {
    try {
      return tokenEncoder.encode(text).length;
    } catch {
      // fall through to heuristic
    }
  }
  // Heuristic fallback: ~4 chars per token for English-like text.
  return Math.max(1, Math.ceil(text.length / 4));
}

type TextInput = string | { text: string } | { input?: string };

export async function embedTexts(texts: TextInput[]): Promise<number[][]> {
  if (!texts || texts.length === 0) return [];

  // Normalize inputs to strings and remember original order
  const inputs: string[] = texts.map((t) => {
    if (!t) return '';
    if (typeof t === 'string') return t;
    if ('text' in t && typeof (t as any).text === 'string') return (t as any).text;
    if ('input' in t && typeof (t as any).input === 'string') return (t as any).input;
    return '';
  });

  // Count tokens for all inputs (sum)
  let totalTokens = 0;
  for (const s of inputs) {
    try {
      const n = await countTokens(s);
      totalTokens += n;
    } catch {
      // ignore per-item failures
    }
  }
  lastEmbeddingTokenCount = totalTokens;
  // Log to browser console the total tokens spent
  try { console.log(`Embedding tokens used: ${lastEmbeddingTokenCount}`); } catch {}

  // Build OpenAI-compatible payload (single request for the entire array)
  let vectors: number[][] = [];

  if (typeof window === 'undefined') {
    // Server-side: use official OpenAI client
    const client = createEmbeddingClient();
    const res = await client.embeddings.create({
      model: EMB_MODEL || 'text-embedding-3-small',
      input: inputs,
    });
    vectors = (res.data ?? []).map((d: any) => d.embedding as number[]);
  } else {
    // Browser: use fetch directly to avoid SDK internals that may call atob
    function assertConfig() {
      if (!EMB_URL) throw new Error('Missing VITE_EMBEDDING_URL');
    }
    async function embFetch(path: string, body: any): Promise<Response> {
      assertConfig();
      const useProxy = IS_DEV && EMB_URL;
      const url = useProxy ? `/emb${path}` : `${EMB_URL}${path}`;
      const headers = useProxy
        ? { 'content-type': 'application/json' }
        : { 'content-type': 'application/json', 'authorization': `Bearer ${EMB_KEY}` };
      const res = await fetch(url, { method: 'POST', headers: headers as any, body: JSON.stringify(body) });
      if (!res.ok) {
        let data: any = undefined;
        try { data = await res.json(); } catch {}
        throw new Error(data?.error?.message || res.statusText);
      }
      return res;
    }

    const r = await embFetch('/embeddings', { model: EMB_MODEL || 'text-embedding-3-small', input: inputs });
    const data = await r.json();
    vectors = (data?.data ?? []).map((d: any) => d.embedding as number[]);
  }

  // Ensure we return embeddings in the original order and fill missing entries with empty arrays
  const result: number[][] = new Array(inputs.length);
  for (let i = 0; i < vectors.length; i++) {
    result[i] = vectors[i] ?? [];
  }
  for (let i = 0; i < result.length; i++) {
    if (!result[i]) result[i] = [];
  }

  return result;
}


