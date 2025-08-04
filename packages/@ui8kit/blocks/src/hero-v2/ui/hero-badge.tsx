import { forwardRef } from "react";
import { Badge } from "@ui8kit/core";
import type { HeroBadgeProps } from "../types";

export const HeroBadge = forwardRef<HTMLDivElement, HeroBadgeProps>(
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

HeroBadge.displayName = "HeroBadge";