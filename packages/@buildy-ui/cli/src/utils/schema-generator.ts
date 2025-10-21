import { zodToJsonSchema } from "zod-to-json-schema"
import { z } from "zod"
import { configSchema } from "../registry/schema.js"
import { registryItemSchema, registryItemTypeSchema } from "../registry/build-schema.js"
import { SCHEMA_CONFIG, getSchemaRef } from "./schema-config.js"

// Extended registry schema for the full registry index
const fullRegistrySchema = z.object({
  $schema: z.string().optional(),
  name: z.string().optional(),
  homepage: z.string().optional(),
  registry: z.enum(SCHEMA_CONFIG.registryTypes).optional(),
  version: z.string().optional(),
  lastUpdated: z.string().optional(),
  categories: z.array(z.enum(SCHEMA_CONFIG.componentCategories)).optional(),
  components: z.array(z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    description: z.string().optional(),
  })).optional(),
  items: z.array(registryItemSchema),
})

export function generateConfigSchema() {
  const baseSchema = zodToJsonSchema(configSchema as any, {
    name: "BuildyConfiguration",
    $refStrategy: "none",
  }) as any

  const actualSchema = baseSchema.definitions?.BuildyConfiguration || baseSchema

  return {
    "$schema": SCHEMA_CONFIG.schemaVersion,
    "title": SCHEMA_CONFIG.descriptions.config.title,
    "description": SCHEMA_CONFIG.descriptions.config.description,
    "type": "object",
    "properties": {
      "$schema": {
        "type": "string",
        "description": SCHEMA_CONFIG.fieldDescriptions.schema
      },
      "framework": {
        "type": "string",
        "enum": SCHEMA_CONFIG.supportedFrameworks,
        "description": SCHEMA_CONFIG.fieldDescriptions.framework
      },
      "typescript": {
        "type": "boolean",
        "default": true,
        "description": SCHEMA_CONFIG.fieldDescriptions.typescript
      },
      "aliases": {
        "type": "object",
        "additionalProperties": {
          "type": "string"
        },
        "default": SCHEMA_CONFIG.defaultAliases,
        "description": SCHEMA_CONFIG.fieldDescriptions.aliases
      },
      "registry": {
        "type": "string", 
        "default": SCHEMA_CONFIG.defaultRegistry,
        "description": SCHEMA_CONFIG.fieldDescriptions.registry
      },
      "componentsDir": {
        "type": "string",
        "default": SCHEMA_CONFIG.defaultDirectories.components,
        "description": SCHEMA_CONFIG.fieldDescriptions.componentsDir
      },
      "libDir": {
        "type": "string",
        "default": SCHEMA_CONFIG.defaultDirectories.lib,
        "description": SCHEMA_CONFIG.fieldDescriptions.libDir
      }
    },
    "required": ["framework"],
    "additionalProperties": false
  }
}

export function generateRegistrySchema() {
  const baseSchema = zodToJsonSchema(fullRegistrySchema as any, {
    name: "BuildyRegistry", 
    $refStrategy: "none",
  }) as any

  const actualSchema = baseSchema.definitions?.BuildyRegistry || baseSchema

  return {
    "$schema": SCHEMA_CONFIG.schemaVersion,
    "title": SCHEMA_CONFIG.descriptions.registry.title,
    "description": SCHEMA_CONFIG.descriptions.registry.description,
    "type": "object",
    "properties": {
      "$schema": {
        "type": "string",
        "description": SCHEMA_CONFIG.fieldDescriptions.schema
      },
      "name": { 
        "type": "string",
        "description": SCHEMA_CONFIG.fieldDescriptions.registryName
      },
      "homepage": { 
        "type": "string",
        "description": SCHEMA_CONFIG.fieldDescriptions.registryHomepage
      },
      "registry": {
        "type": "string",
        "enum": SCHEMA_CONFIG.registryTypes,
        "description": SCHEMA_CONFIG.fieldDescriptions.registryType
      },
      "version": {
        "type": "string",
        "description": SCHEMA_CONFIG.fieldDescriptions.registryVersion
      },
      "lastUpdated": {
        "type": "string",
        "format": "date-time",
        "description": SCHEMA_CONFIG.fieldDescriptions.lastUpdated
      },
      "categories": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": SCHEMA_CONFIG.componentCategories
        },
        "description": SCHEMA_CONFIG.fieldDescriptions.categories
      },
      "components": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "type": { 
              "type": "string",
              "enum": actualSchema.properties?.components?.items?.properties?.type?.enum || [
                "registry:lib", "registry:block", "registry:component", "registry:ui", "registry:template"
              ]
            },
            "description": { "type": "string" }
          },
          "required": ["name", "type"],
          "additionalProperties": false
        },
        "description": SCHEMA_CONFIG.fieldDescriptions.components
      },
      "items": {
        "type": "array",
        "items": { "$ref": getSchemaRef("registry-item") },
        "description": SCHEMA_CONFIG.fieldDescriptions.items
      }
    },
    "required": ["items"],
    "additionalProperties": false
  }
}

export function generateRegistryItemSchema() {
  const baseSchema = zodToJsonSchema(registryItemSchema as any, {
    name: "BuildyRegistryItem",
    $refStrategy: "none",
  }) as any

  const actualSchema = baseSchema.definitions?.BuildyRegistryItem || baseSchema

  return {
    "$schema": SCHEMA_CONFIG.schemaVersion,
    "title": SCHEMA_CONFIG.descriptions.registryItem.title,
    "description": SCHEMA_CONFIG.descriptions.registryItem.description,
    "type": "object",
    "properties": actualSchema.properties,
    "required": actualSchema.required || ["name", "type", "files"],
    "additionalProperties": false
  }
}