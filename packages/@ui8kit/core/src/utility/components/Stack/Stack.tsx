import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const stackVariants = cva("flex flex-col", {
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
    }
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    justify: "start"
  }
});

export interface StackProps extends VariantProps<typeof stackVariants> {
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
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="stack"
        className={cn(stackVariants({ gap, align, justify }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Stack.displayName = "Stack"; 