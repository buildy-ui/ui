# Contributing

Thanks for your interest in contributing to buildy.tw. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

## About this repository

This repository is a simple bunjs monorepo.

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

## CLI

The `buildy-ui` [package](https://www.npmjs.com/package/buildy-ui) is a CLI for adding components to your project.

Any changes to the CLI should be made in the `packages/cli` directory. If you can, it would be great if you could add tests for your changes.

## CSS Integration with Tailwind for PROD Mode

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

## CSS Styles via CDN

Components installed via CLI can also use semantic styles through CDN:

```html
<!-- Add compiled semantic CSS styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/styles.css">
<!-- OR -->
<link rel="stylesheet" href="https://unpkg.com/ui8kit@latest/css/dist/styles.css">
```

This allows you to:
- Use CLI for component logic and structure
- Apply semantic styling via CDN without additional CSS bundling
- Mix CLI workflow with CDN styling for faster development

```jsx
// CLI-imported component with CDN styling
import { Button } from '@/semantic/ui/button'

// Component will automatically use semantic CSS classes from CDN
<Button className="button button-secondary">Styled Button</Button>
```

**Best Practice**: Install components via CLI for development workflow, add CDN CSS link for instant semantic styling without build configuration.