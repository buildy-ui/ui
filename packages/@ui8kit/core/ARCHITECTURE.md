# @ui8kit/core Architecture

## Overview

A completely redesigned architecture for core components with an ideal prop forwarding approach, clean primitives, and reusable CVA configurations.

## Structure

```
packages/@ui8kit/core/src/core/
├── variants/          # Reusable CVA configurations
│   ├── spacing.ts     # margin, padding variants
│   ├── rounded.ts     # border-radius variants
│   ├── shadow.ts      # shadow variants
│   ├── colors.ts      # background, text, border colors
│   ├── layout.ts      # width, height, position, display
│   ├── border.ts      # border variants
│   ├── sizing.ts      # component sizes
│   ├── flex.ts        # flex and grid layout
│   └── index.ts       # central export
├── ui/                # Basic primitives without styles
│   ├── Block.tsx      # section wrapper
│   ├── Container.tsx  # container
│   ├── Grid.tsx       # grid (grid display)
│   ├── Flex.tsx       # flex container
│   ├── Box.tsx        # universal block
│   ├── Stack.tsx      # flex column container
│   ├── Component.tsx  # universal component
│   ├── Element.tsx    # element with as prop
│   ├── Card.tsx       # basic card
│   ├── Button.tsx     # basic button
│   ├── Badge.tsx      # basic badge
│   ├── Image.tsx      # image
│   ├── Icon.tsx       # icon
│   └── index.ts       # component export
├── types.ts           # basic types
├── utils.ts           # utilities (cn function)
├── spacing.ts         # old system (deprecated)
└── index.ts           # main export
```

## Principles of the New Architecture

### 1. Clean Primitives

All basic components in `core/ui/` have only:
- `children?: ReactNode`
- `className?: string`
- `...props` - all other HTML attributes

**No built-in styles or classes!**

```tsx
// ✅ Correct - clean primitive
export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ component = "div", className, children, ...props }, ref) => {
    const Component = component as ElementType;
    
    return (
      <Component
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
```

### 2. Reusable CVA Configurations

All repeating style patterns are extracted into separate CVA configurations:

```tsx
// variants/rounded.ts
export const roundedVariants = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full"
    }
  }
});
```

### 3. Prop Forwarding Approach

At a high level, components receive styles through props and CVA:

```tsx
interface StyledCardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const StyledCard: React.FC<StyledCardProps> = ({ 
  padding = 'md',
  rounded = 'lg',
  shadow = 'sm',
  className,
  ...props 
}) => {
  return (
    <Card
      className={cn(
        spacingVariants({ p: padding }),
        roundedVariants({ rounded }),
        shadowVariants({ shadow }),
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};
```

## Usage

### Basic Primitives

```tsx
import { Block, Container, Grid, Stack, Box } from '@ui8kit/core';

// Simple structure without styles
<Block component="section">
  <Container>
    <Grid className="grid-cols-3 gap-4">
      <Box>Content 1</Box>
      <Box>Content 2</Box> 
      <Box>Content 3</Box>
    </Grid>
  </Container>
</Block>
```

### Applying Styles via CVA

```tsx
import { 
  Card, 
  spacingVariants, 
  roundedVariants, 
  shadowVariants,
  cn 
} from '@ui8kit/core';

<Card
  className={cn(
    'border bg-card',
    spacingVariants({ p: 'lg' }),
    roundedVariants({ rounded: 'xl' }),
    shadowVariants({ shadow: 'md' })
  )}
>
  Card content
</Card>
```

### Creating Composite Components

```tsx
// High-level component with nice customization
interface FeatureCardProps {
  title: string;
  description: string;
  variant?: 'default' | 'highlighted';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  variant = 'default'
}) => {
  return (
    <Card
      className={cn(
        'border transition-colors',
        spacingVariants({ p: 'xl' }),
        roundedVariants({ rounded: 'lg' }),
        shadowVariants({ shadow: variant === 'highlighted' ? 'xl' : 'sm' }),
        colorVariants({
          bg: variant === 'highlighted' ? 'accent' : 'card'
        })
      )}
    >
      <Stack className={cn(flexVariants({ gap: 'md' }))}>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Stack>
    </Card>
  );
};
```

## Available CVA Configurations

### Spacing
- **margins**: `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`
- **paddings**: `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`
- **sizes**: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `auto`

### Rounded
- **variants**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`

### Shadow
- **variants**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`

### Colors
- **background**: `transparent`, `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `card`, `border`, `input`, `ring`
- **text colors**: `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`
- **border colors**: similar to background

### Layout
- **display**: `block`, `inline-block`, `inline`, `flex`, `inline-flex`, `grid`, `inline-grid`, `hidden`
- **width**: `auto`, `full`, `screen`, `fit`, `min`, `max`, `1px`
- **height**: `auto`, `full`, `screen`, `fit`, `min`, `max`, `1px`
- **position**: `static`, `relative`, `absolute`, `fixed`, `sticky`
- **overflow**: `auto`, `hidden`, `visible`, `scroll`

### Flex
- **direction**: `row`, `col`, `row-reverse`, `col-reverse`
- **align**: `start`, `center`, `end`, `baseline`, `stretch`
- **justify**: `start`, `center`, `end`, `between`, `around`, `evenly`
- **wrap**: `wrap`, `nowrap`, `wrap-reverse`
- **gap**: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

### Grid
- **cols**: `1`, `2`, `3`, `4`, `5`, `6`, `12`, `1-2`, `1-2-3`, `1-2-3-4`
- **gap**: `none`, `xs`, `sm`, `md`, `lg`, `xl`
- **align**: `start`, `center`, `end`, `stretch`
- **justify**: `start`, `center`, `end`, `stretch`

## Advantages of the New Architecture

1. **Clean Separation of Concerns** - primitives do not know about styles
2. **Reusability** - CVA configurations can be used everywhere
3. **Consistency** - identical names and values everywhere
4. **Type Safety** - all variants are typed through VariantProps
5. **Flexibility** - any combinations of styles can be created
6. **Performance** - no code duplication, optimal bundles

## Migration

Old components can be gradually migrated to the new architecture:

```tsx
// Old approach
<OldBlock 
  p="lg" 
  rounded="md" 
  shadow="sm" 
  bg="card"
>
  Content
</OldBlock>

// New approach
<Block
  className={cn(
    spacingVariants({ p: 'lg' }),
    roundedVariants({ rounded: 'md' }),
    shadowVariants({ shadow: 'sm' }),
    colorVariants({ bg: 'card' })
  )}
>
  Content
</Block>
```

The new architecture provides perfect prop forwarding quality and maximum flexibility in creating UI components.