import { forwardRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../core/utils";

const galleryItemVariants = cva("relative overflow-hidden", {
  variants: {
    span: {
      1: "row-span-1",
      2: "row-span-2"
    },
    aspect: {
      square: "aspect-square",
      auto: "aspect-auto"
    },
    bg: {
      transparent: "bg-transparent",
      muted: "bg-muted"
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg"
    }
  },
  defaultVariants: {
    span: 1,
    aspect: "square",
    bg: "muted",
    rounded: "md"
  }
});

export interface GalleryItemProps extends VariantProps<typeof galleryItemVariants> {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export const GalleryItem = forwardRef<HTMLDivElement, GalleryItemProps>(
  ({ 
    className, 
    span,
    aspect,
    bg,
    rounded,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-class="gallery-item"
        className={cn(galleryItemVariants({ span, aspect, bg, rounded }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GalleryItem.displayName = "GalleryItem"; 