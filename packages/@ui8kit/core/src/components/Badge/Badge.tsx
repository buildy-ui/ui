import { forwardRef, ReactNode } from "react";
import {
  Badge as BaseBadge,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  borderVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type ColorProps,
  type BorderProps,
  cn
} from "../../core";

// Badge size configurations
const badgeSizeVariants = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  default: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
};

// Badge variant configurations
const badgeVariantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground border-border',
  success: 'bg-green-500 text-white hover:bg-green-600',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  info: 'bg-blue-500 text-white hover:bg-blue-600'
};

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my'>,
    RoundedProps,
    ShadowProps,
    BorderProps {
  children: ReactNode;
  variant?: keyof typeof badgeVariantStyles;
  size?: keyof typeof badgeSizeVariants;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    children, 
    className,
    variant = 'default',
    size = 'default',
    rounded = 'md',
    shadow,
    dot = false,
    // Spacing props  
    m, mx, my,
    // Border props
    border,
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,
    // Content props
    leftSection,
    rightSection,
    ...props 
  }, ref) => {
    return (
      <BaseBadge
        ref={ref}
        data-class="badge"
        className={cn(
          // Base badge styles
          'inline-flex items-center font-semibold transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          // Size styles
          badgeSizeVariants[size],
          // Variant styles
          badgeVariantStyles[variant],
          // Apply variants
          spacingVariants({ m, mx, my }),
          roundedVariants({ rounded }),
          shadowVariants({ shadow }),
          borderVariants({ border, borderTop, borderBottom, borderLeft, borderRight }),
          className
        )}
        {...props}
      >
        {dot && (
          <span 
            data-class="badge-dot" 
            className="mr-1 h-1.5 w-1.5 rounded-full bg-current" 
          />
        )}
        {leftSection && (
          <span data-class="badge-left-section" className="mr-1">
            {leftSection}
          </span>
        )}
        {children}
        {rightSection && (
          <span data-class="badge-right-section" className="ml-1">
            {rightSection}
          </span>
        )}
      </BaseBadge>
    );
  }
);

Badge.displayName = "Badge"; 