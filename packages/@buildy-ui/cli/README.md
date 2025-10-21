# buildy-ui CLI

A powerful CLI for adding UI components to your Vite React projects with simplified package-based registries (`core`, `form`) and intelligent dependency validation.

## Quick Start

No installation needed! Use directly with `npx` or `bun x`:

```bash
# Initialize project (defaults to core)
npx buildy-ui@latest init --registry core

# Initialize form registry
npx buildy-ui@latest init --registry form

# Add components from different registries
npx buildy-ui@latest add button card --registry core
npx buildy-ui@latest add input --registry form

# Install all components from a registry
npx buildy-ui@latest add --all --registry core

# Build and scan registries
npx buildy-ui@latest scan --registry core
npx buildy-ui@latest build
```

## Package Registries

The CLI supports two package registries:

- **`core`** - Base UI components (`@ui8kit/core`)
- **`form`** - Form components (`@ui8kit/form`)

## Commands

### Initialize project
```bash
# Initialize core registry
npx buildy-ui@latest init --registry core

# Initialize form registry
npx buildy-ui@latest init --registry form

# Skip prompts and use defaults
npx buildy-ui@latest init --yes --registry core
```

Creates project configuration, `src/` directories, and dependencies.

### Add components
```bash
# Add from core registry (default)
npx buildy-ui@latest add button card --registry core

# Add from form registry
npx buildy-ui@latest add input --registry form

# Add multiple components at once
npx buildy-ui@latest add button card hero-section --registry core

# Add from external URL
npx buildy-ui@latest add "https://ui.example.com/button.json"

# Install ALL available components from a registry
npx buildy-ui@latest add --all --registry core
npx buildy-ui@latest add --all --registry form

# Preview what would be installed
npx buildy-ui@latest add --all --dry-run --registry core
npx buildy-ui@latest add button --dry-run --registry form

# Force overwrite existing files
npx buildy-ui@latest add button --force --registry core

# Enable retry logic for unreliable connections
npx buildy-ui@latest add button --retry --registry core
npx buildy-ui@latest add --all --retry --registry form
```

**Smart Features**:
- **Simplified registries**: `core` and `form` with no prerequisite ordering
- **Smart Search**: Automatically searches across all categories (`ui`, `blocks`, `components`, `lib`, `templates`)
- **Dependency Intelligence**: Handles workspace dependencies and filters real npm packages
- **Skip Existing**: Already installed files are skipped automatically (use `--force` to overwrite)
- **Retry Mode**: Use `--retry` flag for enhanced connection logic with automatic retries and timeouts
- **Graceful Fallback**: Helpful error messages with alternative solutions when registry is unavailable

### Scan existing components
```bash
# Scan core registry
npx buildy-ui@latest scan --registry core

# Scan form registry
npx buildy-ui@latest scan --registry form --output ./form/registry.json

# Scan with custom source directory
npx buildy-ui@latest scan --registry core --source ./src --output ./src/registry.json
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
npx buildy-ui@latest build ./src/registry.json --output ./packages/registry/r/core

# Build from different working directory
npx buildy-ui@latest build --cwd ./packages/ui --output ./packages/registry/r
```

## Directory Structure

After initialization, your project will have `src/` directories:

```
src/
├── ui/              # UI components (@/ui)
├── blocks/          # Component blocks (@/blocks)
├── components/      # Generic components (@/components)
├── templates/       # Template components (@/templates)
└── lib/             # Utilities (@/lib)
```

Components are automatically installed to the correct directory based on their type:
- `registry:ui` → `src/ui/`
- `registry:block` → `src/blocks/`
- `registry:component` → `src/components/`
- `registry:template` → `src/templates/`
- `registry:lib` → `src/lib/`

## Component Types

- `registry:ui` - Basic UI components (buttons, inputs, etc.)
- `registry:lib` - Utility libraries and functions (shared across registries)
- `registry:block` - Complex component blocks
- `registry:component` - Generic components
- `registry:template` - Template components

## Configuration

Each registry can have its own `buildy.config.json` file (at project root or under `./core` or `./form`):

### Example Config
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
  "componentsDir": "./src/ui",
  "libDir": "./src/lib"
}
```

## Validation

Validation is simplified; there is no dependency between registries. Component dependency checks focus on external npm packages only.

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
          "path": "./src/ui/button.tsx",
          "target": "ui"
        }
      ]
    }
  ],
  "registry": "core",
  "version": "1.0.0"
}
```

### Output: Built Registry
```
packages/registry/r/
├── core/
│   ├── index.json          # Registry index
│   ├── ui/
│   │   └── button.json     # UI components
│   ├── lib/
│   │   └── utils.json      # Utility libraries
│   ├── blocks/
│   │   └── hero.json       # Component blocks
│   └── components/
│       └── card.json       # Generic components
```

## Workflow for Library Authors

1. **Initialize** your project
2. **Develop components** in registry-specific directories
3. **Scan registries** to generate registry.json files
4. **Build registries** to generate distribution files
5. **Deploy** the registry directories to your CDN
6. **Users install** with registry-specific commands

### Example Workflow
```bash
# Development setup
npx buildy-ui@latest init --registry core
npx buildy-ui@latest init --registry form

# Develop components in src/ directories

# Generate registry files
npx buildy-ui@latest scan --registry core --output ./src/registry.json
npx buildy-ui@latest scan --registry form --output ./form/registry.json

# Build distribution
npx buildy-ui@latest build ./src/registry.json --output ./packages/registry/r/core

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