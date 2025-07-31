import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const cardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outlined: "",
      filled: ""
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card"; 