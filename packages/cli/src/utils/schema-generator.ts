import { zodToJsonSchema } from "zod-to-json-schema"
import { z } from "zod"
import { configSchema } from "../registry/schema.js"
import { registryItemSchema, registryItemTypeSchema } from "../registry/build-schema.js"

// Extended registry schema for the full registry index
const fullRegistrySchema = z.object({
  $schema: z.string().optional(),
  name: z.string().optional(),
  homepage: z.string().optional(),
  registry: z.enum(["utility", "semantic", "theme"]).optional(),
  version: z.string().optional(),
  lastUpdated: z.string().optional(),
  categories: z.array(z.enum(["ui", "components", "blocks", "lib", "templates"])).optional(),
  components: z.array(z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    description: z.string().optional(),
  })).optional(),
  items: z.array(registryItemSchema),
})

export function generateConfigSchema() {
  const jsonSchema = zodToJsonSchema(configSchema, {
    name: "BuildyConfiguration",
    $refStrategy: "none",
  })

  return {
    ...jsonSchema,
    title: "Buildy Configuration",
    description: "Configuration file for buildy CLI (UI8Kit structure)",
  }
}

export function generateRegistrySchema() {
  const jsonSchema = zodToJsonSchema(fullRegistrySchema, {
    name: "BuildyRegistry", 
    $refStrategy: "none",
  }) as any

  return {
    ...jsonSchema,
    title: "Buildy Registry",
    description: "Registry schema for UI8Kit component system",
    properties: {
      ...jsonSchema.properties,
      items: {
        type: "array",
        items: { "$ref": "https://buildy.tw/schema/registry-item.json" },
        description: "Full component definitions"
      }
    }
  }
}

export function generateRegistryItemSchema() {
  const jsonSchema = zodToJsonSchema(registryItemSchema, {
    name: "BuildyRegistryItem",
    $refStrategy: "none",
  })

  return {
    ...jsonSchema,
    title: "Buildy Registry Item",
    description: "Schema for individual registry items in the UI8Kit component system",
  }
} 