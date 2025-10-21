import fs from "fs-extra"
import path from "path"
import { Config, configSchema } from "../registry/schema.js"

export async function isViteProject(): Promise<boolean> {
  const viteConfigFiles = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mts",
    "vite.config.mjs"
  ]
  
  for (const file of viteConfigFiles) {
    if (await fs.pathExists(file)) {
      return true
    }
  }
  
  return false
}

export async function hasReact(): Promise<boolean> {
  const packageJsonPath = path.join(process.cwd(), "package.json")
  
  if (!(await fs.pathExists(packageJsonPath))) {
    return false
  }
  
  const packageJson = await fs.readJson(packageJsonPath)
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }
  
  return "react" in deps
}

/**
 * Find configuration for any registry (utility first, then specified registry)
 */
export async function findConfig(registryType?: string): Promise<Config | null> {
  // Try specific registry directory first (e.g., ./core or ./form)
  if (registryType) {
    const registryConfig = await getConfig(`./${registryType}`)
    if (registryConfig) {
      return registryConfig
    }
  }
  // Fallback to root config
  return await getConfig()
}

export async function getConfig(registryPath?: string): Promise<Config | null> {
  // If registryPath is provided, save config in that directory
  // Otherwise use the default location
  const configPath = registryPath 
    ? path.join(process.cwd(), registryPath, "buildy.config.json")
    : path.join(process.cwd(), "buildy.config.json")
  
  if (!(await fs.pathExists(configPath))) {
    return null
  }
  
  try {
    const config = await fs.readJson(configPath)
    return configSchema.parse(config)
  } catch (error) {
    console.error("❌ Invalid buildy.config.json:", (error as Error).message)
    return null
  }
}

export async function saveConfig(config: Config, registryPath?: string): Promise<void> {
  // If registryPath is provided, save config in that directory
  // Otherwise use the default location
  const configPath = registryPath 
    ? path.join(process.cwd(), registryPath, "buildy.config.json")
    : path.join(process.cwd(), "buildy.config.json")
  
  // Ensure directory exists
  await fs.ensureDir(path.dirname(configPath))
  
  await fs.writeJson(configPath, config, { spaces: 2 })
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath)
} 