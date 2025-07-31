import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva("", {
  variants: {
    variant: {
      default: "",
      secondary: "",
      outline: "",
      destructive: ""
    },
    size: {
      default: "",
      sm: "",
      lg: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size,
    leftSection,
    rightSection,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {leftSection}
        {children}
        {rightSection}
      </div>
    );
  }
);

Badge.displayName = "Badge"; 