# UI Component Library Transformation Guide

## 🎯 Main Goal
Transform JSX blocks into semantic Mantine-inspired components with Tailwind CSS and data-class BEM architecture.

## 📋 Core Rules (Follow These Exactly)

### Rule 1: Core Props First
**ALWAYS use component props instead of utility classes when possible**

```typescript
// ✅ CORRECT: Use props
<Title order={1} size="4xl" fw="bold" ta="center" c="primary">

// ❌ WRONG: Duplicate with utilities  
<Title order={1} size="4xl" className="text-4xl font-bold text-center text-primary">
```

### Rule 2: Data-Class Logic
**Simple decision: Has utility classes in className? → Add data-class**

```typescript
// ✅ Has utilities → ADD data-class
<Card className="bg-white shadow-lg hover:shadow-xl" data-class="testimonial-card">

// ✅ No utilities → NO data-class
<Card variant="outline" padding="lg">
```

### Rule 3: Utility-Based Naming
**Create reusable names based on utility classes, not component context**

```typescript
// ✅ CORRECT: Based on utility classes (reusable everywhere)
data-class="text-gradient"        // for bg-gradient + text effects
data-class="button-elevated"      // for shadow-lg hover:shadow-xl
data-class="overlay-dark"         // for absolute inset-0 bg-black/50
data-class="card-interactive"     // for hover:scale-105 transition
data-class="container-centered"   // for max-w-4xl mx-auto
data-class="grid-responsive"      // for responsive grid layouts

// ❌ WRONG: Context-specific names (not reusable)
data-class="hero-title"          // Can't reuse in Features or Blog
data-class="blog-card"           // Can't reuse in other sections
data-class="features-grid"       // Limited to features only
```

### Rule 4: Shadcn Colors Only
**ONLY use semantic color names from shadcn**

```typescript
// ✅ CORRECT
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"

// ❌ WRONG
className="bg-blue-500 text-white"
className="bg-gray-100 text-gray-900"
```

## 🔧 Component Mapping

### Layout Components
```typescript
<section> → <Block variant="section">
<div className="max-w-4xl mx-auto"> → <Container size="lg">
<div className="flex gap-4"> → <Group gap="md">
<div className="space-y-6"> → <Stack gap="lg">
<div className="grid grid-cols-3"> → <Grid cols={3}>
```

### Content Components
```typescript
<h1-h6> → <Title order={1-6}>
<p> → <Text>
<img> → <Image>
<button> → <Button>
```

### Props vs Utilities
```typescript
// Typography
font-bold → fw="bold"
text-center → ta="center"
text-xl → size="xl"
text-primary → c="primary"

// Spacing
p-4 → p="md"
py-16 → py="xl"
gap-4 → gap="md"

// Layout
max-w-4xl → size="lg" (on Container)
```

## 🎨 Available Components

### Always Available:
- **Block** - Universal semantic wrapper (section, main, div, etc.)
- **Container** - Constrained width container (mx-auto by default)
- **Stack** - Vertical layout (space-y-*)
- **Group** - Horizontal layout (flex gap-*)
- **Grid** - Grid layouts
- **Title** - Headings (h1-h6) with order prop
- **Text** - Text content with size variants
- **Button** - Buttons with variants
- **Image** - Images with object-fit variants
- **Card** - Card layouts
- **Badge** - Status indicators

## ✅ Transformation Checklist

Before submitting, check:
- [ ] Core props used instead of equivalent utility classes
- [ ] No redundant utilities that duplicate props
- [ ] data-class ONLY when className has utility classes
- [ ] Utility-based naming (reusable across all components)
- [ ] Only shadcn semantic colors used
- [ ] Semantic HTML through Block component

## 🚀 Quick Examples

### Simple Transformation
```typescript
// BEFORE
<div className="max-w-4xl mx-auto px-4">
  <h1 className="text-4xl font-bold text-center text-gray-900">
    Hello World
  </h1>
</div>

// AFTER  
<Container size="lg" padding="responsive">
  <Title order={1} size="4xl" fw="bold" ta="center" c="foreground">
    Hello World
  </Title>
</Container>
```

### With Data-Class
```typescript
// BEFORE
<section className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
  <h1 className="text-5xl font-bold text-white mb-6">
    Hero Title
  </h1>
</section>

// AFTER
<Block 
  variant="section" 
  className="min-h-screen bg-gradient-to-r from-primary to-secondary"
  data-class="section-gradient"
>
  <Title 
    order={1} 
    size="4xl" 
    fw="bold" 
    c="primary-foreground"
    className="mb-6"
    data-class="title-spaced"
  >
    Hero Title
  </Title>
</Block>
```

## 🎯 Data-Class Naming Examples

### ✅ Good: Utility-Based Names (Reusable)
```typescript
// Layout & Positioning
data-class="container-centered"    // max-w-4xl mx-auto
data-class="overlay-dark"          // absolute inset-0 bg-black/50
data-class="grid-responsive"       // responsive grid layouts
data-class="flex-centered"         // flex items-center justify-center

// Visual Effects
data-class="text-gradient"         // gradient text effects
data-class="button-elevated"       // shadow-lg hover:shadow-xl
data-class="card-interactive"      // hover:scale-105 transition
data-class="image-hover"           // hover:scale-110 transition

// Spacing & Sizing
data-class="title-spaced"          // mb-6 or similar spacing
data-class="section-padded"        // py-16 lg:py-24
data-class="content-wide"          // max-w-6xl
data-class="icon-small"            // w-4 h-4
```

### ❌ Bad: Context-Specific Names (Not Reusable)
```typescript
// These limit reusability across different sections
data-class="hero-title"           // Can't reuse in Features
data-class="blog-card"            // Can't reuse in Products
data-class="features-grid"        // Can't reuse in Gallery
data-class="cta-button"           // Can't reuse in Navigation
```

## 🎯 Remember

1. **Core props FIRST** - Always check if a prop exists before using utilities
2. **data-class = utility classes exist** - Simple rule
3. **Utility-based naming** - Names based on what utilities do, not where they're used
4. **Shadcn colors only** - primary, secondary, muted, etc.
5. **Semantic HTML** - Use Block component for semantic elements

**Core consistency > Source exactness!**