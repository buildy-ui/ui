import React, { useState, useCallback, useRef } from 'react';
import { AIClient } from '../core/ai-client';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '../ui/chat-message';
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from '../ui/chat-input';
import { ChatMessageArea } from '../ui/chat-message-area';
import { ScrollArea } from '../ui/scroll-area';
import { ModelSelector } from '../ui/model-selector';
import { useChatState } from '../hooks/use-chat-state';
import { useStreaming } from '../hooks/use-streaming';
import { useMessageHistory } from '../hooks/use-message-history';
import { useScrollToBottom } from '../hooks/use-scroll-to-bottom';
import type { Message } from '../core/interfaces';
import type { ProviderConfig } from '../providers/provider-factory';
import { createUserMessage, createAssistantMessage } from '../utils/chat-utils';
import { DEFAULT_MODEL } from '../core/config';

interface ChatCompositionProps {
  providerConfig: ProviderConfig;
  initialMessages?: Message[];
  systemPrompt?: string;
  placeholder?: string;
  className?: string;

  // Callbacks
  onMessageSend?: (message: Message) => void;
  onMessageReceive?: (message: Message) => void;
  onError?: (error: string) => void;

  // UI options
  showModelSelector?: boolean;
  availableModels?: string[];
  defaultModel?: string;

  // Chat options
  maxMessages?: number;
  streaming?: boolean;
  autoScroll?: boolean;

  // Styling
  variant?: 'default' | 'bubble' | 'full';
}

export function ChatComposition({
  providerConfig,
  initialMessages = [],
  systemPrompt,
  placeholder = "Type your message...",
  className,
  onMessageSend,
  onMessageReceive,
  onError,
  showModelSelector = false,
  availableModels = ['gpt-5-mini', 'gpt-5-high'],
  defaultModel = DEFAULT_MODEL,
  maxMessages = 100,
  streaming = true,
  autoScroll = true,
  variant = 'default',
}: ChatCompositionProps) {
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Initialize AI client
  const client = React.useMemo(() => new AIClient(providerConfig), [providerConfig]);

  // Chat state management
  const {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    setLoading,
    setError,
    getLastMessage,
  } = useChatState({
    initialMessages,
    maxMessages,
    onMessageAdd: onMessageSend,
  });

  // Message history management
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    exportHistory,
    importHistory,
  } = useMessageHistory(messages, {
    persistKey: 'chat-composition-history',
    autoSave: true,
  });

  // Streaming management
  const {
    isStreaming,
    currentContent,
    startStreaming,
    stopStreaming,
    resetStreaming,
    appendContent,
  } = useStreaming({
    client,
    onChunk: (chunk) => {
      const content = chunk.choices[0]?.delta?.content || '';
      appendContent(content);
    },
    onComplete: (fullContent) => {
      const assistantMessage = createAssistantMessage(fullContent);
      addMessage(assistantMessage);
      onMessageReceive?.(assistantMessage);
      setIsTyping(false);
    },
    onError: (error) => {
      setError(error.message);
      onError?.(error.message);
      setIsTyping(false);
    },
    autoScroll,
  });

  // Auto-scroll functionality
  const [scrollAreaRef, showScrollButton, scrollToBottom] = useScrollToBottom<HTMLDivElement>();

  // Handle message sending
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage = createUserMessage(content);
    addMessage(userMessage);
    setInputValue(''); // Clear input

    setIsTyping(true);
    setIsLoading(true);

    try {
      const conversationMessages: Message[] = [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        ...messages,
        userMessage,
      ];

      if (streaming) {
        await startStreaming(conversationMessages, {
          model: selectedModel,
          temperature: 0.7,
        });
      } else {
        // Non-streaming response
        const response = await client.chatCompletion({
          model: selectedModel,
          messages: conversationMessages,
          parameters: { temperature: 0.7 },
        });

        const assistantMessage = response.choices[0]?.message;
        if (assistantMessage) {
          addMessage(assistantMessage);
          onMessageReceive?.(assistantMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      if (!streaming) {
        setIsTyping(false);
      }
    }
  }, [
    client,
    messages,
    selectedModel,
    systemPrompt,
    streaming,
    addMessage,
    setLoading,
    setError,
    onMessageReceive,
    onError,
    startStreaming,
  ]);

  // Handle model change
  const handleModelChange = useCallback((model: string) => {
    setSelectedModel(model);
  }, []);

  // Handle stop streaming
  const handleStopStreaming = useCallback(() => {
    stopStreaming();
    resetStreaming();
    setIsTyping(false);
  }, [stopStreaming, resetStreaming]);

  // Handle clear chat
  const handleClearChat = useCallback(() => {
    clearMessages();
    resetStreaming();
  }, [clearMessages, resetStreaming]);

  // Auto-scroll when new messages arrive
  React.useEffect(() => {
    if (autoScroll && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, autoScroll, scrollToBottom]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with model selector */}
      {showModelSelector && (
        <div className="flex items-center justify-between p-4 border-b">
          <ModelSelector
            value={selectedModel}
            onChange={handleModelChange}
            models={availableModels}
          />
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              Redo
            </button>
            <button
              onClick={handleClearChat}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <ChatMessageArea>
          {messages.map((message) => (
            <ChatMessage
              key={message.id || Math.random().toString()}
              id={message.id || Math.random().toString()}
              type={message.role === 'user' ? 'outgoing' : 'incoming'}
              variant={variant}
            >
              <ChatMessageAvatar />
              <ChatMessageContent
                content={message.content}
              />
            </ChatMessage>
          ))}

          {/* Streaming message */}
          {isStreaming && currentContent && (
            <ChatMessage
              key="streaming"
              id="streaming"
              type="incoming"
              variant={variant}
            >
              <ChatMessageAvatar />
              <ChatMessageContent
                content={currentContent}
              />
            </ChatMessage>
          )}

          {/* Typing indicator */}
          {isTyping && !isStreaming && (
            <ChatMessage
              key="typing"
              id="typing"
              type="incoming"
              variant={variant}
            >
              <ChatMessageAvatar />
              <ChatMessageContent
                content="..."
              />
            </ChatMessage>
          )}
        </ChatMessageArea>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t">
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onMessageSubmit={handleSendMessage}
          loading={isLoading}
          onStop={handleStopStreaming}
        >
          <ChatInputTextArea placeholder={placeholder} />
          <ChatInputSubmit>Send</ChatInputSubmit>
        </ChatInput>
      </div>
    </div>
  );
}
