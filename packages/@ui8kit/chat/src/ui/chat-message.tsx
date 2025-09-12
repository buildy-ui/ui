import * as React from "react";
import { Block, Group, Icon } from "@ui8kit/core";
import { cva, type VariantProps } from "class-variance-authority";

const chatMessageVariants: ReturnType<typeof cva> = cva("", {
  variants: {
    variant: {
      default: undefined,
      bubble: undefined,
      full: undefined,
    },
    type: {
      incoming: undefined,
      outgoing: undefined,
    },
  },
  defaultVariants: {
    variant: "default",
    type: "incoming",
  },
});
import { MarkdownContent } from "./markdown-content";
import { Sparkles, User } from "lucide-react";

interface MessageContextValue extends VariantProps<typeof chatMessageVariants> {
  id: string;
  variant?: "default" | "bubble" | "full";
  type?: "incoming" | "outgoing";
}

const ChatMessageContext = React.createContext<MessageContextValue | null>(null);
const useChatMessage = () => React.useContext(ChatMessageContext);

interface ChatMessageProps extends VariantProps<typeof chatMessageVariants> {
  children?: any;
  id: string;
  className?: string;
  variant?: "default" | "bubble" | "full";
  type?: "incoming" | "outgoing";
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(({
  variant = "default",
  type = "incoming",
  id,
  children,
  ...props
}, ref) => {
  const align = type === "incoming" ? "start" : "end";
  return (
    <ChatMessageContext.Provider value={{ variant, type, id }}>
      <Block ref={ref} w="full" className="max-w-full overflow-hidden" {...props}>
        <Group className={(variant === "bubble" ? "bg-card/50 border-none shadow-none rounded-2xl p-4" : "bg-none border-none shadow-none p-4 mt-8") + " max-w-full overflow-hidden"} justify={align as any} gap="md" w="full">
          {children}
        </Group>
      </Block>
    </ChatMessageContext.Provider>
  );
});

ChatMessage.displayName = "ChatMessage";

interface ChatMessageAvatarProps {
  imageSrc?: string;
  icon?: any;
  className?: string;
}

const ChatMessageAvatar = React.forwardRef<HTMLDivElement, ChatMessageAvatarProps>(({ icon: iconProp, imageSrc, ...props }, ref) => {
  const context = useChatMessage();
  const type = context?.type ?? "incoming";
  const fallbackIcon = type === "incoming" ? Sparkles : User;
  return (
    <Block ref={ref} rounded="full" border="1px" borderColor={type === "incoming" ? "border" : "muted"} w="fit" h="fit" {...props}>
      {imageSrc ? (
        <img src={imageSrc} alt="Avatar" />
      ) : (
        <Icon lucideIcon={fallbackIcon} />
      )}
    </Block>
  );
});

ChatMessageAvatar.displayName = "ChatMessageAvatar";

interface ChatMessageContentProps {
  id?: string;
  content: string;
  children?: any;
  className?: string;
}

const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(({ content, id: idProp, children, ...props }, ref) => {
  const context = useChatMessage();
  const variant = context?.variant ?? "default";
  const type = context?.type ?? "incoming";
  const id = idProp ?? context?.id ?? "";
  const isBubble = variant === "bubble";

  return (
    <Block
      ref={ref}
      data-class="chat-message-content"
      rounded={isBubble ? "xl" : undefined}
      px={isBubble ? "md" : undefined}
      py={isBubble ? "xs" : undefined}
      {...props}
    >
      {content.length > 0 && <MarkdownContent id={id} content={content} />}
      {children}
    </Block>
  );
});

ChatMessageContent.displayName = "ChatMessageContent";

export { ChatMessage, ChatMessageAvatar, ChatMessageContent };


