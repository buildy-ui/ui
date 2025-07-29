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
  gridCols?: "1" | "2" | "3" | "4" | "5" | "6" | "1-2" | "1-3" | "1-4" | "1-5" | "1-6" | "2-3" | "2-4" | "2-5" | "2-6" | "3-4" | "3-5" | "3-6" | "4-5" | "4-6" | "5-6" | "1-2-3" | "1-2-4" | "1-3-4" | "2-3-4" | "1-2-3-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  // Flex settings (for layout="flex")
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  flexWrap?: boolean;

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

  const textAlign = align === "start" ? "left" : align === "end" ? "right" : "center";

  return (
    <Stack gap="md" align={align} ta={textAlign} className="max-w-2xl">
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
          ta={textAlign}
        >
          {content.title}
        </Title>
      )}

      {content.description && (
        <Text
          size="lg"
          c="secondary-foreground"
          ta={textAlign}
        >
          {content.description}
        </Text>
      )}
    </Stack>
  );
};

// Default item renderers for different layouts
const DefaultItemRenderers = {
  // Card-based grid item
  gridCard: (item: any, index: number) => (
    <Card p="lg" rounded="md" shadow="sm" className="h-full">
      <Stack gap="md" align="start">
        {item.image && (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width="100%"
            height="200px"
            fit="cover"
            rounded="sm"
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
    <Stack gap="md" align="start">
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
    <Group gap="md" align="start">
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
    padding = "responsive",
    py = "xl",
    cols,
    gridCols, // Add gridCols prop
    gap = "lg",
    align = "start",
    justify = "start",
    direction = "row",
    wrap = "wrap",
    flexWrap, // Add flexWrap prop
    stackAlign = "start",
    showHeader = true,
    headerAlign = "center",
    content,
    contentHooks,
    className,
    ...props
  }, ref) => {

    // Use gridCols if provided, fallback to cols
    const finalCols = gridCols || cols || "1-2-3";
    const finalWrap = flexWrap ? "wrap" : wrap;

    // Choose default content hooks based on layout
    const defaultHooks = contentHooks || defaultLayoutContentHooks[layout] || defaultLayoutContentHooks.gridSimple;

    // Render header
    const renderHeader = () => {
      if (!showHeader) return null;
      
      if (defaultHooks.header) {
        return defaultHooks.header(content);
      }
      
      return <DefaultHeaderRenderer content={content} align={headerAlign} />;
    };

    // Render items based on layout
    const renderItems = () => {
      if (!content?.items || content.items.length === 0) return null;

      const itemRenderer = defaultHooks.item || DefaultItemRenderers.gridSimple;
      
      // Add key prop to mapped items
      const items = content.items.map((item: any, index: number) => (
        <div key={item.id || `item-${index}`}>
          {itemRenderer(item, index)}
        </div>
      ));

      // Wrap items in appropriate layout component
      switch (layout) {
        case "grid":
          return (
            <Grid 
              cols={finalCols} 
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
              gap={gap} 
              align={align} 
              justify={justify}
              wrap={finalWrap}
              direction={direction}
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

    // Filter out non-DOM props before spreading
    const { 
      layout: _layout,
      useContainer: _useContainer,
      containerSize: _containerSize,
      padding: _padding,
      cols: _cols,
      gridCols: _gridCols,
      gap: _gap,
      align: _align,
      justify: _justify,
      direction: _direction,
      wrap: _wrap,
      flexWrap: _flexWrap,
      stackAlign: _stackAlign,
      showHeader: _showHeader,
      headerAlign: _headerAlign,
      content: _content,
      contentHooks: _contentHooks,
      ...domProps
    } = props;

    // Render with or without container
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py={py}
        className={className}
        data-class="layout-block"
        {...domProps}
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