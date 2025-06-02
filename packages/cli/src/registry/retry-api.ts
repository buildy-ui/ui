import fetch from "node-fetch"
import { Component, componentSchema } from "./schema.js"
import { SCHEMA_CONFIG, TYPE_TO_FOLDER, getCdnUrls, type RegistryType } from "../utils/schema-config.js"

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

// Cache for each registry type with retry logic
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

async function checkInternetConnection(): Promise<boolean> {
  try {
    console.log("🌐 Checking internet connection...")
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch("https://www.google.com", { 
      method: "HEAD",
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.log("❌ No internet connection detected")
    return false
  }
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${retries}: ${url}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(url, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        return await response.json()
      } else if (response.status === 404) {
        // Don't retry on 404
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed: ${(error as Error).message}`)
      
      if (attempt === retries) {
        throw error
      }
      
      // Wait before retry
      console.log(`⏳ Waiting ${RETRY_DELAY / 1000}s before retry...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    }
  }
}

/**
 * Find and cache the first working CDN from the list with retry logic
 */
async function findWorkingCDNWithRetry(registryType: RegistryType): Promise<string> {
  const cache = getRegistryCache(registryType)
  
  if (cache.workingCDN) {
    return cache.workingCDN
  }
  
  // Check internet connection first
  if (!(await checkInternetConnection())) {
    throw new Error("No internet connection available")
  }
  
  const cdnUrls = getCdnUrls(registryType)
  
  for (const baseUrl of cdnUrls) {
    try {
      console.log(`🔍 Testing ${registryType} CDN with retry: ${baseUrl}`)
      await fetchWithRetry(`${baseUrl}/index.json`, 2) // Fewer retries for testing
      cache.workingCDN = baseUrl
      console.log(`✅ Using ${registryType} CDN: ${baseUrl}`)
      return baseUrl
    } catch (error) {
      console.log(`❌ ${registryType} CDN failed: ${baseUrl}`)
    }
  }
  
  throw new Error(`No working ${registryType} CDN found`)
}

/**
 * Fetch from the working CDN only with retry logic
 */
async function fetchFromWorkingCDNWithRetry(path: string, registryType: RegistryType): Promise<any> {
  const baseUrl = await findWorkingCDNWithRetry(registryType)
  const url = `${baseUrl}/${path}`
  
  console.log(`🎯 Fetching from ${registryType} with retry: ${url}`)
  return await fetchWithRetry(url)
}

/**
 * Get registry index and cache it for the session with retry logic
 */
async function getRegistryIndexWithRetry(registryType: RegistryType): Promise<any> {
  const cache = getRegistryCache(registryType)
  
  if (cache.registryIndex) {
    return cache.registryIndex
  }
  
  console.log(`🌐 Fetching ${registryType} registry index with retry`)
  cache.registryIndex = await fetchFromWorkingCDNWithRetry('index.json', registryType)
  return cache.registryIndex
}

/**
 * Find component by type from index, then fetch directly from correct folder with retry
 */
async function getComponentByTypeWithRetry(name: string, registryType: RegistryType): Promise<Component | null> {
  try {
    // 1. Get index to find component metadata
    const index = await getRegistryIndexWithRetry(registryType)
    
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
    
    // 4. Make targeted request to exact location with retry
    console.log(`🎯 Loading ${name} from /${registryType}/${folder}/ (type: ${componentInfo.type})`)
    const data = await fetchFromWorkingCDNWithRetry(`${folder}/${name}.json`, registryType)
    return componentSchema.parse(data)
    
  } catch (error) {
    console.log(`❌ Failed to get component by type: ${(error as Error).message}`)
    return null
  }
}

export async function getComponentWithRetry(name: string, registryType: RegistryType = SCHEMA_CONFIG.defaultRegistryType): Promise<Component | null> {
  try {
    if (isUrl(name)) {
      // If this is a URL - load directly
      return await fetchFromUrlWithRetry(name)
    }
    
    // Check internet connection first
    if (!(await checkInternetConnection())) {
      throw new Error("No internet connection available")
    }
    
    // Use optimized type-based lookup instead of category searching
    return await getComponentByTypeWithRetry(name, registryType)
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${name} from ${registryType}:`, (error as Error).message)
    return null
  }
}

async function fetchFromUrlWithRetry(url: string): Promise<Component | null> {
  console.log(`🌐 Fetching component from URL with retry: ${url}`)
  
  const data = await fetchWithRetry(url)
  return componentSchema.parse(data)
}

export async function getAllComponentsWithRetry(registryType: RegistryType = SCHEMA_CONFIG.defaultRegistryType): Promise<Component[]> {
  try {
    console.log(`🌐 Fetching all ${registryType} components with retry logic`)
    
    // Check internet connection first
    if (!(await checkInternetConnection())) {
      throw new Error("No internet connection available")
    }
    
    // Get index once, then fetch each component by type
    const indexData = await getRegistryIndexWithRetry(registryType)
    const components: Component[] = []
    
    // Get all components from the index
    if (indexData.components && Array.isArray(indexData.components)) {
      for (const componentInfo of indexData.components) {
        const component = await getComponentWithRetry(componentInfo.name, registryType)
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

/**
 * Reset cached CDN and index for testing or error recovery with retry logic
 */
export function resetCacheWithRetry(registryType?: RegistryType): void {
  if (registryType) {
    registryCache.delete(registryType)
    console.log(`🔄 Retry cache reset for ${registryType} - will rediscover working CDN`)
  } else {
    registryCache.clear()
    console.log(`🔄 All retry caches reset - will rediscover working CDNs`)
  }
} 