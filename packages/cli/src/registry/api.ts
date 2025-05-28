import fetch from "node-fetch"
import { Component, componentSchema } from "./schema.js"

const BUILDY_REGISTRY_URL = "https://buildy.tw/r"

export function isUrl(path: string): boolean {
  try {
    new URL(path)
    return true
  } catch {
    return false
  }
}

export async function getComponent(
  name: string, 
  category = "ui"
): Promise<Component | null> {
  try {
    const url = isUrl(name) 
      ? name 
      : `${BUILDY_REGISTRY_URL}/${category}/${name}.json`
    
    console.log(`🌐 Fetching component from: ${url}`)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return componentSchema.parse(data)
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${name}:`, error)
    return null
  }
}

export async function getComponents(
  names: string[], 
  category = "ui"
): Promise<Component[]> {
  const components: Component[] = []
  
  for (const name of names) {
    const component = await getComponent(name, category)
    if (component) {
      components.push(component)
    }
  }
  
  return components
} 