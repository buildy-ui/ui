import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface FlexProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Flex = forwardRef<HTMLElement, FlexProps>(
  ({ component = "div", className, children, ...props }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn("flex", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Flex.displayName = "Flex"; 