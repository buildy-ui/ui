import fetch from "node-fetch"
import { Component, componentSchema } from "./schema.js"

// CDN URLs in order of preference (fastest to slowest)
const CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/ui8kit/r",
  "https://unpkg.com/ui8kit@latest/r", 
  "https://raw.githubusercontent.com/buildy-ui/ui/main/packages/ui/registry/r"
]

// Map component types to their corresponding folders
const TYPE_TO_FOLDER = {
  "registry:ui": "ui",
  "registry:block": "blocks", 
  "registry:component": "components",
  "registry:lib": "lib"
} as const

// Cache the working CDN for the session to avoid repeated testing
let workingCDN: string | null = null
let registryIndex: any = null

export function isUrl(path: string): boolean {
  try {
    new URL(path)
    return true
  } catch {
    return false
  }
}

/**
 * Find and cache the first working CDN from the list
 * This reduces requests by testing CDNs only once per session
 */
async function findWorkingCDN(): Promise<string> {
  if (workingCDN) {
    return workingCDN // Return cached result
  }
  
  for (const baseUrl of CDN_URLS) {
    try {
      console.log(`🔍 Testing CDN: ${baseUrl}`)
      const response = await fetch(`${baseUrl}/index.json`)
      if (response.ok) {
        workingCDN = baseUrl
        console.log(`✅ Using CDN: ${baseUrl}`)
        return baseUrl
      }
    } catch (error) {
      console.log(`❌ CDN failed: ${baseUrl}`)
    }
  }
  
  throw new Error('No working CDN found')
}

/**
 * Fetch from the working CDN only, avoiding fallback requests
 * This ensures we use only 1 CDN per request instead of testing all 3
 */
async function fetchFromWorkingCDN(path: string): Promise<any> {
  const baseUrl = await findWorkingCDN()
  const url = `${baseUrl}/${path}`
  
  console.log(`🎯 Fetching: ${url}`)
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  return await response.json()
}

/**
 * Get registry index and cache it for the session
 * This avoids repeated index.json requests
 */
async function getRegistryIndex(): Promise<any> {
  if (registryIndex) {
    return registryIndex // Return cached index
  }
  
  console.log(`🌐 Fetching registry index`)
  registryIndex = await fetchFromWorkingCDN('index.json')
  return registryIndex
}

/**
 * Find component by type from index, then fetch directly from correct folder
 * This eliminates blind searching through all categories (ui, blocks, components, lib)
 */
async function getComponentByType(name: string): Promise<Component | null> {
  try {
    // 1. Get index to find component metadata
    const index = await getRegistryIndex()
    
    // 2. Find component in index
    const componentInfo = index.components?.find((c: any) => c.name === name)
    if (!componentInfo) {
      console.log(`❌ Component ${name} not found in registry`)
      return null
    }
    
    // 3. Determine folder by component type
    const folder = TYPE_TO_FOLDER[componentInfo.type as keyof typeof TYPE_TO_FOLDER]
    if (!folder) {
      console.log(`❌ Unknown component type: ${componentInfo.type}`)
      return null
    }
    
    // 4. Make targeted request to exact location
    console.log(`🎯 Loading ${name} from /${folder}/ (type: ${componentInfo.type})`)
    const data = await fetchFromWorkingCDN(`${folder}/${name}.json`)
    return componentSchema.parse(data)
    
  } catch (error) {
    console.log(`❌ Failed to get component by type: ${(error as Error).message}`)
    return null
  }
}

export async function getComponent(name: string): Promise<Component | null> {
  try {
    if (isUrl(name)) {
      // If this is a URL - load directly
      return await fetchFromUrl(name)
    }
    
    // Use optimized type-based lookup instead of category searching
    return await getComponentByType(name)
    
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
    console.log(`🌐 Fetching all components using optimized approach`)
    
    // Get index once, then fetch each component by type
    const indexData = await getRegistryIndex()
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

/**
 * Reset cached CDN and index for testing or error recovery
 * This allows fallback to other CDNs if the current one fails
 */
export function resetCache(): void {
  workingCDN = null
  registryIndex = null
  console.log(`🔄 Cache reset - will rediscover working CDN`)
} 