export interface ComponentPattern {
  pattern: string
  type: "registry:ui" | "registry:lib" | "registry:block" | "registry:component"
  target: string
  ignore?: string[]
}

export interface RegistryGeneratorConfig {
  patterns: ComponentPattern[]
  outputFile: string
  baseDir: string
  schema: string
  globOptions: {
    windowsPathsNoEscape: boolean
    cwd?: string
  }
}

export const defaultConfig: RegistryGeneratorConfig = {
  patterns: [
    {
      pattern: "packages/ui/src/components/ui/*.{ts,tsx}",
      type: "registry:ui",
      target: "ui",
      ignore: ["**/*.test.*", "**/*.spec.*", "**/index.*"]
    },
    {
      pattern: "packages/ui/src/components/blocks/*.{ts,tsx}",
      type: "registry:block", 
      target: "blocks",
      ignore: ["**/*.test.*", "**/*.spec.*", "**/index.*"]
    },
    {
      pattern: "packages/ui/src/lib/*.{ts,tsx}",
      type: "registry:lib",
      target: "lib",
      ignore: ["**/*.test.*", "**/*.spec.*"]
    }
  ],
  outputFile: "packages/ui/src/registry.json",
  baseDir: process.cwd(),
  schema: "https://buildy.tw/schema/registry.json",
  globOptions: {
    windowsPathsNoEscape: true
  }
}
