import type { ReactNode } from "react";
import { forwardRef } from "react";
import {
  Card as BaseCard,
  Stack,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  borderVariants,
  layoutVariants,
  textSizeVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type BorderProps,
  type VariantLayoutProps,
  type TextSizeProps,
  cn
} from "../../core";

// Main Card component interface
interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantSpacingProps,
    RoundedProps,
    ShadowProps,
    ColorProps,
    BorderProps,
    Pick<VariantLayoutProps, 'w' | 'h'> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
}

// Enhanced Card component with prop forwarding
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className,
    variant = 'default',
    // Spacing props
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    // Visual props
    rounded = 'lg',
    shadow = 'sm',
    bg = 'card',
    c,
    borderColor = 'border',
    // Border props  
    border = '1px',
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,
    // Layout props
    w,
    h,
    ...props 
  }, ref) => {
    return (
      <BaseCard
        ref={ref}
        data-class="card"
        className={cn(
          // Base card styles
          'text-card-foreground transition-colors',
          // Apply CVA variants
          spacingVariants({ p: p || 'md', px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr }),
          roundedVariants({ rounded }),
          shadowVariants({ shadow }),
          colorVariants({ bg, c }),
          borderVariants({ border, borderTop, borderBottom, borderLeft, borderRight }),
          colorVariants({ borderColor }),
          layoutVariants({ w, h }),
          // Variant-specific styles
          {
            'border-border': variant === 'default',
            'border-border shadow-none': variant === 'outlined',
            'border-transparent bg-muted/50': variant === 'filled',
          },
          className
        )}
        {...props}
      >
        {children}
      </BaseCard>
    );
  }
);

Card.displayName = "Card";

// Card.Header component
interface CardHeaderProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py'> {
  children: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ 
    children, 
    className,
    p = 'md',
    px,
    py,
    ...props 
  }, ref) => {
    return (
      <Stack
        ref={ref}
        data-class="card-header"
        className={cn(
          'flex flex-col space-y-1.5',
          spacingVariants({ p, px, py }),
          className
        )}
        {...props}
      >
        {children}
      </Stack>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card.Title component
interface CardTitleProps 
  extends React.HTMLAttributes<HTMLHeadingElement>,
    TextSizeProps {
  children: ReactNode;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ 
    children, 
    className,
    size = 'lg',
    order = 3,
    ...props 
  }, ref) => {
    // Create props for the heading element
    const headingProps = {
      ref,
      'data-class': 'card-title',
      className: cn(
        'font-semibold leading-none tracking-tight',
        // Apply CVA variants
        textSizeVariants({ size }),
        className
      ),
      ...props
    };

    // Return the appropriate heading element
    switch (order) {
      case 1:
        return <h1 {...headingProps}>{children}</h1>;
      case 2:
        return <h2 {...headingProps}>{children}</h2>;
      case 3:
        return <h3 {...headingProps}>{children}</h3>;
      case 4:
        return <h4 {...headingProps}>{children}</h4>;
      case 5:
        return <h5 {...headingProps}>{children}</h5>;
      case 6:
        return <h6 {...headingProps}>{children}</h6>;
      default:
        return <h3 {...headingProps}>{children}</h3>;
    }
  }
);

CardTitle.displayName = "CardTitle";

// Card.Description component
interface CardDescriptionProps 
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      data-class="card-description"
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

// Card.Content component
interface CardContentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py'> {
  children: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ 
    children, 
    className,
    p = 'md',
    px,
    py,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-class="card-content"
        className={cn(
          spacingVariants({ p, px, py }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

// Card.Footer component
interface CardFooterProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py'> {
  children: ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ 
    children, 
    className,
    p = 'md',
    px,
    py,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-class="card-footer"
        className={cn(
          'flex items-center pt-0',
          spacingVariants({ p, px, py }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

// Compound Card component
const CompoundCard = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

// Export types and components
export type { CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps };
export { CompoundCard as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 