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
npm install ui8kit@latest
# or
yarn add ui8kit@latest
# or
pnpm add ui8kit@latest
# or
bun add ui8kit@latest
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

.button-secondary {
  @apply bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90;
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

### CDN Integration

For projects that prefer CDN over CLI installation:

#### Compiled Semantic Stylesheet
```html
<!-- Load compiled semantic components -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/styles.css">
<!-- OR -->
<link rel="stylesheet" href="https://unpkg.com/ui8kit@latest/css/dist/styles.css">
```

### Usage Examples

#### With CLI Installation
```jsx
// After CLI installation, components are available via aliases
import { Button } from '@/semantic/ui/button'
import { Card } from '@/semantic/ui/card'

function App() {
  return (
    <Card>
      <Button variant="secondary">Semantic Button</Button>
    </Card>
  )
}
```

#### With CDN Integration
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Load compiled semantic styles -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/styles.css">
</head>
<body>
  <!-- Use semantic classes directly -->
  <div class="card">
    <button class="button button-secondary button-lg">
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
