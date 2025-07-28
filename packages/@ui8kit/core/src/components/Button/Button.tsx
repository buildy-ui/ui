import { forwardRef, ReactNode } from "react";
import {
  Button as BaseButton,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  layoutVariants,
  buttonSizeVariants,
  buttonStyleVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type VariantLayoutProps,
  type ButtonSizeProps,
  type ButtonStyleProps,
  cn
} from "../../core";

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my'>,
    RoundedProps,
    ShadowProps,
    Pick<VariantLayoutProps, 'w'>,
    ButtonSizeProps,
    ButtonStyleProps {
  children: ReactNode;
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
    loading = false,
    disabled = false,
    // Spacing props  
    m, mx, my,
    // Layout props
    w,
    // Content props
    leftSection,
    rightSection,
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
          // Apply CVA variants
          buttonSizeVariants({ size }),
          buttonStyleVariants({ variant }),
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
          <div 
            data-class="button-loading-spinner"
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" 
          />
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