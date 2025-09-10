import { Block, Button, Icon, Group, Stack } from "@ui8kit/core";
import { ChevronDown } from "lucide-react";
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
  scrollButtonAlignment?: ScrollButtonAlignment;
}

export function ChatMessageArea({ children, scrollButtonAlignment = "right" }: ChatMessageAreaProps) {
  const [containerRef, showScrollButton, scrollToBottom] = useScrollToBottom<HTMLDivElement>();
  return (
    <Block position="relative" w="full" h="full">
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


