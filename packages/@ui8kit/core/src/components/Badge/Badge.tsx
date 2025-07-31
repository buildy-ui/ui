import type { ReactNode } from "react";
import { forwardRef } from "react";
import {
  Badge as BaseBadge,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  borderVariants,
  badgeSizeVariants,
  badgeStyleVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type BorderProps,
  type BadgeSizeProps,
  type BadgeStyleProps,
  cn
} from "../../core";

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my'>,
    RoundedProps,
    ShadowProps,
    BorderProps,
    BadgeSizeProps,
    BadgeStyleProps {
  children: ReactNode;
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
          // Apply CVA variants
          badgeSizeVariants({ size }),
          badgeStyleVariants({ variant }),
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