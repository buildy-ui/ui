import { cva, type VariantProps } from "class-variance-authority";

export const flexVariants = cva("", {
  variants: {
    // Flex direction
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse"
    },
    // Align items
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch"
    },
    // Justify content
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    },
    // Flex wrap
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse"
    },
    // Gap
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-10",
      "3xl": "gap-12"
    }
  }
});

export const gridVariants = cva("", {
  variants: {
    // Grid columns
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
      // Responsive patterns
      "1-2": "grid-cols-1 md:grid-cols-2",
      "1-3": "grid-cols-1 lg:grid-cols-3",
      "1-4": "grid-cols-1 lg:grid-cols-4",
      "1-5": "grid-cols-1 lg:grid-cols-5",
      "1-6": "grid-cols-1 lg:grid-cols-6",
      "2-3": "grid-cols-2 lg:grid-cols-3",
      "2-4": "grid-cols-2 lg:grid-cols-4",
      "2-5": "grid-cols-2 lg:grid-cols-5",
      "2-6": "grid-cols-2 lg:grid-cols-6",
      "3-4": "grid-cols-3 lg:grid-cols-4",
      "3-5": "grid-cols-3 lg:grid-cols-5",
      "3-6": "grid-cols-3 lg:grid-cols-6",
      "4-5": "grid-cols-4 lg:grid-cols-5",
      "4-6": "grid-cols-4 lg:grid-cols-6",
      "5-6": "grid-cols-5 lg:grid-cols-6",
      "1-2-3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      "1-2-4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      "1-2-6": "grid-cols-1 md:grid-cols-2 lg:grid-cols-6",
      "1-3-4": "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
      "1-3-6": "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
      "2-3-4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      "1-2-3-4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    },
    // Gap
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8"
    },
    // Align items
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch"
    },
    // Justify items
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch"
    }
  }
});

// Types for flex props
export interface VariantFlexProps extends VariantProps<typeof flexVariants> {}

export interface VariantGridProps extends VariantProps<typeof gridVariants> {} 