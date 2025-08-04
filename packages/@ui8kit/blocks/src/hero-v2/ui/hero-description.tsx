import { forwardRef } from "react";
import { Text } from "@ui8kit/core";
import type { HeroDescriptionProps } from "../types";

export const HeroDescription = forwardRef<HTMLParagraphElement, HeroDescriptionProps>(
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

HeroDescription.displayName = "HeroDescription";