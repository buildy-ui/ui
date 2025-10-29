# buildy-ui CLI

A powerful CLI for adding UI components to your Vite React projects with intelligent dependency validation and simplified registry management.

## Quick Start

No installation needed! Use directly with `npx` or `bun x`:

```bash
# Initialize project (uses 'ui' registry by default)
npx buildy-ui@latest init

# Add components from the registry
npx buildy-ui@latest add button card

# Install all available components
npx buildy-ui@latest add --all

# Build and scan registries
npx buildy-ui@latest scan
npx buildy-ui@latest build
```

## Registry

The CLI uses a unified **`ui`** registry:

- **`ui`** - All UI components and utilities

Simple and streamlined for better developer experience.

## Commands

### Initialize project
```bash
# Initialize with defaults (uses 'ui' registry)
npx buildy-ui@latest init

# Skip prompts and use defaults
npx buildy-ui@latest init --yes
```

Creates project configuration, `src/` directories, and dependencies.

### Add components
```bash
# Add from registry
npx buildy-ui@latest add button card

# Add multiple components at once
npx buildy-ui@latest add button card hero-section

# Add from external URL
npx buildy-ui@latest add "https://ui.example.com/button.json"

# Install ALL available components
npx buildy-ui@latest add --all

# Preview what would be installed
npx buildy-ui@latest add button --dry-run
npx buildy-ui@latest add --all --dry-run

# Force overwrite existing files
npx buildy-ui@latest add button --force

# Enable retry logic for unreliable connections
npx buildy-ui@latest add button --retry
npx buildy-ui@latest add --all --retry
```

**Smart Features**:
- **Simplified registry**: Single `ui` registry for all components
- **Smart Search**: Automatically searches across all categories (`ui`, `blocks`, `components`, `lib`, `layouts`)
- **Dependency Intelligence**: Handles workspace dependencies and filters real npm packages
- **Skip Existing**: Already installed files are skipped automatically (use `--force` to overwrite)
- **Retry Mode**: Use `--retry` flag for enhanced connection logic with automatic retries and timeouts
- **Graceful Fallback**: Helpful error messages with alternative solutions when registry is unavailable

### Scan existing components
```bash
# Scan components
npx buildy-ui@latest scan

# Scan with custom output
npx buildy-ui@latest scan --output ./registry.json

# Scan with custom source directory
npx buildy-ui@latest scan --source ./src --output ./src/registry.json
```

**Scan Features**:
- **Multi-category scanning**: Scans `ui`, `components`, `blocks`, `layouts`, and `lib` directories
- **Dependency analysis**: Uses TypeScript AST to extract real dependencies vs devDependencies
- **Smart filtering**: Excludes local aliases (`@/`, `./`, `~/`) and workspace dependencies
- **JSDoc extraction**: Automatically extracts component descriptions from comments

### Build registry (for library authors)
```bash
# Build with default settings
npx buildy-ui@latest build

# Build specific registry file
npx buildy-ui@latest build ./src/registry.json --output ./packages/registry/r/ui

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
├── layouts/         # Layout components (@/layouts)
└── lib/             # Utilities (@/lib)
```

Components are automatically installed to the correct directory based on their type:
- `registry:ui` → `src/ui/`
- `registry:block` → `src/blocks/`
- `registry:component` → `src/components/`
- `registry:layout` → `src/layouts/`
- `registry:lib` → `src/lib/`

## Component Types

- `registry:ui` - Basic UI components (buttons, inputs, etc.)
- `registry:lib` - Utility libraries and functions
- `registry:block` - Complex component blocks
- `registry:component` - Generic components
- `registry:layout` - Layout and page template components

## Configuration

Each project can have a `buildy.config.json` file at the project root:

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
    "@/layouts": "./src/layouts",
    "@/lib": "./src/lib"
  },
  "registry": "@ui8kit",
  "componentsDir": "./src/ui",
  "libDir": "./src/lib"
}
```

## Dependency Management

The CLI intelligently handles dependencies:

### Workspace Dependencies
```bash
# Automatically detects and handles workspace dependencies
npx buildy-ui@latest add button

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
  "registry": "ui",
  "version": "1.0.0"
}
```

### Output: Built Registry
```
packages/registry/r/
├── ui/
│   ├── index.json          # Registry index
│   ├── ui/
│   │   └── button.json     # UI components
│   ├── lib/
│   │   └── utils.json      # Utility libraries
│   ├── blocks/
│   │   └── hero.json       # Component blocks
│   ├── layouts/
│   │   └── page.json       # Layout components
│   └── components/
│       └── card.json       # Generic components
```

## Workflow for Library Authors

1. **Initialize** your project
2. **Develop components** in registry-specific directories
3. **Scan registries** to generate registry.json files
4. **Build registries** to generate distribution files
5. **Deploy** the registry directories to your CDN
6. **Users install** with simplified commands

### Example Workflow
```bash
# Development setup
npx buildy-ui@latest init

# Develop components in src/ directories

# Generate registry files
npx buildy-ui@latest scan --output ./src/registry.json

# Build distribution
npx buildy-ui@latest build ./src/registry.json --output ./packages/registry/r/ui

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