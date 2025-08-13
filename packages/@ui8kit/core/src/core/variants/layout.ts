import { cva, type VariantProps } from "class-variance-authority";

export const layoutVariants = cva("", {
  variants: {
    // Display
    display: {
      block: "block",
      "inline-block": "inline-block",
      inline: "inline",
      flex: "flex",
      "inline-flex": "inline-flex",
      grid: "grid",
      "inline-grid": "inline-grid",
      contents: "contents",
      hidden: "hidden"
    },
    // Width
    w: {
      auto: "w-auto",
      full: "w-full",
      screen: "w-screen",
      fit: "w-fit",
      min: "w-min",
      max: "w-max",
      "1px": "w-px"
    },
    // Min width
    minW: {
      0: "min-w-0",
      full: "min-w-full",
      min: "min-w-min",
      max: "min-w-max"
    },
    // Max width
    maxW: {
      none: "max-w-none",
      full: "max-w-full",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      screenSm: "max-w-screen-sm",
      screenMd: "max-w-screen-md",
      screenLg: "max-w-screen-lg",
      screenXl: "max-w-screen-xl",
      screen2xl: "max-w-screen-2xl"
    },
    // Height
    h: {
      auto: "h-auto",
      full: "h-full",
      screen: "h-screen",
      fit: "h-fit",
      min: "h-min",
      max: "h-max",
      "1px": "h-px"
    },
    // Max height
    maxH: {
      none: "max-h-none",
      full: "max-h-full",
      screen: "max-h-screen"
    },
    // Min height
    minH: {
      "200px": "min-h-[200px]",
      "300px": "min-h-[300px]",
      "400px": "min-h-[400px]",
      "500px": "min-h-[500px]",
      screen: "min-h-screen",
      full: "min-h-full"
    },
    // Position
    position: {
      static: "static",
      relative: "relative",
      absolute: "absolute",
      fixed: "fixed",
      sticky: "sticky"
    },
    // Inset helpers
    inset: {
      0: "inset-0",
      auto: "inset-auto"
    },
    top: {
      0: "top-0",
      auto: "top-auto"
    },
    right: {
      0: "right-0",
      auto: "right-auto"
    },
    bottom: {
      0: "bottom-0",
      auto: "bottom-auto"
    },
    left: {
      0: "left-0",
      auto: "left-auto"
    },
    // Z-index
    z: {
      "0": "z-0",
      "10": "z-10",
      "20": "z-20",
      "30": "z-30",
      "40": "z-40",
      "50": "z-50",
      auto: "z-auto"
    },
    // Overflow
    overflow: {
      auto: "overflow-auto",
      hidden: "overflow-hidden",
      visible: "overflow-visible",
      scroll: "overflow-scroll"
    },
    overflowX: {
      auto: "overflow-x-auto",
      hidden: "overflow-x-hidden",
      visible: "overflow-x-visible",
      scroll: "overflow-x-scroll"
    },
    overflowY: {
      auto: "overflow-y-auto",
      hidden: "overflow-y-hidden",
      visible: "overflow-y-visible",
      scroll: "overflow-y-scroll"
    },
    visibility: {
      visible: "visible",
      invisible: "invisible",
      collapse: "collapse"
    },
    pointerEvents: {
      auto: "pointer-events-auto",
      none: "pointer-events-none"
    }
  }
});

// Type for layout props
export interface VariantLayoutProps extends VariantProps<typeof layoutVariants> {} 