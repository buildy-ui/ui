// Configuration for schema generation
// Centralized configuration file with all constants and defaults

export const SCHEMA_CONFIG = {
  // Base schema information
  schemaVersion: "http://json-schema.org/draft-07/schema#",
  baseUrl: "https://buildy.tw/schema",
  
  // Framework configuration
  supportedFrameworks: ["vite-react"] as const,
  
  // Default aliases for path mapping
  defaultAliases: {
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/ui",
    "@/layouts": "./src/layouts",
    "@/lib": "./src/lib"
  },
  
  // Registry configuration
  defaultRegistry: "@ui8kit",
  registryTypes: ["ui"] as const,

  // Default registry type
  defaultRegistryType: "ui" as const,
  
  // CDN base URLs (registryName will be substituted)
  cdnBaseUrls: [
    "https://cdn.jsdelivr.net/npm/@ui8kit/registry@latest/r",
    "https://unpkg.com/@ui8kit/registry@latest/r", 
    "https://raw.githubusercontent.com/buildy-ui/ui/main/packages/@ui8kit/registry/r"
  ] as const,
  
  // Component categories
  componentCategories: ["ui", "components", "layouts", "lib", "blocks"] as const,
  
  // Component types (should match registryItemTypeSchema)
  componentTypes: [
    "registry:lib",
    "registry:block", 
    "registry:component",
    "registry:ui",
    "registry:layout"
  ] as const,
  
  // Default directories structure
  defaultDirectories: {
    components: "./src/ui",
    lib: "./src/lib",
    layouts: "./src/layouts",
    blocks: "./src/blocks",
  } as const,
  
  // Schema descriptions and titles
  descriptions: {
    config: {
      title: "Buildy Configuration",
      description: "Configuration file for buildy CLI (UI8Kit structure)",
    },
    registry: {
      title: "Buildy Registry",
      description: "Registry schema for UI8Kit component system",
    },
    registryItem: {
      title: "Buildy Registry Item",
      description: "Schema for individual registry items in the UI8Kit component system",
    }
  } as const,
  
  // Field descriptions
  fieldDescriptions: {
    schema: "JSON Schema URL",
    framework: "Target framework",
    typescript: "Whether the project uses TypeScript",
    aliases: "Path aliases for imports in UI8Kit structure",
    registry: "Default component registry",
    componentsDir: "Directory where utility components will be installed",
    libDir: "Directory for utility libraries",
    registryName: "Registry name",
    registryHomepage: "Registry homepage URL",
    registryType: "Registry type (e.g., ui)",
    registryVersion: "Registry version",
    lastUpdated: "Last update timestamp",
    categories: "Available component categories",
    components: "Component metadata for quick lookup",
    items: "Full component definitions",
  } as const
} as const

export type RegistryType = typeof SCHEMA_CONFIG.registryTypes[number]

// Map component types to their corresponding folders
export const TYPE_TO_FOLDER = {
  "registry:ui": "ui",
  "registry:block": "blocks", 
  "registry:component": "components",
  "registry:lib": "lib",
  "registry:layout": "layouts"
} as const

// Helper functions to generate URLs dynamically
export function getCdnUrls(registryType: RegistryType): string[] {
  return SCHEMA_CONFIG.cdnBaseUrls.map(baseUrl => `${baseUrl}/${registryType}`)
}

export function getInstallPath(registryType: RegistryType, componentType: string): string {
  // Deprecated: install path should be resolved via project config. This remains only for backward compatibility.
  const folder = TYPE_TO_FOLDER[componentType as keyof typeof TYPE_TO_FOLDER]
  if (componentType === "registry:lib") {
    return SCHEMA_CONFIG.defaultDirectories.lib
  }
  return `src/${folder}`
}

// Helper function to filter real npm dependencies (exclude local aliases and paths)
export function filterRealDependencies(dependencies: string[]): string[] {
  return dependencies.filter(dep => {
    // Skip local aliases that start with @/ or ./
    if (dep.startsWith('@/') || dep.startsWith('./') || dep.startsWith('../')) {
      return false
    }
    
    // Skip tilde aliases
    if (dep.startsWith('~/')) {
      return false
    }
    
    // Skip internal workspace packages
    if (dep.startsWith('@ui8kit/') || dep.startsWith('ui8kit/')) {
      return false
    }
    
    // Skip relative paths and Windows paths
    if (dep.includes('\\') || (dep.includes('/') && !dep.startsWith('@') && !dep.includes('://'))) {
      return false
    }
    
    // Skip empty strings
    if (dep.trim() === '') {
      return false
    }
    
    // Skip file: protocol
    if (dep.startsWith('file:')) {
      return false
    }
    
    return true
  })
}

// Helper function to check if a module is an external dependency
export function isExternalDependency(moduleName: string): boolean {
  return !moduleName.startsWith(".") && 
         !moduleName.startsWith("@/") && 
         !moduleName.startsWith("~/") &&
         !moduleName.startsWith("@ui8kit/") &&
         !moduleName.includes("\\") &&
         moduleName !== "" &&
         !moduleName.startsWith("file:")
}

// Helper function to get schema reference URL
export function getSchemaRef(schemaName: string): string {
  return `${SCHEMA_CONFIG.baseUrl}/${schemaName}.json`
}

// Helper function to get full schema URL
export function getSchemaUrl(schemaName?: string): string {
  if (schemaName) {
    return getSchemaRef(schemaName)
  }
  return `${SCHEMA_CONFIG.baseUrl}.json`
} 