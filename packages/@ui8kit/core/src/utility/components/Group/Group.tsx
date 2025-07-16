import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const groupVariants = cva("flex flex-row", {
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
      baseline: "items-baseline",
      stretch: "items-stretch"
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse"
    }
  },
  defaultVariants: {
    gap: "md",
    align: "center",
    justify: "start",
    wrap: "nowrap"
  }
});

export interface GroupProps extends VariantProps<typeof groupVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Group = forwardRef<HTMLElement, GroupProps>(
  ({ 
    component = "div",
    className, 
    gap,
    align,
    justify,
    wrap,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-slot="group"
        className={cn(groupVariants({ gap, align, justify, wrap }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Group.displayName = "Group"; 