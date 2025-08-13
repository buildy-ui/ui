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
  aspectRatioVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type VariantLayoutProps,
  type BorderProps,
  type VariantFlexProps,
  type AspectRatioProps
} from "../../core/variants";

export interface BoxProps 
  extends VariantSpacingProps,
    RoundedProps,
    ShadowProps,
    ColorProps,
    VariantLayoutProps,
    BorderProps,
    VariantFlexProps,
    AspectRatioProps {
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
    display, maxW, w, h, minH, position, z, overflow,
    // Border props
    border, borderTop, borderBottom, borderLeft, borderRight,
    // Flex props
    direction, align, justify, wrap, gap,
    // Aspect ratio props
    aspect,
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
          layoutVariants({ display, maxW, w, h, minH, position, z, overflow }),
          // Apply border variants
          borderVariants({ border, borderTop, borderBottom, borderLeft, borderRight }),
          // Apply flex variants
          flexVariants({ direction, align, justify, wrap, gap }),
          // Apply aspect ratio variants
          aspectRatioVariants({ aspect }),
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