import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const containerVariants = cva("container", {
  variants: {
    size: {
      xs: "max-w-screen-sm",
      sm: "max-w-screen-md",
      md: "max-w-screen-lg", 
      lg: "max-w-screen-xl",
      xl: "max-w-screen-2xl",
      "2xl": "max-w-2xl",   // For content containers 
      "4xl": "max-w-4xl",   // For content containers
      "6xl": "max-w-6xl",   // For content containers
      full: "max-w-none"
    },
    centered: {
      true: "mx-auto",
      false: ""
    },
    // Text alignment patterns
    ta: {
      left: "text-left",
      center: "text-center", 
      right: "text-right",
      justify: "text-justify"
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
    centered: true,
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
    centered,
    ta,
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
        className={cn(containerVariants({ size, centered, ta, fluid, padding }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = "Container";
