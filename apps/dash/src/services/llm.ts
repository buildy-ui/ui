import OpenAI from 'openai';

const RAW_OPENROUTER_URL = (import.meta as any).env?.OPENROUTER_URL as string | undefined;
const VITE_OPENROUTER_URL = (import.meta as any).env?.VITE_OPENROUTER_URL as string | undefined;
const LLM_URL = RAW_OPENROUTER_URL || VITE_OPENROUTER_URL || 'https://openrouter.ai/api/v1';
const LLM_KEY = (import.meta as any).env?.OPENROUTER_API_KEY as string | undefined;
const VITE_LLM_KEY = (import.meta as any).env?.VITE_OPENROUTER_API_KEY as string | undefined;
const IS_DEV = (import.meta as any).env?.DEV as boolean | undefined;
const PROXY_ENABLED = Boolean(RAW_OPENROUTER_URL);

// Create OpenAI client only on server to avoid browser runtime issues
function createLLMClient() {
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

async function llmFetch(path: string, body: any): Promise<Response> {
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
    const res = await client.chat.completions.create({
      model: 'openai/gpt-5-mini',
      messages: content as any,
      response_format: { type: 'json_object' },
    });
    console.log('raw response (server)', res);
    responseBody = res;
  } else {
    // Browser: use fetch/proxy to avoid SDK internals that may call atob
    const res = await llmFetch('/chat/completions', { model: 'openai/gpt-5-mini', messages: content, response_format: { type: 'json_object' } });
    console.log('fetch response (browser)', res);
    responseBody = await res.json();
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
  } else {
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
    const res = await client.chat.completions.create({ model: 'openai/gpt-5-mini', messages, response_format: { type: 'json_object' } as any });
    const text = res.choices[0]?.message?.content ?? '{}';
    try { return JSON.parse(text); } catch { return { text, suggestions: [] }; }
  } else {
    const res = await llmFetch('/chat/completions', { model: 'openai/gpt-5-mini', messages, response_format: { type: 'json_object' } });
    const text = (await res.json())?.choices?.[0]?.message?.content ?? '{}';
    try { return JSON.parse(text); } catch { return { text, suggestions: [] }; }
  }
}


