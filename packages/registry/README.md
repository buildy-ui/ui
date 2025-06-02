## Semantic Components Integration Guide

### CLI Installation (Recommended)

The semantic registry extends utility components with enhanced styling and behavior. Follow these steps:

#### 1. Initialize Base Registry (Required)
```bash
# Initialize utility registry first (foundation requirement)
npx buildy-ui@latest init
```

#### 2. Initialize Semantic Registry
```bash
# Initialize semantic registry
npx buildy-ui@latest init --registry semantic

# Skip prompts and use defaults
npx buildy-ui@latest init --yes --registry semantic
```

#### 3. Add Semantic Components
```bash
# Add specific semantic components
npx buildy-ui@latest add button card --registry semantic
npx buildy-ui@latest add input --registry semantic

# Install ALL semantic components at once
npx buildy-ui@latest add --all --registry semantic

# Preview what would be installed
npx buildy-ui@latest add --all --dry-run --registry semantic

# Force overwrite existing files
npx buildy-ui@latest add button --force --registry semantic
```

#### Project Structure After Installation
```
semantic/
├── ui/              # Semantic UI components
├── blocks/          # Semantic blocks
├── components/      # Semantic components
├── templates/       # Semantic templates
└── buildy.config.json

utility/             # Base registry (required)
├── ui/
├── blocks/
└── buildy.config.json

lib/                 # Shared utilities
└── utils.ts
```

## CSS Integration with Tailwind (PROD Mode)

### Package Installation (Recommended for Tailwind projects)

Since semantic CSS files contain Tailwind directives (`@apply`), they must be processed during build time:

```bash
# Install the CSS package
npm install ui8kit
# or
yarn add ui8kit
# or
pnpm add ui8kit
```

### Import in your CSS/SCSS files

```css
/* Import all semantic styles */
@import "ui8kit/css/dist/semantic/index.css";

/* Or import individual components */
@import "ui8kit/css/dist/semantic/button.css";
@import "ui8kit/css/dist/semantic/card.css";
@import "ui8kit/css/dist/semantic/input.css";
```

### Why Package Installation is Required

Semantic CSS files contain Tailwind directives that need compilation:

```css
/* Example from button.css */
.button-default {
  @apply bg-primary text-primary-foreground shadow-xs hover:bg-primary/90;
}

.button-destructive {
  @apply bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90;
}
```

### CDN vs Package Comparison

| Method | Use Case | Tailwind Directives | Build Required |
|--------|----------|-------------------|----------------|
| **Package** | Production projects | ✅ Supported | ✅ Required |
| **CDN** | Quick prototyping | ❌ Pre-compiled only | ❌ Not required |

### Integration with Tailwind Config

Add the package path to your `tailwind.config.js` for proper purging:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/ui8kit/**/*.{js,ts,jsx,tsx}", // Add this line
  ],
  // ... rest of your config
}
```

**Note**: CDN links with `@import` URLs will remain as external references and won't be processed by Tailwind's build system.

### CDN Integration (only DEV Mode)

For projects that prefer CDN over CLI installation:

#### Full Semantic Stylesheet
```html
<!-- Load complete semantic components -->
<link rel="stylesheet" href="https://unpkg.com/ui8kit@1.0.1/css/dist/semantic/index.css">
<!-- OR -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/index.css">
```

#### Individual Component Stylesheets
```html
<!-- Load only specific components you need -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/button.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/card.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/input.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/alert.css">
```

#### Available Individual Components
- `button.css` - Enhanced button styles
- `card.css` - Card component layouts
- `input.css` - Form input styling
- `alert.css` - Alert and notification styles
- `badge.css` - Badge and label components
- `avatar.css` - User avatar components
- `table.css` - Data table styling
- `pagination.css` - Navigation pagination
- `breadcrumb.css` - Navigation breadcrumbs
- `skeleton.css` - Loading skeleton states

### Usage Examples

#### With CLI Installation
```jsx
// After CLI installation, components are available via aliases
import { Button } from '@/semantic/ui/button'
import { Card } from '@/semantic/ui/card'

function App() {
  return (
    <Card>
      <Button variant="semantic">Semantic Button</Button>
    </Card>
  )
}
```

#### With CDN Integration
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Load semantic styles -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/index.css">
</head>
<body>
  <!-- Use semantic classes directly -->
  <div class="semantic-card">
    <button class="semantic-btn semantic-btn-primary">
      Semantic Button
    </button>
  </div>
</body>
</html>
```

### Registry Dependencies

**Important**: Semantic registry requires utility registry as foundation:
- ✅ Utility registry must be initialized first
- ✅ Components must exist in utility before installing in semantic
- ❌ Cannot use semantic registry without utility base

### Performance Considerations

**CLI Method**:
- ✅ Tree-shaking friendly
- ✅ Only includes used components
- ✅ TypeScript support
- ✅ Local development workflow

**CDN Method**:
- ✅ No build step required
- ✅ Instant integration
- ✅ Cacheable across projects
- ⚠️ Individual files = multiple HTTP requests
- ⚠️ Full bundle may include unused styles

Choose CLI for development projects, CDN for quick prototyping or static sites.
