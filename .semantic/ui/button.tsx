import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// Simple arrays of button variant keys for semantic classes
const buttonVariants = {
  variant: ["default", "destructive", "outline", "secondary", "ghost", "link"] as const,
  size: ["default", "sm", "lg", "icon"] as const,
} as const;

// Types for button variants
type ButtonVariant = typeof buttonVariants.variant[number];
type ButtonSize = typeof buttonVariants.size[number];

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-class="button"
      className={cn(
        "button",
        variant && `button-${variant}`,
        size && `button-${size}`,
        className
      )}
      {...props}
    />
  );
}

Button.displayName = "Button";

export { Button };