# Migration Guide to New @ui8kit/core Architecture

## Overview

This guide helps you migrate from the old component system to the new three-tier architecture with perfect prop forwarding.

## Architecture Changes

### Before (Old System)
```tsx
// Mixed concerns - styles and logic together
import { Block } from '@ui8kit/core/utility';

<Block 
  className="p-8 rounded-lg shadow-md bg-card"
  py="xl"
  bg="muted"
>
  Content
</Block>
```

### After (New System)
```tsx
// Clean separation - prop forwarding approach
import { Block } from '@ui8kit/core';

<Block 
  p="xl" 
  rounded="lg" 
  shadow="md" 
  bg="card"
  py="xl"
>
  Content
</Block>
```

## Component Migration Map

### Layout Components

#### Block Component
```tsx
// Before
import { Block } from '@ui8kit/core/utility/components';

// After
import { Block } from '@ui8kit/core';

// Usage remains similar but with cleaner props
<Block 
  component="section"
  py="xl" 
  bg="background"
  rounded="lg"
>
  Content
</Block>
```

#### Container Component
```tsx
// Before
import { Container } from '@ui8kit/core/utility/components';

// After
import { Container } from '@ui8kit/core';

// Now with unified sizing system
<Container 
  size="lg"        // xs, sm, md, lg, xl, 2xl, 4xl, 6xl, full
  px="md" 
  centered
>
  Content
</Container>
```

#### Stack Component
```tsx
// Before
import { Stack } from '@ui8kit/core/utility/components';

// After
import { Stack } from '@ui8kit/core';

// Cleaner flex properties
<Stack 
  gap="lg"         // Unified gap system
  align="center"   // Simplified alignment
  p="md"
>
  {children}
</Stack>
```

#### Grid Component
```tsx
// Before
import { Grid } from '@ui8kit/core/utility/components';
<Grid cols="cols3" gap="xl">

// After
import { Grid } from '@ui8kit/core';
<Grid cols="1-2-3" gap="lg">    // Better responsive naming
  <Grid.Col span={2}>Wide</Grid.Col>
  <Grid.Col>Regular</Grid.Col>
</Grid>
```

### UI Components

#### Card Component
```tsx
// Before
import { Card } from '@ui8kit/core/utility/ui';

// After
import { Card } from '@ui8kit/core';

// Compound component with better structure
<Card p="lg" rounded="xl" shadow="md" bg="card">
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

#### Button Component
```tsx
// Before
import { Button } from '@ui8kit/core/utility/ui';

// After
import { Button } from '@ui8kit/core';

// Enhanced with loading state and sections
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

#### Title & Text Components
```tsx
// Before
import { Title, Text } from '@ui8kit/core/utility/components';

// After
import { Title, Text } from '@ui8kit/core';

// More consistent typography system
<Title 
  order={1} 
  size="3xl"      // Unified size system
  fw="bold" 
  c="primary"
  mb="md"
>
  Heading
</Title>

<Text 
  size="lg" 
  c="muted-foreground"
  ta="center"
  truncate
>
  Description
</Text>
```

## Prop Name Changes

### Unified Prop Names

| Old | New | Description |
|-----|-----|-------------|
| `radius` | `rounded` | Border radius |
| `color` | `c` | Text color |
| `backgroundColor` | `bg` | Background color |
| `textAlign` | `ta` | Text alignment |
| `fontWeight` | `fw` | Font weight |

### Spacing System
```tsx
// Before - inconsistent naming
<Component 
  padding="lg"
  margin="md"
  paddingX="sm"
/>

// After - consistent short names
<Component 
  p="lg"      // padding
  m="md"      // margin  
  px="sm"     // padding horizontal
  py="lg"     // padding vertical
  mt="md"     // margin top
/>
```

### Color System
```tsx
// Before - mixed naming
<Component 
  backgroundColor="card"
  textColor="muted-foreground"
  borderColor="border"
/>

// After - unified system
<Component 
  bg="card"
  c="muted-foreground" 
  borderColor="border"
/>
```

## Breaking Changes

### Import Paths
```tsx
// Before
import { Block } from '@ui8kit/core/utility/components';
import { Card } from '@ui8kit/core/utility/ui';

// After
import { Block, Card } from '@ui8kit/core';
```

### Removed Props
- Custom `className` for styling (use props instead)
- Verbose prop names (replaced with short versions)
- Mixed size systems (now unified)

### New Required Patterns
```tsx
// Data classes are now automatically applied
<Card data-class="card">       // Automatic
  <Card.Header data-class="card-header">  // Automatic
    <Card.Title data-class="card-title">  // Automatic
```

## Migration Steps

### Step 1: Update Imports
```bash
# Find and replace import paths
# From: '@ui8kit/core/utility/components'
# To: '@ui8kit/core'
```

### Step 2: Update Prop Names
```tsx
// Replace verbose props with short ones
radius → rounded
color → c
backgroundColor → bg
textAlign → ta
fontWeight → fw
```

### Step 3: Update Size Systems
```tsx
// Container sizes
size="screen-lg" → size="lg"
size="2xl" → size="2xl"  // Content containers

// Grid columns  
cols="cols3" → cols="1-2-3"
cols="cols2" → cols="1-2"
```

### Step 4: Remove Custom Classes
```tsx
// Before - mixed approaches
<Card className="p-8 rounded-xl bg-card">

// After - pure props
<Card p="xl" rounded="xl" bg="card">
```

### Step 5: Update Compound Components
```tsx
// Before - flat structure
<Card>
  <div className="card-header">
    <h3>Title</h3>
  </div>
</Card>

// After - semantic structure
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
</Card>
```

## Benefits After Migration

1. **Consistent API** - All components use the same prop patterns
2. **Better TypeScript** - Full type safety with autocompletion
3. **Cleaner Code** - No more mixed className and props
4. **Better Performance** - Optimized CVA variants
5. **Semantic HTML** - Automatic data-class attributes
6. **Future Proof** - Architecture designed for long-term growth

## Automated Migration Tools

### Find & Replace Patterns
```regex
# Import updates
@ui8kit/core/utility/components → @ui8kit/core
@ui8kit/core/utility/ui → @ui8kit/core

# Prop updates
radius= → rounded=
color= → c=
backgroundColor= → bg=
textAlign= → ta=
fontWeight= → fw=

# Grid columns
cols="cols(\d+)" → cols="1-2-$1"
```

### Validation Checklist
- [ ] All imports updated to new paths
- [ ] Prop names converted to short versions
- [ ] Size systems unified
- [ ] Compound components restructured
- [ ] Custom classes removed
- [ ] TypeScript errors resolved
- [ ] Visual regression testing passed

## Support

If you encounter issues during migration:

1. Check the component documentation in `components/README.md`
2. Review the architecture overview in `ARCHITECTURE.md`
3. Look at the updated SplitBlock factory for examples
4. Use TypeScript autocompletion for prop discovery

The new architecture provides a much cleaner, more maintainable, and more powerful component system while maintaining all the functionality of the previous version. 