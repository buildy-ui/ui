# SplitBlock Factory

A universal factory for creating split blocks with a content hook system (similar to WordPress hooks for React).

## Key Features

- ✅ **Maximum Universality**: One component replaces all split-layout blocks
- ✅ **ReactNode Support**: Any elements through `mediaSection` and `contentSection`
- ✅ **Simplified Hooks**: Only `beforeContent`, `content`, and `afterContent`
- ✅ **Container Control**: Container can be placed in content area via hooks
- ✅ **Direct Grid Layout**: Grid bypasses container when `splitSection=true`
- ✅ **TypeScript**: Full typing

## Architecture Changes

### New Hook System
Instead of specific hooks for `badge`, `title`, `description`, `actions` - now only:
- `beforeContent` - Content before main
- `content` - Main content renderer  
- `afterContent` - Content after main

### Container Control
- `splitSection=false`: Uses Container → Stack layout
- `splitSection=true`: Grid directly after Block (no automatic Container)
- Container can be added via content hooks when needed

## Basic Usage

### 1. Hero with Container (via hook)

```tsx
import { SplitBlock, advancedContentHooks } from "@ui8kit/blocks/factory";
import { Box, Image } from "@ui8kit/core";

const HeroExample = () => {
  const mediaSection = (
    <Box>
      <Image
        src="/hero-image.jpg"
        alt="Hero"
        width="100%"
        height="auto"
        radius="lg"
      />
    </Box>
  );

  const content = {
    badge: "New Feature",
    title: "Build Amazing Products",
    description: "Create stunning applications with our tools.",
    primaryButtonText: "Get Started",
    secondaryButtonText: "Learn More"
  };

  return (
    <SplitBlock
      mediaSection={mediaSection}
      content={content}
      contentHooks={advancedContentHooks.heroWithContainer}
      leftMedia={false}
    />
  );
};
```

### 2. Direct Grid Layout (no Container)

```tsx
const DirectGridExample = () => {
  const customContent = (
    <Stack gap="xl" align="center">
      <Title order={1} size="5xl" fw="black">
        🎨 Direct Grid Layout
      </Title>
      <Text size="xl" c="muted-foreground">
        No automatic container wrapping
      </Text>
    </Stack>
  );

  return (
    <SplitBlock
      mediaSection={mediaSection}
      contentSection={customContent}
      splitSection={true} // Grid directly after Block
      leftMedia={false}
    />
  );
};
```

## Content Hook System

### Available Hooks

```tsx
interface ContentHooks {
  beforeContent?: (content: any) => ReactNode;
  content?: (content: any) => ReactNode;
  afterContent?: (content: any) => ReactNode;
}
```

### Creating Custom Hooks

```tsx
import { createContentHook, Container } from "@ui8kit/blocks/factory";

const customHooks = createContentHook({
  beforeContent: (content) => (
    <Text size="sm" c="primary" fw="bold">
      ⭐ Exclusive: {content.category}
    </Text>
  ),
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
      </Stack>
    </Container>
  ),
  afterContent: () => (
    <Container size="lg" padding="responsive">
      <Text size="xs" c="muted-foreground" ta="center">
        💡 Tip: Use content hooks for maximum flexibility
      </Text>
    </Container>
  )
});
```

## Predefined Hooks

### Default Hooks

```tsx
import { defaultContentHooks } from "@ui8kit/blocks/factory";

// Traditional layout (badge + title + description + actions)
defaultContentHooks.traditional

// Badge + Title only
defaultContentHooks.titleOnly

// Custom container wrapper
defaultContentHooks.withContainer({ size: "xl" })

// Centered content
defaultContentHooks.centered

// With background
defaultContentHooks.withBackground({ bg: "primary" })
```

### Advanced Hooks

```tsx
import { advancedContentHooks } from "@ui8kit/blocks/factory";

// Hero with container
advancedContentHooks.heroWithContainer

// Features with container and feature list
advancedContentHooks.featuresWithContainer
```

## Layout Control

### Stack Layout (with Container)

```tsx
<SplitBlock
  splitSection={false} // Uses Container → Stack
  containerSize="lg"
  padding="responsive"
  py="xl"
/>
```

### Direct Grid Layout (no Container)

```tsx
<SplitBlock
  splitSection={true} // Grid directly after Block
  gap="xl"
  align="center"
/>
```

## API Reference

### SplitBlockProps

```tsx
interface SplitBlockProps {
  // Main sections
  mediaSection?: ReactNode;
  contentSection?: ReactNode;
  
  // Layout control
  leftMedia?: boolean; // false by default
  splitSection?: boolean; // true by default
  
  // Data for content hooks
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
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
}
```

### ContentHooks

```tsx
interface ContentHooks {
  beforeContent?: (content: any) => ReactNode;
  content?: (content: any) => ReactNode;
  afterContent?: (content: any) => ReactNode;
}
```

## Migration Examples

### From HeroSplitWithMedia

```tsx
// Before
<HeroSplitWithMedia 
  content={content}
  leftImage={true}
/>

// After (with Container via hook)
<SplitBlock
  mediaSection={mediaSection}
  content={content}
  contentHooks={advancedContentHooks.heroWithContainer}
  leftMedia={true}
/>
```

### From FeaturesSplitMedia

```tsx
// Before
<FeaturesSplitMedia content={content} />

// After (with Container via hook)
<SplitBlock
  mediaSection={imageSection}
  content={content}
  contentHooks={advancedContentHooks.featuresWithContainer}
  leftMedia={false}
/>
```

## Advanced Examples

### Custom Hook with Container Control

```tsx
const customLayoutHook = createContentHook({
  content: (content) => (
    <Container size="xl" padding="xl">
      <Stack gap="xl" align="center" ta="center">
        <Badge variant="outline" size="xl">
          {content.badge}
        </Badge>
        <Title order={1} size="6xl" fw="black">
          {content.title}
        </Title>
      </Stack>
    </Container>
  )
});
```

### Multiple Hooks Composition

```tsx
const composedHooks = createContentHook({
  beforeContent: (content) => (
    <Container size="lg" padding="responsive">
      <Text size="sm" c="primary">
        Category: {content.category}
      </Text>
    </Container>
  ),
  content: (content) => (
    <Container size="lg" padding="responsive">
      <DefaultContentRenderer content={content} />
    </Container>
  ),
  afterContent: () => (
    <Container size="lg" padding="responsive">
      <Text size="xs" c="muted-foreground">
        Updated: {new Date().toLocaleDateString()}
      </Text>
    </Container>
  )
});
```

## Benefits

1. **Maximum Universality**: One component for all split layouts
2. **Simplified API**: Only 3 hooks instead of multiple specific ones
3. **Container Flexibility**: Full control over container placement
4. **Direct Grid**: No unnecessary container nesting when not needed
5. **Backward Compatibility**: Easy migration with predefined hooks
6. **Performance**: Cleaner render tree, better performance

## Examples

See the file `SplitBlock.examples.tsx` for comprehensive usage examples.