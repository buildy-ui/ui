import { cva, type VariantProps } from "class-variance-authority";

export const sizingVariants = cva("", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
      "2xl": ""
    }
  }
});

// Specific size configurations for different component types
export const iconSizeVariants = cva("", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
      "2xl": "w-12 h-12"
    }
  }
});

export const containerSizeVariants = cva("", {
  variants: {
    size: {
      xs: "max-w-screen-sm",
      sm: "max-w-screen-md",
      md: "max-w-screen-lg",
      lg: "max-w-screen-xl",
      xl: "max-w-screen-2xl",
      "2xl": "max-w-2xl",
      "4xl": "max-w-4xl",
      "6xl": "max-w-6xl",
      full: "max-w-none"
    }
  }
});

// Types for sizing props
export interface SizingProps extends VariantProps<typeof sizingVariants> {}

export interface IconSizingProps extends VariantProps<typeof iconSizeVariants> {}

export interface ContainerSizingProps extends VariantProps<typeof containerSizeVariants> {} 