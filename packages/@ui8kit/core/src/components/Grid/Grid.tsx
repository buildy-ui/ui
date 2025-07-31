import type { ReactNode } from "react";
import { forwardRef } from "react";
import {
  Grid as BaseGrid,
  Element as BaseElement,
  gridVariants,
  spacingVariants,
  colorVariants,
  layoutVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  cn
} from "../../core";

// Main Grid component interface
export interface GridProps 
  extends VariantSpacingProps,
    ColorProps,
    VariantLayoutProps {
  cols?: "1" | "2" | "3" | "4" | "5" | "6" | "1-2" | "1-3" | "1-4" | "1-5" | "1-6" | "2-3" | "2-4" | "2-5" | "2-6" | "3-4" | "3-5" | "3-6" | "4-5" | "4-6" | "5-6" | "1-2-3" | "1-2-4" | "1-2-6" | "1-3-4" | "1-3-6" | "2-3-4" | "1-2-3-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

// Enhanced Grid component with prop forwarding
const Grid = forwardRef<HTMLElement, GridProps>(
  ({ 
    children, 
    className,
    cols = "1",
    gap = "md",
    align = "stretch",
    justify = "start",
    // Spacing props
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    // Color props
    bg, c,
    // Layout props
    w, h,
    ...props 
  }, ref) => {
    return (
      <BaseGrid
        ref={ref}
        className={cn(
          // Apply grid variants
          gridVariants({ cols, gap, align, justify }),
          // Apply spacing variants
          spacingVariants({
            p, px, py, pt, pb, pl, pr,
            m, mx, my, mt, mb, ml, mr
          }),
          // Apply color variants
          colorVariants({ bg, c }),
          // Apply layout variants  
          layoutVariants({ w, h }),
          className
        )}
        data-class="grid"
        {...props}
      >
        {children}
      </BaseGrid>
    );
  }
);

Grid.displayName = "Grid";

// GridCol component interface
export interface GridColProps {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "auto" | "full";
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | "auto";
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | "auto";
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "first" | "last" | "none";
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

// GridCol component for grid items
const GridCol = forwardRef<HTMLElement, GridColProps>(
  ({ children, className, span, start, end, order, ...props }, ref) => {
    return (
      <BaseElement
        component="div"
        ref={ref}
        className={cn(
          // Span utility classes
          span === 1 && 'col-span-1',
          span === 2 && 'col-span-2',
          span === 3 && 'col-span-3',
          span === 4 && 'col-span-4',
          span === 5 && 'col-span-5',
          span === 6 && 'col-span-6',
          span === 7 && 'col-span-7',
          span === 8 && 'col-span-8',
          span === 9 && 'col-span-9',
          span === 10 && 'col-span-10',
          span === 11 && 'col-span-11',
          span === 12 && 'col-span-12',
          span === 'auto' && 'col-auto',
          span === 'full' && 'col-span-full',
          
          // Start utility classes
          start === 1 && 'col-start-1',
          start === 2 && 'col-start-2',
          start === 3 && 'col-start-3',
          start === 4 && 'col-start-4',
          start === 5 && 'col-start-5',
          start === 6 && 'col-start-6',
          start === 7 && 'col-start-7',
          start === 8 && 'col-start-8',
          start === 9 && 'col-start-9',
          start === 10 && 'col-start-10',
          start === 11 && 'col-start-11',
          start === 12 && 'col-start-12',
          start === 13 && 'col-start-13',
          start === 'auto' && 'col-start-auto',
          
          // End utility classes
          end === 1 && 'col-end-1',
          end === 2 && 'col-end-2',
          end === 3 && 'col-end-3',
          end === 4 && 'col-end-4',
          end === 5 && 'col-end-5',
          end === 6 && 'col-end-6',
          end === 7 && 'col-end-7',
          end === 8 && 'col-end-8',
          end === 9 && 'col-end-9',
          end === 10 && 'col-end-10',
          end === 11 && 'col-end-11',
          end === 12 && 'col-end-12',
          end === 13 && 'col-end-13',
          end === 'auto' && 'col-end-auto',
          
          // Order utility classes
          order === 1 && 'order-1',
          order === 2 && 'order-2',
          order === 3 && 'order-3',
          order === 4 && 'order-4',
          order === 5 && 'order-5',
          order === 6 && 'order-6',
          order === 7 && 'order-7',
          order === 8 && 'order-8',
          order === 9 && 'order-9',
          order === 10 && 'order-10',
          order === 11 && 'order-11',
          order === 12 && 'order-12',
          order === 'first' && 'order-first',
          order === 'last' && 'order-last',
          order === 'none' && 'order-none',
          
          className
        )}
        data-class="grid-col"
        {...props}
      >
        {children}
      </BaseElement>
    );
  }
);

GridCol.displayName = "GridCol";

// Compound Grid component
const CompoundGrid = Object.assign(Grid, {
  Col: GridCol,
});

// Export the Grid component and types
export { CompoundGrid as Grid, GridCol }; 