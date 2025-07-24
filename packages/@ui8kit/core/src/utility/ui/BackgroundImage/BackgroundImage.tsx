import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../core/utils";

const backgroundImageVariants = cva("", {
  variants: {
    size: {
      auto: "bg-auto",
      cover: "bg-cover",
      contain: "bg-contain"
    },
    position: {
      "absolute-inset": "bg-center absolute inset-0",
      center: "bg-center",
      top: "bg-top",
      "top-right": "bg-top bg-right",
      right: "bg-right",
      "bottom-right": "bg-bottom bg-right",
      bottom: "bg-bottom",
      "bottom-left": "bg-bottom bg-left",
      left: "bg-left",
      "top-left": "bg-top bg-left"
    },
    repeat: {
      repeat: "bg-repeat",
      "no-repeat": "bg-no-repeat",
      "repeat-x": "bg-repeat-x",
      "repeat-y": "bg-repeat-y"
    },
    // Border radius
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full"
    },
    attachment: {
      fixed: "bg-fixed",
      local: "bg-local",
      scroll: "bg-scroll"
    }
  },
  defaultVariants: {
    size: "cover",
    position: "center",
    repeat: "no-repeat",
    attachment: "scroll",
    rounded: "none"
  }
});

export interface BackgroundImageProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backgroundImageVariants> {
  src?: string;
  gradient?: string;
  children?: ReactNode;
}

export const BackgroundImage = forwardRef<HTMLDivElement, BackgroundImageProps>(
  ({ 
    className,
    src,
    gradient,
    size,
    position,
    repeat,
    attachment,
    rounded,
    style,
    children,
    ...props 
  }, ref) => {
    const backgroundStyle = {
      ...style,
      ...(src && { backgroundImage: `url(${src})` }),
      ...(gradient && { backgroundImage: gradient }),
    };

    return (
      <div
        ref={ref}
        data-class="background-image"
        className={cn(
          backgroundImageVariants({ size, position, repeat, attachment, rounded }),
          className
        )}
        style={backgroundStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BackgroundImage.displayName = "BackgroundImage"; 