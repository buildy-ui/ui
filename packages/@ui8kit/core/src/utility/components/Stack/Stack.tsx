import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

export const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8"
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch"
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around"
    },
    // Text alignment patterns from analysis
    ta: {
      left: "text-left",
      center: "text-center", 
      right: "text-right"
    },
    // Content container sizes from analysis
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",   // Found in analysis
      "4xl": "max-w-4xl",   // Found in analysis
      "6xl": "max-w-6xl",
      full: "max-w-none"
    },
    // Centering pattern from analysis
    centered: {
      true: "mx-auto",
      false: ""
    }
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    justify: "start"
  }
  });

export type StackVariants = VariantProps<typeof stackVariants>;

export interface StackProps extends StackVariants {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ 
    component = "div",
    className, 
    gap,
    align,
    justify,
    ta,
    size,
    centered,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="stack"
        className={cn(stackVariants({ gap, align, justify, ta, size, centered }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Stack.displayName = "Stack"; 