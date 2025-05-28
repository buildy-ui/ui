import { z } from "zod"

export const componentFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  target: z.string().optional(),
})

export const componentSchema = z.object({
  name: z.string(),
  type: z.enum(["ui", "block", "component"]),
  description: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  files: z.array(componentFileSchema),
})

export type ComponentFile = z.infer<typeof componentFileSchema>
export type Component = z.infer<typeof componentSchema>

export const configSchema = z.object({
  framework: z.literal("vite-react"),
  typescript: z.boolean().default(true),
  aliases: z.record(z.string()).default({
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/components/ui",
    "@/blocks": "./src/components/blocks",
  }),
  registry: z.string().default("@ui8kit"),
  componentsDir: z.string().default("./src/components"),
})

export type Config = z.infer<typeof configSchema> 