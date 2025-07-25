import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const groupVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col"
    },
    // Responsive direction changes
    responsive: {
      sm: "sm:flex-row",
      md: "md:flex-row", 
      lg: "lg:flex-row",
      xl: "xl:flex-row",
      sm_between: "sm:flex-row sm:justify-between sm:items-center",
      sm_flex_col: "flex flex-col sm:flex-row mt-6 sm:mt-0",
      none: ""
    },
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
    spaceX: {
      xs: "space-x-1",
      sm: "space-x-2",
      md: "space-x-4",
      lg: "space-x-6",
      xl: "space-x-8"
    },
    spaceY: {
      xs: "space-y-1",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8"
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse"
    },
    // Padding
    py: {
      none: "py-0",
      xs: "py-1",
      sm: "py-2",
      md: "py-4",
      lg: "py-6", 
      xl: "py-8",
      "2xl": "py-12"
    },
    px: {
      none: "px-0",
      xs: "px-1",
      sm: "px-2",
      md: "px-4", 
      lg: "px-6",
      xl: "px-8",
      "2xl": "px-12"
    }
  },
  defaultVariants: {
    direction: "row",
    responsive: "none",
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
    direction,
    responsive,
    gap,
    align,
    justify,
    wrap,
    py,
    px,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="group"
        className={cn(groupVariants({ direction, responsive, gap, align, justify, wrap, py, px }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Group.displayName = "Group"; 