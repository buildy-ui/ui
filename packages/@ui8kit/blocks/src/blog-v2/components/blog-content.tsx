import { forwardRef } from "react";
import { Stack } from "@ui8kit/core";
import type { BlogContentProps } from "../types";

export const BlogContent = forwardRef<HTMLDivElement, BlogContentProps>(
  ({ children, align = "left", ...props }, ref) => {
    const textAlign = align === "center" ? "center" : "left";
    const stackAlign = align === "center" ? "center" : "start";

    return (
      <Stack
        ref={ref}
        gap="xl"
        align={stackAlign}
        ta={textAlign}
        {...props}
      >
        {children}
      </Stack>
    );
  }
);

BlogContent.displayName = "BlogContent";