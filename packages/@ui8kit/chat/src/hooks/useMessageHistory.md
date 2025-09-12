- Short answer: `useMessageHistory` only stores and manages messages (with undo/redo and localStorage). It does not automatically include history in LLM requests. Whether the history participates in subsequent requests depends on how your sending logic (e.g., `useChat`) builds the payload.

Recommendations to use it correctly:
- Include history in requests:
  - Before each API call, pass the current `messages` from the hook as context to the LLM (trimmed to token limit).
  - Prepend a system message if your app needs one.
- Control context size:
  - Use `maxHistorySize` to cap stored messages.
  - When sending, apply a token/length-based truncation strategy (e.g., keep latest turns, summarize older ones).
- Streaming integration:
  - On streaming, use `addMessage` once to create the assistant message, then `updateMessage(id, { content: partial })` on deltas. Avoid adding multiple assistant messages per turn.
- Persistence hygiene:
  - Use a distinct `persistKey` per conversation/thread.
  - Keep `autoSave: true` with a sensible `saveThrottleMs` (e.g., 500–1500ms) to reduce localStorage churn during streaming.
- Undo/redo semantics:
  - Expose undo/redo to the UI only for authoring states (user input/edits), not for incoming streamed deltas, to avoid confusing history snapshots.
- Robustness:
  - Guard `localStorage` access (SSR or restricted environments).
  - Provide a “clear” action that calls `clearHistory()` and resets UI state.
- Consistency:
  - Treat the hook as the single source of truth for rendered messages. Build request payloads from the same `messages` array to prevent drift between what users see and what the LLM receives.
- Roles and metadata:
  - Ensure each `Message` has correct `role` ('system' | 'user' | 'assistant').
  - If you add metadata (e.g., tool calls), keep them in the same structure and strip unsupported fields before sending.

If you want me to, I can review `useChat` (or wherever you construct the request in `apps/dash/src/page/chat/use-chat.ts`) to ensure it pulls from `useMessageHistory.messages` and trims/summarizes correctly before sending.