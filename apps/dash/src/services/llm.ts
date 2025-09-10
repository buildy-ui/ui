import OpenAI from 'openai';
import { logLLMRequest, logLLMResponse } from '@/services/sessionLog';

const RAW_OPENROUTER_URL = (import.meta as any).env?.OPENROUTER_URL as string | undefined;
const VITE_OPENROUTER_URL = (import.meta as any).env?.VITE_OPENROUTER_URL as string | undefined;
const LLM_URL = RAW_OPENROUTER_URL || VITE_OPENROUTER_URL || 'https://openrouter.ai/api/v1';
const LLM_KEY = (import.meta as any).env?.OPENROUTER_API_KEY as string | undefined;
const VITE_LLM_KEY = (import.meta as any).env?.VITE_OPENROUTER_API_KEY as string | undefined;
const IS_DEV = (import.meta as any).env?.DEV as boolean | undefined;
const PROXY_ENABLED = Boolean(RAW_OPENROUTER_URL);

// Create OpenAI client. Prefer server; allow browser when using proxy/fetch streaming.
export function createLLMClient() {
  return new OpenAI({
    baseURL: LLM_URL,
    apiKey: LLM_KEY,
    // Helpful for OpenRouter rankings/diagnostics
    defaultHeaders: {
      'X-Title': 'buildy-dash',
      'HTTP-Referer': 'http://localhost:5000',
    } as any,
  });
}

export async function llmFetch(path: string, body: any): Promise<Response> {
  const useProxy = IS_DEV && PROXY_ENABLED;
  const url = useProxy ? `/llm${path}` : `${LLM_URL}${path}`;
  const token = LLM_KEY || VITE_LLM_KEY;
  const referer = (typeof window !== 'undefined' && (window as any)?.location?.origin) ? (window as any).location.origin : 'http://localhost:5000';
  if (!useProxy && !token) {
    throw new Error('Missing OpenRouter API key. Set VITE_OPENROUTER_API_KEY for browser, or configure dev proxy with OPENROUTER_URL and OPENROUTER_API_KEY.');
  }
  const baseHeaders: Record<string, string> = {
    'content-type': 'application/json',
    'X-Title': 'buildy-dash',
    'HTTP-Referer': referer,
  };
  const headers = useProxy
    ? baseHeaders
    : { ...baseHeaders, 'Authorization': `Bearer ${token}` };
  const res = await fetch(url, { method: 'POST', headers: headers as any, body: JSON.stringify(body) });
  if (!res.ok) {
    let data: any = undefined;
    try { data = await res.json(); } catch {}
    throw new Error(data?.error?.message || res.statusText);
  }
  return res;
}

// High-level streaming chat completions via OpenAI SDK (OpenRouter baseURL)
// Supports: stream=true, reasoning, and returns token usage when available.
export type LLMRequestParams = {
  model: string;
  messages: Array<{ role: 'system'|'user'|'assistant'; content: string }>;
  stream?: boolean;
  reasoning?: { effort?: 'low'|'medium'|'high'; exclude?: boolean };
  temperature?: number;
  max_tokens?: number;
  // Progress callbacks
  onProgress?: (
    status: 'reasoning' | 'content' | 'usage' | 'done',
    data: { delta?: string; reasoningText?: string; totalLength?: number; usage?: any }
  ) => void;
};

export async function llmChatCompletions({
  model,
  messages,
  stream = true,
  reasoning,
  temperature,
  max_tokens,
  onProgress,
}: LLMRequestParams): Promise<{ text?: string; usage?: any }> {
  // For browser runtime we prefer SDK streaming iterator when possible.
  // Falls back to proxy fetch if needed.
  try {
    const client = createLLMClient();

    logLLMRequest({ endpoint: 'chat/completions', model, messages, stream, reasoning, temperature, max_tokens });

    const response = await client.chat.completions.create({
      model,
      messages,
      stream,
      reasoning,
      temperature,
      max_tokens,
    } as any);

    let fullText = '';
    let lastUsage: any = undefined;

    if (stream) {
      // Stream chunks using async iterator
      for await (const chunk of response as any) {
        const choice = chunk?.choices?.[0];
        const delta = choice?.delta;

        if (delta?.reasoning) {
          onProgress?.('reasoning', { reasoningText: String(delta.reasoning) });
        }

        if (delta?.content) {
          const textDelta = String(delta.content);
          fullText += textDelta;
          onProgress?.('content', { delta: textDelta, totalLength: fullText.length });
        }

        // Some providers include usage within stream or at the end
        if ((chunk as any)?.usage) {
          lastUsage = (chunk as any).usage;
          onProgress?.('usage', { usage: lastUsage });
        }
      }

      onProgress?.('done', { delta: '', totalLength: fullText.length, usage: lastUsage });
      logLLMResponse({ text: fullText, usage: lastUsage });
      return { text: fullText, usage: lastUsage };
    }

    // Non-streaming
    const text = (response as any)?.choices?.[0]?.message?.content ?? '';
    const usage = (response as any)?.usage;
    onProgress?.('done', { delta: '', totalLength: text.length, usage });
    logLLMResponse({ text, usage });
    return { text, usage };
  } catch (err) {
    // On client SDK limitations (e.g., atob in browser), fallback to proxy fetch
    // using the existing llmFetch helper with stream=true and SSE parsing.
    const proxyRes = await llmFetch('/chat/completions', { model, messages, stream: true, reasoning, temperature, max_tokens });
    if (!proxyRes.ok || !proxyRes.body) {
      throw new Error(`LLM proxy request failed: ${proxyRes.status}`);
    }
    const reader = proxyRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let usage: any = undefined;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed?.choices?.[0]?.delta;
          if (delta?.reasoning) onProgress?.('reasoning', { reasoningText: String(delta.reasoning) });
          if (delta?.content) {
            const d = String(delta.content);
            fullText += d;
            onProgress?.('content', { delta: d, totalLength: fullText.length });
          }
          if (parsed?.usage) {
            usage = parsed.usage;
            onProgress?.('usage', { usage });
          }
        } catch {}
      }
    }
    onProgress?.('done', { delta: '', totalLength: fullText.length, usage });
    logLLMResponse({ text: fullText, usage });
    return { text: fullText, usage };
  }
}

export async function llmRefineTagsAndCategories(context: Array<{ id: string; description?: string; category?: string; tags?: string[] }>, userQuery: string): Promise<{ mustTags: string[]; shouldTags: string[]; categories: string[] }> {
  const prompt = `Given top search results (with id, description, category, tags) and a user query, suggest (1) up to 3 must-have tags, (2) up to 5 optional tags, (3) up to 2 categories to refine recall. Return strict JSON { mustTags: string[], shouldTags: string[], categories: string[] } with no extra text.`;
  const content = [
    { role: 'system', content: prompt },
    { role: 'user', content: JSON.stringify({ query: userQuery, results: context }) },
  ];
  console.groupCollapsed('[LLM] RefineTags request');
  console.log('model', 'openai/gpt-5-mini');
  console.log('messages', content);
  let responseBody: any = null;
  if (typeof window === 'undefined') {
    // Server-side: use SDK
    const client = createLLMClient();
    logLLMRequest({ endpoint: 'chat/completions', model: 'openai/gpt-5-mini', messages: content });
    const res = await client.chat.completions.create({
      model: 'openai/gpt-5-mini',
      messages: content as any,
      response_format: { type: 'json_object' },
    });
    console.log('raw response (server)', res);
    responseBody = res;
    logLLMResponse(res);
  } else {
    // Browser: use fetch/proxy to avoid SDK internals that may call atob
    logLLMRequest({ endpoint: 'chat/completions', model: 'openai/gpt-5-mini', messages: content });
    const res = await llmFetch('/chat/completions', { model: 'openai/gpt-5-mini', messages: content, response_format: { type: 'json_object' } });
    console.log('fetch response (browser)', res);
    responseBody = await res.json();
    logLLMResponse(responseBody);
  }

  const data = responseBody?.choices?.[0]?.message?.content ?? '{}';
  console.log('parsed content text', data);
  console.groupEnd();
  const text = data ?? '{}';
  try {
    const parsed = JSON.parse(text);
    return {
      mustTags: Array.isArray(parsed.mustTags) ? parsed.mustTags.slice(0, 5) : [],
      shouldTags: Array.isArray(parsed.shouldTags) ? parsed.shouldTags.slice(0, 10) : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories.slice(0, 3) : [],
    };
  } catch {
    return { mustTags: [], shouldTags: [], categories: [] };
  }
}

// MVP decision helper: decide if initial 10 are good or propose refined query
export async function llmDecideRefine(userQuery: string, ids: string[]): Promise<{ acceptAll: boolean; refinedQuery?: string } | null> {
  const system = `You are an assistant deciding whether to refine a search across unknown UI blocks.
Constraints:
- Be neutral and unbiased. You do not know the catalog taxonomy; do not infer types from IDs.
- If the initial candidates appear broadly relevant to the user's natural-language query, set acceptAll=true.
- Otherwise, return a concise refinedQuery that clarifies intent/styling without assuming catalog categories.
Return strict JSON { acceptAll: boolean, refinedQuery?: string }`;
  const user = { query: userQuery, ids };

  let responseBody: any = null;
  console.groupCollapsed('[LLM] DecideRefine request');
  console.log('model', 'openai/gpt-5-mini');
  console.log('userQuery', userQuery);
  console.log('ids', ids);
  if (typeof window === 'undefined') {
    const client = createLLMClient();
    logLLMRequest({ endpoint: 'chat/completions', model: 'openai/gpt-5-mini', messages: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify(user) },
    ] });
    const res = await client.chat.completions.create({
      model: 'openai/gpt-5-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(user) },
      ] as any,
      response_format: { type: 'json_object' },
    });
    console.log('raw response (server)', res);
    responseBody = res;
    logLLMResponse(res);
  } else {
    logLLMRequest({ endpoint: 'chat/completions', model: 'openai/gpt-5-mini', messages: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify(user) },
    ] });
    const res = await llmFetch('/chat/completions', {
      model: 'openai/gpt-5-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(user) },
      ],
      response_format: { type: 'json_object' },
    });
    console.log('fetch response (browser)', res);
    responseBody = await res.json();
    logLLMResponse(responseBody);
  }

  const text = responseBody?.choices?.[0]?.message?.content ?? '{}';
  console.log('parsed content text', text);
  console.groupEnd();
  try {
    const parsed = JSON.parse(text);
    const acceptAll = Boolean(parsed?.acceptAll);
    const refinedQuery = typeof parsed?.refinedQuery === 'string' ? parsed.refinedQuery : undefined;
    return { acceptAll, ...(refinedQuery ? { refinedQuery } : {}) };
  } catch {
    return null;
  }
}

// Analyze code + blocks and propose improved descriptions
export async function llmChatAnalyze(context: { query: string; items: Array<{ id: string; description?: string; category?: string; tags?: string[] }>; userNote?: string }, history: Array<{ role: 'system'|'user'|'assistant'; text: string }>, codeChunks: Array<{ id: string; chunk: string }>): Promise<{ text: string; suggestions: Array<{ id: string; suggestion: { description: string; tags: string[]; category?: string; rationale?: string } }> }> {
  const system = `You are an analyzer assisting developers. Given a user query, current item metadata, chat history, and code excerpts, propose improved descriptions/tags (concise, precise), optionally category, and short rationale. Return strict JSON { text: string, suggestions: [{ id: string, suggestion: { description: string, tags: string[], category?: string, rationale?: string } }] }`;
  const messages: any[] = [
    { role: 'system', content: system },
  ];
  for (const m of history.slice(-8)) messages.push({ role: m.role, content: m.text });
  messages.push({ role: 'user', content: JSON.stringify({ query: context.query, items: context.items, userNote: context.userNote, code: codeChunks }) });

  if (typeof window === 'undefined') {
    const client = createLLMClient();
    logLLMRequest({ endpoint: 'chat/completions', model: 'openai/gpt-5-mini', messages });
    const res = await client.chat.completions.create({ model: 'openai/gpt-5-mini', messages, response_format: { type: 'json_object' } as any });
    const text = res.choices[0]?.message?.content ?? '{}';
    logLLMResponse(res);
    try { return JSON.parse(text); } catch { return { text, suggestions: [] }; }
  } else {
    logLLMRequest({ endpoint: 'chat/completions', model: 'openai/gpt-5-mini', messages });
    const res = await llmFetch('/chat/completions', { model: 'openai/gpt-5-mini', messages, response_format: { type: 'json_object' } });
    const json = await res.json();
    logLLMResponse(json);
    const text = json?.choices?.[0]?.message?.content ?? '{}';
    try { return JSON.parse(text); } catch { return { text, suggestions: [] }; }
  }
}


