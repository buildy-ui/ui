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

export async function getConfig(): Promise<Config | null> {
  const configPath = path.join(process.cwd(), "buildy.config.json")
  
  if (!(await fs.pathExists(configPath))) {
    return null
  }
  
  try {
    const config = await fs.readJson(configPath)
    return configSchema.parse(config)
  } catch (error) {
    console.error("❌ Invalid buildy.config.json:", error.message)
    return null
  }
}

export async function saveConfig(config: Config): Promise<void> {
  const configPath = path.join(process.cwd(), "buildy.config.json")
  await fs.writeJson(configPath, config, { spaces: 2 })
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath)
} 