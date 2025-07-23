import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const boxVariants = cva("", {
  variants: {
    display: {
      block: "block",
      "inline-block": "inline-block",
      inline: "inline",
      flex: "flex",
      "inline-flex": "inline-flex",
      grid: "grid",
      "inline-grid": "inline-grid",
      hidden: "hidden"
    },
    // Icon/element sizing patterns
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
      "2xl": "w-12 h-12"
    },
    // Spacing patterns for icons and elements
    spacing: {
      left: "ml-2",
      right: "mr-2",
      "left-sm": "ml-1",
      "right-sm": "mr-1",
      "left-lg": "ml-3",
      "right-lg": "mr-3",
      none: ""
    },
    // Width fit patterns
    width: {
      fit: "w-fit",
      full: "w-full",
      auto: "w-auto"
    },
    // Background colors
    bg: {
      transparent: "bg-transparent",
      background: "bg-background",
      foreground: "bg-foreground",
      primary: "bg-primary/10",
      secondary: "bg-secondary",
      muted: "bg-muted",
      accent: "bg-accent",
      destructive: "bg-destructive"
    },
    // Border radius
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full"
    },
    // Position
    position: {
      static: "static",
      relative: "relative",
      absolute: "absolute",
      fixed: "fixed",
      sticky: "sticky"
    },
    // Z-index
    z: {
      "0": "z-0",
      "10": "z-10",
      "20": "z-20",
      "30": "z-30",
      "40": "z-40",
      "50": "z-50",
      auto: "z-auto"
    }
  }
});

export interface BoxProps extends VariantProps<typeof boxVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ 
    component = "div", 
    className, 
    display,
    size,
    spacing,
    width,
    bg,
    rounded,
    position,
    z,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="box"
        className={cn(boxVariants({ display, size, spacing, width, bg, rounded, position, z }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = "Box"; 