import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface StackProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ component = "div", className, children, ...props }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Stack.displayName = "Stack"; 