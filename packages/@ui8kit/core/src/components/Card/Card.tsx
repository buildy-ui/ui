import { forwardRef, ReactNode } from "react";
import {
  Card as BaseCard,
  Stack,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  borderVariants,
  layoutVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type BorderProps,
  type VariantLayoutProps,
  cn
} from "../../core";

// Main Card component interface
export interface CardProps 
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
export const Card = forwardRef<HTMLDivElement, CardProps>(
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
          // Apply variants
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
export interface CardHeaderProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py'> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
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
export interface CardTitleProps 
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  order?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ 
    children, 
    className,
    size = 'lg',
    order = 3,
    ...props 
  }, ref) => {
    const Component = `h${order}` as keyof JSX.IntrinsicElements;
    
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-xl', 
      lg: 'text-2xl',
      xl: 'text-3xl'
    };

    return (
      <Component
        ref={ref}
        data-class="card-title"
        className={cn(
          'font-semibold leading-none tracking-tight',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = "CardTitle";

// Card.Description component
export interface CardDescriptionProps 
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
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
export interface CardContentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py'> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
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
export interface CardFooterProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'p' | 'px' | 'py'> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
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

//export { CompoundCard as Card };
//export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 