import { forwardRef, ReactNode, ElementType } from "react";
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
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  type TextSizeProps,
  type FontWeightProps,
  type TextAlignProps,
  type LeadingProps,
  type TypographyModifierProps,
  cn
} from "../../core";

export interface TextProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my' | 'mb' | 'mt'>,
    Pick<ColorProps, 'c'>,
    Pick<VariantLayoutProps, 'w'>,
    TextSizeProps,
    FontWeightProps,
    TextAlignProps,
    LeadingProps,
    TypographyModifierProps {
  children: ReactNode;
  component?: ElementType;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ 
    children, 
    className,
    component = 'p',
    size = 'md',
    fw = 'normal',
    ta = 'left',
    leading = 'normal',
    truncate = false,
    italic = false,
    underline = false,
    // Spacing props
    m, mx, my, mb, mt,
    // Color props
    c = 'foreground',
    // Layout props
    w,
    ...props 
  }, ref) => {
    return (
      <Element
        ref={ref}
        as={component}
        data-class="text"
        className={cn(
          // Apply CVA variants
          textSizeVariants({ size }),
          fontWeightVariants({ fw }),
          textAlignVariants({ ta }),
          leadingVariants({ leading }),
          typographyModifierVariants({ truncate, italic, underline }),
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

Text.displayName = "Text"; 