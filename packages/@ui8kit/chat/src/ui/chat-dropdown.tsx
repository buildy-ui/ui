import { useEffect, useState } from "react";
import { Block, Button, Group, Icon, Text } from "@ui8kit/core";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChatDropdownProps {
  title?: string;
  text: string;
  finished?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export function ChatDropdown({
  title = "Reasoning",
  text,
  finished = false,
  defaultOpen = true,
  onToggle,
}: ChatDropdownProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  useEffect(() => {
    if (finished && open) {
      setOpen(false);
      onToggle?.(false);
    }
  }, [finished]);

  if (!text) return null;

  return (
    <Block w="full">
      <Group justify="between" align="center" w="full">
        <Text size="sm" fw="medium" c="muted">
          {title}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const next = !open;
            setOpen(next);
            onToggle?.(next);
          }}
        >
          <Icon lucideIcon={open ? ChevronUp : ChevronDown} />
        </Button>
      </Group>
      {open && (
        <Block mt="sm">
          <Text size="xs" c="muted">
            {text}
          </Text>
        </Block>
      )}
    </Block>
  );
}

export default ChatDropdown;


