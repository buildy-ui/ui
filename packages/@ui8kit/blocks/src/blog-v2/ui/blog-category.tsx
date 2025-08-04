import { forwardRef } from "react";
import { Badge } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import type { BlogCategoryProps } from "../types";

const theme = skyOSTheme;

export const BlogCategory = forwardRef<HTMLDivElement, BlogCategoryProps>(
  ({ children, variant = "default", ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant={variant === "default" ? "filled" : "outline"}
        rounded={theme.rounded.default}
        {...props}
      >
        {children}
      </Badge>
    );
  }
);

BlogCategory.displayName = "BlogCategory";