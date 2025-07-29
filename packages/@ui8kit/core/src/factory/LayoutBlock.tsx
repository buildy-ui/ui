import { forwardRef, ReactNode } from "react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Icon,
  Box,
  Card,
  Image
} from "../components";

// Layout types
export type LayoutType = "grid" | "flex" | "stack";

// Content hook system - allows replacing parts of the content
export interface LayoutContentHooks {
  beforeHeader?: (content: any) => ReactNode;
  header?: (content: any) => ReactNode;
  afterHeader?: (content: any) => ReactNode;
  beforeItems?: (content: any) => ReactNode;
  item?: (item: any, index: number) => ReactNode;
  afterItems?: (content: any) => ReactNode;
}

export interface LayoutBlockProps {
  // Layout control
  layout: LayoutType;
  
  // Container settings
  useContainer?: boolean;
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

  // Grid settings (for layout="grid")
  cols?: "1" | "2" | "3" | "4" | "5" | "6" | "1-2" | "1-3" | "1-4" | "1-5" | "1-6" | "2-3" | "2-4" | "2-5" | "2-6" | "3-4" | "3-5" | "3-6" | "4-5" | "4-6" | "5-6" | "1-2-3" | "1-2-4" | "1-3-4" | "2-3-4" | "1-2-3-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  // Flex settings (for layout="flex")
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  // Stack settings (for layout="stack")
  stackAlign?: "start" | "center" | "end" | "stretch";

  // Header settings
  showHeader?: boolean;
  headerAlign?: "start" | "center" | "end";

  // Data for content
  content?: {
    badge?: string;
    title?: string;
    description?: string;
    items?: Array<{
      id: string;
      title: string;
      description: string;
      image?: {
        src: string;
        alt: string;
      };
      lucideIcon?: any;
      [key: string]: any;
    }>;
    [key: string]: any;
  };

  // Content hook system
  contentHooks?: LayoutContentHooks;

  // Custom class name
  className?: string;
}

// Default header renderer
const DefaultHeaderRenderer = ({ content, align = "center" }: { content: any; align?: "start" | "center" | "end" }) => {
  if (!content) return null;

  return (
    <Stack gap="md" align={align} ta={align} className="max-w-2xl">
      {content.badge && (
        <Badge variant="secondary" size="default" rounded="md">
          {content.badge}
        </Badge>
      )}

      {content.title && (
        <Title
          order={2}
          size="3xl"
          fw="bold"
          ta={align}
        >
          {content.title}
        </Title>
      )}

      {content.description && (
        <Text
          size="lg"
          c="secondary-foreground"
          ta={align}
        >
          {content.description}
        </Text>
      )}
    </Stack>
  );
};

// Default item renderers for different layouts
const DefaultItemRenderers = {
  // Grid item with card
  gridCard: (item: any, index: number) => (
    <Card key={item.id || index} p="lg" rounded="lg" shadow="sm" bg="card">
      <Stack gap="md" align="start">
        {item.image && (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width="100%"
            height="200px"
            fit="cover"
            rounded="md"
          />
        )}
        
        {item.lucideIcon && (
          <Box 
            p="sm" 
            bg="primary" 
            rounded="md" 
            className="inline-flex"
            data-class="icon-wrapper"
          >
            <Icon
              component="span"
              size="md"
              lucideIcon={item.lucideIcon}
              c="primary-foreground"
            />
          </Box>
        )}

        <Stack gap="xs">
          <Title order={3} size="lg" fw="semibold">
            {item.title}
          </Title>
          
          <Text size="sm" c="secondary-foreground">
            {item.description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  ),

  // Simple grid item
  gridSimple: (item: any, index: number) => (
    <Stack key={item.id || index} gap="md" align="start">
      {item.lucideIcon && (
        <Box 
          p="sm" 
          bg="primary" 
          rounded="md" 
          className="inline-flex"
          data-class="icon-wrapper"
        >
          <Icon
            component="span"
            size="md"
            lucideIcon={item.lucideIcon}
            c="primary-foreground"
          />
        </Box>
      )}

      <Stack gap="xs">
        <Title order={3} size="lg" fw="semibold">
          {item.title}
        </Title>
        
        <Text size="sm" c="secondary-foreground">
          {item.description}
        </Text>
      </Stack>
    </Stack>
  ),

  // Flex/Stack item
  flexItem: (item: any, index: number) => (
    <Group key={item.id || index} gap="md" align="start">
      {item.lucideIcon && (
        <Box 
          p="sm" 
          bg="primary" 
          rounded="md" 
          className="flex-shrink-0"
          data-class="icon-wrapper"
        >
          <Icon
            component="span"
            size="md"
            lucideIcon={item.lucideIcon}
            c="primary-foreground"
          />
        </Box>
      )}

      <Stack gap="xs">
        <Title order={3} size="lg" fw="semibold">
          {item.title}
        </Title>
        
        <Text size="sm" c="secondary-foreground">
          {item.description}
        </Text>
      </Stack>
    </Group>
  )
};

// Default content hooks
export const defaultLayoutContentHooks = {
  // Grid with cards
  gridCards: {
    header: (content: any) => <DefaultHeaderRenderer content={content} align="center" />,
    item: DefaultItemRenderers.gridCard
  },

  // Grid simple
  gridSimple: {
    header: (content: any) => <DefaultHeaderRenderer content={content} align="center" />,
    item: DefaultItemRenderers.gridSimple
  },

  // Flex layout
  flex: {
    header: (content: any) => <DefaultHeaderRenderer content={content} align="start" />,
    item: DefaultItemRenderers.flexItem
  },

  // Stack layout
  stack: {
    header: (content: any) => <DefaultHeaderRenderer content={content} align="center" />,
    item: DefaultItemRenderers.flexItem
  }
};

export const LayoutBlock = forwardRef<HTMLElement, LayoutBlockProps>(
  ({
    layout = "grid",
    useContainer = true,
    containerSize = "lg",
    padding = "md",
    py = "lg",
    cols = "1-2-3",
    gap = "lg",
    align = "stretch",
    justify = "start",
    direction = "row",
    wrap = "wrap",
    stackAlign = "start",
    showHeader = true,
    headerAlign = "center",
    content,
    contentHooks,
    className,
    ...props
  }, ref) => {

    // Choose default content hooks based on layout
    const defaultHooks = contentHooks || (() => {
      switch (layout) {
        case "grid": return defaultLayoutContentHooks.gridSimple;
        case "flex": return defaultLayoutContentHooks.flex;
        case "stack": return defaultLayoutContentHooks.stack;
        default: return defaultLayoutContentHooks.gridSimple;
      }
    })();

    // Render header
    const renderHeader = () => {
      if (!showHeader || !content) return null;
      
      if (defaultHooks.beforeHeader) {
        return defaultHooks.beforeHeader(content);
      }
      
      if (defaultHooks.header) {
        return defaultHooks.header(content);
      }
      
      return <DefaultHeaderRenderer content={content} align={headerAlign} />;
    };

    // Render items based on layout
    const renderItems = () => {
      if (!content?.items) return null;

      const itemRenderer = defaultHooks.item || DefaultItemRenderers.gridSimple;
      const items = content.items.map((item: any, index: number) => 
        itemRenderer(item, index)
      );

      // Wrap items in appropriate layout component
      switch (layout) {
        case "grid":
          return (
            <Grid 
              cols={cols} 
              gap={gap} 
              align={align} 
              justify={justify}
              data-class="layout-grid"
            >
              {items}
            </Grid>
          );

        case "flex":
          return (
            <Group 
              direction={direction}
              gap={gap}
              align={align}
              justify={justify}
              wrap={wrap}
              data-class="layout-flex"
            >
              {items}
            </Group>
          );

        case "stack":
          return (
            <Stack 
              gap={gap}
              align={stackAlign}
              data-class="layout-stack"
            >
              {items}
            </Stack>
          );

        default:
          return items;
      }
    };

    // Main content
    const mainContent = (
      <Stack gap="3xl" align={headerAlign}>
        {defaultHooks.beforeHeader?.(content)}
        {renderHeader()}
        {defaultHooks.afterHeader?.(content)}
        {defaultHooks.beforeItems?.(content)}
        {renderItems()}
        {defaultHooks.afterItems?.(content)}
      </Stack>
    );

    // Render with or without container
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py={py}
        className={className}
        data-class="layout-block"
        {...props}
      >
        {useContainer ? (
          <Container size={containerSize} px={padding} centered>
            {mainContent}
          </Container>
        ) : (
          mainContent
        )}
      </Block>
    );
  }
);

LayoutBlock.displayName = "LayoutBlock";

// Utility function for creating content hooks
export const createLayoutContentHook = (hooks: LayoutContentHooks): LayoutContentHooks => hooks;