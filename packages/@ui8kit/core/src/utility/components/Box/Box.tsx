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
    // Flex patterns
    flex: {
      center: "flex items-center justify-center"
    },
    overflow: {
      hidden: "overflow-hidden"
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
    // Height patterns
    height: {
      fit: "h-fit",
      full: "h-full",
      auto: "h-auto",
      "1px": "h-px",
      screen: "h-screen"
    },
    // Width values
    w: {
      "1px": "w-px",
      "2xl": "w-2xl",
      "3xl": "w-3xl",
      "4xl": "w-4xl",
      "5xl": "w-5xl",
      "6xl": "w-6xl",
      "7xl": "w-7xl",
      full: "w-full",
      fit: "w-fit",
      auto: "w-auto"
    },
    // Height values
    h: {
      "1px": "h-px",
      "2xl": "h-2xl",
      "3xl": "h-3xl", 
      "4xl": "h-4xl",
      "5xl": "h-5xl",
      "6xl": "h-6xl",
      "7xl": "h-7xl",
      full: "h-full",
      fit: "h-fit",
      auto: "h-auto"
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
    },
    // Border styles
    border: {
      none: "border-0",
      "1px": "border",
      "2px": "border-2",
      "4px": "border-4"
    },
    borderTop: {
      none: "border-t-0",
      "1px": "border-t",
      "2px": "border-t-2",
      "4px": "border-t-4"
    },
    borderBottom: {
      none: "border-b-0",
      "1px": "border-b",
      "2px": "border-b-2", 
      "4px": "border-b-4"
    },
    borderLeft: {
      none: "border-l-0",
      "1px": "border-l",
      "2px": "border-l-2",
      "4px": "border-l-4"
    },
    borderRight: {
      none: "border-r-0",
      "1px": "border-r",
      "2px": "border-r-2",
      "4px": "border-r-4"
    },
    // Border colors
    borderColor: {
      transparent: "border-transparent",
      current: "border-current",
      border: "border-border",
      input: "border-input",
      ring: "border-ring",
      foreground: "border-foreground",
      primary: "border-primary",
      secondary: "border-secondary",
      destructive: "border-destructive",
      muted: "border-muted",
      accent: "border-accent"
    },
    // Padding
    p: {
      none: "p-0",
      xs: "p-1",
      sm: "p-2", 
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
      "2xl": "p-12"
    },
    px: {
      none: "px-0",
      xs: "px-1",
      sm: "px-2",
      md: "px-4", 
      lg: "px-6",
      xl: "px-8",
      "2xl": "px-12"
    },
    py: {
      none: "py-0",
      xs: "py-1",
      sm: "py-2",
      md: "py-4",
      lg: "py-6", 
      xl: "py-8",
      "2xl": "py-12"
    },
    pt: {
      none: "pt-0",
      xs: "pt-1",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6",
      xl: "pt-8",
      "2xl": "pt-12"
    },
    pb: {
      none: "pb-0",
      xs: "pb-1", 
      sm: "pb-2",
      md: "pb-4",
      lg: "pb-6",
      xl: "pb-8",
      "2xl": "pb-12"
    },
    pl: {
      none: "pl-0",
      xs: "pl-1",
      sm: "pl-2",
      md: "pl-4",
      lg: "pl-6",
      xl: "pl-8",
      "2xl": "pl-12"
    },
    pr: {
      none: "pr-0",
      xs: "pr-1",
      sm: "pr-2", 
      md: "pr-4",
      lg: "pr-6",
      xl: "pr-8",
      "2xl": "pr-12"
    },
    // Margin
    m: {
      none: "m-0",
      xs: "m-1",
      sm: "m-2",
      md: "m-4", 
      lg: "m-6",
      xl: "m-8",
      "2xl": "m-12",
      auto: "m-auto"
    },
    mx: {
      none: "mx-0",
      xs: "mx-1",
      sm: "mx-2",
      md: "mx-4",
      lg: "mx-6",
      xl: "mx-8", 
      "2xl": "mx-12",
      auto: "mx-auto"
    },
    my: {
      none: "my-0",
      xs: "my-1",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
      xl: "my-8",
      "2xl": "my-12",
      auto: "my-auto"
    },
    mt: {
      none: "mt-0",
      xs: "mt-1",
      sm: "mt-2",
      md: "mt-4",
      lg: "mt-6",
      xl: "mt-8",
      "2xl": "mt-12",
      auto: "mt-auto"
    },
    mb: {
      none: "mb-0",
      xs: "mb-1",
      sm: "mb-2",
      md: "mb-4",
      lg: "mb-6",
      xl: "mb-8",
      "2xl": "mb-12",
      auto: "mb-auto"
    },
    ml: {
      none: "ml-0",
      xs: "ml-1",
      sm: "ml-2",
      md: "ml-4",
      lg: "ml-6",
      xl: "ml-8",
      "2xl": "ml-12",
      auto: "ml-auto"
    },
    mr: {
      none: "mr-0",
      xs: "mr-1",
      sm: "mr-2",
      md: "mr-4",
      lg: "mr-6",
      xl: "mr-8",
      "2xl": "mr-12",
      auto: "mr-auto"
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
    flex,
    spacing,
    overflow,
    width,
    height,
    w,
    h,
    bg,
    rounded,
    position,
    z,
    border,
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,
    borderColor,
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="box"
        className={cn(boxVariants({ 
          display, 
          size, 
          flex, 
          spacing, 
          overflow, 
          width,
          height,
          w,
          h,
          bg, 
          rounded, 
          position, 
          z,
          border,
          borderTop,
          borderBottom,
          borderLeft,
          borderRight,
          borderColor,
          p,
          px,
          py,
          pt,
          pb,
          pl,
          pr,
          m,
          mx,
          my,
          mt,
          mb,
          ml,
          mr
        }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = "Box"; 