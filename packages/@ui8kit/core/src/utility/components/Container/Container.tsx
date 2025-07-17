import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const containerVariants = cva("mx-auto w-full", {
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
    },
    padding: {
      none: "px-0",
      sm: "px-2",
      md: "px-4",
      lg: "px-6",
      xl: "px-8",
      responsive: "px-4 md:px-6 lg:px-8"
    }
  },
  defaultVariants: {
    size: "lg",
    fluid: false,
    padding: "responsive"
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
    padding,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="container"
        className={cn(containerVariants({ size, fluid, padding }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = "Container";
