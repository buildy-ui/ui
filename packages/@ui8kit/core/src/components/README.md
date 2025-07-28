# @ui8kit/core Composite Components

## Overview

This directory contains the middle-tier composite components that provide the ideal prop forwarding API for developers. These components use the base primitives from `core/ui/` and apply variants from `core/variants/` to create a beautiful, user-friendly interface.

## Architecture

```
USER LEVEL               COMPOSITE LEVEL           PRIMITIVE LEVEL
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ <Card           │────▶│ components/Card │────▶│ core/ui/Card    │
│   p="lg"        │     │ + spacingVariants│     │ (no styles)     │
│   rounded="md"  │     │ + roundedVariants│     │                 │
│   shadow="sm"   │     │ + shadowVariants │     │                 │
│   bg="card"     │     │ = Beautiful API  │     │                 │
│ />              │     │                  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Components

### Layout Components

#### Block
Section wrapper component with full styling control.

```tsx
<Block 
  component="section"
  py="xl" 
  bg="background"
  rounded="lg"
>
  Content
</Block>
```

#### Container
Responsive container with size presets.

```tsx
<Container 
  size="lg" 
  px="md" 
  centered
>
  Content
</Container>
```

#### Stack
Vertical flex layout.

```tsx
<Stack 
  gap="lg" 
  align="center"
  p="md"
>
  <Title>Heading</Title>
  <Text>Description</Text>
</Stack>
```

#### Group
Horizontal flex layout.

```tsx
<Group 
  gap="md" 
  align="center" 
  justify="between"
>
  <Button>Left</Button>
  <Button>Right</Button>
</Group>
```

#### Grid
CSS Grid layout with responsive presets.

```tsx
<Grid 
  cols="1-2-3" 
  gap="lg"
  p="md"
>
  <Grid.Col span={2}>Wide column</Grid.Col>
  <Grid.Col>Regular column</Grid.Col>
</Grid>
```

### UI Components

#### Card
Card component with compound structure.

```tsx
<Card 
  p="lg" 
  rounded="xl" 
  shadow="md" 
  bg="card"
>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

#### Button
Interactive button with variants and states.

```tsx
<Button 
  variant="default" 
  size="lg" 
  rounded="md"
  shadow="sm"
  leftSection={<Icon />}
  loading={isLoading}
>
  Click me
</Button>
```

#### Badge
Small status indicators.

```tsx
<Badge 
  variant="success" 
  size="sm" 
  rounded="full"
  dot
  rightSection={<Icon />}
>
  Active
</Badge>
```

#### Title
Semantic headings with typography control.

```tsx
<Title 
  order={1} 
  size="3xl" 
  fw="bold"
  c="primary"
  mb="md"
>
  Main Heading
</Title>
```

#### Text
Text elements with full typography control.

```tsx
<Text 
  size="lg" 
  c="muted-foreground"
  ta="center"
  truncate
>
  Description text
</Text>
```

#### Image
Enhanced image component.

```tsx
<Image 
  src="/image.jpg"
  alt="Description"
  aspect="video"
  fit="cover"
  rounded="lg"
  shadow="md"
/>
```

#### Icon
Icon wrapper with size and color control.

```tsx
<Icon 
  lucideIcon={ChevronDown}
  size="lg"
  c="primary"
  mx="sm"
/>
```

## Universal Props

All components support these universal props through CVA variants:

### Spacing Props
- **Padding**: `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`
- **Margin**: `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`
- **Values**: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `auto`

### Visual Props
- **Rounded**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`
- **Shadow**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`
- **Colors**: All design system colors

### Layout Props
- **Width/Height**: `auto`, `full`, `screen`, `fit`, `min`, `max`
- **Position**: `static`, `relative`, `absolute`, `fixed`, `sticky`

## Data Classes

Every component includes semantic `data-class` attributes for easy targeting:

```tsx
<Card data-class="card">
  <Card.Header data-class="card-header">
    <Card.Title data-class="card-title">Title</Card.Title>
  </Card.Header>
</Card>
```

This enables easy CSS targeting and semantic understanding of the markup.

## Best Practices

1. **Use semantic components**: Choose `Block` with appropriate `component` prop for sections
2. **Leverage compound components**: Use `Card.Header`, `Card.Content` structure
3. **Apply consistent spacing**: Use the spacing scale for predictable layouts
4. **Follow the prop naming**: Use short, consistent prop names (`p`, `m`, `bg`, `c`)
5. **Utilize data-class**: Use for custom styling and testing selectors

## Migration from Old Components

```tsx
// Old approach - mixed concerns
<OldCard className="p-8 rounded-xl shadow-md bg-card">
  Content
</OldCard>

// New approach - clean prop forwarding
<Card p="xl" rounded="xl" shadow="md" bg="card">
  Content
</Card>
```

The new architecture provides perfect prop forwarding with maximum flexibility and consistency. 