import { forwardRef, ReactNode, ElementType } from "react";
import {
  Container as BaseContainer,
  spacingVariants,
  colorVariants,
  layoutVariants,
  containerSizeVariants,
  type VariantSpacingProps,
  type ColorProps,
  type ContainerSizingProps,
  cn
} from "../../core";

// Text alignment configurations
const textAlignVariants = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

export interface ContainerProps 
  extends React.HTMLAttributes<HTMLElement>,
    VariantSpacingProps,
    ColorProps,
    ContainerSizingProps {
  children: ReactNode;
  component?: ElementType;
  centered?: boolean;
  fluid?: boolean;
  ta?: keyof typeof textAlignVariants;
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
          // Base container styles
          'container',
          // Size variant
          containerSizeVariants({ size }),
          // Centering
          centered && 'mx-auto',
          // Fluid
          fluid && 'max-w-none',
          // Text alignment
          ta && textAlignVariants[ta],
          // Apply variants
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