import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface GridProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ component = "div", className, children, ...props }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn("grid", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Grid.displayName = "Grid"; 