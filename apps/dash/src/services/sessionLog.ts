type LLMEntry = { ts: number; type: 'llm_request' | 'llm_response'; payload: any };
type ChatEntry = { ts: number; type: 'chat_message'; role: 'user'|'assistant'|'system'; text: string; extras?: any };
type QueryEntry = { ts: number; type: 'search_query'; query: string; topIds?: string[] };

type SessionEntry = LLMEntry | ChatEntry | QueryEntry;

const LOG_KEY = 'session:log';

let memoryLog: SessionEntry[] = [];

function loadFromStorage(): void {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LOG_KEY) : null;
    if (raw) memoryLog = JSON.parse(raw);
  } catch {}
}

function saveToStorage(): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(LOG_KEY, JSON.stringify(memoryLog));
  } catch {}
}

export function logSearchQuery(query: string, topIds?: string[]): void {
  if (!memoryLog.length) loadFromStorage();
  memoryLog.push({ ts: Date.now(), type: 'search_query', query, topIds });
  saveToStorage();
}

export function logLLMRequest(payload: any): void {
  if (!memoryLog.length) loadFromStorage();
  memoryLog.push({ ts: Date.now(), type: 'llm_request', payload });
  saveToStorage();
}

export function logLLMResponse(payload: any): void {
  if (!memoryLog.length) loadFromStorage();
  memoryLog.push({ ts: Date.now(), type: 'llm_response', payload });
  saveToStorage();
}

export function logChatMessage(role: 'user'|'assistant'|'system', text: string, extras?: any): void {
  if (!memoryLog.length) loadFromStorage();
  memoryLog.push({ ts: Date.now(), type: 'chat_message', role, text, extras });
  saveToStorage();
}

export function exportSession(): SessionEntry[] {
  if (!memoryLog.length) loadFromStorage();
  return memoryLog.slice();
}

export function clearSession(): void {
  memoryLog = [];
  saveToStorage();
}


