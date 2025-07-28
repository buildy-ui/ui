import { forwardRef } from "react";
import {
  Image as BaseImage,
  spacingVariants,
  roundedVariants,
  shadowVariants,
  layoutVariants,
  type VariantSpacingProps,
  type RoundedProps,
  type ShadowProps,
  type VariantLayoutProps,
  cn
} from "../../core";

// Image fit configurations
const imageFitVariants = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  'scale-down': 'object-scale-down',
  none: 'object-none'
};

// Image position configurations
const imagePositionVariants = {
  center: 'object-center',
  top: 'object-top',
  'top-right': 'object-top object-right',
  right: 'object-right',
  'bottom-right': 'object-bottom object-right',
  bottom: 'object-bottom',
  'bottom-left': 'object-bottom object-left',
  left: 'object-left',
  'top-left': 'object-top object-left'
};

// Aspect ratio configurations
const aspectRatioVariants = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '16/9': 'aspect-[16/9]'
};

export interface ImageProps 
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'>,
    Pick<VariantSpacingProps, 'm' | 'mx' | 'my'>,
    RoundedProps,
    ShadowProps,
    Pick<VariantLayoutProps, 'w' | 'h'> {
  width?: string | number;
  height?: string | number;
  fit?: keyof typeof imageFitVariants;
  position?: keyof typeof imagePositionVariants;
  aspect?: keyof typeof aspectRatioVariants;
  fallbackSrc?: string;
  withPlaceholder?: boolean;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    className,
    src,
    alt,
    width,
    height,
    fit = 'cover',
    position = 'center',
    aspect = 'auto',
    rounded,
    shadow,
    fallbackSrc,
    withPlaceholder = false,
    onError,
    // Spacing props  
    m, mx, my,
    // Layout props
    w,
    h,
    ...props 
  }, ref) => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (fallbackSrc) {
        e.currentTarget.src = fallbackSrc;
      }
      onError?.(e);
    };

    return (
      <BaseImage
        ref={ref}
        data-class="image"
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        className={cn(
          // Base image styles
          'block',
          // Object fit and position
          imageFitVariants[fit],
          imagePositionVariants[position],
          // Aspect ratio
          aspectRatioVariants[aspect],
          // Placeholder background
          withPlaceholder && 'bg-muted',
          // Apply variants
          spacingVariants({ m, mx, my }),
          layoutVariants({ w, h }),
          roundedVariants({ rounded }),
          shadowVariants({ shadow }),
          className
        )}
        {...props}
      />
    );
  }
);

Image.displayName = "Image"; 