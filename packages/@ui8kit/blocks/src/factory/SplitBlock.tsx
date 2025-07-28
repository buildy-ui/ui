import { forwardRef, ReactNode } from "react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Icon
} from "@ui8kit/core";

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

  // Container settings (only for splitSection=false)
  containerSize?: "sm" | "md" | "lg" | "xl";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "responsive";
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl";

  // Grid settings (only for splitSection=true)
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";

  // Custom class name
  className?: string;
}

// Default content renderer using traditional structure
const DefaultContentRenderer = ({ content }: { content: any }) => {
  if (!content) return null;

  return (
    <Stack gap="lg" align="start">
      {content.badge && (
        <Badge variant="secondary">
          {content.badge}
        </Badge>
      )}

      {content.title && (
        <Title
          order={1}
          size="3xl"
          fw="bold"
        >
          {content.title}
        </Title>
      )}

      {content.description && (
        <Text
          size="lg"
          c="muted-foreground"
        >
          {content.description}
        </Text>
      )}

      {(content.primaryButtonText || content.secondaryButtonText) && (
        <Group gap="md" align="center">
          {content.primaryButtonText && (
            <Button
              size="lg"
              variant="default"
              leftSection={content.primaryButtonIcon ? (
                <Icon
                  component="span"
                  size="md"
                  lucideIcon={content.primaryButtonIcon}
                />
              ) : undefined}
            >
              {content.primaryButtonText}
            </Button>
          )}

          {content.secondaryButtonText && (
            <Button
              variant="outline"
              size="lg"
              leftSection={content.secondaryButtonIcon ? (
                <Icon
                  component="span"
                  size="md"
                  lucideIcon={content.secondaryButtonIcon}
                />
              ) : undefined}
            >
              {content.secondaryButtonText}
            </Button>
          )}
        </Group>
      )}
    </Stack>
  );
};

const DefaultContentSection = ({ content, contentHooks }: { content: any; contentHooks?: ContentHooks }) => {
  const renderContent = () => {
    if (contentHooks?.content) return contentHooks.content(content);
    return <DefaultContentRenderer content={content} />;
  };

  return (
    <>
      {contentHooks?.beforeContent?.(content)}
      {renderContent()}
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
    containerSize = "lg",
    padding = "responsive",
    py = "lg",
    gap = "xl",
    align = "center",
    className,
    ...props
  }, ref) => {

    // Define the final contentSection
    const finalContentSection = contentSection || (
      <DefaultContentSection content={content} contentHooks={contentHooks} />
    );

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
          <Container size={containerSize} padding={padding} centered>
            <Grid cols="cols2" gap={gap} align={align}>
              {leftMedia ? mediaSection : finalContentSection}
              {leftMedia ? finalContentSection : mediaSection}
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
        className={`flex flex-col ${className || ''}`}
        {...props}
      >
        <Grid cols="cols2" gap={gap === "none" ? undefined : gap} align={align} className="flex-1 items-center gap-0">
          {leftMedia ? mediaSection : finalContentSection}
          {leftMedia ? finalContentSection : mediaSection}
        </Grid>
      </Block>
    );
  }
);

SplitBlock.displayName = "SplitBlock";

// Export the default components
export { DefaultContentSection, DefaultContentRenderer };

// Utilities for creating hooks
export const createContentHook = (hooks: ContentHooks): ContentHooks => hooks;

// Default content hooks for common use cases
export const defaultContentHooks = {
  // Traditional layout (badge + title + description + actions)
  traditional: createContentHook({
    content: (content) => <DefaultContentRenderer content={content} />
  }),

  // Badge + Title only
  titleOnly: createContentHook({
    content: (content) => (
      <Stack gap="md" align="start">
        {content.badge && (
          <Badge variant="outline">
            {content.badge}
          </Badge>
        )}
        {content.title && (
          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>
        )}
      </Stack>
    )
  }),

  // Custom container wrapper for content
  withContainer: (containerProps = {}) => createContentHook({
    content: (content) => (
      <Container size="lg" padding="responsive" {...containerProps}>
        <DefaultContentRenderer content={content} />
      </Container>
    )
  }),

  // Centered content
  centered: createContentHook({
    content: (content) => (
      <Stack gap="lg" align="center" ta="center">
        <DefaultContentRenderer content={content} />
      </Stack>
    )
  }),

  // With background
  withBackground: (bgProps = {}) => createContentHook({
    content: (content) => (
      <Block p="xl" bg="muted" rounded="lg" {...bgProps}>
        <DefaultContentRenderer content={content} />
      </Block>
    )
  })
};

// Examples of advanced hooks
export const advancedContentHooks = {
  // Hero with container
  heroWithContainer: createContentHook({
    content: (content) => (
      <Container size="lg" padding="responsive">
        <Stack gap="lg" align="start">
          <Badge variant="outline" size="lg">
            🚀 {content.badge}
          </Badge>
          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>
          <Text size="xl" c="muted-foreground">
            {content.description}
          </Text>
          {(content.primaryButtonText || content.secondaryButtonText) && (
            <Group gap="md">
              {content.primaryButtonText && (
                <Button size="lg" variant="default">
                  {content.primaryButtonText}
                </Button>
              )}
              {content.secondaryButtonText && (
                <Button size="lg" variant="outline">
                  {content.secondaryButtonText}
                </Button>
              )}
            </Group>
          )}
        </Stack>
      </Container>
    )
  }),

  // Features with container
  featuresWithContainer: createContentHook({
    content: (content) => (
      <Container size="lg" padding="responsive" className="grid grid-cols-1 items-center justify-items-stretch">
        <Stack gap="lg" align="start">
          <Badge variant="secondary">{content.badge}</Badge>
          <Title order={2} size="3xl" fw="bold">
            {content.title}
          </Title>
          <Text size="lg" c="muted-foreground">
            {content.description}
          </Text>
          {content.features && (
            <Stack gap="md">
              {content.features.map((feature: any, index: number) => (
                <Stack key={index} gap="sm" direction="row" align="start">
                  <Badge variant="default" size="sm">✓</Badge>
                  <Stack gap="xs">
                    <Text fw="semibold">{feature.title}</Text>
                    <Text size="sm" c="muted-foreground">
                      {feature.description}
                    </Text>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    )
  })
}; 