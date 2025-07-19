import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
      "2xl": "w-12 h-12"
    },
    spacing: {
      left: "ml-2",
      right: "mr-2",
      "left-sm": "ml-1",
      "right-sm": "mr-1", 
      "left-lg": "ml-3",
      "right-lg": "mr-3",
      none: ""
    },
    display: {
      inline: "inline-block",
      block: "block"
    },
    animated: {
      true: "transition-transform",
      false: ""
    },
    hover: {
      scale: "hover:scale-110",
      translate: "group-hover:translate-x-1",
      none: ""
    }
  },
  defaultVariants: {
    size: "md",
    spacing: "none",
    display: "inline",
    animated: false,
    hover: "none"
  }
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ 
    component = "div", 
    className, 
    size,
    spacing,
    display,
    animated,
    hover,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="icon"
        className={cn(iconVariants({ size, spacing, display, animated, hover }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Icon.displayName = "Icon"; 