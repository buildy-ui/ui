import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const overlayVariants = cva("absolute inset-0", {
  variants: {
    color: {
      black: "bg-white dark:bg-black",
      white: "bg-black dark:bg-white",
      primary: "bg-primary",
      secondary: "bg-secondary",
      background: "bg-background",
      muted: "bg-muted"
    },
    opacity: {
      0: "opacity-0",
      5: "opacity-5",
      10: "opacity-10",
      20: "opacity-20",
      25: "opacity-25",
      30: "opacity-30",
      40: "opacity-40",
      50: "opacity-50",
      60: "opacity-60",
      70: "opacity-70",
      75: "opacity-75",
      80: "opacity-80",
      90: "opacity-90",
      95: "opacity-95",
      100: "opacity-100"
    },
    blur: {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl"
    },
    fixed: {
      true: "fixed",
      false: "absolute"
    }
  },
  defaultVariants: {
    color: "black",
    opacity: 50,
    blur: "none",
    fixed: false
  }
});

export interface OverlayProps 
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof overlayVariants> {
  children?: ReactNode;
  gradient?: string;
  zIndex?: number;
}

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ 
    className,
    color,
    opacity,
    blur,
    fixed,
    gradient,
    zIndex,
    style,
    children,
    ...props 
  }, ref) => {
    const overlayStyle = {
      ...style,
      ...(gradient && { background: gradient }),
      ...(zIndex && { zIndex }),
    };

    return (
      <div
        ref={ref}
        data-class="overlay"
        className={cn(overlayVariants({ color, opacity, blur, fixed }), className)}
        style={overlayStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Overlay.displayName = "Overlay"; 