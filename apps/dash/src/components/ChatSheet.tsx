import { useEffect, useState } from 'react';
import { Box, Card, Stack, Title, Text, Button } from '@ui8kit/core';
import { ResizableSheet } from '@/components/ResizableSheet';
import { addMessage, listMessages, type ChatMessage } from '@/services/chat';
import { chatTurnAnalyze, ensureSession } from '@/services/agent_analyzer';
import { getItemById, updateItem } from '@/services/items';
import { embedTexts } from '@/services/embeddings';
import { ensureCollection, upsertPoints } from '@/services/qdrant';

type QuizProps = { onChange?: (value: 'accept'|'needs_work'|'reject') => void };
function QuizWidget({ onChange }: QuizProps) {
  return (
    <Stack gap="xs" align="start">
      <Text size="xs" c="muted">Feedback</Text>
      <div className="flex items-center gap-3 text-sm">
        <label className="inline-flex items-center gap-1"><input type="radio" name="quiz" onChange={() => onChange?.('accept')} />Accept</label>
        <label className="inline-flex items-center gap-1"><input type="radio" name="quiz" onChange={() => onChange?.('needs_work')} />Needs work</label>
        <label className="inline-flex items-center gap-1"><input type="radio" name="quiz" onChange={() => onChange?.('reject')} />Reject</label>
      </div>
    </Stack>
  );
}

type ItemLite = { id: string; description?: string; category?: string; tags?: string[]; sourceUrl?: string };

export function ChatSheet({ id, title, query, items }: { id: string; title: string; query: string; items: ItemLite[] }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; description: string; tags: string[]; category?: string; rationale?: string; accepted: boolean }>>([]);

  useEffect(() => {
    (async () => {
      if (!sessionId) {
        const sid = await ensureSession(query, items.map(i => String(i.id)));
        setSessionId(sid);
        const list = await listMessages(sid);
        setMessages(list);
      } else {
        const list = await listMessages(sessionId);
        setMessages(list);
      }
    })();
  }, [sessionId, query, items]);

  async function send() {
    if (!sessionId || !input.trim()) return;
    setLoading(true);
    try {
      await addMessage({ sessionId, role: 'user', text: input, attachments: [] });
      setInput('');
      const turn = await chatTurnAnalyze({ sessionId, query, items, userNote: input });
      const flat = (turn.suggestions || []).map((s) => ({ id: s.id, description: s.suggestion.description, tags: s.suggestion.tags || [], category: s.suggestion.category, rationale: s.suggestion.rationale, accepted: true }));
      setSuggestions(flat);
      const list = await listMessages(sessionId);
      setMessages(list);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert((e as any)?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function applyAndEmbed() {
    if (!suggestions.length) return;
    setLoading(true);
    try {
      const accepted = suggestions.filter(s => s.accepted);
      // Update local items storage
      for (const s of accepted) {
        const existing = await getItemById(s.id);
        if (existing) {
          const nextPayload = { ...(existing as any).payload, qdrant: { ...((existing as any).payload?.qdrant || {}), description: s.description, tags: s.tags, category: s.category } };
          await updateItem(s.id, { payload: nextPayload } as any);
        }
      }
      // Re-embed and upsert to aggregate collection 'all'
      const texts = accepted.map(s => s.description);
      const vectors = await embedTexts(texts);
      const dim = vectors[0]?.length || 0;
      if (dim) await ensureCollection('all', dim);
      const points = accepted.map((s, i) => ({ id: s.id, vector: vectors[i] || [], payload: { description: s.description, tags: s.tags, category: s.category } }));
      await upsertPoints('all', points);
      alert(`Applied ${accepted.length} suggestions and re-embedded.`);
    } catch (e) {
      alert((e as any)?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResizableSheet id={id} title={title}>
      <Box w="full">
        <Stack gap="md">
          <Card p="sm" rounded="md" shadow="sm" bg="card" w="full">
            <Stack gap="xs">
              {messages.map((m) => (
                <Box key={m.id} w="full">
                  <Text size="xs" c="muted">{m.role}</Text>
                  <Text size="sm">{m.text}</Text>
                </Box>
              ))}
            </Stack>
          </Card>
          {!!suggestions.length && (
            <Card p="sm" rounded="md" shadow="sm" bg="card" w="full">
              <Stack gap="sm">
                <Title size="sm">Suggestions</Title>
                {suggestions.map((s, idx) => (
                  <Stack key={`${s.id}-${idx}`} gap="xs">
                    <label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={s.accepted} onChange={(e) => setSuggestions(prev => prev.map((x,i) => i===idx ? { ...x, accepted: e.target.checked } : x))} />Apply</label>
                    <Text size="xs" c="muted">ID: {s.id}</Text>
                    <Text size="sm">{s.description}</Text>
                    <Text size="xs" c="muted">Tags: {s.tags.join(', ')}</Text>
                    {s.category && <Text size="xs" c="muted">Category: {s.category}</Text>}
                    {s.rationale && <Text size="xs" c="muted">Why: {s.rationale}</Text>}
                  </Stack>
                ))}
                <div className="flex gap-2 justify-end">
                  <Button variant="default" disabled={loading} onClick={applyAndEmbed}>{loading ? 'Embedding…' : 'Apply & Re-embed'}</Button>
                </div>
              </Stack>
            </Card>
          )}
          <Card p="sm" rounded="md" shadow="sm" bg="card" w="full">
            <Stack gap="sm">
              <QuizWidget />
              <textarea className="w-full px-3 py-2 rounded-md border bg-background" rows={3} placeholder="Write a note or question..." value={input} onChange={(e) => setInput(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <Button variant="default" disabled={loading || !input.trim()} onClick={send}>{loading ? 'Analyzing…' : 'Send'}</Button>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </ResizableSheet>
  );
}


