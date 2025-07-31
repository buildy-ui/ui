import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
      secondary: "",  
      outline: "",
      ghost: "",
      link: ""
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {leftSection}
        {children}
        {rightSection}
      </button>
    );
  }
);

Button.displayName = "Button"; 