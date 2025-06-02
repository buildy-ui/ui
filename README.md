# BuildY UI8Kit component library

A powerful **[buildy-ui](https://www.npmjs.com/package/buildy-ui) CLI** for adding UI components to your Vite React projects with [multi-registry](https://www.npmjs.com/package/ui8kit) support and intelligent dependency validation.

## Quick Start

No installation needed! Use directly with `npx` or `bun x`:

```bash
# Initialize utility registry (base requirement)
npx buildy-ui@latest init

# Initialize additional registries
npx buildy-ui@latest init --registry semantic
npx buildy-ui@latest init --registry yourtheme

# Add components from different registries
npx buildy-ui@latest add button card --registry utility
npx buildy-ui@latest add input --registry semantic
npx buildy-ui@latest add dark-theme --registry yourtheme

# Install all components from a registry
npx buildy-ui@latest add --all --registry semantic

# Build and scan registries
npx buildy-ui@latest scan --registry utility
npx buildy-ui@latest build
```

## Semantic CSS Styles via CDN only dev mode

Components installed via CLI can also use semantic styles through CDN:

```html
<!-- Add semantic CSS styles to CLI-imported components -->
<link rel="stylesheet" href="https://unpkg.com/ui8kit@1.0.1/css/dist/semantic/index.css">
<!-- OR -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/index.css">
<!-- OR -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/button.css">
```

This allows you to:
- Use CLI for component logic and structure
- Apply semantic styling via CDN without additional CSS bundling
- Mix CLI workflow with CDN styling for faster development

```jsx
// CLI-imported component with CDN styling
import { Button } from '@/semantic/ui/button'

// Component will automatically use semantic CSS classes from CDN
<Button className="button button-secondary button-lg">Styled Button</Button>
```

**Best Practice**: Install components via CLI for development workflow, add CDN CSS link for instant semantic styling without build configuration.

## CSS Integration with Tailwind for Prod

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

## Multi-Registry Architecture

The CLI supports three types of registries:

- **`utility`** - Base registry (required first). Contains foundational UI components
- **`semantic`** - Semantic components that extend utility components
- **`theme`** - Theme-specific components and variations

### Registry Dependencies

- **Utility registry** is the foundation and must be initialized first
- **Semantic and yourtheme registries** require utility registry to be present
- Components can only be installed in non-utility registries if they exist in utility first

## Commands

### Initialize project
```bash
# Initialize utility registry (required first)
npx buildy-ui@latest init

# Initialize additional registries
npx buildy-ui@latest init --registry semantic
npx buildy-ui@latest init --registry yourtheme

# Skip prompts and use defaults
npx buildy-ui@latest init --yes --registry semantic
```

Creates registry-specific configuration, directories, and dependencies.

### Add components
```bash
# Add from utility registry (default)
npx buildy-ui@latest add button card

# Add from specific registries
npx buildy-ui@latest add button --registry utility
npx buildy-ui@latest add input --registry semantic
npx buildy-ui@latest add dark-theme --registry yourtheme

# Add multiple components at once
npx buildy-ui@latest add button card hero-section --registry semantic

# Add from external URL
npx buildy-ui@latest add "https://ui.example.com/button.json"

# Install ALL available components from a registry
npx buildy-ui@latest add --all --registry utility
npx buildy-ui@latest add --all --registry semantic

# Preview what would be installed
npx buildy-ui@latest add --all --dry-run --registry semantic
npx buildy-ui@latest add button --dry-run --registry yourtheme

# Force overwrite existing files
npx buildy-ui@latest add button --force --registry semantic

# Enable retry logic for unreliable connections
npx buildy-ui@latest add button --retry --registry semantic
npx buildy-ui@latest add --all --retry --registry yourtheme
```

**Smart Features**:
- **Registry Validation**: Ensures utility registry exists before using semantic/theme
- **Component Validation**: Checks if components exist in utility before installing in other registries
- **Smart Search**: Automatically searches across all categories (`ui`, `blocks`, `components`, `lib`, `templates`)
- **Dependency Intelligence**: Handles workspace dependencies and filters real npm packages
- **Skip Existing**: Already installed files are skipped automatically (use `--force` to overwrite)
- **Retry Mode**: Use `--retry` flag for enhanced connection logic with automatic retries and timeouts
- **Graceful Fallback**: Helpful error messages with alternative solutions when registry is unavailable

### Scan existing components
```bash
# Scan utility registry
npx buildy-ui@latest scan --registry utility

# Scan semantic registry
npx buildy-ui@latest scan --registry semantic --output ./semantic/registry.json

# Scan with custom source directory
npx buildy-ui@latest scan --registry yourtheme --source ./theme --output ./theme-registry.json
```

**Scan Features**:
- **Multi-category scanning**: Scans `ui`, `components`, `blocks`, `templates`, and `lib` directories
- **Dependency analysis**: Uses TypeScript AST to extract real dependencies vs devDependencies
- **Smart filtering**: Excludes local aliases (`@/`, `./`, `~/`) and workspace dependencies
- **JSDoc extraction**: Automatically extracts component descriptions from comments

### Build registry (for library authors)
```bash
# Build with default settings
npx buildy-ui@latest build

# Build specific registry
npx buildy-ui@latest build ./utility/registry.json --output ./packages/registry/r/utility

# Build semantic registry
npx buildy-ui@latest build ./semantic/registry.json --output ./packages/registry/r/semantic

# Build from different working directory
npx buildy-ui@latest build --cwd ./packages/ui --output ./packages/registry/r
```

## Directory Structure

After initialization, your project will have registry-specific directories:

```
# Utility registry (base)
utility/
├── ui/              # UI components (@/ui)
├── blocks/          # Component blocks (@/blocks)
├── components/      # Generic components (@/components)
├── templates/       # Template components (@/templates)
└── buildy.config.json

# Semantic registry
semantic/
├── ui/              # Semantic UI components
├── blocks/          # Semantic blocks
├── components/      # Semantic components
├── templates/       # Semantic templates
└── buildy.config.json

# Theme registry
theme/
├── ui/              # Theme-specific UI
├── blocks/          # Theme blocks
├── components/      # Theme components
├── templates/       # Theme templates
└── buildy.config.json

# Shared utilities (created with utility registry)
lib/                 # Utilities (@/lib)
└── utils.ts
```

Components are automatically installed to the correct directory based on their type and registry:
- `registry:ui` → `{registry}/ui/`
- `registry:block` → `{registry}/blocks/`
- `registry:component` → `{registry}/components/`
- `registry:template` → `{registry}/templates/`
- `registry:lib` → `lib/` (always at root)

## Component Types

- `registry:ui` - Basic UI components (buttons, inputs, etc.)
- `registry:lib` - Utility libraries and functions (shared across registries)
- `registry:block` - Complex component blocks
- `registry:component` - Generic components
- `registry:template` - Template components

## Configuration

Each registry has its own `buildy.config.json` file:

### Utility Registry Config
```json
{
  "$schema": "https://buildy.tw/schema.json",
  "framework": "vite-react",
  "typescript": true,
  "aliases": {
    "@": "./src",
    "@/components": "./utility/components",
    "@/ui": "./utility/ui",
    "@/blocks": "./utility/blocks",
    "@/lib": "./lib",
    "@/utility": "./utility",
    "@/semantic": "./semantic",
    "@/theme": "./theme"
  },
  "registry": "@ui8kit",
  "componentsDir": "./utility/ui",
  "libDir": "./lib"
}
```

### Semantic Registry Config
```json
{
  "$schema": "https://buildy.tw/schema.json",
  "framework": "vite-react",
  "typescript": true,
  "aliases": {
    "@": "./src",
    "@/components": "./semantic/components",
    "@/ui": "./semantic/ui",
    "@/blocks": "./semantic/blocks",
    "@/lib": "./lib",
    "@/utility": "./utility",
    "@/semantic": "./semantic",
    "@/theme": "./theme"
  },
  "registry": "@ui8kit",
  "componentsDir": "./semantic/ui",
  "libDir": "./lib"
}
```

## Registry Validation

The CLI includes intelligent validation:

### Registry Dependency Validation
```bash
# This will fail if utility registry is not initialized
npx buildy-ui@latest init --registry semantic
# ❌ Cannot use semantic registry without utility registry. Please run: npx buildy-ui init

# This will fail if utility registry has no components
npx buildy-ui@latest add button --registry semantic
# ❌ No components found in utility registry. Please install utility components first
```

### Component Dependency Validation
```bash
# This will show available utility components and fail
npx buildy-ui@latest add card --registry semantic

# Output:
# 📦 Available utility components (3 total):
#    ui: button, input
#    lib: utils
# ❌ Components not found in utility registry: card. Install them first: npx buildy-ui add card
```

## Dependency Management

The CLI intelligently handles dependencies:

### Workspace Dependencies
```bash
# Automatically detects and handles workspace dependencies
npx buildy-ui@latest add button --registry semantic

# Output:
# ✅ Already installed: clsx, tailwind-merge
# 🔗 Workspace dependencies: react, react-dom
# 📦 Will install: lucide-react
```

### Dependency Analysis
- **Real dependencies**: Actual npm packages that need installation
- **Workspace dependencies**: Detected and skipped (e.g., `workspace:*`)
- **Local aliases**: Filtered out (`@/`, `./`, `~/`)
- **DevDependencies**: Automatically categorized (TypeScript, testing tools, etc.)

## External Component Format

```json
{
  "$schema": "https://buildy.tw/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "description": "A customizable button component",
  "dependencies": ["clsx", "tailwind-merge"],
  "devDependencies": ["@types/react"],
  "files": [
    {
      "path": "button.tsx",
      "content": "import React from 'react'...",
      "target": "ui"
    }
  ]
}
```

## Registry Building

### Input: registry.json
```json
{
  "$schema": "https://buildy.tw/schema/registry.json",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "description": "A customizable button component",
      "dependencies": ["clsx", "tailwind-merge"],
      "devDependencies": ["@types/react"],
      "files": [
        {
          "path": "./utility/ui/button.tsx",
          "target": "ui"
        }
      ]
    }
  ],
  "registry": "utility",
  "version": "1.0.0"
}
```

### Output: Built Registry
```
packages/registry/r/
├── utility/
│   ├── index.json          # Utility registry index
│   ├── ui/
│   │   └── button.json     # UI components
│   ├── lib/
│   │   └── utils.json      # Utility libraries
│   ├── blocks/
│   │   └── hero.json       # Component blocks
│   └── components/
│       └── card.json       # Generic components
├── semantic/
│   ├── index.json          # Semantic registry index
│   └── ui/
│       └── input.json      # Semantic components
└── yourtheme/
    ├── index.json          # Theme registry index
    └── ui/
        └── dark-button.json # Theme components
```

## Workflow for Library Authors

1. **Initialize registries** in your development environment
2. **Develop components** in registry-specific directories
3. **Scan registries** to generate registry.json files
4. **Build registries** to generate distribution files
5. **Deploy** the registry directories to your CDN
6. **Users install** with registry-specific commands

### Example Workflow
```bash
# Development setup
npx buildy-ui@latest init
npx buildy-ui@latest init --registry semantic
npx buildy-ui@latest init --registry yourtheme

# Develop components in utility/, semantic/, yourtheme/ directories

# Generate registry files
npx buildy-ui@latest scan --registry utility --output ./utility/registry.json
npx buildy-ui@latest scan --registry semantic --output ./semantic/registry.json
npx buildy-ui@latest scan --registry yourtheme --output ./theme/registry.json

# Build distribution
npx buildy-ui@latest build ./utility/registry.json --output ./packages/registry/r/utility
npx buildy-ui@latest build ./semantic/registry.json --output ./packages/registry/r/semantic
npx buildy-ui@latest build ./theme/registry.json --output ./packages/registry/r/theme

# Deploy packages/registry/r/ to your CDN
```

## Alternative Installation Methods

If you prefer to install the CLI:

### Global installation
```bash
npm install -g buildy-ui
# Then use: buildy init, buildy add button, etc.
```

### Local installation
```bash
npm install -D buildy-ui
# Then use: npx buildy init, npx buildy add button, etc.
```

## License

MIT