export type ChatAttachment = { type: 'code' | 'url'; url?: string; path?: string; text?: string };
export type ChatMessage = { id: string; sessionId: string; role: 'system' | 'user' | 'assistant'; text: string; attachments?: ChatAttachment[]; createdAt: number };
export type ChatSession = { id: string; query: string; originalIds: string[]; createdAt: number; status?: 'open' | 'closed' };

const SESSIONS_KEY = 'ui8kit-brain-chat-sessions-v1';
const MESSAGES_KEY = 'ui8kit-brain-chat-messages-v1';

function load<T = any>(k: string, def: T): T {
  try { const raw = sessionStorage.getItem(k); if (raw) return JSON.parse(raw) as T; } catch {}
  return def;
}
function save<T = any>(k: string, v: T): void { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} }

export async function createSession(input: { query: string; originalIds: string[] }): Promise<ChatSession> {
  const sessions = load<ChatSession[]>(SESSIONS_KEY, []);
  const now = Date.now();
  const session: ChatSession = { id: `${now}-${Math.random().toString(36).slice(2,8)}`, query: input.query, originalIds: input.originalIds, createdAt: now, status: 'open' };
  sessions.unshift(session);
  save(SESSIONS_KEY, sessions);
  return session;
}

export async function addMessage(input: Omit<ChatMessage,'id'|'createdAt'>): Promise<ChatMessage> {
  const messages = load<ChatMessage[]>(MESSAGES_KEY, []);
  const msg: ChatMessage = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, createdAt: Date.now() };
  messages.push(msg);
  save(MESSAGES_KEY, messages);
  return msg;
}

export async function listMessages(sessionId: string): Promise<ChatMessage[]> {
  const messages = load<ChatMessage[]>(MESSAGES_KEY, []);
  return messages.filter(m => m.sessionId === sessionId).sort((a,b) => a.createdAt - b.createdAt);
}

export async function listSessions(): Promise<ChatSession[]> {
  return load<ChatSession[]>(SESSIONS_KEY, []);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = load<ChatSession[]>(SESSIONS_KEY, []);
  save(SESSIONS_KEY, sessions.filter(s => s.id !== sessionId));
  const messages = load<ChatMessage[]>(MESSAGES_KEY, []);
  save(MESSAGES_KEY, messages.filter(m => m.sessionId !== sessionId));
}

export async function exportSession(sessionId: string): Promise<any> {
  const sessions = load<ChatSession[]>(SESSIONS_KEY, []);
  const messages = await listMessages(sessionId);
  const session = sessions.find(s => s.id === sessionId) || null;
  return { session, messages };
}


