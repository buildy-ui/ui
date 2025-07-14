import { z } from "zod"

export const componentFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  target: z.string().optional(),
})

export const componentSchema = z.object({
  name: z.string(),
  type: z.enum(["registry:ui", "registry:block", "registry:component", "registry:lib", "registry:template"]),
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
  framework: z.literal("vite-react"),
  typescript: z.boolean().default(true),
  aliases: z.record(z.string()).default({
    "@": "./src",
    "@/components": "./utility/components",
    "@/ui": "./utility/ui",
    "@/blocks": "./utility/blocks",
    "@/lib": "./lib",
    "@/utility": "./utility",
    "@/semantic": "./semantic",
    "@/theme": "./theme",
  }),
  registry: z.string().default("@ui8kit"),
  componentsDir: z.string().default("./utility/ui"),
  libDir: z.string().default("./lib"),
})

export type Config = z.infer<typeof configSchema> 