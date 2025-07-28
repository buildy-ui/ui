import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ 
    component = "span",
    className, 
    size,
    children,
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn(iconVariants({ size }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Icon.displayName = "Icon"; 