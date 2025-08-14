"use client"
import { Block, Box, Button, Icon, Stack, Text } from "@ui8kit/core"
import { useAppTheme } from '@/hooks/use-theme';
import { useChat } from '@/page/chat/context';
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

interface ChatSidebarProps {
	className?: string;
	dataClass?: string;
}

export function ChatSidebar({ className, dataClass }: ChatSidebarProps) {
	const { rounded, buttonSize } = useAppTheme();
	const { threads, selectedThreadId, selectThread, createThread, removeThread, renewChat } = useChat();
  const navigate = useNavigate();
	return (
		<Block component="aside" className={className} data-class={dataClass}>
			<Box overflow="auto" h="screen">
				<Stack p="md" align="start" gap="md">
					<Text c="muted">Chats</Text>
					<Button variant="secondary" size="sm" rounded={rounded.button} onClick={() => createThread()}>New chat</Button>
				</Stack>
				<Stack gap="xs" p="md">
					{threads.length === 0 && (
						<Text c="muted" size="sm">No chats yet</Text>
					)}
					{threads.map(thread => (
						<Box
							key={thread.id}
							p="sm"
							rounded={rounded?.default}
							shadow="none"
							bg={selectedThreadId === thread.id ? 'accent' : 'card'}
							border="1px"
							w="full"
						>
							<Stack gap="xs" align="stretch">
								<Button
									size="sm"
									variant="ghost"
									contentAlign="between"
									onClick={() => selectThread(thread.id)}
								>
									<Text truncate c={selectedThreadId === thread.id ? 'accent' : 'foreground'}>{thread.title || 'New chat'}</Text>
								</Button>
								<Button size="xs" variant="ghost" onClick={() => removeThread(thread.id)}>
									<Text size="sm" c="muted">Delete</Text>
								</Button>
							</Stack>
						</Box>
					))}
				</Stack>
				<Stack p="md">
					<Button size="sm" variant="ghost" onClick={renewChat}>Reset selection</Button>
				</Stack>
        <Stack p="md">
          <Button onClick={() => navigate('/chat/setting')} variant="ghost" size={buttonSize.default} rounded={rounded.button}>
            <Icon component="span" lucideIcon={Settings} />
            <Text size="sm" c="muted">Setting</Text>
          </Button>
        </Stack>
			</Box>
		</Block>
	)
}