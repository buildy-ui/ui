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

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

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
 * This reduces requests by testing CDNs only once per session
 */
async function findWorkingCDNWithRetry(): Promise<string> {
  if (workingCDN) {
    return workingCDN // Return cached result
  }
  
  // Check internet connection first
  if (!(await checkInternetConnection())) {
    throw new Error("No internet connection available")
  }
  
  for (const baseUrl of CDN_URLS) {
    try {
      console.log(`🔍 Testing CDN with retry: ${baseUrl}`)
      await fetchWithRetry(`${baseUrl}/index.json`, 2) // Fewer retries for testing
      workingCDN = baseUrl
      console.log(`✅ Using CDN: ${baseUrl}`)
      return baseUrl
    } catch (error) {
      console.log(`❌ CDN failed: ${baseUrl}`)
    }
  }
  
  throw new Error('No working CDN found')
}

/**
 * Fetch from the working CDN only with retry logic
 * This ensures we use only 1 CDN per request instead of testing all 3
 */
async function fetchFromWorkingCDNWithRetry(path: string): Promise<any> {
  const baseUrl = await findWorkingCDNWithRetry()
  const url = `${baseUrl}/${path}`
  
  console.log(`🎯 Fetching with retry: ${url}`)
  return await fetchWithRetry(url)
}

/**
 * Get registry index and cache it for the session with retry logic
 * This avoids repeated index.json requests
 */
async function getRegistryIndexWithRetry(): Promise<any> {
  if (registryIndex) {
    return registryIndex // Return cached index
  }
  
  console.log(`🌐 Fetching registry index with retry`)
  registryIndex = await fetchFromWorkingCDNWithRetry('index.json')
  return registryIndex
}

/**
 * Find component by type from index, then fetch directly from correct folder with retry
 * This eliminates blind searching through all categories (ui, blocks, components, lib)
 */
async function getComponentByTypeWithRetry(name: string): Promise<Component | null> {
  try {
    // 1. Get index to find component metadata
    const index = await getRegistryIndexWithRetry()
    
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
    
    // 4. Make targeted request to exact location with retry
    console.log(`🎯 Loading ${name} from /${folder}/ (type: ${componentInfo.type})`)
    const data = await fetchFromWorkingCDNWithRetry(`${folder}/${name}.json`)
    return componentSchema.parse(data)
    
  } catch (error) {
    console.log(`❌ Failed to get component by type: ${(error as Error).message}`)
    return null
  }
}

export async function getComponentWithRetry(name: string): Promise<Component | null> {
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
    return await getComponentByTypeWithRetry(name)
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${name}:`, (error as Error).message)
    return null
  }
}

async function fetchFromUrlWithRetry(url: string): Promise<Component | null> {
  console.log(`🌐 Fetching component from: ${url}`)
  
  // Check internet connection first
  if (!(await checkInternetConnection())) {
    throw new Error("No internet connection available")
  }
  
  const data = await fetchWithRetry(url)
  return componentSchema.parse(data)
}

export async function getAllComponentsWithRetry(): Promise<Component[]> {
  try {
    console.log(`🌐 Fetching all components using optimized approach with retry`)
    
    // Check internet connection first
    if (!(await checkInternetConnection())) {
      throw new Error("No internet connection available")
    }
    
    // Get index once, then fetch each component by type
    const indexData = await getRegistryIndexWithRetry()
    const components: Component[] = []
    
    // Get all components from the index
    if (indexData.components && Array.isArray(indexData.components)) {
      for (const componentInfo of indexData.components) {
        const component = await getComponentWithRetry(componentInfo.name)
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

/**
 * Reset cached CDN and index for testing or error recovery
 * This allows fallback to other CDNs if the current one fails
 */
export function resetCacheWithRetry(): void {
  workingCDN = null
  registryIndex = null
  console.log(`🔄 Cache reset - will rediscover working CDN with retry`)
} 