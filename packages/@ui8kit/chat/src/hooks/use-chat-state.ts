import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '../core/interfaces';
import { generateMessageId, ensureMessageId, ensureMessageTimestamp } from '../utils/chat-utils';

interface UseChatStateOptions {
  initialMessages?: Message[];
  maxMessages?: number;
  onMessageAdd?: (message: Message) => void;
  onMessageUpdate?: (message: Message) => void;
  onMessageRemove?: (messageId: string) => void;
}

interface UseChatStateReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Message operations
  addMessage: (message: Partial<Message>) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility functions
  getMessageById: (id: string) => Message | undefined;
  getLastMessage: () => Message | undefined;
  getMessageCount: () => number;
  getUserMessages: () => Message[];
  getAssistantMessages: () => Message[];
}

export function useChatState(options: UseChatStateOptions = {}): UseChatStateReturn {
  const {
    initialMessages = [],
    maxMessages = 100,
    onMessageAdd,
    onMessageUpdate,
    onMessageRemove,
  } = options;

  const [messages, setMessages] = useState<Message[]>(() =>
    initialMessages.map(msg => ({
      ...ensureMessageId(msg),
      ...ensureMessageTimestamp(msg),
    }))
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageRefs = useRef<Map<string, Message>>(new Map());

  // Sync with refs for performance
  useEffect(() => {
    messageRefs.current.clear();
    messages.forEach(msg => messageRefs.current.set(msg.id || '', msg));
  }, [messages]);

  const addMessage = useCallback((message: Partial<Message>): string => {
    const id = message.id || generateMessageId();
    const fullMessage: Message = {
      role: message.role || 'user',
      content: message.content || '',
      id,
      timestamp: message.timestamp || new Date(),
      ...message,
    };

    setMessages(prev => {
      const newMessages = [...prev, fullMessage];

      // Limit message count if specified
      if (maxMessages && newMessages.length > maxMessages) {
        newMessages.splice(0, newMessages.length - maxMessages);
      }

      return newMessages;
    });

    onMessageAdd?.(fullMessage);
    return id;
  }, [maxMessages, onMessageAdd]);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id
          ? { ...msg, ...updates, timestamp: updates.timestamp || msg.timestamp }
          : msg
      )
    );

    const updatedMessage = messageRefs.current.get(id);
    if (updatedMessage) {
      const fullUpdatedMessage = { ...updatedMessage, ...updates };
      onMessageUpdate?.(fullUpdatedMessage);
    }
  }, [onMessageUpdate]);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    onMessageRemove?.(id);
  }, [onMessageRemove]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messageRefs.current.clear();
  }, []);

  const getMessageById = useCallback((id: string): Message | undefined => {
    return messageRefs.current.get(id);
  }, []);

  const getLastMessage = useCallback((): Message | undefined => {
    return messages[messages.length - 1];
  }, [messages]);

  const getMessageCount = useCallback((): number => {
    return messages.length;
  }, [messages]);

  const getUserMessages = useCallback((): Message[] => {
    return messages.filter(msg => msg.role === 'user');
  }, [messages]);

  const getAssistantMessages = useCallback((): Message[] => {
    return messages.filter(msg => msg.role === 'assistant');
  }, [messages]);

  return {
    messages,
    isLoading,
    error,

    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,

    setLoading: setIsLoading,
    setError,

    getMessageById,
    getLastMessage,
    getMessageCount,
    getUserMessages,
    getAssistantMessages,
  };
}
