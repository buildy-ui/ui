# Technical Specification: UI Component Library Enhancement System

## Project Overview

**Library**: `@ui8kit/core`  
**Target**: Decompose complex JSX blocks into semantic Mantine-inspired components with Tailwind CSS and data-class BEM architecture

## Project Structure

```
packages/@ui8kit/core/src/
├── core/           # Logic and utilities (@/core)
│   ├── types.ts    # Core types and interfaces
│   ├── utils.ts    # Utilities (cn, withDataClass, hasUtilityClasses)
│   ├── bem-types.ts # BEM TypeScript autocomplete types
│   └── index.ts    # Exports
└── utility/        # UI components (@/utility)
    ├── components/ # Layout and semantic components (Block, Container, etc.)
    └── ui/         # Basic UI elements (Button, Card, etc.)

blocks/             # Final reconstructed blocks
```

## Core Architecture Principles

### 1. **Data-Class System with BEM and Conditional Application**
- **CRITICAL**: Use `data-class` attribute ONLY when element has utility classes in `className`
- **NEVER**: Use `data-class` when element only uses CVA props (variant, size, etc.)
- **BEM Structure**: Follow "block", "block-element", "block-element-modifier" naming
- Scripts automatically detect `data-class` attributes and extract utility classes from `className`
- TypeScript autocomplete available for BEM patterns

#### **Conditional Data-Class Application:**
```typescript
// ✅ CORRECT: Has utility classes → USE data-class
<Card 
  className="bg-white border-2 shadow-lg hover:shadow-xl transition-shadow"
  data-class="testimonial-card"
/>

// ✅ CORRECT: Has responsive utilities → USE data-class  
<Grid 
  cols={2} 
  gap="lg" 
  className="md:grid-cols-3 lg:grid-cols-4"
  data-class="products-grid"
/>

// ❌ INCORRECT: Only CVA props → NO data-class
<Card padding="lg" variant="outline">
  <!-- No className with utilities = No data-class -->
</Card>

// ❌ INCORRECT: Empty or whitespace className → NO data-class
<Card className="" data-class="testimonial-card">
<Card className="   " data-class="testimonial-card">
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

#### **Script Processing Mechanism:**
```typescript
// Script finds element with data-class AND utility classes
<Box 
  data-class="hero-section" 
  className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary"
/>

// AST parser extracts utility classes from className
// Generates CSS:
.hero-section {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary;
}

// Script IGNORES elements without utility classes:
<Card padding="lg" variant="outline">
  <!-- No data-class needed, no CSS generated -->
</Card>
```

### 2. **Block Component as Universal Semantic Wrapper**
- **Block** component replaces generic `<div>` and `<Box>` for semantic sections
- Supports all HTML5 semantic elements: `section`, `main`, `nav`, `article`, `header`, `footer`, `aside`
- Includes comprehensive spacing, color, and layout props
- Automatically handles responsive behavior

#### **Block Component Usage:**
```typescript
// Replace generic divs with semantic Block
<Block 
  component="section" 
  padding="responsive"
  className="bg-background"
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

### 3. **Mantine-Inspired Component Design**
- Universal, context-independent component names (Title, not HeroTitle)
- Polymorphic components with `component` prop
- Comprehensive props system that reduces need for utility classes:
  - Spacing: `m`, `mt`, `mb`, `mx`, `my`, `p`, `pt`, `pb`, `px`, `py`
  - Colors: `c`, `bg` (using shadcn semantic colors)
  - Typography: `size`, `fw`, `ta`, `lh`
  - Layout: `pos`, `w`, `h`, `maw`, `mah`
  - Responsive objects: `{ base: 'sm', md: 'lg' }`
- Composition with compound components (Card.Header, Card.Content)

#### **Props vs Utility Classes Strategy:**
```typescript
// ✅ PREFER: Use component props when available
<Title order={1} size="4xl" fw="bold" ta="center">
  <!-- No data-class needed -->
</Title>

// ✅ USE data-class: When props don't cover the styling
<Title 
  order={1} 
  size="4xl" 
  className="text-4xl md:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
  data-class="hero-title"
>
  Responsive + Gradient Title
</Title>
```

### 4. **Shadcn Color System Requirements**
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

### 5. **Utility Functions for Data-Class Management**
```typescript
import { withDataClass, hasUtilityClasses } from '@ui8kit/core';

// Automatically applies data-class only when utility classes present
const conditionalProps = withDataClass(className, "hero-title");

// Check if className contains utility classes
const hasUtilities = hasUtilityClasses("bg-white border-2 shadow-lg");
// Returns: true

const hasNoUtilities = hasUtilityClasses(""); 
// Returns: false
```

## Analysis Algorithm for AI Agents

### Phase 1: Identify Component Structure (Priority Order)

#### 1.1 **Semantic Structure Analysis**
```typescript
1. Semantic containers (40%) - section, main, article, header, footer
2. Layout patterns (30%) - flex, grid, positioning 
3. Content hierarchy (20%) - headings, text, lists
4. Interactive elements (10%) - buttons, forms, links
```

#### 1.2 **Component Mapping Rules**
```typescript
// Semantic Elements → Block Component
<section className="..."> → <Block component="section" ...>
<main className="..."> → <Block component="main" ...>
<div className="..."> → <Block component="div" ...> (if semantic wrapper)

// Layout Patterns → Layout Components
<div className="flex gap-4"> → <Group gap="md">
<div className="space-y-6"> → <Stack gap="lg">
<div className="grid grid-cols-3"> → <Grid cols={3}>
<div className="max-w-4xl mx-auto"> → <Container size="lg">

// Content Elements → Content Components  
<h1 className="text-4xl font-bold"> → <Title order={1} size="2xl" fw="bold">
<p className="text-lg"> → <Text size="lg">
<img src="..." className="..."> → <Image src="..." className="..." data-class="...">
<button className="..."> → <Button variant="..." size="...">
```

#### 1.3 **Data-Class Decision Matrix**
```typescript
// STEP 1: Check if element has className with utility classes
const hasUtilities = className && hasUtilityClasses(className);

// STEP 2: Apply data-class logic
if (hasUtilities) {
  // ✅ Add data-class with BEM naming
  <Component className="..." data-class="block-element" />
} else {
  // ❌ Use only CVA props, no data-class
  <Component variant="..." size="..." />
}

// STEP 3: BEM naming guidelines
"hero" → main hero section
"hero-title" → title within hero
"hero-content" → content wrapper in hero
"hero-title-large" → large variant of hero title
```

### Phase 2: Advanced Pattern Recognition

#### 2.1 **Complex Layout Patterns**
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

#### 2.2 **Visual Enhancement Patterns**
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
- Container     // Constrained width container with responsive padding
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

#### **Step 1: Semantic Analysis**
```typescript
// Identify semantic structure
<section> → <Block component="section">
<main> → <Block component="main">  
<div> as wrapper → <Block> or specific layout component
<div> as container → <Container>
<div> as flex → <Group> or <Stack>
<div> as grid → <Grid>
```

#### **Step 2: Content Mapping**
```typescript
// Map content elements
<h1-h6> → <Title order={1-6}>
<p> → <Text>
<img> → <Image>
<button> → <Button>
<a> → <Button component="a"> or <Text component="a">
```

#### **Step 3: Styling Strategy**
```typescript
// For each element, decide:
1. Can component props handle the styling?
   YES → Use props only, no data-class
   NO → Use className + data-class

2. If using className + data-class:
   - Extract utility classes to className
   - Create BEM-compliant data-class name
   - Ensure data-class follows block-element-modifier pattern
```

#### **Step 4: Props vs Utilities Decision Tree**
```typescript
// Common styling → Use component props
text-center → ta="center"
text-xl → size="xl"
font-bold → fw="bold"
p-4 → p="md"
text-primary-foreground → c="primary"
bg-secondary → bg="secondary"

// Complex/Responsive styling → Use className + data-class  
text-4xl md:text-6xl lg:text-7xl → className + data-class
bg-gradient-to-r from-primary to-secondary → className + data-class
hover:scale-105 transition-transform → className + data-class
group-hover:translate-x-2 → className + data-class
```

## Quality Standards for AI Agents

### **MANDATORY Requirements**

#### **✅ Must Have:**
- All Tailwind classes in single strings (no line breaks)
- Only shadcn semantic colors used
- data-class ONLY when className has utility classes
- BEM naming for all data-class values
- Component props used when available
- Proper semantic HTML through Block component

#### **❌ Must Avoid:**
- data-class with empty/whitespace className
- Arbitrary color values (blue-500, gray-100, etc.)
- Arrays or template literals in cn() calls
- Line breaks in className strings
- Generic div when semantic element appropriate
- Utility classes when component props available

### **Validation Checklist**
```typescript
// Before submitting transformation:
□ All data-class usage has corresponding utility classes in className
□ All colors use shadcn semantic names only
□ BEM naming pattern followed for data-class values  
□ Component props used instead of utilities where possible
□ Semantic HTML structure maintained through Block component
□ No arbitrary color values present
□ All className strings are single-line
□ CVA variants use complete Tailwind strings
□ Responsive behavior preserved
□ Interactive states maintained
```

## Example Transformations

### **Example 1: Hero Section**
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

// AFTER (ui8kit/core transformation)
<Block 
  component="section" 
  className="min-h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
  data-class="hero-section"
>
  <Container size="lg" ta="center">
    <Title 
      order={1} 
      className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6"
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
      className="bg-background text-foreground px-8 py-3 hover:bg-muted transition-colors"
      data-class="hero-cta"
    >
      Get Started
    </Button>
  </Container>
</Block>
```

### **Example 2: Card Grid Layout**
```typescript
// BEFORE
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
    <img src="..." className="w-full h-48 object-cover rounded-md mb-4" />
    <h3 className="text-xl font-bold text-gray-900 mb-2">Card Title</h3>
    <p className="text-gray-600">Card description text here.</p>
  </div>
</div>

// AFTER  
<Grid 
  cols={1} 
  gap="lg" 
  p="lg"
  className="md:grid-cols-2 lg:grid-cols-3"
  data-class="cards-grid"
>
  <Card 
    padding="lg"
    className="shadow-lg hover:shadow-xl transition-shadow"
    data-class="feature-card"
  >
    <Image 
      src="..." 
      className="w-full h-48 object-cover rounded-md mb-4"
      data-class="card-image"
    />
    <Title order={3} size="xl" fw="bold" c="foreground" className="mb-2">
      Card Title
    </Title>
    <Text c="muted-foreground">
      Card description text here.
    </Text>
  </Card>
</Grid>
```

## VS Code Integration

### **Available Snippets:**
```typescript
bem-block    → data-class="hero|features|blog..."
bem-hero     → data-class="hero-title|hero-content..."  
bem-card     → data-class="card-header|card-content..."
ui-block     → <Block component="section" data-class="">
ui-container → <Container size="lg" padding="responsive">
ui-grid      → <Grid cols={2} gap="lg" data-class="">
```

This comprehensive system ensures AI agents can accurately transform any React block into the ui8kit/core design system while maintaining semantic integrity, visual fidelity, and following all architectural principles.