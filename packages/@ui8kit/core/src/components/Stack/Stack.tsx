import type { ReactNode, ElementType } from "react";
import { forwardRef } from "react";
import {
  Stack as BaseStack,
  spacingVariants,
  colorVariants,
  layoutVariants,
  flexVariants,
  textAlignVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  type VariantFlexProps,
  type TextAlignProps,
  cn
} from "../../core";

export interface StackProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py' | 'm' | 'mx' | 'my'>,
    Pick<ColorProps, 'bg' | 'c'>,
    Pick<VariantLayoutProps, 'w' | 'h'>,
    Pick<VariantFlexProps, 'gap' | 'align' | 'justify'>,
    TextAlignProps {
  children: ReactNode;
  component?: ElementType;
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
          // Apply CVA variants
          flexVariants({ gap, align, justify }),
          spacingVariants({ p, px, py, m, mx, my }),
          colorVariants({ bg, c }),
          layoutVariants({ w, h }),
          textAlignVariants({ ta }),
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