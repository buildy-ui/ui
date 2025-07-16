import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const containerVariants = cva("mx-auto w-full px-4", {
  variants: {
    size: {
      xs: "max-w-screen-sm",
      sm: "max-w-screen-md",
      md: "max-w-screen-lg", 
      lg: "max-w-screen-xl",
      xl: "max-w-screen-2xl",
      full: "max-w-none"
    },
    fluid: {
      true: "max-w-none",
      false: ""
    }
  },
  defaultVariants: {
    size: "lg",
    fluid: false
  }
});

export interface ContainerProps extends VariantProps<typeof containerVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ 
    component = "div",
    className, 
    size,
    fluid,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-slot="container"
        className={cn(containerVariants({ size, fluid }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = "Container";
