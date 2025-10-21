import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

export interface ValidationResult {
  isValid: boolean
  message?: string
  missingComponents?: string[]
}

/**
 * Check if utility registry is initialized (base requirement)
 */
export async function isUtilityRegistryInitialized(): Promise<boolean> {
  // Deprecated in core/form model. Always allow operations.
  return true
}

/**
 * Check if a specific registry can be used (requires utility as base)
 */
export async function canUseRegistry(registryType: string): Promise<ValidationResult> {
  // In the simplified core/form model, all registries are usable without prerequisites.
  return { isValid: true }
}

/**
 * Get list of available components in utility registry from all categories
 */
export async function getUtilityComponents(): Promise<string[]> {
  // Deprecated in core/form model. No prerequisite components required.
  return []
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
  // Validation no longer enforces base utility presence.
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
  // Deprecated in core/form model. No summary to show.
} 