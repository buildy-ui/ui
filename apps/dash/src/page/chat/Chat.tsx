import { Box, Stack, Title, Button, Text, Group, Icon } from "@ui8kit/core";
import { Fragment } from 'react';
import {
  ChatInput,
  ChatInputTextArea,
  ChatInputSubmit,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageArea,
  ModelSelector,
  Model,
  ChatDropdown
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
              onChange={(model) => setSelectedModel(model as Model)}
            />

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
          p="md"
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
            >
              <Text c="muted" size="sm">
                Start a conversation by typing a message below
              </Text>
            </Box>
          ) : (
            <ChatMessageArea>
              {messages.map((message) => (
                <Fragment key={message.id}>
                  {message.role !== 'user' && message.reasoningText && (
                    <Box w="full">
                      <Box display="flex" w="full" mb="md">
                        {/* Render dropdown for this assistant message */}
                        <Box w="full">
                          <ChatDropdown text={message.reasoningText} finished={Boolean(message.reasoningFinished)} />
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {message.role === 'user' && (
                  <ChatMessage
                    id={message.id}
                    type='outgoing'
                  >
                    <ChatMessageAvatar />
                    <ChatMessageContent
                      id={message.id}
                      content={message.content}
                    />
                  </ChatMessage>
                  )}
                  {message.role !== 'user' && message.reasoningText && !isLoading && (
                  <ChatMessage
                    id={message.id}
                    type='incoming'
                    variant='bubble'
                  >
                    <ChatMessageAvatar />
                    <ChatMessageContent
                      id={message.id}
                      content={message.content}
                    />
                  </ChatMessage>
                  )}
                </Fragment>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <Box display="flex-1" ml="sm">
                  <RequestStatusIndicator status={requestStatus} theme={theme} /></Box>
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
          p="sm"
          className="focus-within:ring-1 focus-within:ring-ring focus-within:outline-none transition-colors"
        >
          <ChatInput
            onMessageSubmit={handleSubmit}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex flex-col items-end w-full gap-2"
          >
            <ChatInputTextArea
              placeholder="Type your message here..."
              disabled={isLoading}
              variant="unstyled"
              className={`w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none !bg-card`}
            />
            <Box display="flex" w="full" justify="end" mt="sm">
              <Group gap="sm" justify="between" w="full">
                <Button variant="outline" onClick={stopGeneration}>
                  <Icon lucideIcon={RotateCcw} />
                  Stop
                </Button>
                <ChatInputSubmit
                  loading={isLoading}
                  onStop={stopGeneration}
                >
                  Send
                </ChatInputSubmit>
              </Group>
            </Box>
          </ChatInput>
        </Box>
      </Stack>
    </Box>
  );
}
