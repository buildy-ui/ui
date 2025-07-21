import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const blockVariants = cva("", {
  variants: {
    variant: {
      section: "block",
      main: "block", 
      nav: "block",
      article: "block",
      header: "block",
      footer: "block",
      aside: "block",
      div: "block"
    },
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
    w: {
      auto: "w-auto",
      full: "w-full",
      screen: "w-screen",
      fit: "w-fit",
      min: "w-min",
      max: "w-max"
    },
    h: {
      auto: "h-auto",
      full: "h-full",
      screen: "h-screen",
      fit: "h-fit",
      min: "h-min",
      max: "h-max"
    },
    p: {
      none: "p-0",
      xs: "p-1",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8"
    },
    px: {
      none: "px-0",
      xs: "px-1",
      sm: "px-2",
      md: "px-4",
      lg: "px-6",
      xl: "px-8"
    },
    py: {
      none: "py-0",
      xs: "py-0 md:py-4 lg:py-8",
      sm: "py-4 md:py-8 lg:py-16",
      md: "py-8 md:py-16 lg:py-24",
      lg: "py-16 md:py-24 lg:py-32",
      xl: "py-24 md:py-32 lg:py-40"
    },
    m: {
      none: "m-0",
      xs: "m-1",
      sm: "m-2",
      md: "m-4",
      lg: "m-6",
      xl: "m-8",
      auto: "m-auto"
    },
    mx: {
      none: "mx-0",
      xs: "mx-1",
      sm: "mx-2",
      md: "mx-4",
      lg: "mx-6",
      xl: "mx-8",
      auto: "mx-auto"
    },
    my: {
      none: "my-0",
      xs: "my-1",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
      xl: "my-8",
      auto: "my-auto"
    },
    bg: {
      transparent: "bg-transparent",
      background: "bg-background",
      foreground: "bg-foreground",
      primary: "bg-primary",
      "primary-foreground": "bg-primary-foreground",
      secondary: "bg-secondary",
      "secondary-foreground": "bg-secondary-foreground",
      muted: "bg-muted",
      "muted-foreground": "bg-muted-foreground",
      accent: "bg-accent",
      "accent-foreground": "bg-accent-foreground",
      destructive: "bg-destructive",
      "destructive-foreground": "bg-destructive-foreground",
      border: "bg-border",
      input: "bg-input",
      ring: "bg-ring"
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full"
    },
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl"
    },
    border: {
      none: "border-0",
      thin: "border",
      thick: "border-2"
    },
    position: {
      static: "static",
      relative: "relative",
      absolute: "absolute",
      fixed: "fixed",
      sticky: "sticky"
    }
  },
  defaultVariants: {
    variant: "div",
    display: "block"
  }
});

export interface BlockProps extends VariantProps<typeof blockVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Block = forwardRef<HTMLElement, BlockProps>(
  ({ 
    component,
    variant = "div",
    className, 
    display,
    w,
    h,
    p,
    px,
    py,
    m,
    mx,
    my,
    bg,
    rounded,
    shadow,
    border,
    position,
    style,
    children,
    'data-class': dataClass,
    ...props 
  }, ref) => {
    // Use variant as component if no component is explicitly provided
    const Component = (component || variant) as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class={dataClass || "block"}
        className={cn(
          blockVariants({ 
            variant, 
            display, 
            w, 
            h, 
            p, 
            px, 
            py, 
            m, 
            mx, 
            my, 
            bg, 
            rounded, 
            shadow, 
            border, 
            position 
          }), 
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Block.displayName = "Block"; 