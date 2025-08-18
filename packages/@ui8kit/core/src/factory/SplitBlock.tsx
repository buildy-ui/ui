import type { ReactNode } from "react";
import { forwardRef } from "react";
import {
  Block,
  Container,
  Grid
} from "../components";
import type { VariantSpacingProps, ContainerSizingProps, VariantGridProps } from "../core/variants";

// Content hook system - allows replacing parts of the content
export interface ContentHooks {
  beforeContent?: (content: any) => ReactNode;
  content?: (content: any) => ReactNode;
  afterContent?: (content: any) => ReactNode;
}

export interface SplitBlockProps {
  // Main sections
  mediaSection?: ReactNode;
  contentSection?: ReactNode;

  // Layout control
  leftMedia?: boolean;
  splitSection?: boolean; // if true - uses Grid directly after Block, otherwise uses Container

  // Data for content (if not using contentSection)
  content?: {
    [key: string]: any; // any data for hooks
  };

  // Content hook system
  contentHooks?: ContentHooks;

  // Named slots API (optional)
  // Allows overriding specific areas without custom contentSection
  slots?: {
    media?: ReactNode;
    // Future content composition slots (used by presenters)
    header?: ReactNode;
    body?: ReactNode;
    actions?: ReactNode;
  };

  // Container settings (only for splitSection=false)
  containerSize?: ContainerSizingProps["size"];
  padding?: VariantSpacingProps["px"];
  py?: VariantSpacingProps["py"];

  // Grid settings (only for splitSection=true)
  gap?: VariantGridProps["gap"];
  align?: VariantGridProps["align"];

  // Custom class name
  className?: string;
}

const DefaultContentSection = ({ content, contentHooks }: { content: any; contentHooks?: ContentHooks }) => {
  return (
    <>
      {contentHooks?.beforeContent?.(content)}
      {contentHooks?.content?.(content)}
      {contentHooks?.afterContent?.(content)}
    </>
  );
};

export const SplitBlock = forwardRef<HTMLElement, SplitBlockProps>(
  ({
    mediaSection,
    contentSection,
    leftMedia = false,
    splitSection = true,
    content,
    contentHooks,
    slots,
    containerSize = "lg",
    padding = "md",
    py = "lg",
    gap = "lg",
    align = "center",
    className,
    ...props
  }, ref) => {

    // Define the final contentSection
    const finalContentSection = contentSection || (
      <DefaultContentSection content={content} contentHooks={contentHooks} />
    );

    // Resolve media section with slot override if provided
    const finalMediaSection = (slots && typeof slots.media !== "undefined") ? slots.media : mediaSection;

    // If splitSection = false, use Container layout
    if (!splitSection) {
      return (
        <Block
          component="section"
          ref={ref}
          w="full"
          py={py}
          className={className}
          {...props}
        >
          <Container size={containerSize} px={padding} centered>
            <Grid cols="1-2" gap={gap} align={align}>
              {leftMedia ? finalMediaSection : finalContentSection}
              {leftMedia ? finalContentSection : finalMediaSection}
            </Grid>
          </Container>
        </Block>
      );
    }

    // Split layout with Grid directly after Block (no Container)
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py={py}
        className={className}
        {...props}
      >
        <Grid 
          cols="1-2" 
          gap={gap} 
          align={align}
          className="flex-1 items-center"
          data-class="split-grid"
        >
          {leftMedia ? finalMediaSection : finalContentSection}
          {leftMedia ? finalContentSection : finalMediaSection}
        </Grid>
      </Block>
    );
  }
);

SplitBlock.displayName = "SplitBlock";

// Export the minimal content API
export { DefaultContentSection };

// Utilities for creating hooks (escape hatch / compatibility)
export const createContentHook = (hooks: ContentHooks): ContentHooks => hooks;