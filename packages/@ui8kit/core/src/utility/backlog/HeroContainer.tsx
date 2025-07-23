import { forwardRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../core/utils";

const heroContainerVariants = cva("relative flex items-center justify-center overflow-hidden", {
  variants: {
    height: {
      screen: "min-h-screen",
      "75vh": "min-h-[75vh]",
      "50vh": "min-h-[50vh]",
      auto: "min-h-auto"
    },
    align: {
      center: "items-center justify-center",
      start: "items-start justify-center",
      end: "items-end justify-center"
    }
  },
  defaultVariants: {
    height: "screen",
    align: "center"
  }
});

export interface HeroContainerProps extends VariantProps<typeof heroContainerVariants> {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export const HeroContainer = forwardRef<HTMLDivElement, HeroContainerProps>(
  ({ 
    className, 
    height,
    align,
    children,
    ...props 
  }, ref) => {
    
    return (
      <section
        ref={ref}
        data-class="hero-container"
        className={cn(heroContainerVariants({ height, align }), className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

HeroContainer.displayName = "HeroContainer"; 