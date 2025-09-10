"use client";

import type { ReactNode, ChangeEventHandler, ComponentProps, KeyboardEvent } from "react";
import { createContext, useContext } from "react";
import { Block, Button, Icon } from "@ui8kit/core";
import { Textarea } from "@ui8kit/form";
import { useTextareaResize } from "../hooks/use-textarea-resize";
import { ArrowUp, Square } from "lucide-react";

interface ChatInputContextValue {
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit?: () => void;
  onMessageSubmit?: (message: string) => void;
  loading?: boolean;
  onStop?: () => void;
  variant?: "default" | "unstyled";
  rows?: number;
}

const ChatInputContext = createContext<ChatInputContextValue>({});

interface ChatInputProps extends Omit<ChatInputContextValue, "variant"> {
  children: any;
  className?: string;
  variant?: "default" | "unstyled";
  rows?: number;
  onMessageSubmit?: (message: string) => void;
}

function ChatInput({
  children,
  className,
  variant = "default",
  value,
  onChange,
  onSubmit,
  onMessageSubmit,
  loading,
  onStop,
  rows = 1,
}: ChatInputProps) {
  const contextValue: ChatInputContextValue = {
    value,
    onChange,
    onSubmit,
    onMessageSubmit,
    loading,
    onStop,
    variant,
    rows,
  };

  return (
    <ChatInputContext.Provider value={contextValue}>
      {/* Container: layout-only via ui8kit Block */}
      <Block data-class="chat-input" w="full">
        {children}
      </Block>
    </ChatInputContext.Provider>
  );
}

ChatInput.displayName = "ChatInput";

interface ChatInputTextAreaProps extends ComponentProps<typeof Textarea> {
  onSubmit?: () => void;
  variant?: "default" | "unstyled";
  rows?: number;
}

function ChatInputTextArea({
  onSubmit: onSubmitProp,
  variant: variantProp,
  rows: rowsProp,
  "aria-label": ariaLabel,
  ...props
}: ChatInputTextAreaProps) {
  const context = useContext(ChatInputContext);
  const onSubmit = onSubmitProp ?? context.onSubmit;
  const onMessageSubmit = context.onMessageSubmit;
  const rows = rowsProp ?? context.rows ?? 1;

  // Convert parent variant to textarea variant unless explicitly overridden
  const variant = variantProp ?? (context.variant === "default" ? "unstyled" : "default");

  // Get value from props or context
  const value = (props as any).value ?? context.value ?? "";

  const textareaRef = useTextareaResize(value, rows);
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!onMessageSubmit && !onSubmit) return;
    if (e.key === "Enter" && !e.shiftKey) {
      if (typeof value !== "string" || value.trim().length === 0) return;
      e.preventDefault();
      if (onMessageSubmit && value.trim()) {
        onMessageSubmit(value.trim());
      } else if (onSubmit) {
        onSubmit();
      }
    }
  };

  // Get onChange from props or context
  const onChange = (props as any).onChange ?? context.onChange;

  return (
    <Textarea
      ref={textareaRef}
      {...props}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      readOnly={!onChange}
      // No decorative classes; Textarea already uses tokens
      rows={rows}
      aria-label={ariaLabel || "Message input"}
      // When variant is "unstyled", rely on form's neutral field without extra borders
      data-variant={variant}
    />
  );
}

ChatInputTextArea.displayName = "ChatInputTextArea";

interface ChatInputSubmitProps extends ComponentProps<typeof Button> {
  onSubmit?: () => void;
  loading?: boolean;
  onStop?: () => void;
}

function ChatInputSubmit({
  onSubmit: onSubmitProp,
  loading: loadingProp,
  onStop: onStopProp,
  ...props
}: ChatInputSubmitProps) {
  const context = useContext(ChatInputContext);
  const loading = loadingProp ?? context.loading;
  const onStop = onStopProp ?? context.onStop;
  const onSubmit = onSubmitProp ?? context.onSubmit;
  const onMessageSubmit = context.onMessageSubmit;

  if (loading && onStop) {
    return (
      <Button
        size="icon"
        variant="outline"
        rounded="full"
        aria-label="Stop"
        onClick={(e) => {
          e.preventDefault();
          onStop?.();
        }}
        {...props}
      >
        <Icon lucideIcon={Square} />
      </Button>
    );
  }

  const currentValue = (props as any).value ?? context.value ?? "";
  const isDisabled = typeof currentValue !== "string" || currentValue.trim().length === 0;

  return (
    <Button
      size="icon"
      variant="outline"
      rounded="full"
      aria-label="Send"
      disabled={isDisabled}
      onClick={(event) => {
        event.preventDefault();
        if (!isDisabled) {
          if (onMessageSubmit && currentValue?.trim()) {
            onMessageSubmit(currentValue.trim());
          } else if (onSubmit) {
            onSubmit();
          }
        }
      }}
      {...props}
    >
      <Icon lucideIcon={ArrowUp} />
    </Button>
  );
}

ChatInputSubmit.displayName = "ChatInputSubmit";

export { ChatInput, ChatInputTextArea, ChatInputSubmit };


