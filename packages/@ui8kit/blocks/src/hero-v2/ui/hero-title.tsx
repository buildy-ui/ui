import { forwardRef } from "react";
import { Title } from "@ui8kit/core";
import type { HeroTitleProps } from "../types";

export const HeroTitle = forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <Title
        ref={ref}
        order={1}
        size="4xl"
        fw="bold"
        {...props}
      >
        {children}
      </Title>
    );
  }
);

HeroTitle.displayName = "HeroTitle";