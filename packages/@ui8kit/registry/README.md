# BuildY/UI React components

## Quick Start

No installation needed! Use directly with `npx` or `bunx` or `bun x`:

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
