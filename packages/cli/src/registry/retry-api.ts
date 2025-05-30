import fetch from "node-fetch"
import { Component, componentSchema } from "./schema.js"

// CDN URLs in order of preference (fastest to slowest)
const CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/ui8kit/r",
  "https://unpkg.com/ui8kit@latest/r", 
  "https://raw.githubusercontent.com/buildy-ui/ui/main/packages/ui/registry/r"
]

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

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

async function fetchWithFallbackAndRetry(path: string): Promise<any> {
  let lastError: Error | null = null
  
  for (const baseUrl of CDN_URLS) {
    try {
      const url = `${baseUrl}/${path}`
      console.log(`🔍 Trying CDN: ${baseUrl}`)
      
      const data = await fetchWithRetry(url, 2) // Fewer retries per CDN
      console.log(`✅ Success from: ${baseUrl}`)
      return data
      
    } catch (error) {
      console.log(`❌ Failed from ${baseUrl}: ${(error as Error).message}`)
      lastError = error as Error
    }
  }
  
  throw new Error(`All CDN sources failed. Last error: ${lastError?.message}`)
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
    
    // Try to find in different categories
    const categories = ["ui", "blocks", "components", "lib"]
    
    for (const category of categories) {
      try {
        console.log(`🔍 Searching in ${category} for ${name}`)
        
        const data = await fetchWithFallbackAndRetry(`${category}/${name}.json`)
        const component = componentSchema.parse(data)
        console.log(`✅ Found ${name} in ${category}`)
        return component
        
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
    console.log(`🌐 Fetching registry index with fallback and retry`)
    
    // Check internet connection first
    if (!(await checkInternetConnection())) {
      throw new Error("No internet connection available")
    }
    
    const indexData = await fetchWithFallbackAndRetry('index.json')
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