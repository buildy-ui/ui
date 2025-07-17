import * as React from "react";
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot";

// Simple array of badge variant keys for semantic classes
const badgeVariants = ["default", "secondary", "destructive", "outline"] as const;

// Type for badge variants
type BadgeVariant = typeof badgeVariants[number];

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant; asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-class="badge"
      className={cn(
        "badge",
        variant && `badge-${variant}`,
        className
      )}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export { Badge };