# buildy CLI

A simple CLI for adding UI components to your Vite React projects.

## Installation

```bash
npm install -g buildy
# or
bun install -g buildy
```

## Usage

### Initialize buildy in your project

```bash
buildy init
```

This will:
- Check if you're in a Vite React project
- Create a `buildy.config.json` configuration file
- Set up component directories

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

## Component Format

External components should follow this JSON format:

```json
{
  "name": "button",
  "type": "ui",
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
  "framework": "vite-react",
  "typescript": true,
  "aliases": {
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/components/ui",
    "@/blocks": "./src/components/blocks"
  },
  "registry": "@ui8kit",
  "componentsDir": "./src/components"
}
```

## Examples

```bash
# Initialize in a new Vite project
cd my-vite-app
buildy init

# Add some components
buildy add button card input

# Add from external source
buildy add "https://ui.company.com/registry/hero-section.json"
```

## License

MIT 