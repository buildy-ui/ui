import { useState, useCallback, useRef, useEffect } from 'react';
import { Model } from '@ui8kit/chat';
import { llmFetch } from '@/services/llm';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
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
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedModel: 'gpt-5-mini',
    error: null,
    inputValue: '',
    requestStatus: 'idle',
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

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
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
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    // Clear input immediately
    setState(prev => ({ ...prev, inputValue: '', requestStatus: 'connecting_openrouter' }));

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
      // Prepare messages for API
      const messages = state.messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Status: Connecting to OpenRouter
      setRequestStatus('connecting_openrouter');

      // Make API request with streaming
      const response = await llmFetch('/chat/completions', {
        model: state.selectedModel,
        messages,
        stream: true,
      });

      // Status: OpenRouter responded, now calling OpenAI
      setRequestStatus('openrouter_response');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Status: Calling OpenAI API
      setRequestStatus('calling_openai');

      if (!response.body) {
        throw new Error('Response body is not available');
      }

      // Status: OpenAI is processing the request
      setRequestStatus('openai_processing');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      // Create temporary assistant message
      const assistantMessage = addMessage('', 'assistant');

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;

                if (delta) {
                  // Status: Model is reasoning and generating response
                  if (assistantContent === '') {
                    setRequestStatus('model_reasoning');
                  } else if (assistantContent.length < 50) {
                    setRequestStatus('generating_response');
                  } else {
                    setRequestStatus('streaming_tokens');
                  }

                  assistantContent += delta;

                  // Update the assistant message with new content
                  setState(prev => ({
                    ...prev,
                    messages: prev.messages.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: assistantContent }
                        : msg
                    ),
                  }));
                }
              } catch (e) {
                // Skip invalid JSON
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (!assistantContent) {
        throw new Error('No response content received');
      }

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
