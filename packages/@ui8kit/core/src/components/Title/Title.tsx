import { forwardRef, ReactNode } from "react";
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

// Title size configurations
const titleSizeVariants = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl'
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

export interface TitleProps 
  extends React.HTMLAttributes<HTMLHeadingElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my' | 'mb' | 'mt'>,
    Pick<ColorProps, 'c'>,
    Pick<VariantLayoutProps, 'w'> {
  children: ReactNode;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: keyof typeof titleSizeVariants;
  fw?: keyof typeof fontWeightVariants;
  ta?: keyof typeof textAlignVariants;
  leading?: keyof typeof leadingVariants;
  truncate?: boolean;
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
    truncate = false,
    // Spacing props
    m, mx, my, mb, mt,
    // Color props
    c = 'foreground',
    // Layout props
    w,
    ...props 
  }, ref) => {
    const headingTag = `h${order}` as keyof JSX.IntrinsicElements;

    return (
      <Element
        ref={ref}
        as={headingTag}
        data-class="title"
        className={cn(
          // Base title styles
          'font-semibold tracking-tight',
          // Size
          titleSizeVariants[size],
          // Font weight
          fontWeightVariants[fw],
          // Text alignment
          textAlignVariants[ta],
          // Leading
          leadingVariants[leading],
          // Truncate
          truncate && 'truncate',
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

Title.displayName = "Title"; 