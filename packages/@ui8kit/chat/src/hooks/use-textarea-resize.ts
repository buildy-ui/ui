"use client";

import { useLayoutEffect, useRef } from "react";
import type { ComponentProps } from "react";

export function useTextareaResize(
  value: ComponentProps<"textarea">["value"],
  rows = 1,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Resize textarea height based on content and minimum rows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const textArea = textareaRef.current;
    if (!textArea) return;

    const computedStyle = window.getComputedStyle(textArea);
    const lineHeight = Number.parseInt(computedStyle.lineHeight, 10) || 20;
    const padding =
      Number.parseInt(computedStyle.paddingTop, 10) +
      Number.parseInt(computedStyle.paddingBottom, 10);
    const minHeight = lineHeight * rows + padding;

    textArea.style.height = "0px";
    const scrollHeight = Math.max(textArea.scrollHeight, minHeight);
    textArea.style.height = `${scrollHeight + 2}px`;
  }, [value, rows]);

  return textareaRef;
}


