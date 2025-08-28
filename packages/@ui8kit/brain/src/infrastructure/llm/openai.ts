import OpenAI from 'openai';
import { ENV } from '../../config/env';

export const chatClient = new OpenAI({
  baseURL: ENV.OPENROUTER_URL,
  apiKey: ENV.OPENROUTER_API_KEY,
});

export const embeddingClient = new OpenAI({
  baseURL: ENV.EMBEDDING_URL,
  apiKey: ENV.EMBEDDING_API_KEY,
});

// Max total tokens per embeddings request batch.
const MAX_TOKENS_PER_BATCH = 7000;

// Lazy-loaded encoder instance from @dqbd/tiktoken. We keep it for the process lifetime.
let tokenEncoder: { encode: (text: string) => number[]; free?: () => void } | null = null;
let encoderInitialized = false;

async function ensureTokenEncoder(): Promise<void> {
  if (encoderInitialized) return;
  encoderInitialized = true;
  try {
    // Dynamic import to avoid hard dependency and TS module resolution at build time.
    const moduleName = '@dqbd/tiktoken';
    // Indirect import via Function to prevent the compiler from trying to resolve types.
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

type TokenMappedText = { index: number; text: string; tokens: number };

async function buildTokenMap(texts: string[]): Promise<TokenMappedText[]> {
  const result: TokenMappedText[] = [];
  for (let i = 0; i < texts.length; i++) {
    const t = texts[i] ?? '';
    const tokens = await countTokens(t);
    result.push({ index: i, text: t, tokens });
  }
  return result;
}

function createBatchesByTokenLimit(items: TokenMappedText[], maxTokens: number): Array<{ indices: number[]; inputs: string[] }> {
  const batches: Array<{ indices: number[]; inputs: string[] }> = [];
  let currentTokens = 0;
  let currentIndices: number[] = [];
  let currentInputs: string[] = [];

  const pushCurrent = () => {
    if (currentIndices.length > 0) {
      batches.push({ indices: currentIndices, inputs: currentInputs });
      currentTokens = 0;
      currentIndices = [];
      currentInputs = [];
    }
  };

  for (const item of items) {
    // If a single item is larger than the batch limit, send it alone.
    if (item.tokens > maxTokens) {
      pushCurrent();
      batches.push({ indices: [item.index], inputs: [item.text] });
      continue;
    }
    if (currentTokens + item.tokens > maxTokens) {
      pushCurrent();
    }
    currentIndices.push(item.index);
    currentInputs.push(item.text);
    currentTokens += item.tokens;
  }

  pushCurrent();
  return batches;
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  // 1) Build token map
  const tokenMap = await buildTokenMap(texts);

  // 2) Create batches where total tokens per request <= MAX_TOKENS_PER_BATCH
  const batches = createBatchesByTokenLimit(tokenMap, MAX_TOKENS_PER_BATCH);

  // 3) Execute requests sequentially to avoid RPS limits; preserve original order
  const vectors: number[][] = new Array(texts.length);
  for (const batch of batches) {
    const res = await embeddingClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch.inputs,
    });
    // Map results back to original indices
    for (let i = 0; i < res.data.length; i++) {
      const originalIndex = batch.indices[i];
      vectors[originalIndex] = res.data[i].embedding as unknown as number[];
      console.log(`Counted ${originalIndex} tokens`);
    }
  }

  return vectors;
}


