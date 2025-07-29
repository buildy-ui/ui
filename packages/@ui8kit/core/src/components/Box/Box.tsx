import { forwardRef, ElementType, ReactNode } from "react";
import { cn } from "../../core/utils";
import { BaseBox } from "../../core/ui";
import {
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  layoutVariants,
  borderVariants,
  flexVariants,
  type SpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type LayoutProps,
  type BorderProps,
  type FlexProps
} from "../../core/variants";

export interface BoxProps 
  extends SpacingProps,
    RoundedProps,
    ShadowProps,
    ColorProps,
    LayoutProps,
    BorderProps,
    FlexProps {
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
    display, w, h, minH, pos, z, overflow,
    // Border props
    border, borderT, borderR, borderB, borderL,
    // Flex props
    flex, direction, align, justify, wrap, gap,
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
          layoutVariants({ display, w, h, minH, pos, z, overflow }),
          // Apply border variants
          borderVariants({ border, borderT, borderR, borderB, borderL }),
          // Apply flex variants
          flexVariants({ flex, direction, align, justify, wrap, gap }),
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