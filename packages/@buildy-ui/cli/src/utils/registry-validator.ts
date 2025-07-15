import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import { SCHEMA_CONFIG } from "./schema-config.js"

export interface ValidationResult {
  isValid: boolean
  message?: string
  missingComponents?: string[]
}

/**
 * Check if utility registry is initialized (base requirement)
 */
export async function isUtilityRegistryInitialized(): Promise<boolean> {
  const utilityConfigPath = path.join(process.cwd(), "utility", "buildy.config.json")
  return await fs.pathExists(utilityConfigPath)
}

/**
 * Check if a specific registry can be used (requires utility as base)
 */
export async function canUseRegistry(registryType: string): Promise<ValidationResult> {
  // Utility registry is always allowed (it's the base)
  if (registryType === "utility") {
    return { isValid: true }
  }
  
  // Check if utility registry is initialized
  if (!(await isUtilityRegistryInitialized())) {
    return {
      isValid: false,
      message: `Cannot use ${registryType} registry without utility registry. Please run: npx buildy-ui init`
    }
  }
  
  return { isValid: true }
}

/**
 * Get list of available components in utility registry from all categories
 */
export async function getUtilityComponents(): Promise<string[]> {
  const utilityPath = path.join(process.cwd(), "utility")
  const allComponents = new Set<string>()
  
  // Check all component categories
  for (const category of SCHEMA_CONFIG.componentCategories) {
    const categoryPath = path.join(utilityPath, category)
    
    if (await fs.pathExists(categoryPath)) {
      try {
        const files = await fs.readdir(categoryPath)
        const componentNames = files
          .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
          .map(file => path.basename(file, path.extname(file)))
          .filter(name => name !== 'index' && !name.startsWith('_'))
        
        componentNames.forEach(name => allComponents.add(name))
      } catch (error) {
        console.warn(`Warning: Could not read ${categoryPath}:`, (error as Error).message)
      }
    }
  }
  
  // Also check lib directory (at root level)
  const libPath = path.join(process.cwd(), "lib")
  if (await fs.pathExists(libPath)) {
    try {
      const files = await fs.readdir(libPath)
      const libComponents = files
        .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
        .map(file => path.basename(file, path.extname(file)))
        .filter(name => name !== 'index' && !name.startsWith('_'))
      
      libComponents.forEach(name => allComponents.add(name))
    } catch (error) {
      console.warn(`Warning: Could not read ${libPath}:`, (error as Error).message)
    }
  }
  
  return Array.from(allComponents)
}

/**
 * Get detailed component information by category
 */
export async function getUtilityComponentsByCategory(): Promise<Record<string, string[]>> {
  const utilityPath = path.join(process.cwd(), "utility")
  const componentsByCategory: Record<string, string[]> = {}
  
  // Check all component categories
  for (const category of SCHEMA_CONFIG.componentCategories) {
    const categoryPath = path.join(utilityPath, category)
    
    if (await fs.pathExists(categoryPath)) {
      try {
        const files = await fs.readdir(categoryPath)
        const componentNames = files
          .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
          .map(file => path.basename(file, path.extname(file)))
          .filter(name => name !== 'index' && !name.startsWith('_'))
        
        if (componentNames.length > 0) {
          componentsByCategory[category] = componentNames
        }
      } catch (error) {
        console.warn(`Warning: Could not read ${categoryPath}:`, (error as Error).message)
      }
    }
  }
  
  // Also check lib directory (at root level)
  const libPath = path.join(process.cwd(), "lib")
  if (await fs.pathExists(libPath)) {
    try {
      const files = await fs.readdir(libPath)
      const libComponents = files
        .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
        .map(file => path.basename(file, path.extname(file)))
        .filter(name => name !== 'index' && !name.startsWith('_'))
      
      if (libComponents.length > 0) {
        componentsByCategory['lib'] = libComponents
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${libPath}:`, (error as Error).message)
    }
  }
  
  return componentsByCategory
}

/**
 * Validate if components can be installed in non-utility registry
 */
export async function validateComponentInstallation(
  components: string[], 
  registryType: string
): Promise<ValidationResult> {
  // Skip validation for utility registry
  if (registryType === "utility") {
    return { isValid: true }
  }
  
  // Check if registry can be used
  const registryCheck = await canUseRegistry(registryType)
  if (!registryCheck.isValid) {
    return registryCheck
  }
  
  // Get available utility components
  const utilityComponents = await getUtilityComponents()
  
  if (utilityComponents.length === 0) {
    return {
      isValid: false,
      message: `No components found in utility registry. Please install utility components first: npx buildy-ui add --all`
    }
  }
  
  // Check if all requested components exist in utility
  const missingComponents = components.filter(comp => !utilityComponents.includes(comp))
  
  if (missingComponents.length > 0) {
    return {
      isValid: false,
      message: `Components not found in utility registry: ${missingComponents.join(', ')}. Install them first: npx buildy-ui add ${missingComponents.join(' ')}`,
      missingComponents
    }
  }
  
  return { isValid: true }
}

/**
 * Show validation error and exit
 */
export function handleValidationError(result: ValidationResult): never {
  console.error(chalk.red("❌ Registry Validation Error:"))
  console.error(chalk.red(result.message))
  
  if (result.missingComponents && result.missingComponents.length > 0) {
    console.log(chalk.yellow("\n💡 Suggestion:"))
    console.log(`Install missing components first: ${chalk.cyan(`npx buildy-ui add ${result.missingComponents.join(' ')}`)}\n`)
  }
  
  process.exit(1)
}

/**
 * Show utility components summary
 */
export async function showUtilityComponentsSummary(): Promise<void> {
  const componentsByCategory = await getUtilityComponentsByCategory()
  const totalComponents = Object.values(componentsByCategory).flat().length
  
  if (totalComponents === 0) {
    console.log(chalk.yellow("⚠️  No utility components found"))
    console.log("Install utility components first: npx buildy-ui add --all")
    return
  }
  
  console.log(chalk.blue(`\n📦 Available utility components (${totalComponents} total):`))
  
  Object.entries(componentsByCategory).forEach(([category, components]) => {
    console.log(`   ${chalk.cyan(category)}: ${components.join(', ')}`)
  })
} 