import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface ComponentProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ component = "div", className, children, ...props }, ref) => {
    const Element = component as ElementType;
    
    return (
      <Element
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Component.displayName = "Component"; 