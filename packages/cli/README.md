# buildy-ui CLI

A simple CLI for adding UI components to your Vite React projects and building component registries.

## Installation & Usage

### Option 1: Direct usage (recommended)
```bash
# No installation needed - use directly
bunx buildy-ui@latest init
bunx buildy-ui@latest add button card
bunx buildy-ui@latest build

# Or with npm
npx buildy-ui@latest init
npx buildy-ui@latest add button card
npx buildy-ui@latest build
```

### Option 2: Global installation
```bash
# Install globally
npm install -g buildy-ui
# or
bun install -g buildy-ui

# Then use the buildy command
buildy init
buildy add button card
buildy build
```

### Option 3: Local installation
```bash
# Install in your project
npm install -D buildy-ui
# or  
bun add -D buildy-ui

# Use with npx/bunx
npx buildy init
bunx buildy add button card
npx buildy build
```

## Quick Start

### For Component Users
```bash
# 1. Navigate to your Vite React project
cd my-vite-app

# 2. Initialize buildy (creates config and directories)
bunx buildy-ui@latest init

# 3. Add components
bunx buildy-ui@latest add button card
bunx buildy-ui@latest add "https://example.com/component.json"
```

### For Component Library Authors
```bash
# 1. Create registry.json with your components
# 2. Build the registry for distribution
bunx buildy-ui@latest build

# 3. Deploy the generated files to your CDN/website
```

## Commands

All examples below assume global installation. For direct usage, replace `buildy` with `bunx buildy-ui@latest`.

### Initialize project
```bash
buildy init

# Skip prompts and use defaults
buildy init --yes
```

This will:
- Check if you're in a Vite React project
- Create a `buildy.config.json` configuration file
- Set up component directories (`src/components/ui`, `src/components/blocks`, `src/lib`)
- Create `src/lib/utils.ts` with utility functions
- Install required dependencies (`clsx`, `tailwind-merge`)

### Add components
```bash
# Add builtin components
buildy add button card

# Add semantic components  
buildy add button card --semantic

# Add from external URL
buildy add "https://ui.example.com/button.json"

# Add from GitHub
buildy add "https://raw.githubusercontent.com/company/ui/main/registry/button.json"

# Dry run (see what would be installed)
buildy add button --dry-run

# Force overwrite existing files
buildy add button --force
```

### Build registry (for library authors)
```bash
# Build with default settings
buildy build

# Custom registry file and output directory
buildy build ./my-registry.json --output ./dist/registry

# Build from different working directory
buildy build --cwd ./packages/ui --output ./apps/web/public/r
```

This will:
- Read your `registry.json` file
- Process all component files and embed their content
- Generate organized JSON files by component type
- Create an index file for discovery
- Output to `./public/r/` by default

## Registry Structure

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
      "files": [
        {
          "path": "./src/components/ui/button.tsx",
          "target": "ui"
        }
      ]
    },
    {
      "name": "utils",
      "type": "registry:lib",
      "description": "Utility functions for styling",
      "dependencies": ["clsx", "tailwind-merge"],
      "files": [
        {
          "path": "./src/lib/utils.ts",
          "target": "lib"
        }
      ]
    }
  ]
}
```

### Output: Built Registry
```
public/r/
├── index.json          # Registry index
├── ui/
│   └── button.json     # UI components
├── lib/
│   └── utils.json      # Utility libraries
├── blocks/
│   └── hero.json       # Component blocks
└── components/
    └── card.json       # Generic components
```

### Supported Component Types
- `registry:ui` - Basic UI components (buttons, inputs, etc.)
- `registry:lib` - Utility libraries and functions
- `registry:block` - Complex component blocks
- `registry:component` - Generic components

## Component Format

External components should follow this JSON format:

```json
{
  "$schema": "https://buildy.tw/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "description": "A customizable button component",
  "dependencies": ["clsx", "tailwind-merge"],
  "devDependencies": [],
  "files": [
    {
      "path": "button.tsx",
      "content": "import React from 'react'...",
      "target": "ui"
    }
  ]
}
```

## Configuration

The `buildy.config.json` file in your project root:

```json
{
  "$schema": "https://buildy.tw/schema.json",
  "framework": "vite-react",
  "typescript": true,
  "aliases": {
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/components/ui",
    "@/blocks": "./src/components/blocks",
    "@/lib": "./src/lib"
  },
  "registry": "@ui8kit",
  "componentsDir": "./src/components",
  "libDir": "./src/lib"
}
```

The `$schema` property enables:
- ✅ **IntelliSense** in VS Code and other editors
- ✅ **Validation** of configuration values
- ✅ **Auto-completion** for properties
- ✅ **Hover documentation** for each field

## Examples

### Using Components
```bash
# Initialize in a new Vite project
cd my-vite-app
buildy init

# Add some components
buildy add button card input

# Add from external source
buildy add "https://ui.company.com/registry/ui/hero-section.json"
```

### Building Component Library
```bash
# In your component library project
cd my-ui-library

# Create registry.json with your components
# Build the registry
buildy build

# Deploy public/r/ to your CDN
# Now users can install with:
# buildy add "https://your-cdn.com/r/ui/button.json"
```

## Workflow for Library Authors

1. **Develop components** in your preferred structure
2. **Create registry.json** describing your components
3. **Run `buildy build`** to generate distribution files
4. **Deploy** the `public/r/` directory to your website/CDN
5. **Users install** with `buildy add "https://your-site.com/r/ui/component.json"`

## License

MIT