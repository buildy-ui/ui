import { forwardRef } from "react";
import { Badge } from "@ui8kit/core";
import type { BlogBadgeProps } from "../types";

export const BlogBadge = forwardRef<HTMLDivElement, BlogBadgeProps>(
  ({ children, ...props }, ref) => {
    return (
      <Badge 
        ref={ref}
        variant="secondary" 
        rounded="full"
        {...props}
      >
        {children}
      </Badge>
    );
  }
);

BlogBadge.displayName = "BlogBadge";