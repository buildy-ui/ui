import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../utils";

export interface ContainerProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(
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

Container.displayName = "Container"; 