import { useState, useCallback, useRef, useEffect } from 'react';
import type { Model } from '@ui8kit/chat';
import { ui8chatCompletions } from '@/services/ui8kitChat';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  reasoningText?: string;
  reasoningFinished?: boolean;
}

export type RequestStatus =
  | 'idle'
  | 'connecting_openrouter'
  | 'openrouter_response'
  | 'calling_openai'
  | 'openai_processing'
  | 'model_reasoning'
  | 'generating_response'
  | 'streaming_tokens'
  | 'completed';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: Model;
  error: string | null;
  inputValue: string;
  requestStatus: RequestStatus;
  reasoningText: string;
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedModel: 'gpt-5-mini',
    error: null,
    inputValue: '',
    requestStatus: 'idle',
    reasoningText: '',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const setSelectedModel = useCallback((model: Model) => {
    setState(prev => ({ ...prev, selectedModel: model }));
  }, []);

  const setInputValue = useCallback((value: string) => {
    setState(prev => ({ ...prev, inputValue: value }));
  }, []);

  const setRequestStatus = useCallback((status: RequestStatus) => {
    setState(prev => ({ ...prev, requestStatus: status }));
  }, []);

  // Ensure unique, stable IDs for React keys even within the same ms
  const idSeqRef = useRef(0);
  const generateId = useCallback(() => {
    idSeqRef.current += 1;
    return `${Date.now()}_${idSeqRef.current}`;
  }, []);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: generateId(),
      content,
      role,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      error: null,
    }));

    return message;
  }, [generateId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    // Clear input immediately and reset reasoning text
    setState(prev => ({ ...prev, inputValue: '', requestStatus: 'connecting_openrouter', reasoningText: '' }));

    // Add user message
    const userMessage = addMessage(content, 'user');

    // Start loading
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Debug: log request payload summary
      // eslint-disable-next-line no-console
      console.log('[chat] sendMessage', { model: state.selectedModel, prevMessages: state.messages.length, userContentLength: content.length });
      // Prepare messages for API
      const messages = state.messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Status: Connecting to OpenRouter (initial phase)
      setRequestStatus('connecting_openrouter');

      // Create temporary assistant message to update progressively
      const assistantMessage = addMessage('', 'assistant');

      // Stream via UI8Kit AIClient-backed service
      const result = await ui8chatCompletions({
        model: state.selectedModel,
        messages,
        stream: true,
        reasoning: { effort: 'medium', exclude: false },
        temperature: 0.5,
        max_tokens: 8000,
        signal: abortController.signal,
        onProgress: (status, data) => {
          switch (status) {
            case 'reasoning': {
              setRequestStatus('model_reasoning');
              const chunk = data.reasoningText || '';
              if (chunk) {
                // eslint-disable-next-line no-console
                // console.log('[chat] reasoning chunk', { length: chunk.length, sample: chunk.slice(0, 80) });
                setState(prev => ({
                  ...prev,
                  reasoningText: prev.reasoningText + chunk,
                  messages: prev.messages.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, reasoningText: (msg.reasoningText || '') + chunk, reasoningFinished: false }
                      : msg
                  ),
                }));
              }
              break;
            }
            case 'content': {
              const delta = data.delta || '';
              const total = data.totalLength || 0;
              // eslint-disable-next-line no-console
              // console.log('[chat] content delta', { length: delta.length, total });
              if (total < 10) setRequestStatus('generating_response');
              else setRequestStatus('streaming_tokens');
              // Update assistant message content incrementally
              setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: (msg.content || '') + delta }
                    : msg
                ),
              }));
              break;
            }
            case 'usage':
              // Future: surface token usage in UI if needed
              // eslint-disable-next-line no-console
              console.log('[chat] usage', data.usage);
              break;
            case 'done':
              setRequestStatus('completed');
              setState(prev => {
                const nextMessages = prev.messages.map(msg =>
                  msg.id === assistantMessage.id ? { ...msg, reasoningFinished: true } : msg
                );
                const final = nextMessages.find(m => m.id === assistantMessage.id);
                // eslint-disable-next-line no-console
                console.log('[chat] done', { contentLength: (final?.content || '').length, hasReasoning: Boolean(final?.reasoningText), usageFromResult: result?.usage });
                return { ...prev, messages: nextMessages };
              });
              setTimeout(() => setRequestStatus('idle'), 2000);
              break;
          }
        },
      });

      // eslint-disable-next-line no-console
      console.log('[chat] final text', result?.text ?? '');

      // Status: Completed
      setRequestStatus('completed');

      // Reset to idle after a short delay
      setTimeout(() => setRequestStatus('idle'), 2000);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        setRequestStatus('idle');
        return;
      }

      console.error('Chat error:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to send message',
        requestStatus: 'idle',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
      abortControllerRef.current = null;
    }
  }, [state.messages, state.isLoading, state.selectedModel, addMessage, setRequestStatus]);

  const clearMessages = useCallback(() => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => ({
      ...prev,
      messages: [],
      isLoading: false,
      error: null,
      inputValue: '',
      requestStatus: 'idle',
      reasoningText: '',
    }));
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, isLoading: false, requestStatus: 'idle' }));
    }
  }, []);

  return {
    ...state,
    sendMessage,
    setSelectedModel,
    setInputValue,
    setRequestStatus,
    clearMessages,
    stopGeneration,
  };
}
