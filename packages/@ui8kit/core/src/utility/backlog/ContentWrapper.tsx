import { forwardRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../core/utils";

const contentWrapperVariants = cva("relative", {
  variants: {
    zIndex: {
      0: "z-0",
      10: "z-10",
      20: "z-20",
      30: "z-30",
      40: "z-40",
      50: "z-50"
    },
    height: {
      full: "h-full",
      screen: "h-screen",
      auto: "h-auto"
    },
    display: {
      block: "block",
      flex: "flex",
      "inline-flex": "inline-flex"
    },
    align: {
      center: "items-center",
      start: "items-start",
      end: "items-end"
    },
    justify: {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end",
      between: "justify-between"
    }
  },
  defaultVariants: {
    zIndex: 10,
    height: "full",
    display: "flex",
    align: "center",
    justify: "center"
  }
});

export interface ContentWrapperProps extends VariantProps<typeof contentWrapperVariants> {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export const ContentWrapper = forwardRef<HTMLDivElement, ContentWrapperProps>(
  ({ 
    className, 
    zIndex,
    height,
    display,
    align,
    justify,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-class="content-wrapper"
        className={cn(contentWrapperVariants({ zIndex, height, display, align, justify }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContentWrapper.displayName = "ContentWrapper"; 