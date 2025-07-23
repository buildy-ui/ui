import { forwardRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4", 
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
      "2xl": "w-12 h-12"
    },
    spacing: {
      left: "ml-2",
      right: "mr-2",
      "left-sm": "ml-1",
      "right-sm": "mr-1", 
      "left-lg": "ml-3",
      "right-lg": "mr-3",
      none: ""
    },
    display: {
      inline: "inline-block",
      block: "block"
    },
    animated: {
      true: "transition-transform",
      false: ""
    },
    hover: {
      scale: "hover:scale-110",
      translate: "group-hover:translate-x-1",
      none: ""
    }
  },
  defaultVariants: {
    size: "sm",
    spacing: "none",
    display: "inline",
    animated: false,
    hover: "none"
  }
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  // SVG props
  svgPath?: string;
  svgSize?: string;
  svgViewBox?: string;
  // Lucide icon component
  lucideIcon?: ElementType;
  [key: string]: any;
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ 
    component = "div", 
    className, 
    size,
    spacing,
    display,
    animated,
    hover,
    svgPath,
    svgSize = "24",
    svgViewBox = "0 0 24 24",
    lucideIcon,
    style,
    children, 
    ...props 
  }, ref) => {
    const Component = component as ElementType;
    
    // If Lucide icon is provided, render it directly
    if (lucideIcon) {
      const LucideIcon = lucideIcon;
      
      // Map size variants to pixel values for Lucide
      const sizeMap = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
        "2xl": 48
      };
      
      const lucideSize = sizeMap[size as keyof typeof sizeMap] || 16;
      
      return (
        <Component
          ref={ref}
          data-class="icon"
          className={cn(iconVariants({ size, spacing, display, animated, hover }), className)}
          style={style}
          {...props}
        >
          <LucideIcon size={lucideSize} />
        </Component>
      );
    }
    
    // If SVG path is provided, create SVG element
    if (svgPath) {
      const svgStyle = {
        ...style,
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='${svgViewBox}' stroke-width='1.5' stroke='currentColor'%3e${encodeURIComponent(svgPath)}%3c/svg%3e")`,
        backgroundSize: `${svgSize}px ${svgSize}px`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      };
      
      return (
        <Component
          ref={ref}
          data-class="icon"
          className={cn(iconVariants({ size, spacing, display, animated, hover }), className)}
          style={svgStyle}
          {...props}
        >
          {children}
        </Component>
      );
    }
    
    return (
      <Component
        ref={ref}
        data-class="icon"
        className={cn(iconVariants({ size, spacing, display, animated, hover }), className)}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Icon.displayName = "Icon"; 