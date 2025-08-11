import { cva, type VariantProps } from "class-variance-authority";

export const shadowVariants = cva("", {
  variants: {
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
      inner: "shadow-inner"
    }
  }
});

// Type for shadow props
export interface ShadowProps extends VariantProps<typeof shadowVariants> {} 