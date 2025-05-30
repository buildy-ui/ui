# buildy-ui CLI

A simple CLI for adding UI components to your Vite React projects and building component registries.

## Quick Start

No installation needed! Use directly with `npx` or `bun x`:

```bash
# Initialize in your Vite React project
npx buildy-ui@latest init

# Add components (smart search across all categories)
npx buildy-ui@latest add button card hero-section
npx buildy-ui@latest add "https://example.com/component.json"

# Install all available components
npx buildy-ui@latest add --all

# Build registry (for library authors)
npx buildy-ui@latest build
```

## Commands

### Initialize project
```bash
npx buildy-ui@latest init

# Skip prompts and use defaults
npx buildy-ui@latest init --yes
```

Creates configuration, directories, and installs dependencies.

### Add components
```bash
# Smart search - automatically finds components in any category
npx buildy-ui@latest add button          # Found in ui/
npx buildy-ui@latest add hero-section    # Found in blocks/
npx buildy-ui@latest add utils           # Found in lib/

# Add multiple components at once
npx buildy-ui@latest add button card hero-section

# Add from external URL
npx buildy-ui@latest add "https://ui.example.com/button.json"

# Install ALL available components
npx buildy-ui@latest add --all
npx buildy-ui@latest add all

# Preview what would be installed
npx buildy-ui@latest add --all --dry-run
npx buildy-ui@latest add button --dry-run

# Force overwrite existing files
npx buildy-ui@latest add button --force

# Enable retry logic for unreliable connections
npx buildy-ui@latest add button --retry
npx buildy-ui@latest add --all --retry
```

**Smart Features**:
- **Smart Search**: Automatically searches across all categories (`ui`, `blocks`, `components`, `lib`)
- **Skip Existing**: Already installed files are skipped automatically (use `--force` to overwrite)
- **Retry Mode**: Use `--retry` flag for enhanced connection logic with automatic retries and timeouts
- **Graceful Fallback**: Helpful error messages with alternative solutions when registry is unavailable

### Build registry (for library authors)
```bash
# Build with default settings
npx buildy-ui@latest build

# Custom registry file and output directory
npx buildy-ui@latest build ./my-registry.json --output ./dist/registry

# Build from different working directory
npx buildy-ui@latest build --cwd ./packages/ui --output ./apps/web/public/r
```

## Directory Structure

After initialization, your project will have:

```
src/
├── ui/              # UI components (@/ui)
├── blocks/          # Component blocks (@/blocks)
├── components/      # Generic components (@/components)
└── lib/             # Utilities (@/lib)
```

Components are automatically installed to the correct directory based on their type:
- `registry:ui` → `src/ui/`
- `registry:block` → `src/blocks/`
- `registry:lib` → `src/lib/`
- `registry:component` → `src/components/`

## Component Types

- `registry:ui` - Basic UI components (buttons, inputs, etc.)
- `registry:lib` - Utility libraries and functions
- `registry:block` - Complex component blocks
- `registry:component` - Generic components

## Configuration

The `buildy.config.json` file provides IntelliSense and validation:

```json
{
  "$schema": "https://buildy.tw/schema.json",
  "framework": "vite-react",
  "typescript": true,
  "aliases": {
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/ui",
    "@/blocks": "./src/blocks",
    "@/lib": "./src/lib"
  },
  "registry": "@ui8kit",
  "componentsDir": "./src/components",
  "libDir": "./src/lib"
}
```

## External Component Format

```json
{
  "$schema": "https://buildy.tw/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "description": "A customizable button component",
  "dependencies": ["clsx", "tailwind-merge"],
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
      "files": [
        {
          "path": "./src/ui/button.tsx",
          "target": "ui"
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

## Workflow for Library Authors

1. **Develop components** in your preferred structure
2. **Create registry.json** describing your components
3. **Run `npx buildy-ui@latest build`** to generate distribution files
4. **Deploy** the `public/r/` directory to your website/CDN
5. **Users install** with `npx buildy-ui@latest add "https://your-site.com/r/ui/component.json"`

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