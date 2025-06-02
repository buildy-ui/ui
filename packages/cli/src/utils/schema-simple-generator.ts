import { SCHEMA_CONFIG, getSchemaRef } from "./schema-config"

export function generateConfigSchema() {
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
              "enum": SCHEMA_CONFIG.componentTypes
            },
            "description": { "type": "string" }
          },
          "required": ["name", "type"]
        },
        "description": SCHEMA_CONFIG.fieldDescriptions.components
      },
      "items": {
        "type": "array",
        "items": { "$ref": getSchemaRef("registry-item") },
        "description": SCHEMA_CONFIG.fieldDescriptions.items
      }
    },
    "required": ["items"]
  }
}

export function generateRegistryItemSchema() {
  return {
    "$schema": SCHEMA_CONFIG.schemaVersion,
    "title": SCHEMA_CONFIG.descriptions.registryItem.title,
    "description": SCHEMA_CONFIG.descriptions.registryItem.description,
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "type": { 
        "type": "string",
        "enum": SCHEMA_CONFIG.componentTypes
      },
      "description": { "type": "string" },
      "dependencies": { 
        "type": "array",
        "items": { "type": "string" }
      },
      "devDependencies": { 
        "type": "array", 
        "items": { "type": "string" }
      },
      "files": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "path": { "type": "string" },
            "content": { "type": "string" },
            "target": { "type": "string" }
          },
          "required": ["path"]
        }
      }
    },
    "required": ["name", "type", "files"]
  }
} 