import { Box, Stack, Title, Button, Text, Group, Icon } from "@ui8kit/core";
import {
  ChatInput,
  ChatInputTextArea,
  ChatInputSubmit,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageArea,
  ModelSelector
} from "@ui8kit/chat";
import { useChat } from './use-chat';
import { RequestStatusIndicator } from './RequestStatusIndicator';
import { useAppTheme } from '@/hooks/use-theme';
import { Trash2, RotateCcw } from 'lucide-react';

const content = {
  title: "AI Chat Assistant",
  description: "Ask me anything about your project or code"
}

export function Chat() {
  const { rounded, buttonSize } = useAppTheme();
  const theme = {
    rounded,
    buttonSize,
  }

  const {
    messages,
    isLoading,
    selectedModel,
    error,
    inputValue,
    requestStatus,
    reasoningText,
    sendMessage,
    setSelectedModel,
    setInputValue,
    clearMessages,
    stopGeneration,
  } = useChat();

  const handleSubmit = (message: string) => {
    sendMessage(message);
  };

  return (
    <Box w="full" h="full" position="relative">
      <Stack gap="md" h="full">
        {/* Header */}
        <Stack gap="sm">
          <Title size="2xl" c="secondary-foreground" data-class="chat-title">
            {content.title}
          </Title>
          <Text c="muted">{content.description}</Text>

          {/* Model Selector */}
          <Group gap="md" justify="between">
            <ModelSelector
              value={selectedModel}
              onChange={setSelectedModel}
            />

            {/* Request Status Indicator */}
            <RequestStatusIndicator status={requestStatus} theme={theme} />

            {/* Controls */}
            <Group gap="sm">
              <Button
                size={buttonSize.default}
                variant="outline"
                onClick={clearMessages}
                disabled={messages.length === 0}
              >
                <Icon lucideIcon={Trash2} />
                Clear
              </Button>
              {isLoading && (
                <Button
                  size={buttonSize.default}
                  variant="outline"
                  onClick={stopGeneration}
                >
                  <Icon lucideIcon={RotateCcw} />
                  Stop
                </Button>
              )}
            </Group>
          </Group>
        </Stack>

        {/* Messages Area */}
        <Box
          flex="1"
          minH="200px"
          rounded={rounded?.default}
          shadow="none"
          bg="card"
          p="md"
          border="1px"
          borderColor="border"
          position="relative"
          overflow="hidden"
        >
          {messages.length === 0 ? (
            <Box
              position="absolute"
              inset="0"
              display="flex"
              align="center"
              justify="center"
              p="md"
            >
              <Text c="muted" size="sm">
                Start a conversation by typing a message below
              </Text>
            </Box>
          ) : (
            <ChatMessageArea reasoningText={reasoningText} reasoningFinished={requestStatus === 'completed'}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  type={message.role === 'user' ? 'outgoing' : 'incoming'}
                  variant="bubble"
                >
                  <ChatMessageAvatar />
                  <ChatMessageContent
                    id={message.id}
                    content={message.content}
                  />
                </ChatMessage>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <ChatMessage
                  id="loading"
                  type="incoming"
                  variant="bubble"
                >
                  <ChatMessageAvatar />
                  <ChatMessageContent
                    id="loading"
                    content="..."
                  />
                </ChatMessage>
              )}
            </ChatMessageArea>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Box p="md" rounded={rounded?.default} bg="destructive" c="destructive-foreground">
            <Text size="sm">{error}</Text>
          </Box>
        )}

        {/* Input Area */}
        <Box
          rounded={rounded?.default}
          shadow="none"
          bg="card"
          border="1px"
          borderColor="border"
          p="md"
        >
          <ChatInput
            onMessageSubmit={handleSubmit}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          >
            <Group gap="sm" justify="between">
            <ChatInputTextArea
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <ChatInputSubmit
              loading={isLoading}
              onStop={stopGeneration}
            >
              Send
            </ChatInputSubmit>
            </Group>
          </ChatInput>
        </Box>
      </Stack>
    </Box>
  );
}
