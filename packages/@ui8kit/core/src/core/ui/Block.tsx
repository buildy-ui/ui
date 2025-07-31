import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface BlockProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Block = forwardRef<HTMLElement, BlockProps>(
  ({ component = "div", className, children, ...props }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Block.displayName = "Block"; 