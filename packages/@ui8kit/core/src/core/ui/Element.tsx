import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface ElementProps {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Element = forwardRef<HTMLElement, ElementProps>(
  ({ as = "div", className, children, ...props }, ref) => {
    const Tag = as as ElementType;
    
    return (
      <Tag
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Element.displayName = "Element"; 