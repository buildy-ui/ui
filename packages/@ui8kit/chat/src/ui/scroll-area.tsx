import { forwardRef } from "react";
import { Block } from "@ui8kit/core";

export interface ScrollAreaProps {
  children?: any;
  className?: string;
}

export const ScrollArea = forwardRef<HTMLElement, ScrollAreaProps>(
  ({ children, ...props }, ref) => {
    return (
      <Block ref={ref} data-class="scroll-area" position="relative" w="full" h="full" {...props}>
        <div className="overflow-y-auto w-full h-full" data-class="scroll-viewport">
          {children}
        </div>
      </Block>
    );
  },
);

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;


