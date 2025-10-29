# 🚀 Quick Reference Guide

## Configuration Changes

### Registry Type
```typescript
// ✅ Now just one registry type
SCHEMA_CONFIG.registryTypes = ["ui"]
SCHEMA_CONFIG.defaultRegistryType = "ui"
```

### Component Type Mapping
```typescript
TYPE_TO_FOLDER = {
  "registry:ui": "ui",
  "registry:block": "blocks",
  "registry:component": "components",
  "registry:layout": "layouts",  // ✅ Was: registry:template → templates
  "registry:lib": "lib",
}
```

### Default Directories
```typescript
defaultDirectories = {
  components: "./src/ui",
  lib: "./src/lib",
  layouts: "./src/layouts",      // ✅ Was: templates
  blocks: "./src/blocks",
}
```

---

## Using Configuration

```typescript
import { SCHEMA_CONFIG, TYPE_TO_FOLDER } from "../utils/schema-config.js"

// Access configuration
const registry = SCHEMA_CONFIG.defaultRegistryType  // "ui"
const folder = TYPE_TO_FOLDER["registry:layout"]     // "layouts"
const dir = SCHEMA_CONFIG.defaultDirectories.layouts // "./src/layouts"
```

---

## Using CLI Messages

```typescript
import { CLI_MESSAGES } from "../utils/cli-messages.js"

// Error messages
console.error(CLI_MESSAGES.errors.notInitialized)
console.error(CLI_MESSAGES.errors.componentNotFound("button", "ui"))

// Success messages
console.log(CLI_MESSAGES.success.initialized("ui"))

// Info messages
console.log(CLI_MESSAGES.info.initializing("ui"))

// Examples
CLI_MESSAGES.examples.add.forEach(ex => console.log(ex))

// Directories
Object.entries(CLI_MESSAGES.directories).forEach(([name, desc]) => {
  console.log(`${name}: ${desc}`)
})
```

---

## Command Usage

```bash
# Initialize project (now simpler - no registry option needed)
npx buildy-ui init
npx buildy-ui init --yes

# Add components
npx buildy-ui add button
npx buildy-ui add button card input
npx buildy-ui add --all --retry

# Scan components
npx buildy-ui scan

# Build registry
npx buildy-ui build
```

---

## File Locations

| Purpose | File |
|---------|------|
| Configuration | `src/utils/schema-config.ts` |
| Messages | `src/utils/cli-messages.ts` |
| Init Command | `src/commands/init.ts` |
| Add Command | `src/commands/add.ts` |
| Build Command | `src/commands/build.ts` |
| Scan Command | `src/commands/scan.ts` |

---

## Key Functions

### Schema Config
```typescript
getCdnUrls(registryType)           // Get CDN URLs for registry
getInstallPath(registryType, type) // Get install path
isExternalDependency(moduleName)   // Check if external dependency
getSchemaRef(schemaName)           // Get schema reference URL
```

### In Commands
```typescript
// From add.ts
processComponents()      // Process multiple components (helper)
installComponentFiles()  // Install component files
resolveInstallDir()      // Resolve target directory

// From init.ts
isViteProject()         // Check if Vite project
hasReact()              // Check if React installed
saveConfig()            // Save configuration

// From scan.ts
scanDirectory()         // Scan directory for components
analyzeComponentDependencies() // Analyze dependencies
```

---

## Common Tasks

### Add a New Configuration Value
1. Update `SCHEMA_CONFIG` in `schema-config.ts`
2. Use throughout codebase: `SCHEMA_CONFIG.newValue`

### Add a New CLI Message
1. Add to `CLI_MESSAGES` in `cli-messages.ts`
2. Use in commands: `CLI_MESSAGES.category.message`

### Add a New Registry Type
1. Update `registryTypes` in `SCHEMA_CONFIG`
2. Update `TYPE_TO_FOLDER` mapping
3. Update `componentCategories` if needed

### Add a New Command
1. Create file in `src/commands/new-command.ts`
2. Export async function: `export async function newCommand(options)`
3. Register in `src/index.ts`: `program.command("new-command")`

---

## Build & Deploy

```bash
# Build TypeScript to JavaScript
npm run build

# Type check
npm run type-check

# Link locally for testing
npm link

# Clean rebuild
rm -rf dist && npm run build
```

---

## Environment Variables

```bash
# Enable debug logging
DEBUG=1 npx buildy-ui init

# Specify working directory
CWD=/path/to/project npx buildy-ui add button

# Use custom registry
REGISTRY=ui npx buildy-ui add button
```

---

## Testing Locally

```typescript
// In any command file, add:
if (process.env.DEBUG) {
  console.log("DEBUG INFO:", value)
}

// Run with:
DEBUG=1 npx buildy-ui init
```

---

## Important Notes

✅ **Always use:**
- `SCHEMA_CONFIG` for configuration values
- `CLI_MESSAGES` for user-facing strings
- `TYPE_TO_FOLDER` for component type mapping

❌ **Never:**
- Hardcode paths or strings
- Duplicate code
- Use `any` type
- Modify `dist/` directly

---

## TypeScript Tips

```typescript
// Type-safe registry type
import { type RegistryType } from "../utils/schema-config.js"

function validate(registry: RegistryType) {
  // TypeScript ensures it's one of the valid types
}

// Accessing config values safely
const folder = TYPE_TO_FOLDER[type as keyof typeof TYPE_TO_FOLDER]
```

---

## Performance Notes

- ✅ Configuration is loaded once at startup
- ✅ Messages are static (no runtime generation)
- ✅ Type mappings use constant objects (O(1) lookup)
- ✅ No file I/O needed for configuration

---

**Last Updated**: 2025-10-29  
**Optimization Status**: ✅ Complete
