import { forwardRef, ReactNode } from "react";
import {
  Button as BaseButton,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  layoutVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type VariantLayoutProps,
  cn
} from "../../core";

// Button size configurations
const buttonSizeVariants = {
  xs: 'h-6 px-2 text-xs',
  sm: 'h-9 px-3 text-sm',
  default: 'h-10 px-4 py-2',
  lg: 'h-11 px-8',
  xl: 'h-12 px-10 text-base',
  icon: 'h-10 w-10'
};

// Button variant configurations
const buttonVariantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline'
};

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my'>,
    RoundedProps,
    ShadowProps,
    Pick<VariantLayoutProps, 'w'> {
  children: ReactNode;
  variant?: keyof typeof buttonVariantStyles;
  size?: keyof typeof buttonSizeVariants;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className,
    variant = 'default',
    size = 'default',
    rounded = 'md',
    shadow,
    // Spacing props  
    m, mx, my,
    // Layout props
    w,
    // Content props
    leftSection,
    rightSection,
    loading = false,
    disabled = false,
    ...props 
  }, ref) => {
    return (
      <BaseButton
        ref={ref}
        data-class="button"
        disabled={disabled || loading}
        className={cn(
          // Base button styles
          'inline-flex items-center justify-center whitespace-nowrap',
          'font-medium ring-offset-background transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Size styles
          buttonSizeVariants[size],
          // Variant styles
          buttonVariantStyles[variant],
          // Apply variants
          spacingVariants({ m, mx, my }),
          roundedVariants({ rounded }),
          shadowVariants({ shadow }),
          layoutVariants({ w }),
          // Loading state
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftSection && (
          <span data-class="button-left-section" className="mr-2">
            {leftSection}
          </span>
        )}
        {children}
        {!loading && rightSection && (
          <span data-class="button-right-section" className="ml-2">
            {rightSection}
          </span>
        )}
      </BaseButton>
    );
  }
);

Button.displayName = "Button"; 