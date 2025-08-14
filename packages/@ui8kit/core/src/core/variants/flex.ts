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
    // Flex grow/shrink/basis
    grow: {
      0: "grow-0",
      1: "grow"
    },
    shrink: {
      0: "shrink-0",
      1: "shrink"
    },
    basis: {
      auto: "basis-auto",
      full: "basis-full",
      0: "basis-0",
      px: "basis-px"
    },
    // Order
    order: {
      first: "order-first",
      last: "order-last",
      none: "order-none",
      1: "order-1",
      2: "order-2",
      3: "order-3",
      4: "order-4",
      5: "order-5",
      6: "order-6",
      7: "order-7",
      8: "order-8",
      9: "order-9",
      10: "order-10",
      11: "order-11",
      12: "order-12"
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
    },
    gapX: {
      none: "gap-x-0",
      xs: "gap-x-1",
      sm: "gap-x-2",
      md: "gap-x-4",
      lg: "gap-x-6",
      xl: "gap-x-8"
    },
    gapY: {
      none: "gap-y-0",
      xs: "gap-y-1",
      sm: "gap-y-2",
      md: "gap-y-4",
      lg: "gap-y-6",
      xl: "gap-y-8"
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
    // Container justify-content
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    },
    // Item justify alignment (optional)
    justifyItems: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch"
    },
    // Grid rows
    rows: {
      1: "grid-rows-1",
      2: "grid-rows-2",
      3: "grid-rows-3",
      4: "grid-rows-4",
      5: "grid-rows-5",
      6: "grid-rows-6",
      12: "grid-rows-12"
    },
    // Align content (row distribution)
    content: {
      start: "content-start",
      center: "content-center",
      end: "content-end",
      between: "content-between",
      around: "content-around",
      evenly: "content-evenly"
    },
    // Grid flow
    flow: {
      row: "grid-flow-row",
      col: "grid-flow-col",
      dense: "grid-flow-dense",
      rowDense: "grid-flow-row-dense",
      colDense: "grid-flow-col-dense"
    },
    // Auto rows/cols
    autoRows: {
      auto: "auto-rows-auto",
      min: "auto-rows-min",
      max: "auto-rows-max",
      fr: "auto-rows-fr"
    },
    autoCols: {
      auto: "auto-cols-auto",
      min: "auto-cols-min",
      max: "auto-cols-max",
      fr: "auto-cols-fr"
    },
    // Row/Col start & end
    rowStart: {
      auto: "row-start-auto",
      1: "row-start-1",
      2: "row-start-2",
      3: "row-start-3",
      4: "row-start-4",
      5: "row-start-5",
      6: "row-start-6",
      7: "row-start-7"
    },
    rowEnd: {
      auto: "row-end-auto",
      1: "row-end-1",
      2: "row-end-2",
      3: "row-end-3",
      4: "row-end-4",
      5: "row-end-5",
      6: "row-end-6",
      7: "row-end-7"
    },
    colStart: {
      auto: "col-start-auto",
      1: "col-start-1",
      2: "col-start-2",
      3: "col-start-3",
      4: "col-start-4",
      5: "col-start-5",
      6: "col-start-6",
      7: "col-start-7",
      8: "col-start-8",
      9: "col-start-9",
      10: "col-start-10",
      11: "col-start-11",
      12: "col-start-12",
      13: "col-start-13"
    },
    colEnd: {
      auto: "col-end-auto",
      1: "col-end-1",
      2: "col-end-2",
      3: "col-end-3",
      4: "col-end-4",
      5: "col-end-5",
      6: "col-end-6",
      7: "col-end-7",
      8: "col-end-8",
      9: "col-end-9",
      10: "col-end-10",
      11: "col-end-11",
      12: "col-end-12",
      13: "col-end-13"
    },
    // Gap in grid context
    gapX: {
      none: "gap-x-0",
      xs: "gap-x-1",
      sm: "gap-x-2",
      md: "gap-x-4",
      lg: "gap-x-6",
      xl: "gap-x-8"
    },
    gapY: {
      none: "gap-y-0",
      xs: "gap-y-1",
      sm: "gap-y-2",
      md: "gap-y-4",
      lg: "gap-y-6",
      xl: "gap-y-8"
    }
  }
});

// Types for flex props
export interface VariantFlexProps extends VariantProps<typeof flexVariants> {}

export interface VariantGridProps extends VariantProps<typeof gridVariants> {} 