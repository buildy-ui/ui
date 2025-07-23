import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base", 
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl"
    },
    fw: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    ta: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify"
    },
    c: {
      foreground: "text-foreground",
      mutedForeground: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      secondaryForeground: "text-secondary-foreground",
      destructive: "text-destructive",
      accent: "text-accent",
      white: "text-white"
    },
    truncate: {
      true: "truncate",
      false: ""
    }
  },
  defaultVariants: {
    size: "md",
    fw: "normal",
    ta: "left",
    c: "foreground",
    truncate: false
  }
});

export interface TextProps extends VariantProps<typeof textVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ 
    component = "p",
    className, 
    size,
    fw,
    ta,
    c,
    truncate,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="text"
        className={cn(textVariants({ size, fw, ta, c, truncate }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text"; 