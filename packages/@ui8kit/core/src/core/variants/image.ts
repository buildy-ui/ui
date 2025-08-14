import { cva, type VariantProps } from "class-variance-authority";

// Image fit variants
export const imageFitVariants = cva("", {
  variants: {
    fit: {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      "scale-down": "object-scale-down",
      none: "object-none"
    }
  },
  defaultVariants: {
    fit: "cover"
  }
});

// Image position variants
export const imagePositionVariants = cva("", {
  variants: {
    position: {
      center: "object-center",
      top: "object-top",
      "top-right": "object-top object-right",
      right: "object-right",
      "bottom-right": "object-bottom object-right",
      bottom: "object-bottom",
      "bottom-left": "object-bottom object-left",
      left: "object-left",
      "top-left": "object-top object-left"
    }
  },
  defaultVariants: {
    position: "center"
  }
});

// Aspect ratio variants
export const aspectRatioVariants = cva("", {
  variants: {
    aspect: {
      auto: "",
      square: "aspect-square",
      video: "aspect-video",
      "4/3": "aspect-[4/3]",
      "3/2": "aspect-[3/2]",
      "16/9": "aspect-[16/9]",
      "9/16": "aspect-[9/16]"
    }
  },
  defaultVariants: {
    aspect: "auto"
  }
});

export interface ImageFitProps extends VariantProps<typeof imageFitVariants> {}
export interface ImagePositionProps extends VariantProps<typeof imagePositionVariants> {}
export interface AspectRatioProps extends VariantProps<typeof aspectRatioVariants> {} 