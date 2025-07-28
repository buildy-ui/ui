import { forwardRef, ImgHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const imageVariants = cva("block", {
  variants: {
    fit: {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      "scale-down": "object-scale-down",
      none: "object-none",
      full: "object-cover w-full h-full"
    },
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
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
      t_sm: "rounded-t-sm",
      t_md: "rounded-t-md",
      t_lg: "rounded-t-lg",
      t_xl: "rounded-t-xl"
    },
    aspect: {
      square: "aspect-square",
      video: "aspect-video",
      auto: "aspect-auto",
      none: ""
    },
    fallback: {
      true: "bg-muted",
      false: ""
    }
  },
  defaultVariants: {
    fit: "cover",
    position: "center",
    radius: "none",
    fallback: false
  }
});

export interface ImageProps 
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'>,
    VariantProps<typeof imageVariants> {
  width?: string | number;
  height?: string | number;
  fallbackSrc?: string;
  withPlaceholder?: boolean;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    className, 
    fit,
    position,
    radius,
    fallback,
    src,
    alt,
    width,
    height,
    fallbackSrc,
    withPlaceholder = false,
    onError,
    ...props 
  }, ref) => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (fallbackSrc) {
        e.currentTarget.src = fallbackSrc;
      }
      onError?.(e);
    };

    return (
      <img
        ref={ref}
        data-class="image"
        className={cn(
          imageVariants({ fit, position, radius, fallback: withPlaceholder || fallback }),
          className
        )}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = "Image"; 