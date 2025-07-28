import { forwardRef, ReactNode, ElementType } from "react";
import {
  Grid as BaseGrid,
  spacingVariants,
  colorVariants,
  layoutVariants,
  gridVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  type VariantGridProps,
  cn
} from "../../core";

export interface GridProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py' | 'm' | 'mx' | 'my'>,
    Pick<ColorProps, 'bg' | 'c'>,
    Pick<VariantLayoutProps, 'w' | 'h'>,
    VariantGridProps {
  children: ReactNode;
  component?: ElementType;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ 
    children, 
    className,
    component = 'div',
    cols = '1-2-3',
    gap = 'md',
    align = 'stretch',
    justify = 'stretch',
    // Spacing props
    p, px, py,
    m, mx, my,
    // Color props
    bg,
    c,
    // Layout props
    w,
    h,
    ...props 
  }, ref) => {
    return (
      <BaseGrid
        ref={ref}
        component={component}
        data-class="grid"
        className={cn(
          // Apply CVA variants
          gridVariants({ cols, gap, align, justify }),
          spacingVariants({ p, px, py, m, mx, my }),
          colorVariants({ bg, c }),
          layoutVariants({ w, h }),
          className
        )}
        {...props}
      >
        {children}
      </BaseGrid>
    );
  }
);

Grid.displayName = "Grid";

// Grid.Col component for spanning columns
export interface GridColProps 
  extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  component?: ElementType;
  span?: number | 'full';
  start?: number | 'auto';
  end?: number | 'auto';
  order?: number | 'first' | 'last' | 'none';
}

export const GridCol = forwardRef<HTMLElement, GridColProps>(
  ({ 
    children, 
    className,
    component = 'div',
    span,
    start,
    end,
    order,
    ...props 
  }, ref) => {
    const Component = component as ElementType;

    return (
      <Component
        ref={ref}
        data-class="grid-col"
        className={cn(
          // Column span utility classes
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
          span === 'full' && 'col-span-full',
          
          // Column start utility classes
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
          start === 'auto' && 'col-start-auto',
          
          // Column end utility classes
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
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GridCol.displayName = "GridCol";

// Compound Grid component
const CompoundGrid = Object.assign(Grid, {
  Col: GridCol,
});

//export { CompoundGrid as Grid };
//export { GridCol }; 