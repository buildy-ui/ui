# Technical Specification: UI Component Library Enhancement System

## Project Overview

**Library**: `@ui8kit/core`  
**Target**: Decompose complex JSX blocks into semantic Mantine-inspired components with Tailwind CSS and data-slot architecture

## Project Structure

```
packages/@ui8kit/core/src/
├── core/           # Logic and utilities (@/core)
└── utility/        # UI components (@/utility)
    ├── components/ # Layout and semantic components  
    └── ui/         # Basic UI elements

blocks/             # Final reconstructed blocks
```

## Core Architecture Principles

### 1. **Data-Slot System with Automatic Processing**
- Every component uses `data-slot="component-name"` for base styles
- **CRITICAL**: Components are written ONLY with Tailwind utility classes
- Scripts automatically detect `data-slot` attributes and generate:
  - Semantic copies with class names like `button button-primary button-sm`
  - CSS files with `@apply` directives
  - Two output modes: utility-first and semantic
- No manual semantic class writing required

### 2. **Mantine-Inspired Component Design**
- Universal, context-independent component names (Title, not HeroTitle)
- Polymorphic components with `component` prop (Box can be div, section, article)
- Comprehensive props system:
  - Spacing: `m`, `mt`, `mb`, `mx`, `my`, `p`, `pt`, `pb`, `px`, `py`
  - Colors: `c`, `bg` 
  - Typography: `size`, `fw`, `ta`, `lh`
  - Layout: `pos`, `w`, `h`, `maw`, `mah`
  - Responsive objects: `{ base: 'sm', md: 'lg' }`
- Composition over inheritance with compound components (Card.Header, Card.Content)

### 3. **Tailwind CSS Integration Requirements**
- **MANDATORY**: All Tailwind classes written as single strings without line breaks
- **MANDATORY**: No arrays or template literals in `cn()` calls
- **MANDATORY**: Use ONLY shadcn-approved color names in all color-related classes
- CVA variants use complete Tailwind class strings
- All styling through utility classes - semantic generation is automatic

### 4. **Shadcn Color System Requirements**
- **ONLY** use shadcn semantic color names: `primary`, `secondary`, `destructive`, `muted`, `accent`, `card`, `popover`, `border`, `input`, `ring`
- **ALWAYS** use foreground pairs: `primary-foreground`, `secondary-foreground`, `destructive-foreground`, `muted-foreground`, `accent-foreground`, `card-foreground`, `popover-foreground`
- **NEVER** use arbitrary color values like `blue-500`, `red-600`, `gray-100` etc.
- Color tokens can be extended by user through shadcn design token files
- For custom colors, they must be added to the shadcn token system first

**✅ Correct shadcn colors:**
```typescript
variants: {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    muted: "bg-muted text-muted-foreground hover:bg-muted/80",
    accent: "bg-accent text-accent-foreground hover:bg-accent/80"
  }
}
```

**❌ Incorrect arbitrary colors:**
```typescript
variants: {
  variant: {
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    red: "bg-red-500 text-white hover:bg-red-600", 
    gray: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  }
}
```

**✅ Correct:**
```typescript
variants: {
  variant: {
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }
}
className={cn("flex h-10 w-full rounded-md border border-input bg-background", className)}
```

**❌ Incorrect:**
```typescript
variants: {
  variant: {
    secondary: `
      border-transparent 
      bg-secondary 
      text-secondary-foreground
      hover:bg-secondary/80
    `
  }
}
className={cn([
  "flex h-10 w-full rounded-md",
  "border border-input bg-background"
], className)}
```

## Analysis Algorithm

### Phase 1: Structural Analysis (Priority Weighting)

#### 1.1 **Analysis Priorities**
```typescript
1. Layout structure (30%) - основная композиция
2. Content semantics (25%) - семантические элементы  
3. Interactive elements (20%) - кнопки, формы, ссылки
4. Visual decorations (15%) - украшения, эффекты
5. Responsive behavior (10%) - адаптивность
```

#### 1.2 **Layout Detection**
```typescript
// Transform patterns:
div with flex → Stack, Group, Flex components
div with grid → Grid, SimpleGrid components
div with max-width → Container component
section/article → Box component="section|article"
div with absolute positioning → Box with pos props
div with centering → Center or Container component
```

#### 1.3 **Semantic Element Detection**
```typescript
// Direct mapping rules:
h1-h6 → Title component with order prop
p → Text component
ul/ol/li → List components  
img → Image or BackgroundImage components
button/a → Button, Anchor components
input/select/textarea → TextInput, Select, Textarea components
```

#### 1.4 **Variant Extraction from Tailwind Classes**
```typescript
// Extract and group classes:
text-sm/md/lg/xl → size variants
bg-primary/secondary/destructive/muted/accent → shadcn color variants  
hover:*, focus:*, active:* → state modifiers
sm:*, md:*, lg:* → responsive props objects
p-*, m-*, gap-* → spacing props
font-*, leading-*, tracking-* → typography props

// IMPORTANT: Only use shadcn semantic colors:
✅ bg-primary, text-primary-foreground, border-input, bg-muted
❌ bg-blue-500, text-red-600, border-gray-200
```

### Phase 2: Complex Decoration Handling

#### 2.1 **Decorative Elements Processing**
```typescript
// Handle complex patterns:
1. Gradients → extract to separate BackgroundImage component
2. Overlays (bg-black/50) → Overlay component with opacity
3. Pseudo-elements → convert to real Box elements
4. Complex shadows/borders → preserve in variant styles
5. Blur effects → maintain as style props
6. Animations/transitions → preserve as Tailwind classes
7. Multiple nested decorative divs → consolidate into single components
```

#### 2.2 **Edge Cases Resolution**
```typescript
// When encountering:
1. Many nested divs → analyze purpose, group decorative layers
2. Complex positioning → use Box with position props
3. Custom CSS properties → preserve in styles prop
4. Non-standard patterns → document and create specialized variants
5. Mixed semantic/decorative elements → separate concerns
```

## Required Base Components

### **Always Ensure These Exist:**
```typescript
- Box (universal polymorphic container)
- Container (constrained width container)  
- Stack (vertical layout)
- Group (horizontal layout)
- Flex (flexible layout)
- Grid (grid layout)
- Title (headings h1-h6)
- Text (text content)
- Button (interactive elements)
- Image (media content)
- BackgroundImage (background images)
- Overlay (overlay layers)
- Badge (status indicators)
```

## Component Implementation Template

### **Standard Component Structure**
```typescript
import { cva } from "class-variance-authority";
import { cn } from "@/core/utils";

const componentVariants = cva(
  // Base classes - will be extracted to [data-slot="component"] in CSS
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
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
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function Component({ 
  component = "button",
  variant,
  size, 
  className,
  ...props 
}: ComponentProps) {
  const Comp = component;
  
  return (
    <Comp
      data-slot="component"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Transformation Rules

### **Element Mapping**
```typescript
// Original → New Component
<div className="max-w-4xl mx-auto"> → <Container size="lg">
<h1 className="text-4xl font-bold"> → <Title order={1} size="2xl" fw="bold">
<p className="text-lg text-gray-600"> → <Text size="lg" c="gray.6">
<div className="flex gap-4"> → <Group gap="md">
<div className="space-y-6"> → <Stack gap="lg">
<div className="grid grid-cols-3"> → <Grid cols={3}>
<section className="..."> → <Box component="section" ...>
```

### **Props Transformation**
```typescript
// Tailwind → Mantine Props
className="text-center" → ta="center"
className="font-bold" → fw="bold"  
className="text-primary-foreground" → c="primary.foreground"
className="bg-primary" → bg="primary"
className="text-muted-foreground" → c="muted.foreground"
className="max-w-lg" → maw="lg"
className="h-screen" → h="100vh"
className="relative" → pos="relative"

// ALWAYS use shadcn colors in transformations:
✅ text-primary-foreground, bg-secondary, border-input
❌ text-white, bg-blue-500, border-gray-300
```

## Automatic Processing Benefits

The automated script system provides:
1. **Development**: Write only utility classes
2. **Production**: Get semantic classes automatically  
3. **Flexibility**: Switch between modes without code changes
4. **Consistency**: Standardized component patterns
5. **Maintenance**: Single source of truth for styling

## Shadcn Design Token Integration

### **Token File Support**
- User can attach shadcn design token files to extend color palette
- All custom colors must be added through proper shadcn token structure
- Maintains design system consistency across the entire component library
- Automatic validation against shadcn color standards

### **Extending Color Palette**
```typescript
// User can provide custom shadcn tokens file:
// tokens.json or globals.css with custom CSS variables
:root {
  --custom: 210 40% 50%;
  --custom-foreground: 222.2 84% 4.9%;
  --brand: 221.2 83.2% 53.3%;
  --brand-foreground: 210 40% 98%;
}

// Then use in components:
variants: {
  variant: {
    custom: "bg-custom text-custom-foreground hover:bg-custom/90",
    brand: "bg-brand text-brand-foreground hover:bg-brand/90"
  }
}
```

## Deliverables

### 1. **Updated Components** (`@/utility`)
- New components with complete Tailwind utility classes
- CVA variants using single-string Tailwind classes
- Proper TypeScript interfaces with Mantine-style props
- `data-slot` attributes for automatic processing

### 2. **Reconstructed Block** (`@/blocks`)
- Clean Mantine-style component composition
- Identical visual output to original
- Preserved functionality and interactions
- Optimized semantic structure

### 3. **Documentation**
- Component API with props reference
- Complex pattern solutions
- Edge case handling notes

## Quality Checklist

- [ ] All components use `data-slot` attributes
- [ ] All Tailwind classes are single strings without line breaks
- [ ] CVA variants use complete Tailwind class strings  
- [ ] Components follow Mantine naming conventions (universal, not context-specific)
- [ ] Polymorphic components support `component` prop
- [ ] Responsive props use object notation `{ base: 'sm', md: 'lg' }`
- [ ] TypeScript interfaces include Mantine-style props (spacing, colors, etc.)
- [ ] Original functionality is preserved
- [ ] Visual output is identical
- [ ] Complex decorations are properly decomposed
- [ ] Edge cases are documented

## Example Workflow

1. **Analyze** complex JSX block using priority weighting
2. **Identify** layout patterns and semantic elements
3. **Extract** decorations and styling variants
4. **Map** to universal Mantine-style components
5. **Create/Update** components in `@/utility` with Tailwind classes
6. **Reconstruct** block using new component composition
7. **Verify** visual and functional equivalence
8. **Document** any complex patterns or decisions

This system ensures consistent, maintainable, and scalable UI component development while leveraging automatic script processing for dual-mode output.