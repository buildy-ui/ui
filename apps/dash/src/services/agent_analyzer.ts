import { addMessage, listMessages, createSession, type ChatMessage } from '@/services/chat';
import { fetchCodeByUrl, chunkText } from '@/services/source';
import { llmChatAnalyze } from '@/services/llm';

export type AnalyzerInput = { sessionId: string; query: string; items: Array<{ id: string; description?: string; category?: string; tags?: string[]; sourceUrl?: string }>; userNote?: string };
export type AnalyzerSuggestion = { id: string; suggestion: { description: string; tags: string[]; category?: string; rationale?: string } };

export async function ensureSession(query: string, originalIds: string[]): Promise<string> {
  const s = await createSession({ query, originalIds });
  return s.id;
}

export async function chatTurnAnalyze(input: AnalyzerInput): Promise<{ assistantText: string; suggestions: AnalyzerSuggestion[] }> {
  // Collect code context
  const codeChunks: Array<{ id: string; chunk: string }> = [];
  for (const item of input.items) {
    if (!item.sourceUrl) continue;
    try {
      const code = await fetchCodeByUrl(item.sourceUrl);
      const chunks = chunkText(code, 4000).slice(0, 2);
      for (const c of chunks) codeChunks.push({ id: item.id, chunk: c });
    } catch {}
  }

  const history = await listMessages(input.sessionId);
  const assistant = await llmChatAnalyze({ query: input.query, items: input.items, userNote: input.userNote }, history, codeChunks);

  await addMessage({ sessionId: input.sessionId, role: 'assistant', text: assistant.text, attachments: [] });
  const suggestions: AnalyzerSuggestion[] = assistant.suggestions || [];
  return { assistantText: assistant.text, suggestions };
}


