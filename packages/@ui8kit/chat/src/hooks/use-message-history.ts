import { useState, useCallback, useEffect } from 'react';
import type { Message } from '../core/interfaces';

interface UseMessageHistoryOptions {
  maxHistorySize?: number;
  persistKey?: string;
  autoSave?: boolean;
  saveThrottleMs?: number;
}

interface UseMessageHistoryReturn {
  messages: Message[];
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;

  // Message operations
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearHistory: () => void;

  // History operations
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  loadHistory: () => Promise<void>;
  exportHistory: () => Message[];
  importHistory: (messages: Message[]) => void;

  // Utility functions
  getMessageById: (id: string) => Message | undefined;
  findMessages: (predicate: (message: Message) => boolean) => Message[];
  replaceHistory: (messages: Message[]) => void;
}

export function useMessageHistory(
  initialMessages: Message[] = [],
  options: UseMessageHistoryOptions = {}
): UseMessageHistoryReturn {
  const {
    maxHistorySize = 1000,
    persistKey = 'chat-history',
    autoSave = true,
    saveThrottleMs = 1000,
  } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [history, setHistory] = useState<Message[][]>([initialMessages]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  const throttledSave = useCallback(() => {
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(() => {
      if (autoSave && persistKey) {
        try {
          localStorage.setItem(persistKey, JSON.stringify(messages));
        } catch (error) {
          console.warn('Failed to save chat history:', error);
        }
      }
    }, saveThrottleMs);

    setSaveTimeout(timeout);
  }, [messages, persistKey, autoSave, saveThrottleMs, saveTimeout]);

  // Load history on mount
  useEffect(() => {
    if (persistKey) {
      loadHistory();
    }
  }, [persistKey]);

  // Auto-save on messages change
  useEffect(() => {
    if (autoSave) {
      throttledSave();
    }
  }, [messages, throttledSave, autoSave]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];

      // Limit history size
      if (newMessages.length > maxHistorySize) {
        return newMessages.slice(-maxHistorySize);
      }

      return newMessages;
    });

    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...messages, message]);

      // Limit history size
      if (newHistory.length > 50) { // Keep last 50 history states
        return newHistory.slice(-50);
      }

      return newHistory;
    });

    setHistoryIndex(prev => prev + 1);
  }, [messages, historyIndex, maxHistorySize]);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );

    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      const updatedMessages = messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      );
      newHistory.push(updatedMessages);

      return newHistory.slice(-50);
    });

    setHistoryIndex(prev => prev + 1);
  }, [messages, historyIndex]);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));

    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      const filteredMessages = messages.filter(msg => msg.id !== id);
      newHistory.push(filteredMessages);

      return newHistory.slice(-50);
    });

    setHistoryIndex(prev => prev + 1);
  }, [messages, historyIndex]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setHistory([[]]);
    setHistoryIndex(0);

    if (persistKey) {
      try {
        localStorage.removeItem(persistKey);
      } catch (error) {
        console.warn('Failed to clear persisted history:', error);
      }
    }
  }, [persistKey]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMessages(history[newIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMessages(history[newIndex]);
    }
  }, [historyIndex, history]);

  const saveHistory = useCallback(() => {
    if (persistKey) {
      try {
        localStorage.setItem(persistKey, JSON.stringify(messages));
      } catch (error) {
        console.warn('Failed to save history:', error);
      }
    }
  }, [messages, persistKey]);

  const loadHistory = useCallback(async () => {
    if (persistKey) {
      try {
        const saved = localStorage.getItem(persistKey);
        if (saved) {
          const parsedMessages = JSON.parse(saved);
          setMessages(parsedMessages);
          setHistory([parsedMessages]);
          setHistoryIndex(0);
        }
      } catch (error) {
        console.warn('Failed to load history:', error);
      }
    }
  }, [persistKey]);

  const exportHistory = useCallback((): Message[] => {
    return [...messages];
  }, [messages]);

  const importHistory = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    setHistory([newMessages]);
    setHistoryIndex(0);
  }, []);

  const getMessageById = useCallback((id: string): Message | undefined => {
    return messages.find(msg => msg.id === id);
  }, [messages]);

  const findMessages = useCallback(
    (predicate: (message: Message) => boolean): Message[] => {
      return messages.filter(predicate);
    },
    [messages]
  );

  const replaceHistory = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    setHistory([newMessages]);
    setHistoryIndex(0);
  }, []);

  return {
    messages,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historySize: history.length,

    addMessage,
    updateMessage,
    removeMessage,
    clearHistory,

    undo,
    redo,
    saveHistory,
    loadHistory,
    exportHistory,
    importHistory,

    getMessageById,
    findMessages,
    replaceHistory,
  };
}
