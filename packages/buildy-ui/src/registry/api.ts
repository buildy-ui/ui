import fetch from "node-fetch"
import { Component, componentSchema } from "./schema.js"
import { SCHEMA_CONFIG, TYPE_TO_FOLDER, getCdnUrls, type RegistryType } from "../utils/schema-config.js"

// Cache for each registry type
const registryCache = new Map<RegistryType, {
  workingCDN: string | null
  registryIndex: any
}>()

export function isUrl(path: string): boolean {
  try {
    new URL(path)
    return true
  } catch {
    return false
  }
}

/**
 * Get or initialize cache for specific registry
 */
function getRegistryCache(registryType: RegistryType) {
  if (!registryCache.has(registryType)) {
    registryCache.set(registryType, {
      workingCDN: null,
      registryIndex: null
    })
  }
  return registryCache.get(registryType)!
}

/**
 * Find and cache the first working CDN from the list
 * This reduces requests by testing CDNs only once per session
 */
async function findWorkingCDN(registryType: RegistryType): Promise<string> {
  const cache = getRegistryCache(registryType)
  
  if (cache.workingCDN) {
    return cache.workingCDN
  }
  
  const cdnUrls = getCdnUrls(registryType)
  
  for (const baseUrl of cdnUrls) {
    try {
      console.log(`🔍 Testing ${registryType} CDN: ${baseUrl}`)
      const response = await fetch(`${baseUrl}/index.json`)
      if (response.ok) {
        cache.workingCDN = baseUrl
        console.log(`✅ Using ${registryType} CDN: ${baseUrl}`)
        return baseUrl
      }
    } catch (error) {
      console.log(`❌ ${registryType} CDN failed: ${baseUrl}`)
    }
  }
  
  throw new Error(`No working ${registryType} CDN found`)
}

/**
 * Fetch from the working CDN only, avoiding fallback requests
 * This ensures we use only 1 CDN per request instead of testing all 3
 */
async function fetchFromWorkingCDN(path: string, registryType: RegistryType): Promise<any> {
  const baseUrl = await findWorkingCDN(registryType)
  const url = `${baseUrl}/${path}`
  
  console.log(`🎯 Fetching from ${registryType}: ${url}`)
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
async function getRegistryIndex(registryType: RegistryType): Promise<any> {
  const cache = getRegistryCache(registryType)
  
  if (cache.registryIndex) {
    return cache.registryIndex
  }
  
  console.log(`🌐 Fetching ${registryType} registry index`)
  cache.registryIndex = await fetchFromWorkingCDN('index.json', registryType)
  return cache.registryIndex
}

/**
 * Find component by type from index, then fetch directly from correct folder
 * This eliminates blind searching through all categories (ui, blocks, components, lib, templates)
 */
async function getComponentByType(name: string, registryType: RegistryType): Promise<Component | null> {
  try {
    // 1. Get index to find component metadata
    const index = await getRegistryIndex(registryType)
    
    // 2. Find component in index
    const componentInfo = index.components?.find((c: any) => c.name === name)
    if (!componentInfo) {
      console.log(`❌ Component ${name} not found in ${registryType} registry`)
      return null
    }
    
    // 3. Determine folder by component type
    const folder = TYPE_TO_FOLDER[componentInfo.type as keyof typeof TYPE_TO_FOLDER]
    if (!folder) {
      console.log(`❌ Unknown component type: ${componentInfo.type}`)
      return null
    }
    
    // 4. Make targeted request to exact location
    console.log(`🎯 Loading ${name} from /${registryType}/${folder}/ (type: ${componentInfo.type})`)
    const data = await fetchFromWorkingCDN(`${folder}/${name}.json`, registryType)
    return componentSchema.parse(data)
    
  } catch (error) {
    console.log(`❌ Failed to get component by type: ${(error as Error).message}`)
    return null
  }
}

export async function getComponent(name: string, registryType: RegistryType = SCHEMA_CONFIG.defaultRegistryType): Promise<Component | null> {
  try {
    if (isUrl(name)) {
      // If this is a URL - load directly
      return await fetchFromUrl(name)
    }
    
    // Use optimized type-based lookup instead of category searching
    return await getComponentByType(name, registryType)
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${name} from ${registryType}:`, (error as Error).message)
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

export async function getAllComponents(registryType: RegistryType = SCHEMA_CONFIG.defaultRegistryType): Promise<Component[]> {
  try {
    console.log(`🌐 Fetching all ${registryType} components using optimized approach`)
    
    // Get index once, then fetch each component by type
    const indexData = await getRegistryIndex(registryType)
    const components: Component[] = []
    
    // Get all components from the index
    if (indexData.components && Array.isArray(indexData.components)) {
      for (const componentInfo of indexData.components) {
        const component = await getComponent(componentInfo.name, registryType)
        if (component) {
          components.push(component)
        }
      }
    }
    
    return components
    
  } catch (error) {
    console.error(`❌ Failed to fetch all ${registryType} components:`, (error as Error).message)
    return []
  }
}

export async function getComponents(names: string[], registryType: RegistryType = SCHEMA_CONFIG.defaultRegistryType): Promise<Component[]> {
  const components: Component[] = []
  
  for (const name of names) {
    const component = await getComponent(name, registryType)
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
export function resetCache(registryType?: RegistryType): void {
  if (registryType) {
    registryCache.delete(registryType)
    console.log(`🔄 Cache reset for ${registryType} - will rediscover working CDN`)
  } else {
    registryCache.clear()
    console.log(`🔄 All registry caches reset - will rediscover working CDNs`)
  }
} 