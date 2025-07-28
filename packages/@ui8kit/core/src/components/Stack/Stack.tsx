import { forwardRef, ReactNode, ElementType } from "react";
import {
  Stack as BaseStack,
  spacingVariants,
  colorVariants,
  layoutVariants,
  flexVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  type VariantFlexProps,
  cn
} from "../../core";

// Text alignment configurations
const textAlignVariants = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

export interface StackProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py' | 'm' | 'mx' | 'my'>,
    Pick<ColorProps, 'bg' | 'c'>,
    Pick<VariantLayoutProps, 'w' | 'h'>,
    Pick<VariantFlexProps, 'gap' | 'align' | 'justify'> {
  children: ReactNode;
  component?: ElementType;
  ta?: keyof typeof textAlignVariants;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ 
    children, 
    className,
    component = 'div',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    ta,
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
      <BaseStack
        ref={ref}
        component={component}
        data-class="stack"
        className={cn(
          // Apply variants
          flexVariants({ gap, align, justify }),
          spacingVariants({ p, px, py, m, mx, my }),
          colorVariants({ bg, c }),
          layoutVariants({ w, h }),
          // Text alignment
          ta && textAlignVariants[ta],
          className
        )}
        {...props}
      >
        {children}
      </BaseStack>
    );
  }
);

Stack.displayName = "Stack"; 