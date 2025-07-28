import { cva, type VariantProps } from "class-variance-authority";

// Badge size variants
export const badgeSizeVariants = cva("", {
  variants: {
    size: {
      xs: "px-1.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-xs",
      default: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

// Badge style variants
export const badgeStyleVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground border-border",
      success: "bg-green-500 text-white hover:bg-green-600",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      info: "bg-blue-500 text-white hover:bg-blue-600"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeSizeProps extends VariantProps<typeof badgeSizeVariants> {}
export interface BadgeStyleProps extends VariantProps<typeof badgeStyleVariants> {} 