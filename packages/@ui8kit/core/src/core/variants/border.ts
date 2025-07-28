import { cva, type VariantProps } from "class-variance-authority";

export const borderVariants = cva("", {
  variants: {
    border: {
      none: "border-0",
      "1px": "border",
      "2px": "border-2",
      "4px": "border-4"
    },
    borderTop: {
      none: "border-t-0",
      "1px": "border-t",
      "2px": "border-t-2",
      "4px": "border-t-4"
    },
    borderBottom: {
      none: "border-b-0",
      "1px": "border-b",
      "2px": "border-b-2",
      "4px": "border-b-4"
    },
    borderLeft: {
      none: "border-l-0",
      "1px": "border-l",
      "2px": "border-l-2",
      "4px": "border-l-4"
    },
    borderRight: {
      none: "border-r-0",
      "1px": "border-r",
      "2px": "border-r-2",
      "4px": "border-r-4"
    }
  }
});

// Type for border props
export interface BorderProps extends VariantProps<typeof borderVariants> {} 