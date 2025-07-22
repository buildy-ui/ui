import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2", 
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
      cols2: "grid-cols-1 lg:grid-cols-2", 
      cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      cols4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      cols5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
      cols2_6: "grid-cols-2 lg:grid-cols-6"
    },
    gap: {
      none: "gap-0",
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
      stretch: "items-stretch",
      baseline: "items-baseline"
    },
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch"
    },
    centered: {
      true: "items-center",
      false: ""
    }
  },
  defaultVariants: {
    cols: 1,
    gap: "md",
    align: "stretch",
    justify: "stretch",
    centered: false
  }
});

export interface GridProps extends VariantProps<typeof gridVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

const Grid = forwardRef<HTMLElement, GridProps>(
  ({ 
    component = "div",
    className, 
    cols,
    gap,
    align,
    justify,
    centered,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="grid"
        className={cn(gridVariants({ cols, gap, align, justify, centered }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Grid.displayName = "Grid";

// Grid.Col component
const gridColVariants = cva("", {
  variants: {
    span: {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
      full: "col-span-full"
    },
    start: {
      1: "col-start-1",
      2: "col-start-2",
      3: "col-start-3",
      4: "col-start-4",
      5: "col-start-5",
      6: "col-start-6",
      7: "col-start-7",
      8: "col-start-8",
      9: "col-start-9",
      10: "col-start-10",
      11: "col-start-11",
      12: "col-start-12",
      auto: "col-start-auto"
    },
    order: {
      1: "order-1",
      2: "order-2",
      3: "order-3",
      4: "order-4",
      5: "order-5",
      6: "order-6",
      7: "order-7",
      8: "order-8",
      9: "order-9",
      10: "order-10",
      11: "order-11",
      12: "order-12",
      first: "order-first",
      last: "order-last",
      none: "order-none"
    }
  },
  defaultVariants: {
    span: 1
  }
});

export interface GridColProps extends VariantProps<typeof gridColVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

const GridCol = forwardRef<HTMLElement, GridColProps>(
  ({ 
    component = "div",
    className, 
    span,
    start,
    order,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        data-class="grid-col"
        className={cn(gridColVariants({ span, start, order }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GridCol.displayName = "GridCol";

// Compound component
const CompoundGrid = Object.assign(Grid, {
  Col: GridCol,
});

export { CompoundGrid as Grid, GridCol }; 