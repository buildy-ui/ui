import type { ReactNode, ElementType } from "react";
import { forwardRef } from "react";
import {
  Container as BaseContainer,
  spacingVariants,
  colorVariants,
  containerSizeVariants,
  textAlignVariants,
  type VariantSpacingProps,
  type ColorProps,
  type ContainerSizingProps,
  type TextAlignProps,
  cn
} from "../../core";

export interface ContainerProps 
  extends React.HTMLAttributes<HTMLElement>,
    VariantSpacingProps,
    ColorProps,
    ContainerSizingProps,
    TextAlignProps {
  children: ReactNode;
  component?: ElementType;
  centered?: boolean;
  fluid?: boolean;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ 
    children, 
    className,
    component = 'div',
    size = 'lg',
    centered = true,
    fluid = false,
    ta,
    // Spacing props
    p, px = 'md', py,
    m, mx, my, mt, mb, ml, mr,
    pt, pb, pl, pr,
    // Color props
    bg,
    c,
    borderColor,
    ...props 
  }, ref) => {
    return (
      <BaseContainer
        ref={ref}
        component={component}
        data-class="container"
        className={cn(
          // Size variant
          containerSizeVariants({ size }),
          // Centering
          centered && 'mx-auto',
          // Fluid
          fluid && 'max-w-none',
          // Apply CVA variants
          textAlignVariants({ ta }),
          spacingVariants({ p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr }),
          colorVariants({ bg, c, borderColor }),
          className
        )}
        {...props}
      >
        {children}
      </BaseContainer>
    );
  }
);

Container.displayName = "Container"; 