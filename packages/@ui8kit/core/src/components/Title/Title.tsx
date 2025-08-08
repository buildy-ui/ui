import type { ReactNode, ElementType } from "react";
import { forwardRef } from "react";
import {
  Element,
  spacingVariants,
  colorVariants,
  layoutVariants,
  textSizeVariants,
  fontWeightVariants,
  textAlignVariants,
  leadingVariants,
  typographyModifierVariants,
  trackingVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  type TextSizeProps,
  type FontWeightProps,
  type TextAlignProps,
  type LeadingProps,
  type TypographyModifierProps,
  type TrackingProps,
  cn
} from "../../core";

export interface TitleProps 
  extends React.HTMLAttributes<HTMLHeadingElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my' | 'mb' | 'mt'>,
    Pick<ColorProps, 'c'>,
    Pick<VariantLayoutProps, 'w'>,
    TextSizeProps,
    FontWeightProps,
    TextAlignProps,
    LeadingProps,
    TrackingProps,
    Pick<TypographyModifierProps, 'truncate'> {
  children: ReactNode;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ 
    children, 
    className,
    order = 1,
    size = 'lg',
    fw = 'semibold',
    ta = 'left',
    leading = 'normal',
    tracking,
    truncate = false,
    // Spacing props
    m, mx, my, mb, mt,
    // Color props
    c = 'foreground',
    // Layout props
    w,
    ...props 
  }, ref) => {
    const headingTag = `h${order}` as ElementType;

    return (
      <Element
        ref={ref}
        as={headingTag}
        data-class="title"
        className={cn(
          // Base title styles
          'font-semibold tracking-tight',
          // Apply CVA variants
          textSizeVariants({ size }),
          fontWeightVariants({ fw }),
          textAlignVariants({ ta }),
          leadingVariants({ leading }),
          trackingVariants({ tracking }),
          typographyModifierVariants({ truncate }),
          spacingVariants({ m, mx, my, mb, mt }),
          colorVariants({ c }),
          layoutVariants({ w }),
          className
        )}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Title.displayName = "Title"; 