import { AIClient, type Message as UI8Message } from '@ui8kit/chat';

type Role = 'system' | 'user' | 'assistant';

export type UI8ChatRequestParams = {
  model: string;
  messages: Array<{ role: Role; content: string }>;
  stream?: boolean;
  reasoning?: { effort?: 'low' | 'medium' | 'high'; exclude?: boolean };
  temperature?: number;
  max_tokens?: number;
  signal?: AbortSignal | null;
  onProgress?: (
    status: 'reasoning' | 'content' | 'usage' | 'done',
    data: { delta?: string; reasoningText?: string; totalLength?: number; usage?: any }
  ) => void;
};

const LLM_URL = (import.meta as any).env?.VITE_OPENROUTER_URL as string | undefined;
const LLM_KEY = (import.meta as any).env?.VITE_OPENROUTER_API_KEY as string | undefined;

if (!LLM_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[ui8kitChat] Missing VITE_OPENROUTER_API_KEY — streaming will fail without a key');
}

// Singleton AI client configured for OpenRouter
const aiClient = new AIClient({
  type: 'openrouter',
  apiKey: LLM_KEY || '',
  baseURL: LLM_URL || undefined,
});

export async function ui8chatCompletions({
  model,
  messages,
  stream = true,
  reasoning,
  temperature,
  max_tokens,
  signal,
  onProgress,
}: UI8ChatRequestParams): Promise<{ text?: string; usage?: any }> {
  // Non-streaming mode (rarely used in UI)
  if (!stream) {
    const res = await aiClient.chatCompletion({
      model,
      messages: messages as unknown as UI8Message[],
      parameters: {
        temperature,
        max_tokens,
        ...(reasoning ? { reasoning } : {}),
      } as any,
    });
    const text = res.choices?.[0]?.message?.content ?? '';
    const usage = (res as any)?.usage;
    onProgress?.('done', { delta: '', totalLength: text.length, usage });
    return { text, usage };
  }

  // Streaming mode
  // eslint-disable-next-line no-console
  console.log('[ui8kitChat] stream start', { model, messagesCount: messages.length, hasReasoning: Boolean(reasoning), max_tokens });
  const streamGen = aiClient.chatCompletionStream({
    model,
    messages: messages as unknown as UI8Message[],
    parameters: {
      temperature,
      max_tokens,
      stream: true,
      ...(reasoning ? { reasoning } : {}),
    } as any,
  });

  let fullText = '';
  let lastUsage: any = undefined;

  for await (const chunk of streamGen as any) {
    if (signal?.aborted) break;

    const choice = chunk?.choices?.[0];
    const delta = choice?.delta;

    if (delta?.reasoning) {
      const r = String(delta.reasoning);
      // eslint-disable-next-line no-console
      // console.log('[ui8kitChat] reasoning delta', r.slice(0, 80));
      onProgress?.('reasoning', { reasoningText: r });
    }

    if (delta?.content) {
      const d = String(delta.content);
      fullText += d;
      // eslint-disable-next-line no-console
      // console.log('[ui8kitChat] content delta', { len: d.length, total: fullText.length });
      onProgress?.('content', { delta: d, totalLength: fullText.length });
    }

    if ((chunk as any)?.usage) {
      lastUsage = (chunk as any).usage;
      // eslint-disable-next-line no-console
      console.log('[ui8kitChat] usage', lastUsage);
      onProgress?.('usage', { usage: lastUsage });
    }
  }

  // eslint-disable-next-line no-console
  console.log('[ui8kitChat] stream done', { total: fullText.length });
  onProgress?.('done', { delta: '', totalLength: fullText.length, usage: lastUsage });
  return { text: fullText, usage: lastUsage };
}


