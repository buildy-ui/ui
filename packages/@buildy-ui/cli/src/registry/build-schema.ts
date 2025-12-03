import { z } from "zod"

export const registryItemTypeSchema = z.enum([
  "registry:lib",
  "registry:block", 
  "registry:component",
  "registry:ui",
  "registry:composite",
  "registry:layout",
  "registry:variants"
])

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(), // Populated during build
  target: z.string().optional(),
})

export const registryItemTailwindSchema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    theme: z.record(z.string(), z.any()).optional(),
    plugins: z.array(z.string()).optional(),
  }).optional(),
})

export const registryItemCssVarsSchema = z.object({
  theme: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: registryItemTypeSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema),
  tailwind: registryItemTailwindSchema.optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

export const registrySchema = z.object({
  $schema: z.string().optional(),
  items: z.array(registryItemSchema),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
export type Registry = z.infer<typeof registrySchema>
export type RegistryItemTailwind = z.infer<typeof registryItemTailwindSchema>
export type RegistryItemCssVars = z.infer<typeof registryItemCssVarsSchema>
