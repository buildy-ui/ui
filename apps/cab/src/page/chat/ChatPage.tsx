import { Block, Box, Button, Group, Stack, Text, Title, Icon } from "@ui8kit/core";
import { Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@ui8kit/form';
import { ChevronDown, Send } from "lucide-react";
import { useAppTheme } from '@/hooks/use-theme';
import { useChat } from '@/page/chat/context';
import { useEffect, useRef, useState } from 'react';

export function ChatPage() {
  const { rounded, buttonSize } = useAppTheme();
  const { selectedThread, messages, sendMessage } = useChat();
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>("search1");
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const modelRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = modelRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setModelOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const modelLabel = model === 'search1' ? 'Search 1' : model === 'search2' ? 'Search 2' : 'Search 3';

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
              <Group justify="between" align="center" gap="sm">
                <Box w="auto" className="relative min-w-36" ref={modelRef as any}>
                  <Select className="hidden" value={model} onChange={() => {}} />
                  <SelectTrigger onClick={() => setModelOpen((v) => !v)}>
                    <SelectValue value={modelLabel} placeholder="Select" />
                    <Icon size="sm" c="secondary-foreground" component="span" lucideIcon={ChevronDown} className="ml-2" />
                  </SelectTrigger>
                  {modelOpen && (
                    <SelectContent className="absolute left-0 top-full bg-card">
                      <SelectItem value="search1" onClick={(v) => { setModel(v); setModelOpen(false); }}>Search 1</SelectItem>
                      <SelectItem value="search2" onClick={(v) => { setModel(v); setModelOpen(false); }}>Search 2</SelectItem>
                      <SelectItem value="search3" onClick={(v) => { setModel(v); setModelOpen(false); }}>Search 3</SelectItem>
                    </SelectContent>
                  )}
                </Box>
                <Button variant="secondary" size={buttonSize.default} onClick={handleSend} rounded={rounded.button}>
                  <Icon size="sm" c="secondary-foreground" component="span" lucideIcon={Send} />
                  <Text size="sm" c="secondary-foreground">Send</Text>
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Block>
      </Stack>
    </Box>
  );
}
