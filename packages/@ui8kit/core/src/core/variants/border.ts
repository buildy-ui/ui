import { cva, type VariantProps } from "class-variance-authority";

export const borderVariants = cva("", {
  variants: {
    border: {
      none: "border-0",
      "1px": "border",
      "2px": "border-2",
      "4px": "border-4"
    },
    // Ring width
    ring: {
      0: "ring-0",
      1: "ring-1",
      2: "ring-2",
      4: "ring-4",
      8: "ring-8"
    },
    // Ring offset width
    ringOffset: {
      0: "ring-offset-0",
      1: "ring-offset-1",
      2: "ring-offset-2",
      4: "ring-offset-4",
      8: "ring-offset-8"
    },
    borderStyle: {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted"
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