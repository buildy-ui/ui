import type { ReactNode, ElementType } from "react";
import { forwardRef } from "react";
import {
  Block as BaseBlock,
  spacingVariants,
  colorVariants,
  layoutVariants,
  roundedVariants,
  shadowVariants,
  borderVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  type RoundedProps,
  type ShadowProps,
  type BorderProps,
  cn
} from "../../core";

export interface BlockProps 
  extends React.HTMLAttributes<HTMLElement>,
    VariantSpacingProps,
    ColorProps,
    Pick<VariantLayoutProps, 'w' | 'h' | 'minH' | 'position'>,
    RoundedProps,
    ShadowProps,
    BorderProps {
  children: ReactNode;
  component?: ElementType;
  variant?: 'section' | 'main' | 'nav' | 'article' | 'header' | 'footer' | 'aside' | 'div';
}

export const Block = forwardRef<HTMLElement, BlockProps>(
  ({ 
    children, 
    className,
    component,
    variant = 'div',
    // Spacing props
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    // Color props
    bg,
    c,
    borderColor,
    // Layout props
    w = 'full',
    h,
    minH,
    position,
    // Visual props
    rounded,
    shadow,
    // Border props
    border,
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,
    ...props 
  }, ref) => {
    // Use variant as component if no component is explicitly provided
    const elementType = component || variant;

    return (
      <BaseBlock
        ref={ref}
        component={elementType}
        data-class="block"
        className={cn(
          // Apply variants
          spacingVariants({ p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr }),
          colorVariants({ bg, c, borderColor }),
          layoutVariants({ w, h, minH, position }),
          roundedVariants({ rounded }),
          shadowVariants({ shadow }),
          borderVariants({ border, borderTop, borderBottom, borderLeft, borderRight }),
          className
        )}
        {...props}
      >
        {children}
      </BaseBlock>
    );
  }
);

Block.displayName = "Block"; 