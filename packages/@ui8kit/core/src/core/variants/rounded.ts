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

// Side-specific rounded
export const roundedSideVariants = cva("", {
  variants: {
    roundedTop: {
      none: "rounded-t-none",
      sm: "rounded-t-sm",
      md: "rounded-t-md",
      lg: "rounded-t-lg",
      xl: "rounded-t-xl",
      full: "rounded-t-full"
    },
    roundedRight: {
      none: "rounded-r-none",
      sm: "rounded-r-sm",
      md: "rounded-r-md",
      lg: "rounded-r-lg",
      xl: "rounded-r-xl",
      full: "rounded-r-full"
    },
    roundedBottom: {
      none: "rounded-b-none",
      sm: "rounded-b-sm",
      md: "rounded-b-md",
      lg: "rounded-b-lg",
      xl: "rounded-b-xl",
      full: "rounded-b-full"
    },
    roundedLeft: {
      none: "rounded-l-none",
      sm: "rounded-l-sm",
      md: "rounded-l-md",
      lg: "rounded-l-lg",
      xl: "rounded-l-xl",
      full: "rounded-l-full"
    }
  }
});

// Type for rounded props
export interface RoundedProps extends VariantProps<typeof roundedVariants> {} 