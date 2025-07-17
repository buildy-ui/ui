# Data-Class Usage Guide

## Basic Principles

### ✅ When to use `data-class`:
```tsx
// ✅ CORRECT: there are utility classes
<Card 
  className="bg-white border-2 shadow-lg hover:shadow-xl transition-shadow"
  data-class="testimonial-card"
/>

// ✅ CORRECT: there are custom styles
<Box 
  className="aspect-video overflow-hidden rounded-t-lg"
  data-class="blog-article-image-wrapper"
/>

// ✅ CORRECT: responsive utilities
<Grid 
  cols={2} 
  gap="lg" 
  className="md:grid-cols-3 lg:grid-cols-4"
  data-class="products-grid"
/>
```

### ❌ When NOT to use `data-class`:
```tsx
// ❌ INCORRECT: no utility classes
<Card padding="lg">  // Only CVA props

// ❌ INCORRECT: empty className
<Card className="" data-class="testimonial-card">

// ❌ INCORRECT: only spaces
<Card className="   " data-class="testimonial-card">
```

## BEM Autocomplete

### Naming Structure:
```tsx
data-class="block"                    // hero
data-class="block-element"            // hero-title  
data-class="block-element-modifier"   // hero-title-large
data-class="block-modifier"           // hero-dark
```

### Available Blocks:
- **Layout**: `hero`, `features`, `blog`, `testimonials`, `pricing`, `contact`, `footer`, `header`
- **Components**: `card`, `button`, `form`, `modal`, `nav`, `sidebar`

### VS Code Snippets:
```
bem-block    → data-class="hero|features|blog..."
bem-hero     → data-class="hero-title|subtitle|content..."
bem-card     → data-class="card-header|content|footer..."
bem-mod      → data-class="block-element-primary|secondary..."
```

## Practical Examples

### Hero Section:
```tsx
<Block
  variant="section"
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
  data-class="hero-section"
>
  <Container 
    size="lg" 
    padding="responsive"
    data-class="hero-content"  // ✅ Container automatically adds responsive padding
  >
    <Title
      order={1}
      size="4xl"
      className="text-4xl md:text-6xl lg:text-7xl leading-tight"
      data-class="hero-title"  // ✅ There are responsive classes
    >
      Build Something Amazing
    </Title>
    
    <Text
      size="xl"
      c="muted-foreground"
      // ❌ NO data-class - only CVA props
    >
      Create stunning landing pages
    </Text>
  </Container>
</Block>
```

### Blog Cards:
```tsx
<Grid 
  cols={2} 
  gap="lg" 
  className="w-full md:grid-cols-3"
  data-class="blog-articles-grid"  // ✅ There are responsive classes
>
  {articles.map((article, index) => (
    <Grid.Col key={index}>
      <Card 
        padding="none"
        className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border bg-card hover:scale-105 rounded-lg cursor-pointer"
        data-class="blog-article-card"  // ✅ Many utility classes
      >
        <Box 
          className="aspect-video overflow-hidden rounded-t-lg"
          data-class="blog-article-image-wrapper"  // ✅ There are utilities
        >
          <Image 
            src={article.image}
            className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
            data-class="blog-article-image"  // ✅ There are utilities
          />
        </Box>
        
        <Card.Content 
          padding="lg"
          // ❌ NO data-class - only padding from CVA
        >
          <Title order={3}>
            {article.title}
          </Title>
        </Card.Content>
      </Card>
    </Grid.Col>
  ))}
</Grid>
```

## Automation

### Utility `withDataClass`:
```tsx
import { withDataClass } from '@ui8kit/core';

// Automatically adds data-class only when className is present
const props = withDataClass(
  "bg-white border-2 shadow-lg", 
  "testimonial-card"
);
// Result: { 'data-class': 'testimonial-card' }

const emptyProps = withDataClass(
  undefined, 
  "testimonial-card"
);
// Result: {} - NO data-class
```

### Checking Utility Classes:
```tsx
import { hasUtilityClasses } from '@ui8kit/core';

hasUtilityClasses("bg-white border-2");        // true
hasUtilityClasses("flex justify-center");      // true  
hasUtilityClasses("");                         // false
hasUtilityClasses("   ");                      // false
```

## Result for the Script

The script receives:
```html
<!-- ✅ Will be processed -->
<div data-class="hero-title" class="text-4xl md:text-6xl lg:text-7xl">
  ↓ Generates CSS:
  .hero-title { @apply text-4xl md:text-6xl lg:text-7xl; }

<!-- ❌ Will be skipped -->
<div class="text-xl">  <!-- No data-class -->
``` 