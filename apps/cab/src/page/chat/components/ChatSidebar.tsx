"use client"
import { Block, Box, Stack, Text } from "@ui8kit/core"
import { useAppTheme } from '@/hooks/use-theme';

interface ChatSidebarProps {
  className?: string;
  dataClass?: string;
}

export function ChatSidebar({ className, dataClass }: ChatSidebarProps) {
  const { rounded } = useAppTheme();
  return (
    <Block component="aside" className={className} data-class={dataClass}>
      <Box overflow="auto" h="screen">
        <Stack p="md" align="start">
          <Text c="muted">Chats</Text>
        </Stack>
        <Stack gap="lg" p="md">
          <Box p="md" rounded={rounded?.default} shadow="none" bg="card" border="1px" aspect="9/16" w="full"></Box>
        </Stack>
      </Box>
    </Block>
  )
}