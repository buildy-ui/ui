import { forwardRef } from "react";
import { Title } from "@ui8kit/core";
import type { BlogTitleProps } from "../types";

export const BlogTitle = forwardRef<HTMLHeadingElement, BlogTitleProps>(
  ({ children, order = 1, size = "4xl", ...props }, ref) => {
    return (
      <Title
        ref={ref}
        order={order}
        size={size}
        fw="bold"
        {...props}
      >
        {children}
      </Title>
    );
  }
);

BlogTitle.displayName = "BlogTitle";