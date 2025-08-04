import { forwardRef } from "react";
import { Text } from "@ui8kit/core";
import type { HeroDescriptionProps } from "../types";

export const HeroDescription = forwardRef<HTMLParagraphElement, HeroDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        c="secondary-foreground"
        className={`max-w-[42rem] ${className || ""}`}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

HeroDescription.displayName = "HeroDescription";