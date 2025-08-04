import { forwardRef } from "react";
import { Group } from "@ui8kit/core";
import type { HeroActionsProps } from "../types";

export const HeroActions = forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Group
        ref={ref}
        gap="md"
        align="center"
        className={`flex-wrap ${className || ""}`}
        {...props}
      >
        {children}
      </Group>
    );
  }
);

HeroActions.displayName = "HeroActions";