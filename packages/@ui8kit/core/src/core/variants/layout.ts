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
    }
  }
});

// Type for layout props
export interface VariantLayoutProps extends VariantProps<typeof layoutVariants> {} 