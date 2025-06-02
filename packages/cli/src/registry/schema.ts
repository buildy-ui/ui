import { z } from "zod"

export const componentFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  target: z.string().optional(),
})

export const componentSchema = z.object({
  name: z.string(),
  type: z.enum(["registry:ui", "registry:block", "registry:component", "registry:lib", "registry:template"]),
  description: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  files: z.array(componentFileSchema),
})

export type ComponentFile = z.infer<typeof componentFileSchema>
export type Component = z.infer<typeof componentSchema>

export const configSchema = z.object({
  $schema: z.string().optional(),
  framework: z.literal("vite-react"),
  typescript: z.boolean().default(true),
  aliases: z.record(z.string()).default({
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./utility/ui",
    "@/blocks": "./utility/blocks",
    "@/lib": "./lib",
    "@/utility": "./utility",
    "@/semantic": "./semantic",
    "@/theme": "./theme",
  }),
  registry: z.string().default("@ui8kit"),
  componentsDir: z.string().default("./utility/components"),
  libDir: z.string().default("./lib"),
})

export type Config = z.infer<typeof configSchema> 