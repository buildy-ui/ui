import { z } from "zod"
import { SCHEMA_CONFIG } from "../utils/schema-config"

export const componentFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  target: z.string().optional(),
})

export const componentSchema = z.object({
  name: z.string(),
  type: z.enum(SCHEMA_CONFIG.componentTypes as unknown as readonly [string, ...string[]]),
  title: z.string().optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(componentFileSchema),
  tailwind: z.object({
    config: z.object({
      content: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
      plugins: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
  cssVars: z.object({
    theme: z.record(z.string(), z.string()).optional(),
    light: z.record(z.string(), z.string()).optional(),
    dark: z.record(z.string(), z.string()).optional(),
  }).optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

export type ComponentFile = z.infer<typeof componentFileSchema>
export type Component = z.infer<typeof componentSchema>

export const configSchema = z.object({
  $schema: z.string().optional(),
  framework: z.literal(SCHEMA_CONFIG.supportedFrameworks[0]),
  typescript: z.boolean().default(true),
  aliases: z.record(z.string(), z.string()).default(SCHEMA_CONFIG.defaultAliases as Record<string, string>),
  registry: z.string().default(SCHEMA_CONFIG.defaultRegistry),
  componentsDir: z.string().default(SCHEMA_CONFIG.defaultDirectories.components as string),
  libDir: z.string().default(SCHEMA_CONFIG.defaultDirectories.lib as string),
})

export type Config = z.infer<typeof configSchema> 