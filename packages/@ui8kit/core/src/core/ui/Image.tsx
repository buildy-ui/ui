import type { ImgHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const imageVariants = cva("", {
  variants: {
    fit: {
      contain: "",
      cover: "",
      fill: "",
      none: ""
    },
    aspect: {
      auto: "",
      square: "",
      video: ""
    }
  },
  defaultVariants: {
    fit: "cover",
    aspect: "auto"
  }
});

export interface ImageProps 
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'>,
    VariantProps<typeof imageVariants> {
  width?: string | number;
  height?: string | number;
  fallbackSrc?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    className, 
    fit,
    aspect,
    src,
    alt,
    width,
    height,
    fallbackSrc,
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
        className={cn(imageVariants({ fit, aspect }), className)}
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