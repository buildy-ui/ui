import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border"
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm"
      },
      radius: {
        default: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        "4xl": "rounded-4xl",
        "5xl": "rounded-5xl",
        "full": "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size,
    radius,
    leftSection,
    rightSection,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-class="badge"
        className={cn(badgeVariants({ variant, size, radius }), className)}
        {...props}
      >
        {leftSection && <span className="mr-1">{leftSection}</span>}
        {children}
        {rightSection && <span className="ml-1">{rightSection}</span>}
      </div>
    );
  }
);

Badge.displayName = "Badge"; 