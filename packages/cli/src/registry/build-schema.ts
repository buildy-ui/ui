import { z } from "zod"

export const registryItemTypeSchema = z.enum([
  "registry:lib",
  "registry:block", 
  "registry:component",
  "registry:ui"
])

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(), // Populated during build
  target: z.string().optional(),
})

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  files: z.array(registryItemFileSchema),
})

export const registrySchema = z.object({
  $schema: z.string().optional(),
  items: z.array(registryItemSchema),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
export type Registry = z.infer<typeof registrySchema>
