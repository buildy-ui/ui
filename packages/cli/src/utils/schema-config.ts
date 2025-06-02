// Configuration for schema generation
// This file contains all the sensitive data that might change over time

export const SCHEMA_CONFIG = {
  // Base schema information
  schemaVersion: "http://json-schema.org/draft-07/schema#",
  baseUrl: "https://buildy.tw/schema",
  
  // Framework configuration
  supportedFrameworks: ["vite-react"],
  
  // Default aliases for path mapping
  defaultAliases: {
    "@": "./src",
    "@/components": "./utility/components",
    "@/ui": "./utility/ui",
    "@/blocks": "./utility/blocks",
    "@/lib": "./lib",
    "@/utility": "./utility",
    "@/semantic": "./semantic",
    "@/theme": "./theme",
  },
  
  // Registry configuration
  defaultRegistry: "@ui8kit",
  registryTypes: ["utility", "semantic", "theme"],
  
  // Component categories
  componentCategories: ["ui", "components", "blocks", "lib", "templates"],
  
  // Component types (should match registryItemTypeSchema)
  componentTypes: [
    "registry:lib",
    "registry:block", 
    "registry:component",
    "registry:ui",
    "registry:template"
  ],
  
  // Default directories
  defaultDirectories: {
    components: "./utility/ui",
    lib: "./lib",
  },
  
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
  },
  
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
    registryType: "Registry type in UI8Kit architecture",
    registryVersion: "Registry version",
    lastUpdated: "Last update timestamp",
    categories: "Available component categories",
    components: "Component metadata for quick lookup",
    items: "Full component definitions",
  }
} as const

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