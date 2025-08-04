import { forwardRef } from "react";
import { Badge } from "@ui8kit/core";
import type { HeroBadgeProps } from "../types";

export const HeroBadge = forwardRef<HTMLDivElement, HeroBadgeProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Badge 
        ref={ref}
        variant="secondary" 
        rounded="full"
        className={className}
        {...props}
      >
        {children}
      </Badge>
    );
  }
);

HeroBadge.displayName = "HeroBadge";