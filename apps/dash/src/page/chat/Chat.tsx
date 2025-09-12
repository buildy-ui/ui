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
    <Box w="full" h="full" position="relative" className="max-w-full">
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
          w="full"
          position="relative"
          overflow="auto"
          p="sm"
          className="max-w-full overflow-x-hidden"
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
            <ChatMessageArea className="max-w-full w-full overflow-x-hidden">
              {messages.map((message) => (
                <Fragment key={message.id}>
                  <ChatMessage
                    id={message.id}
                    type={message.role === 'user' ? 'outgoing' : 'incoming'}
                    variant={message.role !== 'user' ? 'bubble' : 'default'}
                  >
                    {message.role === 'user' && (
                      <ChatMessageAvatar  />
                    )}
                    <Stack gap="md">
                      {message.role !== 'user' && message.reasoningText && (
                        <Box display="flex" w="full" mb="md">
                          {/* Render dropdown for this assistant message */}
                          <ChatDropdown text={message.reasoningText} finished={Boolean(message.reasoningFinished)} />
                        </Box>
                      )}
                      <ChatMessageContent
                        id={message.id}
                        content={message.content}
                      />
                    </Stack>
                  </ChatMessage>
                </Fragment>
              ))}
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
          position="sticky"
          w="full"
          z="10"
          mt="lg"
          border="1px"
          borderColor="border"
          className="bottom-0 focus-within:ring-1 focus-within:ring-ring focus-within:outline-none transition-colors"
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
              className="w-full border-none ring-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none !bg-card"
            />
            <Box display="flex" w="full" justify="end" mt="sm">
              <Group gap="sm" justify="between" w="full">
                <Box display="flex-1" justify="start"><RequestStatusIndicator status={requestStatus} theme={theme} /></Box>

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
