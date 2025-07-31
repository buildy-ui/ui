import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../../core/utils";
import { Box as BaseBox } from "../../core/ui";
import {
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  layoutVariants,
  borderVariants,
  flexVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type VariantLayoutProps,
  type BorderProps,
  type VariantFlexProps
} from "../../core/variants";

export interface BoxProps 
  extends VariantSpacingProps,
    RoundedProps,
    ShadowProps,
    ColorProps,
    VariantLayoutProps,
    BorderProps,
    VariantFlexProps {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ 
    component = "div",
    className,
    children,
    // Spacing props
    m, mx, my, mt, mr, mb, ml,
    p, px, py, pt, pr, pb, pl,
    // Rounded props
    rounded,
    // Shadow props
    shadow,
    // Color props
    bg, c, borderColor,
    // Layout props
    display, w, h, minH, position, z, overflow,
    // Border props
    border, borderTop, borderBottom, borderLeft, borderRight,
    // Flex props
    direction, align, justify, wrap, gap,
    ...props 
  }, ref) => {
    return (
      <BaseBox
        component={component}
        ref={ref}
        className={cn(
          // Apply spacing variants
          spacingVariants({
            m, mx, my, mt, mr, mb, ml,
            p, px, py, pt, pr, pb, pl
          }),
          // Apply rounded variants
          roundedVariants({ rounded }),
          // Apply shadow variants
          shadowVariants({ shadow }),
          // Apply color variants
          colorVariants({ bg, c, borderColor }),
          // Apply layout variants
          layoutVariants({ display, w, h, minH, position, z, overflow }),
          // Apply border variants
          borderVariants({ border, borderTop, borderBottom, borderLeft, borderRight }),
          // Apply flex variants
          flexVariants({ direction, align, justify, wrap, gap }),
          className
        )}
        {...props}
      >
        {children}
      </BaseBox>
    );
  }
);

Box.displayName = "Box";