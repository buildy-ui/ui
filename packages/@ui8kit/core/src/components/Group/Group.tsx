import type { ReactNode, ElementType } from "react";
import { forwardRef } from "react";
import {
  Flex,
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

export interface GroupProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py' | 'm' | 'mx' | 'my'>,
    Pick<ColorProps, 'bg' | 'c'>,
    Pick<VariantLayoutProps, 'w' | 'h'>,
    Pick<VariantFlexProps, 'gap' | 'align' | 'justify' | 'wrap'> {
  children: ReactNode;
  component?: ElementType;
  grow?: boolean;
  preventGrowOverflow?: boolean;
}

export const Group = forwardRef<HTMLElement, GroupProps>(
  ({ 
    children, 
    className,
    component = 'div',
    gap = 'md',
    align = 'center',
    justify = 'start',
    wrap = 'nowrap',
    grow = false,
    preventGrowOverflow = true,
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
      <Flex
        ref={ref}
        component={component}
        data-class="group"
        className={cn(
          // Apply CVA variants - Group is always flex-row
          flexVariants({ gap, align, justify, wrap }),
          spacingVariants({ p, px, py, m, mx, my }),
          colorVariants({ bg, c }),
          layoutVariants({ w, h }),
          // Group specific styles
          grow && 'flex-1',
          preventGrowOverflow && 'min-w-0',
          className
        )}
        {...props}
      >
        {children}
      </Flex>
    );
  }
);

Group.displayName = "Group"; 