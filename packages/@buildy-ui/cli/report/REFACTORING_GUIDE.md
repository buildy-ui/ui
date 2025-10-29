# Refactoring & Developer Guide

## 🎯 Architecture Overview

The CLI has been refactored to follow these principles:

1. **Single Responsibility**: Each module has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Common logic extracted to helper functions
3. **Configuration-Driven**: All values come from `SCHEMA_CONFIG`
4. **Type-Safe**: TypeScript `as const` for compile-time checks
5. **User-Centric**: Messages centralized in `CLI_MESSAGES`

## 📂 File Structure

```
src/
├── index.ts                    # CLI entry point and command definitions
├── commands/
│   ├── add.ts                 # Add components command (REFACTORED)
│   ├── build.ts               # Build registry command (OPTIMIZED)
│   ├── init.ts                # Initialize project command (OPTIMIZED)
│   └── scan.ts                # Scan components command (OPTIMIZED)
├── registry/
│   ├── api.ts                 # Component fetching
│   ├── build-schema.ts        # Zod schemas for registry (UPDATED)
│   ├── retry-api.ts           # Retry logic for API calls
│   └── schema.ts              # Configuration schemas
└── utils/
    ├── cli-messages.ts        # ✨ NEW: Centralized CLI messages
    ├── schema-config.ts       # ✨ REFACTORED: Centralized configuration
    ├── dependency-checker.ts  # Dependency management
    ├── project.ts             # Project utilities
    ├── registry-validator.ts  # Registry validation
    └── schema-generator.ts    # JSON schema generation
```

## 🔧 Working with Configuration

### Adding a New Registry Type

1. **Update `SCHEMA_CONFIG`** in `src/utils/schema-config.ts`:

```typescript
export const SCHEMA_CONFIG = {
  // ...
  registryTypes: ["ui", "premium", "experimental"] as const,
  
  // Add folder mapping
  // ...
}

export type RegistryType = typeof SCHEMA_CONFIG.registryTypes[number]
```

2. **Update `TYPE_TO_FOLDER`** mapping:

```typescript
export const TYPE_TO_FOLDER = {
  "registry:ui": "ui",
  "registry:premium": "premium",
  "registry:experimental": "experimental",
  // ... rest of mappings
} as const
```

### Adding a New Directory Category

1. **Update `SCHEMA_CONFIG.defaultDirectories`**:

```typescript
defaultDirectories: {
  components: "./src/ui",
  lib: "./src/lib",
  layouts: "./src/layouts",
  blocks: "./src/blocks",
  "premium-ui": "./src/premium-ui",  // NEW
} as const
```

2. **Update `componentCategories`**:

```typescript
componentCategories: ["ui", "components", "layouts", "lib", "blocks", "premium-ui"] as const
```

## 💬 Working with CLI Messages

### Adding a New User Prompt

```typescript
// In src/utils/cli-messages.ts
export const CLI_MESSAGES = {
  prompts: {
    typescript: "Are you using TypeScript?",
    newFeature: "Would you like to enable this feature?",  // NEW
    // ...
  }
}

// Usage in command:
const response = await prompts({
  type: "confirm",
  name: "featureEnabled",
  message: CLI_MESSAGES.prompts.newFeature,
  initial: true
})
```

### Adding a New Error Message

```typescript
// In src/utils/cli-messages.ts
errors: {
  newError: "Something went wrong:",
  newErrorWithValue: (value: string) => `Error with ${value}`,
}

// Usage:
console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.newError}`))
```

## 🔄 Adding New Features

### Example: Add a New Command

1. **Create command file** `src/commands/export.ts`:

```typescript
import { CLI_MESSAGES } from "../utils/cli-messages.js"
import { SCHEMA_CONFIG } from "../utils/schema-config.js"

interface ExportOptions {
  format?: string
  output?: string
}

export async function exportCommand(options: ExportOptions) {
  console.log(chalk.blue(`🚀 ${CLI_MESSAGES.info.exporting}`))
  
  // Use configuration values
  const registryType = SCHEMA_CONFIG.defaultRegistryType
  
  // Implementation...
}
```

2. **Register command** in `src/index.ts`:

```typescript
program
  .command("export")
  .description("Export components to different formats")
  .option("-f, --format <type>", "Export format: json, yaml", "json")
  .option("-o, --output <path>", "Output file path")
  .action(exportCommand)
```

3. **Add messages** to `src/utils/cli-messages.ts`:

```typescript
info: {
  exporting: "Exporting components...",
}
```

## ✨ Best Practices

### ✅ DO

- Use `CLI_MESSAGES` for all user-facing strings
- Use `SCHEMA_CONFIG` for all configuration values
- Extract repeated logic to helper functions
- Use TypeScript strict mode
- Document complex functions
- Keep functions focused and small

### ❌ DON'T

- Hardcode strings or paths
- Duplicate code across files
- Use `any` type (use `unknown` instead)
- Modify `dist/` folder directly
- Use different styles across files

## 🧪 Testing Locally

### Run the CLI in development

```bash
# Build TypeScript
npm run build

# Test init command
node dist/index.js init --help
node dist/index.js init --yes

# Test add command
node dist/index.js add --help
node dist/index.js add button --dry-run

# Test scan command
node dist/index.js scan --help

# Test build command
node dist/index.js build --help
```

### Link locally for testing

```bash
cd E:\_@Bun\@BuildY\packages\@buildy-ui\cli
npm link

# Now you can use:
buildy-ui init
buildy-ui add button
```

## 📝 Code Examples

### Using Configuration in a Function

```typescript
import { SCHEMA_CONFIG, TYPE_TO_FOLDER } from "../utils/schema-config.js"

function getComponentPath(componentType: string): string {
  const folder = TYPE_TO_FOLDER[componentType as keyof typeof TYPE_TO_FOLDER]
  return folder || "components"
}

function isValidRegistry(registry: string): boolean {
  return SCHEMA_CONFIG.registryTypes.includes(registry as any)
}
```

### Using CLI Messages in Error Handling

```typescript
import { CLI_MESSAGES } from "../utils/cli-messages.js"
import chalk from "chalk"

try {
  // Some operation
} catch (error) {
  console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.buildFailed}`))
  console.error((error as Error).message)
  process.exit(1)
}
```

### Creating a Helper Function

```typescript
async function processComponents(
  componentNames: string[],
  registryType: RegistryType,
  config: Config,
  options: AddOptions
) {
  const results = []
  
  for (const name of componentNames) {
    try {
      // Process each component
      results.push({ name, status: "success" })
    } catch (error) {
      results.push({ name, status: "error" })
    }
  }
  
  return results
}
```

## 🎯 Performance Tips

1. **Lazy Load**: Only load modules when needed
2. **Cache Results**: Store API responses in memory
3. **Parallel Processing**: Process multiple components simultaneously
4. **Optimize Regex**: Use compiled regex patterns
5. **Minimize File I/O**: Batch file operations

## 🐛 Debugging

### Enable verbose logging

```typescript
// Add to your function
if (process.env.DEBUG) {
  console.log("DEBUG:", value)
}

// Run with:
DEBUG=1 npx buildy-ui init
```

### Check configuration values

```typescript
// In any command:
console.log("Current config:", SCHEMA_CONFIG)
```

## 📚 Resources

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Commander.js Docs**: https://github.com/tj/commander.js
- **Zod Schema Validation**: https://zod.dev/
- **Chalk Documentation**: https://github.com/chalk/chalk

## 🚀 Deployment

### Before publishing to NPM

1. Update `package.json` version
2. Run `npm run build`
3. Test locally with `npm link`
4. Run `npm run type-check`
5. Create changelog entry
6. Commit and push
7. Create GitHub release
8. Run `npm publish`

### After publishing

```bash
# Users can install:
npm install -g buildy-ui

# Or use directly:
npx buildy-ui init
npx buildy-ui add button
```
