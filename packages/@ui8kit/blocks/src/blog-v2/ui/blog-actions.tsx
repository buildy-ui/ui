import { forwardRef } from "react";
import { Group } from "@ui8kit/core";
import type { BlogActionsProps } from "../types";

export const BlogActions = forwardRef<HTMLDivElement, BlogActionsProps>(
  ({ children, ...props }, ref) => {
    return (
      <Group
        ref={ref}
        gap="md"
        align="center"
        wrap="wrap"
        {...props}
      >
        {children}
      </Group>
    );
  }
);

BlogActions.displayName = "BlogActions";