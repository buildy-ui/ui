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

export async function getComponent(name: string): Promise<Component | null> {
  try {
    if (isUrl(name)) {
      // If this is a URL - load directly
      return await fetchFromUrl(name)
    }
    
    // Try to find in different categories
    const categories = ["ui", "blocks", "components", "lib"]
    
    for (const category of categories) {
      try {
        const url = `${BUILDY_REGISTRY_URL}/${category}/${name}.json`
        console.log(`🔍 Searching in ${category}: ${url}`)
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          const component = componentSchema.parse(data)
          console.log(`✅ Found ${name} in ${category}`)
          return component
        }
      } catch (error) {
        // Continue searching in the next category
        console.log(`❌ Not found in ${category}`)
      }
    }
    
    console.log(`❌ Component ${name} not found in any category`)
    return null
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${name}:`, (error as Error).message)
    return null
  }
}

async function fetchFromUrl(url: string): Promise<Component | null> {
  console.log(`🌐 Fetching component from: ${url}`)
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const data = await response.json()
  return componentSchema.parse(data)
}

export async function getAllComponents(): Promise<Component[]> {
  try {
    console.log(`🌐 Fetching registry index from: ${BUILDY_REGISTRY_URL}/index.json`)
    
    const response = await fetch(`${BUILDY_REGISTRY_URL}/index.json`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const indexData = await response.json() as any
    const components: Component[] = []
    
    // Get all components from the index
    if (indexData.components && Array.isArray(indexData.components)) {
      for (const componentInfo of indexData.components) {
        const component = await getComponent(componentInfo.name)
        if (component) {
          components.push(component)
        }
      }
    }
    
    return components
    
  } catch (error) {
    console.error(`❌ Failed to fetch all components:`, (error as Error).message)
    return []
  }
}

export async function getComponents(names: string[]): Promise<Component[]> {
  const components: Component[] = []
  
  for (const name of names) {
    const component = await getComponent(name)
    if (component) {
      components.push(component)
    }
  }
  
  return components
} 