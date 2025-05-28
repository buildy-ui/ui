import fs from "fs/promises"

export async function validateConfigWithSchema(configPath: string): Promise<boolean> {
  try {
    const config = await fs.readFile(configPath, "utf-8")
    const configJson = JSON.parse(config)
    
    if (!configJson.$schema) {
      console.warn("⚠️  Consider adding $schema for better IDE support:")
      console.log('  "$schema": "https://buildy.tw/schema.json"')
    }
    
    return true
  } catch (error) {
    console.error("❌ Invalid configuration:", (error as Error).message)
    return false
  }
} 