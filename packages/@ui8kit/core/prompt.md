# Technical Specification: UI Component Library Enhancement System

## Project Overview

**Library**: `@ui8kit/core`  
**Target**: Decompose complex JSX blocks into semantic Mantine-inspired components with Tailwind CSS and data-class BEM architecture

## Project Structure

```
packages/@ui8kit/core/src/
├── core/           # Logic and utilities (@/core)
│   ├── types.ts    # Core types and interfaces
│   ├── utils.ts    # Utilities (cn function)
│   ├── bem-types.ts # BEM TypeScript autocomplete types
│   └── index.ts    # Exports
└── utility/        # UI components (@/utility)
    ├── components/ # Layout and semantic components (Block, Container, etc.)
    └── ui/         # Basic UI elements (Button, Card, etc.)

blocks/             # Final reconstructed blocks
```

## Core Architecture Principles

### 1. **Core-First Development Strategy**
- **PRIORITY #1**: Use core component props instead of utility classes
- **PRIORITY #2**: Maintain consistency with core library defaults
- **PRIORITY #3**: Create coherent prototypes, not exact copies
- **PRIORITY #4**: Minimize utility class usage

#### **Core-First Decision Matrix:**
```typescript
// ✅ CORRECT: Use core props instead of utilities
<Title order={1} size="4xl" fw="bold" ta="center" c="foreground">
  <!-- NO utility classes needed -->
</Title>

// ❌ WRONG: Duplicating with utility classes
<Title 
  order={1} 
  size="4xl" 
  className="text-4xl font-bold text-center text-foreground"
>
  <!-- Redundant utilities -->
</Title>

// ✅ CORRECT: Only use utilities for what props can't handle
<Title 
  order={1} 
  size="4xl" 
  fw="bold"
  className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
  data-class="hero-title"
>
  <!-- Gradient effect needs utilities -->
</Title>
```

#### **Core Library Consistency Rules:**
```typescript
// If core has default behavior → use it, don't override
<Container size="lg">
  <!-- mx-auto is default, don't add className="mx-auto" -->
</Container>

// If core has prop for styling → use prop, not utility
<Button size="lg" variant="primary">
  <!-- Use size prop, not className="px-8 py-6" -->
</Button>

// If core prop conflicts with source → choose core prop
// Source: className="px-8"
// Core: size="lg" (gives px-6)
// Choose: size="lg" ✅
```

### 2. **Data-Class System with BEM - Simple Rules**
- **Rule 1**: If element has `className` with utility classes → add `data-class` with BEM naming
- **Rule 2**: If element has no `className` or empty `className` → no `data-class`
- **Rule 3**: Use BEM structure: "block", "block-element", "block-element-modifier"
- **Rule 4**: Scripts process elements with `data-class` and extract utilities from `className`

#### **Simple Decision Making:**
```typescript
// ✅ CORRECT: Has utility classes → ADD data-class
<Card 
  className="bg-white border-2 shadow-lg hover:shadow-xl transition-shadow"
  data-class="testimonial-card"
/>

// ✅ CORRECT: Has responsive utilities → ADD data-class  
<Grid 
  cols={2} 
  gap="lg" 
  className="md:grid-cols-3 lg:grid-cols-4"
  data-class="products-grid"
/>

// ✅ CORRECT: Only CVA props → NO data-class
<Card padding="lg" variant="outline">
  <!-- No className with utilities = No data-class -->
</Card>

// ✅ CORRECT: Empty className → NO data-class
<Card className="">
  <!-- No utility classes = No data-class -->
</Card>
```

#### **BEM Naming Structure:**
```typescript
// Block level
data-class="hero"
data-class="features" 
data-class="blog"

// Block + Element
data-class="hero-title"
data-class="hero-content"
data-class="features-grid"
data-class="blog-card"

// Block + Element + Modifier
data-class="hero-title-large"
data-class="blog-card-featured"
data-class="features-grid-centered"
```

#### **Available BEM Blocks:**
- **Layout**: `hero`, `features`, `blog`, `testimonials`, `pricing`, `contact`, `footer`, `header`
- **Components**: `card`, `button`, `form`, `modal`, `nav`, `sidebar`
- **Content**: `article`, `gallery`, `timeline`, `stats`

### 3. **Block Component as Universal Semantic Wrapper**
- **Block** component replaces generic `<div>` and `<Box>` for semantic sections
- Supports all HTML5 semantic elements: `section`, `main`, `nav`, `article`, `header`, `footer`, `aside`
- Includes comprehensive spacing, color, and layout props
- Use `variant` prop instead of `component` prop: `<Block variant="section">`

#### **Block Component Usage:**
```typescript
// Replace generic divs with semantic Block
<Block 
  variant="section" 
  className="bg-gradient-to-r from-primary to-secondary"
  data-class="hero-section"
>
  <Container size="lg">
    <!-- Content -->
  </Container>
</Block>

// Built-in responsive padding
<Container padding="responsive">
  <!-- Automatically applies: px-4 md:px-6 lg:px-8 -->
</Container>
```

### 4. **Mantine-Inspired Component Design**
- Universal, context-independent component names (Title, not HeroTitle)
- Polymorphic components with `component` prop
- Comprehensive props system that reduces need for utility classes:
  - Spacing: `m`, `mt`, `mb`, `mx`, `my`, `p`, `pt`, `pb`, `px`, `py`
  - Colors: `c`, `bg` (using shadcn semantic colors)
  - Typography: `size`, `fw`, `ta`, `lh`
  - Layout: `pos`, `w`, `h`, `maw`, `mah`
  - Responsive objects: `{ base: 'sm', md: 'lg' }`

#### **Props vs Utility Classes Strategy:**
```typescript
// ✅ ALWAYS PREFER: Use component props when available
<Title order={1} size="4xl" fw="bold" ta="center">
  <!-- No data-class needed -->
</Title>

// ❌ AVOID: Duplicating props with utilities
<Title 
  order={1} 
  size="4xl" 
  className="text-4xl font-bold text-center"
>
  <!-- Redundant - props already handle this -->
</Title>

// ✅ ONLY USE utilities: When props don't cover the need
<Title 
  order={1} 
  size="4xl" 
  fw="bold"
  className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
  data-class="hero-title"
>
  <!-- Gradient effect requires utilities -->
</Title>
```

### 5. **Shadcn Color System Requirements**
- **ONLY** use shadcn semantic color names: `primary`, `secondary`, `destructive`, `muted`, `accent`, `card`, `popover`, `border`, `input`, `ring`, `background`, `foreground`
- **ALWAYS** use foreground pairs: `primary-foreground`, `secondary-foreground`, etc.
- **NEVER** use arbitrary colors like `blue-500`, `red-600`, `gray-100`

**✅ Correct shadcn colors:**
```typescript
className="bg-primary text-primary-foreground hover:bg-primary/90"
className="bg-card text-card-foreground border border-border"
className="text-muted-foreground bg-muted"
```

**❌ Incorrect arbitrary colors:**
```typescript
className="bg-blue-500 text-white hover:bg-blue-600"
className="bg-gray-100 text-gray-900 border-gray-300"
```

## Analysis Algorithm for AI Agents

### Phase 1: Core Component Analysis (Priority Order)

#### 1.1 **Core Props Discovery**
```typescript
1. Identify available core component props (80%) 
2. Map source styling to core props (15%)
3. Determine remaining utility needs (5%)
```

#### 1.2 **Core-First Mapping Rules**
```typescript
// Typography → Title/Text props
font-bold → fw="bold"
text-center → ta="center"
text-xl → size="xl"
text-primary → c="primary"
text-white → c="white"

// Layout → Container/Block props  
max-w-4xl → size="lg" (on Container)
mx-auto → default behavior (don't add)
py-16 → py="xl"
px-4 → padding="responsive"

// Spacing → Component props
space-y-6 → gap="lg" (on Stack)
gap-4 → gap="md" (on Group/Grid)
p-6 → padding="lg"

// Interactive → Button props
px-8 py-3 → size="lg"
bg-primary → variant="primary"
hover:bg-primary/90 → handled by variant
```

#### 1.3 **Redundancy Elimination**
```typescript
// ❌ WRONG: Duplicating props with utilities
<Title 
  size="4xl" 
  className="text-4xl"
/>

// ✅ CORRECT: Use only props
<Title size="4xl" />

// ✅ CORRECT: Props + non-redundant utilities
<Title 
  size="4xl" 
  className="bg-gradient-to-r from-primary to-secondary"
  data-class="hero-title"
/>
```

### Phase 2: Component Structure Analysis

#### 2.1 **Semantic Structure Analysis**
```typescript
1. Semantic containers (40%) - section, main, article, header, footer
2. Layout patterns (30%) - flex, grid, positioning 
3. Content hierarchy (20%) - headings, text, lists
4. Interactive elements (10%) - buttons, forms, links
```

#### 2.2 **Component Mapping Rules**
```typescript
// Semantic Elements → Block Component
<section className="..."> → <Block variant="section" ...>
<main className="..."> → <Block variant="main" ...>
<div className="..."> → <Block variant="div" ...> (if semantic wrapper)

// Layout Patterns → Layout Components
<div className="flex gap-4"> → <Group gap="md">
<div className="space-y-6"> → <Stack gap="lg">
<div className="grid grid-cols-3"> → <Grid cols={3}>
<div className="max-w-4xl mx-auto"> → <Container size="lg">

// Content Elements → Content Components  
<h1 className="text-4xl font-bold"> → <Title order={1} size="4xl" fw="bold">
<p className="text-lg"> → <Text size="lg">
<img src="..." className="..."> → <Image src="..." className="..." data-class="...">
<button className="..."> → <Button variant="..." size="...">
```

#### 2.3 **Data-Class Decision - Simple Rules**
```typescript
// SIMPLE RULE: If className has utility classes → add data-class
<Component 
  className="bg-white border-2 shadow-lg"
  data-class="block-element"
/>

// SIMPLE RULE: If no className or empty → no data-class
<Component variant="secondary" size="lg">
  <!-- No className = No data-class -->
</Component>

// BEM naming examples
"hero" → main hero section
"hero-title" → title within hero
"hero-content" → content wrapper in hero
"hero-title-large" → large variant of hero title
```

### Phase 3: Advanced Pattern Recognition

#### 3.1 **Complex Layout Patterns**
```typescript
// Multi-column layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
→ <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3" data-class="responsive-grid">

// Centered content with constraints
<div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
→ <Container size="lg" padding="responsive">

// Flexible spacing
<div className="space-y-6 lg:space-y-8">
→ <Stack gap="lg" className="lg:gap-8" data-class="responsive-stack">
```

#### 3.2 **Visual Enhancement Patterns**
```typescript
// Background overlays
<div className="relative">
  <div className="absolute inset-0 bg-black/50">
→ <Box pos="relative">
    <Overlay opacity={0.5} />

// Gradient backgrounds  
<div className="bg-gradient-to-r from-primary to-secondary">
→ <Block className="bg-gradient-to-r from-primary to-secondary" data-class="gradient-bg">

// Complex shadows and effects
<div className="shadow-lg hover:shadow-xl transition-shadow duration-300">
→ <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" data-class="interactive-card">
```

## Required Core Components

### **Always Available Components:**
```typescript
// Layout & Structure
- Block         // Universal semantic wrapper (section, main, div, etc.)
- Container     // Constrained width container with responsive padding (mx-auto by default)
- Stack         // Vertical layout (space-y-*)
- Group         // Horizontal layout (flex gap-*)
- Grid          // Grid layouts
- Flex          // Flexible layouts
- Box           // Generic polymorphic container

// Content & Typography
- Title         // Headings (h1-h6) with order prop
- Text          // Text content with size variants
- List          // ul/ol lists

// Media & Visual
- Image         // Images with object-fit variants
- BackgroundImage // Background images
- Overlay       // Overlay layers

// Interactive
- Button        // Buttons with variants
- Badge         // Status indicators
- Card          // Card layouts with compound pattern

// Form Elements (when needed)
- TextInput, Select, Textarea, etc.
```

## Component Implementation Template

### **Standard Component with Data-Class Support**
```typescript
import { cva } from "class-variance-authority";
import { cn } from "@/core/utils";
import { forwardRef } from "react";

const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

interface ComponentProps {
  component?: React.ElementType;
  variant?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  'data-class'?: string;
  children?: React.ReactNode;
}

export const Component = forwardRef<HTMLElement, ComponentProps>(({ 
  component = "button",
  variant,
  size, 
  className,
  'data-class': dataClass,
  ...props 
}, ref) => {
  const Comp = component;
  
  return (
    <Comp
      ref={ref}
      className={cn(componentVariants({ variant, size }), className)}
      {...(className && { 'data-class': dataClass })}
      {...props}
    />
  );
});
```

## Transformation Rules for AI Agents

### **Step-by-Step Transformation Process**

#### **Step 1: Core Props Analysis**
```typescript
// Identify what core props can handle
<h1 className="text-4xl font-bold text-center text-primary">
  ↓ Analyze available props
  order={1} size="4xl" fw="bold" ta="center" c="primary"
  ↓ Result
<Title order={1} size="4xl" fw="bold" ta="center" c="primary">
```

#### **Step 2: Semantic Analysis**
```typescript
// Identify semantic structure
<section> → <Block variant="section">
<main> → <Block variant="main">  
<div> as wrapper → <Block> or specific layout component
<div> as container → <Container>
<div> as flex → <Group> or <Stack>
<div> as grid → <Grid>
```

#### **Step 3: Content Mapping**
```typescript
// Map content elements
<h1-h6> → <Title order={1-6}>
<p> → <Text>
<img> → <Image>
<button> → <Button>
<a> → <Button component="a"> or <Text component="a">
```

#### **Step 4: Core-First Styling Strategy**
```typescript
// PRIORITY 1: Use core props
text-center → ta="center"
text-xl → size="xl"
font-bold → fw="bold"
p-4 → p="md"
text-primary-foreground → c="primary"
bg-secondary → bg="secondary"

// PRIORITY 2: Use utilities only for uncovered needs
bg-gradient-to-r from-primary to-secondary → className + data-class
hover:scale-105 transition-transform → className + data-class
group-hover:translate-x-2 → className + data-class
```

#### **Step 5: Consistency Check**
```typescript
// Check against core defaults
<Container className="mx-auto"> → <Container> (mx-auto is default)
<Button className="px-8 py-3"> → <Button size="lg"> (if core size="lg" gives px-8 py-3)
<Title className="text-4xl"> → <Title size="4xl"> (if core size="4xl" gives text-4xl)

// Choose core over source when conflict
Source: px-8 py-3
Core: size="lg" gives px-6 py-3
Choose: size="lg" ✅ (consistency over exactness)
```

## Quality Standards for AI Agents

### **MANDATORY Requirements**

#### **✅ Must Have:**
- **Core props prioritized over utility classes**
- **Consistency with core library defaults**
- **Minimal utility class usage**
- All Tailwind classes in single strings (no line breaks)
- Only shadcn semantic colors used
- data-class ONLY when className has utility classes
- BEM naming for all data-class values
- Proper semantic HTML through Block component

#### **❌ Must Avoid:**
- **Duplicating core props with utility classes**
- **Overriding core defaults unnecessarily**
- **Exact source matching over core consistency**
- data-class with empty/whitespace className
- Arbitrary color values (blue-500, gray-100, etc.)
- Arrays or template literals in cn() calls
- Line breaks in className strings
- Generic div when semantic element appropriate

### **Validation Checklist**
```typescript
// Before submitting transformation:
□ Core props used instead of equivalent utility classes
□ No redundant utilities that duplicate props
□ Core library defaults respected
□ Prototype coherence prioritized over exact matching
□ All data-class usage has corresponding utility classes in className
□ All colors use shadcn semantic names only
□ BEM naming pattern followed for data-class values  
□ Semantic HTML structure maintained through Block component
□ No arbitrary color values present
□ All className strings are single-line
□ CVA variants use complete Tailwind strings
□ Responsive behavior preserved
□ Interactive states maintained
```

## Example Transformations

### **Example 1: Core-First Hero Section**
```typescript
// BEFORE (typical React block)
<section className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
      Build Something Amazing
    </h1>
    <p className="text-xl text-gray-200 mb-8">
      Create stunning landing pages with our component library
    </p>
    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
      Get Started
    </button>
  </div>
</section>

// AFTER (ui8kit/core transformation - CORE-FIRST)
<Block 
  variant="section" 
  className="min-h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
  data-class="hero-section"
>
  <Container size="lg" ta="center">
    <Title 
      order={1} 
      size="4xl" 
      fw="bold" 
      c="primary-foreground"
      className="mb-6"
      data-class="hero-title"
    >
      Build Something Amazing
    </Title>
    <Text 
      size="xl" 
      c="muted-foreground" 
      className="mb-8"
      data-class="hero-description"
    >
      Create stunning landing pages with our component library
    </Text>
    <Button 
      size="lg"
      variant="secondary"
      className="transition-colors"
      data-class="hero-cta"
    >
      Get Started
    </Button>
  </Container>
</Block>
```

### **Example 2: Props Over Utilities**
```typescript
// ❌ WRONG: Duplicating props with utilities
<Title 
  order={1} 
  size="4xl" 
  className="text-4xl md:text-6xl font-bold text-center"
>
  Redundant Title
</Title>

// ✅ CORRECT: Core props only
<Title 
  order={1} 
  size="4xl" 
  fw="bold" 
  ta="center"
>
  Clean Title
</Title>

// ✅ CORRECT: Props + necessary utilities
<Title 
  order={1} 
  size="4xl" 
  fw="bold" 
  ta="center"
  className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
  data-class="hero-title"
>
  Gradient Title
</Title>
```

### **Example 3: Container Defaults**
```typescript
// ❌ WRONG: Overriding defaults
<Container size="lg" className="mx-auto">
  <!-- mx-auto is default -->
</Container>

// ✅ CORRECT: Use defaults
<Container size="lg">
  <!-- mx-auto applied automatically -->
</Container>

// ✅ CORRECT: Only add when needed
<Container 
  size="lg" 
  className="bg-muted"
  data-class="hero-container"
>
  <!-- Only non-default styling -->
</Container>
```

## VS Code Integration

### **Available Snippets:**
```typescript
bem-block    → data-class="hero|features|blog..."
bem-hero     → data-class="hero-title|hero-content..."  
bem-card     → data-class="card-header|card-content..."
ui-block     → <Block variant="section" data-class="">
ui-container → <Container size="lg" padding="responsive">
ui-grid      → <Grid cols={2} gap="lg" data-class="">
```

## Summary

The key principles are:
1. **Core props ALWAYS take priority over utility classes**
2. **Maintain consistency with core library defaults**
3. **Create coherent prototypes, not exact copies**
4. **If className has utility classes → add data-class with BEM naming**
5. **If no className or empty className → no data-class**
6. **Use only shadcn semantic colors**
7. **Follow BEM naming structure**

**Remember: Core consistency > Source exactness!**