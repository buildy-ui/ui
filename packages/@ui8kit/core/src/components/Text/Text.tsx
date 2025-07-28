import { forwardRef, ReactNode, ElementType } from "react";
import {
  Element,
  spacingVariants,
  colorVariants,
  layoutVariants,
  type VariantSpacingProps,
  type ColorProps,
  type VariantLayoutProps,
  cn
} from "../../core";

// Text size configurations
const textSizeVariants = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl'
};

// Font weight configurations
const fontWeightVariants = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};

// Text alignment configurations
const textAlignVariants = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

// Leading configurations
const leadingVariants = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed'
};

export interface TextProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my' | 'mb' | 'mt'>,
    Pick<ColorProps, 'c'>,
    Pick<VariantLayoutProps, 'w'> {
  children: ReactNode;
  component?: ElementType;
  size?: keyof typeof textSizeVariants;
  fw?: keyof typeof fontWeightVariants;
  ta?: keyof typeof textAlignVariants;
  leading?: keyof typeof leadingVariants;
  truncate?: boolean;
  italic?: boolean;
  underline?: boolean;
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
          // Size
          textSizeVariants[size],
          // Font weight
          fontWeightVariants[fw],
          // Text alignment
          textAlignVariants[ta],
          // Leading
          leadingVariants[leading],
          // Modifiers
          truncate && 'truncate',
          italic && 'italic',
          underline && 'underline',
          // Apply variants
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