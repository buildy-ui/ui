import type { ReactNode, ElementType } from "react";
import { forwardRef } from "react";
import {
  Icon as BaseIcon,
  spacingVariants,
  colorVariants,
  iconSizeVariants,
  type VariantSpacingProps,
  type ColorProps,
  type IconSizingProps,
  cn
} from "../../core";

export interface IconProps 
  extends React.HTMLAttributes<HTMLElement>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my'>,
    Pick<ColorProps, 'c'>,
    IconSizingProps {
  children?: ReactNode;
  component?: ElementType;
  lucideIcon?: any; // For Lucide React icons
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ 
    children,
    className,
    component = 'span',
    size = 'sm',
    lucideIcon: LucideIcon,
    // Spacing props  
    m, mx, my,
    // Color props
    c = 'foreground',
    ...props 
  }, ref) => {
    return (
      <BaseIcon
        ref={ref}
        component={component}
        data-class="icon"
        className={cn(
          // Base icon styles
          'inline-block flex items-center justify-center',
          // Apply CVA variants
          iconSizeVariants({ size }),
          spacingVariants({ m, mx, my }),
          colorVariants({ c }),
          className
        )}
        // prevent non-DOM props leakage
        aria-hidden={props['aria-hidden']}
        role={props.role}
      >
        {LucideIcon ? (
          // Render Lucide icon as child element to avoid prop leakage to DOM
          <span>
            <LucideIcon
              className={cn(
                iconSizeVariants({ size }),
                spacingVariants({ m, mx, my }),
                colorVariants({ c }),
                className
              )}
            />
          </span>
        ) : children}
      </BaseIcon>
    );
  }
);

Icon.displayName = "Icon"; 