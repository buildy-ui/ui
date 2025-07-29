import { cva, type VariantProps } from "class-variance-authority";

export const roundedVariants = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      default: "rounded",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full"
    }
  }
});

// Type for rounded props
export interface RoundedProps extends VariantProps<typeof roundedVariants> {} 