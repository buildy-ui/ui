import { forwardRef } from "react";
import { Stack } from "@ui8kit/core";
import type { HeroContentProps } from "../types";

export const HeroContent = forwardRef<HTMLDivElement, HeroContentProps>(
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

HeroContent.displayName = "HeroContent";