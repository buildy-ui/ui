import fs from "fs-extra"
import path from "path"
import { Config, configSchema } from "../registry/schema.js"
import { isUtilityRegistryInitialized } from "./registry-validator.js"
import { SCHEMA_CONFIG } from "./schema-config.js"

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
  // Always try utility first (it's the base configuration)
  const utilityConfig = await getConfig("./utility")
  if (utilityConfig) {
    return utilityConfig
  }
  
  // If no utility config and specific registry requested, try that registry
  if (registryType && registryType !== "utility") {
    const registryConfig = await getConfig(`./${registryType}`)
    if (registryConfig) {
      return registryConfig
    }
  }
  
  // Try default location (root)
  return await getConfig()
}

export async function getConfig(registryPath?: string): Promise<Config | null> {
  // If trying to access non-utility registry, ensure utility exists
  if (registryPath && registryPath !== "./utility") {
    if (!(await isUtilityRegistryInitialized())) {
      console.error("❌ Utility registry must be initialized first")
      console.log("Run: npx buildy-ui init")
      return null
    }
  }
  
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