import { forwardRef } from "react";
import { Block, Container } from "@ui8kit/core";
import type { BlogSectionProps } from "../types";

export const BlogSection = forwardRef<HTMLElement, BlogSectionProps>(
  ({ children, layout = "grid", useContainer = true, py = "xl", ...props }, ref) => {
    const content = useContainer ? (
      <Container size="lg" px="md" centered>
        {children}
      </Container>
    ) : children;

    return (
      <Block
        ref={ref}
        component="section"
        w="full"
        py={py}
        {...props}
      >
        {content}
      </Block>
    );
  }
);

BlogSection.displayName = "BlogSection";