import { forwardRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const titleVariants = cva("font-semibold tracking-tight", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm", 
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl"
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
      "muted-foreground": "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
      accent: "text-accent"
    }
  },
  defaultVariants: {
    size: "lg",
    fw: "semibold",
    ta: "left",
    c: "foreground"
  }
});

export interface TitleProps extends VariantProps<typeof titleVariants> {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ 
    order = 1,
    className, 
    size,
    fw,
    ta,
    c,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = `h${order}` as keyof JSX.IntrinsicElements;
    
    return (
      <Component
        ref={ref}
        data-class="title"
        className={cn(titleVariants({ size, fw, ta, c }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Title.displayName = "Title"; 