import { Block, Button, Icon, Group, Stack } from "@ui8kit/core";
import { ChevronDown } from "lucide-react";
import { ChatDropdown } from "./chat-dropdown";
import { ScrollArea } from "./scroll-area";
import { useScrollToBottom } from "../hooks/use-scroll-to-bottom";

type ScrollButtonAlignment = "left" | "center" | "right";

interface ScrollButtonProps {
  onClick: () => void;
  alignment?: ScrollButtonAlignment;
}

export function ScrollButton({ onClick, alignment = "right" }: ScrollButtonProps) {
  const justify: Record<ScrollButtonAlignment, "start" | "center" | "end"> = {
    left: "start",
    center: "center",
    right: "end",
  };

  return (
    <div className="absolute bottom-4 w-full">
      <Group justify={justify[alignment]} w="full">
        <Button size="icon" variant="secondary" rounded="full" onClick={onClick} aria-label="Scroll to bottom">
          <Icon lucideIcon={ChevronDown} />
        </Button>
      </Group>
    </div>
  );
}

interface ChatMessageAreaProps {
  children: any;
  className?: string;
  scrollButtonAlignment?: ScrollButtonAlignment;
  reasoningText?: string;
  reasoningFinished?: boolean;
}

export function ChatMessageArea({ children, scrollButtonAlignment = "right", reasoningText, reasoningFinished }: ChatMessageAreaProps) {
  const [containerRef, showScrollButton, scrollToBottom] = useScrollToBottom<HTMLDivElement>();
  return (
    <Block position="relative" w="full" h="full">
      {reasoningText && (
        <Block p="sm" border="1px" borderColor="border" rounded="md" mb="sm" bg="card">
          <ChatDropdown text={reasoningText} finished={Boolean(reasoningFinished)} />
        </Block>
      )}
      <ScrollArea>
        <Block ref={containerRef}>
          <Block minH="full">{children}</Block>
        </Block>
      </ScrollArea>
      {showScrollButton && (
        <ScrollButton onClick={scrollToBottom} alignment={scrollButtonAlignment} />
      )}
    </Block>
  );
}

ChatMessageArea.displayName = "ChatMessageArea";


