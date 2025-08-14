import { Block, Box, Button, Stack, Text, Title } from "@ui8kit/core";
import { Textarea } from '@ui8kit/form';
import { useAppTheme } from '@/hooks/use-theme';
import { useChat } from '@/page/chat/context';
import { useEffect, useRef, useState } from 'react';

export function ChatPage() {
  const { rounded, buttonSize } = useAppTheme();
  const { selectedThread, messages, sendMessage } = useChat();
  const [input, setInput] = useState<string>("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, selectedThread?.id]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="xl" c="secondary-foreground" mt="lg" data-class="chat-title">
          {selectedThread ? (selectedThread.title || 'New chat') : 'Start a new chat'}
        </Title>

        <Block p="md" rounded={rounded?.default} bg="card" border="1px">
          <Stack gap="md">
            <Box w="full" h="auto">
              <Stack gap="md">
                {messages.length === 0 && (
                  <Text c="muted">No messages yet. Type below to start the conversation.</Text>
                )}
                {messages.map(m => (
                  <Block key={m.id} bg={m.role === 'user' ? 'primary' : 'secondary'} c={m.role === 'user' ? 'primary-foreground' : 'secondary-foreground'} p="md" rounded={rounded?.default}>
                    <Stack gap="xs">
                      <Text size="sm" c="muted">{m.role === 'user' ? 'You' : 'Assistant'}</Text>
                      <Text>{m.text}</Text>
                    </Stack>
                  </Block>
                ))}
                <div ref={endRef} />
              </Stack>
            </Box>

            <Stack gap="sm">
              <Textarea
                placeholder="Type a message... (Ctrl/Cmd + Enter to send)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
              />
              <Box w="full">
                <Button size={buttonSize.sm} onClick={handleSend} style={{ float: 'right' }}>Send</Button>
              </Box>
            </Stack>
          </Stack>
        </Block>
      </Stack>
    </Box>
  );
}
