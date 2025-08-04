import { forwardRef } from "react";
import { Text } from "@ui8kit/core";
import type { BlogDescriptionProps } from "../types";

export const BlogDescription = forwardRef<HTMLParagraphElement, BlogDescriptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        c="secondary-foreground"
        style={{ maxWidth: "42rem" }}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

BlogDescription.displayName = "BlogDescription";