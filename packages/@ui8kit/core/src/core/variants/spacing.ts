import { cva, type VariantProps } from "class-variance-authority";

export const spacingVariants = cva("", {
  variants: {
    // Margin
    m: {
      none: "m-0",
      xs: "m-1",
      sm: "m-2",
      md: "m-4",
      lg: "m-6",
      xl: "m-8",
      "2xl": "m-12",
      auto: "m-auto"
    },
    mx: {
      none: "mx-0",
      xs: "mx-1",
      sm: "mx-2",
      md: "mx-4",
      lg: "mx-6",
      xl: "mx-8",
      "2xl": "mx-12",
      auto: "mx-auto"
    },
    my: {
      none: "my-0",
      xs: "my-1",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
      xl: "my-8",
      "2xl": "my-12",
      auto: "my-auto"
    },
    mt: {
      none: "mt-0",
      xs: "mt-1",
      sm: "mt-2",
      md: "mt-4",
      lg: "mt-6",
      xl: "mt-8",
      "2xl": "mt-12",
      auto: "mt-auto"
    },
    mb: {
      none: "mb-0",
      xs: "mb-1",
      sm: "mb-2",
      md: "mb-4",
      lg: "mb-6",
      xl: "mb-8",
      "2xl": "mb-12",
      auto: "mb-auto"
    },
    ml: {
      none: "ml-0",
      xs: "ml-1",
      sm: "ml-2",
      md: "ml-4",
      lg: "ml-6",
      xl: "ml-8",
      "2xl": "ml-12",
      auto: "ml-auto"
    },
    mr: {
      none: "mr-0",
      xs: "mr-1",
      sm: "mr-2",
      md: "mr-4",
      lg: "mr-6",
      xl: "mr-8",
      "2xl": "mr-12",
      auto: "mr-auto"
    },
    // Padding
    p: {
      none: "p-0",
      xs: "p-1",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
      "2xl": "p-12"
    },
    px: {
      none: "px-0",
      xs: "px-1",
      sm: "px-2",
      md: "px-4",
      lg: "px-6",
      xl: "px-8",
      "2xl": "px-12"
    },
    py: {
      none: "py-0",
      xs: "py-2",
      sm: "py-4",
      md: "py-8",
      lg: "py-16",
      xl: "py-32",
      "2xl": "py-48"
    },
    pt: {
      none: "pt-0",
      xs: "pt-1",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6",
      xl: "pt-8",
      "2xl": "pt-12"
    },
    pb: {
      none: "pb-0",
      xs: "pb-1",
      sm: "pb-2",
      md: "pb-4",
      lg: "pb-6",
      xl: "pb-8",
      "2xl": "pb-12"
    },
    pl: {
      none: "pl-0",
      xs: "pl-1",
      sm: "pl-2",
      md: "pl-4",
      lg: "pl-6",
      xl: "pl-8",
      "2xl": "pl-12"
    },
    pr: {
      none: "pr-0",
      xs: "pr-1",
      sm: "pr-2",
      md: "pr-4",
      lg: "pr-6",
      xl: "pr-8",
      "2xl": "pr-12"
    },
    // Space between immediate children
    spaceX: {
      none: "space-x-0",
      xs: "space-x-1",
      sm: "space-x-2",
      md: "space-x-4",
      lg: "space-x-6",
      xl: "space-x-8"
    },
    spaceY: {
      none: "space-y-0",
      xs: "space-y-1",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8"
    }
  }
});

// Type for spacing props
export interface VariantSpacingProps extends VariantProps<typeof spacingVariants> {} 