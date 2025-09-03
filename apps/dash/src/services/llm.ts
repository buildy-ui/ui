import OpenAI from 'openai';

const LLM_URL = (import.meta as any).env?.OPENROUTER_URL as string | undefined;
const LLM_KEY = (import.meta as any).env?.OPENROUTER_API_KEY as string | undefined;
const IS_DEV = (import.meta as any).env?.DEV as boolean | undefined;

// Create OpenAI client only on server to avoid browser runtime issues
function createLLMClient() {
  return new OpenAI({
    baseURL: LLM_URL,
    apiKey: LLM_KEY,
  });
}

function assertConfig() {
  if (!LLM_URL) throw new Error('Missing OPENROUTER_URL');
}

async function llmFetch(path: string, body: any): Promise<Response> {
  assertConfig();
  const useProxy = IS_DEV && LLM_URL;
  const url = useProxy ? `/llm${path}` : `${LLM_URL}${path}`;
  const headers = useProxy ? { 'content-type': 'application/json' } : { 'content-type': 'application/json', 'authorization': `Bearer ${LLM_KEY}` };
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
  console.log('content', content);
  let responseBody: any = null;
  if (typeof window === 'undefined') {
    // Server-side: use SDK
    const client = createLLMClient();
    const res = await client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: content as any,
      response_format: { type: 'json_object' },
    });
    console.log('res', res);
    responseBody = res;
  } else {
    // Browser: use fetch/proxy to avoid SDK internals that may call atob
    const res = await llmFetch('/chat/completions', { model: 'gpt-5-mini', messages: content, response_format: { type: 'json_object' } });
    console.log('res', res);
    responseBody = await res.json();
  }

  const data = responseBody?.choices?.[0]?.message?.content ?? '{}';
  console.log('data', data);
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


