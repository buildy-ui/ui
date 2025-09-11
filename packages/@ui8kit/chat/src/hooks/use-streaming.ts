import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, StreamChunk } from '../core/interfaces';
import { DEFAULT_MODEL } from '../core/config';
import { AIClient } from '../core/ai-client';

interface UseStreamingOptions {
  client: AIClient;
  onChunk?: (chunk: StreamChunk) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
  autoScroll?: boolean;
}

interface UseStreamingReturn {
  isStreaming: boolean;
  currentContent: string;
  error: string | null;

  // Streaming control
  startStreaming: (messages: Message[], options?: StreamingOptions) => Promise<void>;
  stopStreaming: () => void;
  resetStreaming: () => void;

  // Content management
  appendContent: (content: string) => void;
  replaceContent: (content: string) => void;
  clearContent: () => void;
}

interface StreamingOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stop?: string[];
}

export function useStreaming(options: UseStreamingOptions): UseStreamingReturn {
  const { client, onChunk, onComplete, onError, autoScroll = true } = options;

  const [isStreaming, setIsStreaming] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const contentRef = useRef<string>('');

  // Sync content state with ref
  useEffect(() => {
    contentRef.current = currentContent;
  }, [currentContent]);

  const appendContent = useCallback((content: string) => {
    setCurrentContent(prev => prev + content);
  }, []);

  const replaceContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  const clearContent = useCallback(() => {
    setCurrentContent('');
    contentRef.current = '';
  }, []);

  const resetStreaming = useCallback(() => {
    stopStreaming();
    clearContent();
    setError(null);
  }, [clearContent]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const startStreaming = useCallback(async (
    messages: Message[],
    streamingOptions: StreamingOptions = {}
  ) => {
    if (isStreaming) {
      console.warn('Streaming is already in progress');
      return;
    }

    try {
      setIsStreaming(true);
      setError(null);
      clearContent();

      abortControllerRef.current = new AbortController();

      const stream = client.chatCompletionStream({
        model: streamingOptions.model || DEFAULT_MODEL,
        messages,
        parameters: {
          temperature: streamingOptions.temperature ?? 0.7,
          max_tokens: streamingOptions.max_tokens ?? 1000,
          stop: streamingOptions.stop,
          stream: true,
        },
      });

      let fullContent = '';

      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        onChunk?.(chunk);

        // Extract content from chunk
        if (chunk.choices[0]?.delta?.content) {
          const content = chunk.choices[0].delta.content;
          fullContent += content;
          appendContent(content);

          // Auto-scroll if enabled
          if (autoScroll) {
            // This would typically trigger a scroll to bottom
            // Implementation depends on the UI framework
          }
        }

        // Check for completion
        if (chunk.choices[0]?.finish_reason) {
          break;
        }
      }

      onComplete?.(fullContent);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Streaming failed';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [client, isStreaming, clearContent, appendContent, onChunk, onComplete, onError, autoScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  return {
    isStreaming,
    currentContent,
    error,

    startStreaming,
    stopStreaming,
    resetStreaming,

    appendContent,
    replaceContent,
    clearContent,
  };
}
