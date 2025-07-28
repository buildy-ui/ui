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
          // Apply variants
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

    const spanClasses = span ? {
      1: 'col-span-1',
      2: 'col-span-2', 
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
      full: 'col-span-full'
    }[span] : undefined;

    const startClasses = start && start !== 'auto' ? {
      1: 'col-start-1',
      2: 'col-start-2',
      3: 'col-start-3',
      4: 'col-start-4',
      5: 'col-start-5',
      6: 'col-start-6',
      7: 'col-start-7',
      8: 'col-start-8',
      9: 'col-start-9',
      10: 'col-start-10',
      11: 'col-start-11',
      12: 'col-start-12'
    }[start as number] : start === 'auto' ? 'col-start-auto' : undefined;

    const endClasses = end && end !== 'auto' ? {
      1: 'col-end-1',
      2: 'col-end-2',
      3: 'col-end-3',
      4: 'col-end-4',
      5: 'col-end-5',
      6: 'col-end-6',
      7: 'col-end-7',
      8: 'col-end-8',
      9: 'col-end-9',
      10: 'col-end-10',
      11: 'col-end-11',
      12: 'col-end-12',
      13: 'col-end-13'
    }[end as number] : end === 'auto' ? 'col-end-auto' : undefined;

    const orderClasses = order ? {
      1: 'order-1',
      2: 'order-2',
      3: 'order-3',
      4: 'order-4',
      5: 'order-5',
      6: 'order-6',
      7: 'order-7',
      8: 'order-8',
      9: 'order-9',
      10: 'order-10',
      11: 'order-11',
      12: 'order-12',
      first: 'order-first',
      last: 'order-last',
      none: 'order-none'
    }[order] : undefined;

    return (
      <Component
        ref={ref}
        data-class="grid-col"
        className={cn(
          spanClasses,
          startClasses,
          endClasses,
          orderClasses,
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