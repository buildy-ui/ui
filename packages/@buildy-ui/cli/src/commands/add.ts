import chalk from "chalk"
import ora from "ora"
import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import { getComponent, getAllComponents } from "../registry/api.js"
import { getComponentWithRetry, getAllComponentsWithRetry } from "../registry/retry-api.js"
import { findConfig } from "../utils/project.js"
import { Component, type Config } from "../registry/schema.js"
import { SCHEMA_CONFIG, getInstallPath, type RegistryType } from "../utils/schema-config.js"
import { validateComponentInstallation, handleValidationError, showUtilityComponentsSummary } from "../utils/registry-validator.js"
import { checkProjectDependencies, showDependencyStatus, filterMissingDependencies, isWorkspaceError } from "../utils/dependency-checker.js"

interface AddOptions {
  force?: boolean
  dryRun?: boolean
  all?: boolean
  retry?: boolean
  registry?: string
}

export async function addCommand(components: string[], options: AddOptions) {
  // Resolve registry type
  const registryType = resolveRegistryType(options.registry)
  
  if (options.all || components.includes("all")) {
    return await addAllComponents(options, registryType)
  }
  
  if (components.length === 0) {
    console.error(chalk.red("❌ Please specify at least one component to add."))
    console.log("Example: npx buildy-ui@latest add button card")
    console.log("Example: npx buildy-ui@latest add button --registry core")
    console.log("Example: npx buildy-ui@latest add all  # Install all components")
    console.log("Example: npx buildy-ui@latest add --all --registry core  # Install all core components")
    console.log("Example: npx buildy-ui@latest add --retry  # Enable retry for unreliable connections")
    console.log("Example: npx buildy-ui@latest add \"https://example.com/component.json\"")
    process.exit(1)
  }
  
  // Validate component installation before proceeding
  const validation = await validateComponentInstallation(components, registryType)
  if (!validation.isValid) {
    handleValidationError(validation)
  }
  
  // Get project configuration (try utility first, then specified registry)
  const config = await findConfig(registryType)
  if (!config) {
    console.error(chalk.red("❌ buildy is not initialized in this project."))
    console.log(`Run 'npx buildy-ui@latest init' first.`)
    console.log(`For ${registryType} registry, run: npx buildy-ui@latest init --registry ${registryType}`)
    process.exit(1)
  }
  
  // Choose API based on retry flag
  const getComponentFn = options.retry ? getComponentWithRetry : getComponent
  
  if (options.retry) {
    console.log(chalk.blue("🔄 Retry mode enabled - using enhanced connection logic"))
  }
  
  console.log(chalk.blue(`📦 Installing from ${registryType} registry...`))
  
  const results: Array<{ name: string; status: "success" | "error"; error?: string }> = []
  
  for (const componentName of components) {
    const spinner = ora(`Installing ${componentName} from ${registryType}...`).start()
    
    try {
      // Get component data from specified registry
      const component = await getComponentFn(componentName, registryType)
      
      if (!component) {
        throw new Error(`Component "${componentName}" not found in ${registryType} registry`)
      }
      
      if (options.dryRun) {
        spinner.succeed(`Would install: ${component.name} from ${registryType}`)
        console.log(`   Type: ${component.type}`)
        console.log(`   Files: ${component.files.length}`)
        console.log(`   Dependencies: ${component.dependencies.join(", ") || "none"}`)
        
        // Show dependency status for dry run
        if (component.dependencies.length > 0) {
          const depStatus = await checkProjectDependencies(component.dependencies)
          showDependencyStatus(depStatus)
        }
        continue
      }
      
      // Install component files
      await installComponentFiles(component, config, options.force)
      
      // Install dependencies with improved error handling
      if (component.dependencies.length > 0) {
        try {
          await installDependencies(component.dependencies)
        } catch (error) {
          console.log(chalk.yellow(`   ⚠️  Warning: Could not install some dependencies for ${component.name}`))
          console.log(chalk.yellow(`   Dependencies: ${component.dependencies.join(", ")}`))
          console.log(chalk.yellow(`   Please install them manually if needed`))
          // Don't fail the entire installation for dependency issues
        }
      }
      
      spinner.succeed(`Installed ${component.name} from ${registryType}`)
      results.push({ name: component.name, status: "success" })
      
    } catch (error) {
      spinner.fail(`Failed to install ${componentName} from ${registryType}`)
      console.error(chalk.red(`   Error: ${(error as Error).message}`))
      results.push({ 
        name: componentName, 
        status: "error", 
        error: (error as Error).message 
      })
    }
  }
  
  // Summary
  const successful = results.filter(r => r.status === "success")
  const failed = results.filter(r => r.status === "error")
  
  console.log(chalk.blue("\n📊 Installation Summary:"))
  console.log(`   Registry: ${registryType}`)
  console.log(`   ✅ Successful: ${successful.length}`)
  console.log(`   ❌ Failed: ${failed.length}`)
  
  if (successful.length > 0) {
    console.log(chalk.green("\n🎉 Components installed successfully!"))
    console.log("You can now import and use them in your project.")
  }
  
  if (failed.length > 0) {
    process.exit(1)
  }
}

async function addAllComponents(options: AddOptions, registryType: RegistryType) {
  console.log(chalk.blue(`🚀 Installing all available components from ${registryType} registry...`))

  
  // Get project configuration (try utility first, then specified registry)
  const config = await findConfig(registryType)
  if (!config) {
    console.error(chalk.red("❌ buildy is not initialized in this project."))
    console.log(`Run 'npx buildy-ui@latest init' first.`)
    console.log(`For ${registryType} registry, run: npx buildy-ui@latest init --registry ${registryType}`)
    process.exit(1)
  }
  
  // Choose API based on retry flag
  const getAllComponentsFn = options.retry ? getAllComponentsWithRetry : getAllComponents
  
  if (options.retry) {
    console.log(chalk.blue("🔄 Retry mode enabled - using enhanced connection logic"))
  }
  
  const spinner = ora(`Fetching component list from ${registryType}...`).start()
  
  try {
    const allComponents = await getAllComponentsFn(registryType)
    
    if (allComponents.length === 0) {
      spinner.fail(`No components found in ${registryType} registry`)
      console.log(chalk.yellow(`\n⚠️  ${registryType} registry temporarily unavailable`))
      console.log("Try these alternatives:")
      console.log("  • Check your internet connection")
      console.log(`  • Use --retry flag: npx buildy-ui@latest add --all --registry ${registryType} --retry`)
      console.log("  • Use VPN if available")
      console.log("  • Install from URL: npx buildy-ui@latest add 'https://...'")
      console.log("  • Check https://buildy.tw for manual download")
      return
    }
    
    spinner.succeed(`Found ${allComponents.length} components in ${registryType}`)
    
    if (options.dryRun) {
      console.log(chalk.blue(`\n📋 Would install from ${registryType}:`))
      allComponents.forEach(comp => {
        console.log(`   - ${comp.name} (${comp.type})`)
      })
      return
    }
    
    const results: Array<{ name: string; status: "success" | "error"; error?: string }> = []
    
    for (const component of allComponents) {
      const componentSpinner = ora(`Installing ${component.name} from ${registryType}...`).start()
      
      try {
      // Install component files
      await installComponentFiles(component, config, options.force)
        
        // Install dependencies with improved error handling
        if (component.dependencies.length > 0) {
          try {
            await installDependencies(component.dependencies)
          } catch (error) {
            console.log(chalk.yellow(`   ⚠️  Warning: Could not install some dependencies for ${component.name}`))
            console.log(chalk.yellow(`   Dependencies: ${component.dependencies.join(", ")}`))
            console.log(chalk.yellow(`   Please install them manually if needed`))
            // Don't fail the entire installation for dependency issues
          }
        }
        
        componentSpinner.succeed(`Installed ${component.name} from ${registryType}`)
        results.push({ name: component.name, status: "success" })
        
      } catch (error) {
        componentSpinner.fail(`Failed to install ${component.name}`)
        console.error(chalk.red(`   Error: ${(error as Error).message}`))
        results.push({ 
          name: component.name, 
          status: "error", 
          error: (error as Error).message 
        })
      }
    }
    
    // Summary
    const successful = results.filter(r => r.status === "success")
    const failed = results.filter(r => r.status === "error")
    
    console.log(chalk.blue("\n📊 Installation Summary:"))
    console.log(`   Registry: ${registryType}`)
    console.log(`   ✅ Successful: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)
    
    if (successful.length > 0) {
      console.log(chalk.green(`\n🎉 All ${registryType} components installed successfully!`))
      console.log("You can now import and use them in your project.")
    }
    
    if (failed.length > 0) {
      process.exit(1)
    }
    
  } catch (error) {
    spinner.fail(`Failed to fetch components from ${registryType}`)
    console.error(chalk.red("❌ Error:"), (error as Error).message)
    console.log(chalk.yellow(`\n⚠️  ${registryType} registry temporarily unavailable`))
    console.log("Try these alternatives:")
    console.log("  • Check your internet connection")
    console.log(`  • Use --retry flag: npx buildy-ui@latest add --all --registry ${registryType} --retry`)
    console.log("  • Use VPN if available")
    console.log("  • Install from URL: npx buildy-ui@latest add 'https://...'")
    console.log("  • Check https://buildy.tw for manual download")
    process.exit(1)
  }
}

async function installComponentFiles(
  component: Component,
  config: Config,
  force = false
): Promise<void> {
  for (const file of component.files) {
    const fileName = path.basename(file.path)

    // Determine base install folder by target or component type
    const target = file.target || inferTargetFromType(component.type)
    const installDir = resolveInstallDir(target, config)
    const targetPath = path.join(process.cwd(), installDir, fileName)

    if (!force && await fs.pathExists(targetPath)) {
      console.log(`   ⚠️  Skipped ${fileName} (already exists, use --force to overwrite)`) 
      continue
    }

    await fs.ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, file.content, "utf-8")
  }
}

function inferTargetFromType(componentType: string): string {
  switch (componentType) {
    case "registry:ui":
      return "ui"
    case "registry:block":
      return "blocks"
    case "registry:component":
      return "components"
    case "registry:template":
      return "templates"
    case "registry:lib":
      return "lib"
    default:
      return "components"
  }
}

function resolveInstallDir(target: string, config: Config): string {
  if (target === "lib") {
    return normalizeDir(config.libDir || "src/lib")
  }

  // Prefer config.componentsDir for UI; derive siblings for other targets
  const baseUiDir = normalizeDir(config.componentsDir || "src/ui")
  if (target === "ui") return baseUiDir

  const parent = baseUiDir.replace(/[/\\]ui$/i, "") || "src"
  switch (target) {
    case "components":
      return path.join(parent, "components").replace(/\\/g, "/")
    case "blocks":
      return path.join(parent, "blocks").replace(/\\/g, "/")
    case "templates":
      return path.join(parent, "templates").replace(/\\/g, "/")
    default:
      return baseUiDir
  }
}

function normalizeDir(dir: string): string {
  return dir.replace(/^\.\//, "").replace(/\\/g, "/")
}

function resolveRegistryType(registryInput?: string): RegistryType {
  if (!registryInput) {
    return SCHEMA_CONFIG.defaultRegistryType
  }
  
  // Check if it's a valid registry type
  if (SCHEMA_CONFIG.registryTypes.includes(registryInput as any)) {
    return registryInput as RegistryType
  }
  
  console.warn(chalk.yellow(`⚠️  Unknown registry type: ${registryInput}`))
  console.log(`Available registries: ${SCHEMA_CONFIG.registryTypes.join(", ")}`)
  console.log(`Using default: ${SCHEMA_CONFIG.defaultRegistryType}`)
  
  return SCHEMA_CONFIG.defaultRegistryType
}

async function installDependencies(dependencies: string[]): Promise<void> {
  const spinner = ora("Installing dependencies...").start()
  
  try {
    // Check dependency status first
    const depStatus = await checkProjectDependencies(dependencies)
    
    // Filter out dependencies that are already installed or are workspace dependencies
    const missingDependencies = await filterMissingDependencies(dependencies)
    
    if (missingDependencies.length === 0) {
      spinner.succeed("All dependencies already available")
      if (depStatus.workspace.length > 0) {
        console.log(chalk.blue(`   🔗 Using workspace dependencies: ${depStatus.workspace.join(", ")}`))
      }
      return
    }
    
    // Show what we're about to install
    showDependencyStatus(depStatus)
    
    // Detect package manager
    const packageManager = await detectPackageManager()
    
    const installCommand = packageManager === "npm" 
      ? ["install", ...missingDependencies]
      : ["add", ...missingDependencies]
    
    await execa(packageManager, installCommand, {
      cwd: process.cwd(),
      stdio: "pipe"
    })
    
    spinner.succeed("Dependencies installed")
  } catch (error) {
    spinner.fail("Failed to install dependencies")
    
    // Show more helpful error message
    const errorMessage = (error as any).stderr || (error as Error).message
    
    if (isWorkspaceError(errorMessage)) {
      console.log(chalk.yellow("\n💡 Workspace dependency detected. Installing individually..."))
      
      // Try to install each dependency individually
      const results = await installDependenciesIndividually(dependencies)
      
      if (results.some(r => r.success)) {
        console.log(chalk.green("✅ Some dependencies installed successfully"))
        return
      }
    }
    
    throw new Error(`Failed to install dependencies: ${errorMessage}`)
  }
}

async function installDependenciesIndividually(dependencies: string[]): Promise<Array<{dep: string, success: boolean}>> {
  const packageManager = await detectPackageManager()
  const results: Array<{dep: string, success: boolean}> = []
  
  // Filter out workspace dependencies first
  const missingDeps = await filterMissingDependencies(dependencies)
  
  for (const dep of missingDeps) {
    try {
      const installCommand = packageManager === "npm" 
        ? ["install", dep]
        : ["add", dep]
      
      await execa(packageManager, installCommand, {
        cwd: process.cwd(),
        stdio: "pipe"
      })
      
      console.log(chalk.green(`   ✅ Installed ${dep}`))
      results.push({dep, success: true})
    } catch (error) {
      console.log(chalk.yellow(`   ⚠️  Skipped ${dep} (may already be available)`))
      results.push({dep, success: false})
    }
  }
  
  return results
}

async function detectPackageManager(): Promise<string> {
  if (await fs.pathExists("bun.lock")) return "bun"
  if (await fs.pathExists("pnpm-lock.yaml")) return "pnpm"
  if (await fs.pathExists("yarn.lock")) return "yarn"
  return "npm"
} 