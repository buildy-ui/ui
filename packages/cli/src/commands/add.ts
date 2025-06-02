import chalk from "chalk"
import ora from "ora"
import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import { getComponent, getAllComponents } from "../registry/api.js"
import { getComponentWithRetry, getAllComponentsWithRetry } from "../registry/retry-api.js"
import { getConfig } from "../utils/project.js"
import { Component, ComponentFile } from "../registry/schema.js"

interface AddOptions {
  force?: boolean
  dryRun?: boolean
  all?: boolean
  retry?: boolean
}

export async function addCommand(components: string[], options: AddOptions) {
  if (options.all || components.includes("all")) {
    return await addAllComponents(options)
  }
  
  if (components.length === 0) {
    console.error(chalk.red("❌ Please specify at least one component to add."))
    console.log("Example: npx buildy-ui@latest add button card")
    console.log("Example: npx buildy-ui@latest add all  # Install all components")
    console.log("Example: npx buildy-ui@latest add --all  # Install all components")
    console.log("Example: npx buildy-ui@latest add --retry  # Enable retry for unreliable connections")
    console.log("Example: npx buildy-ui@latest add \"https://example.com/component.json\"")
    process.exit(1)
  }
  
  // Get project configuration
  const config = await getConfig()
  if (!config) {
    console.error(chalk.red("❌ buildy is not initialized in this project."))
    console.log("Run 'npx buildy-ui@latest init' first.")
    process.exit(1)
  }
  
  // Choose API based on retry flag
  const getComponentFn = options.retry ? getComponentWithRetry : getComponent
  
  if (options.retry) {
    console.log(chalk.blue("🔄 Retry mode enabled - using enhanced connection logic"))
  }
  
  const results: Array<{ name: string; status: "success" | "error"; error?: string }> = []
  
  for (const componentName of components) {
    const spinner = ora(`Installing ${componentName}...`).start()
    
    try {
      // Get component data (smart search across all categories)
      const component = await getComponentFn(componentName)
      
      if (!component) {
        throw new Error(`Component "${componentName}" not found`)
      }
      
      if (options.dryRun) {
        spinner.succeed(`Would install: ${component.name}`)
        console.log(`   Type: ${component.type}`)
        console.log(`   Files: ${component.files.length}`)
        console.log(`   Dependencies: ${component.dependencies.join(", ") || "none"}`)
        continue
      }
      
      // Install component files
      await installComponentFiles(component, config.componentsDir, options.force)
      
      // Install dependencies
      if (component.dependencies.length > 0) {
        await installDependencies(component.dependencies)
      }
      
      spinner.succeed(`Installed ${component.name}`)
      results.push({ name: component.name, status: "success" })
      
    } catch (error) {
      spinner.fail(`Failed to install ${componentName}`)
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

async function addAllComponents(options: AddOptions) {
  console.log(chalk.blue("🚀 Installing all available components..."))
  
  // Get project configuration
  const config = await getConfig()
  if (!config) {
    console.error(chalk.red("❌ buildy is not initialized in this project."))
    console.log("Run 'npx buildy-ui@latest init' first.")
    process.exit(1)
  }
  
  // Choose API based on retry flag
  const getAllComponentsFn = options.retry ? getAllComponentsWithRetry : getAllComponents
  
  if (options.retry) {
    console.log(chalk.blue("🔄 Retry mode enabled - using enhanced connection logic"))
  }
  
  const spinner = ora("Fetching component list...").start()
  
  try {
    const allComponents = await getAllComponentsFn()
    
    if (allComponents.length === 0) {
      spinner.fail("No components found in registry")
      console.log(chalk.yellow("\n⚠️  Registry temporarily unavailable"))
      console.log("Try these alternatives:")
      console.log("  • Check your internet connection")
      console.log("  • Use --retry flag: npx buildy-ui@latest add --all --retry")
      console.log("  • Use VPN if available")
      console.log("  • Install from URL: npx buildy-ui@latest add 'https://...'")
      console.log("  • Check https://buildy.tw for manual download")
      return
    }
    
    spinner.succeed(`Found ${allComponents.length} components`)
    
    if (options.dryRun) {
      console.log(chalk.blue("\n📋 Would install:"))
      allComponents.forEach(comp => {
        console.log(`   - ${comp.name} (${comp.type})`)
      })
      return
    }
    
    const results: Array<{ name: string; status: "success" | "error"; error?: string }> = []
    
    for (const component of allComponents) {
      const componentSpinner = ora(`Installing ${component.name}...`).start()
      
      try {
        // Install component files
        await installComponentFiles(component, config.componentsDir, options.force)
        
        // Install dependencies
        if (component.dependencies.length > 0) {
          await installDependencies(component.dependencies)
        }
        
        componentSpinner.succeed(`Installed ${component.name}`)
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
    console.log(`   ✅ Successful: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)
    
    if (successful.length > 0) {
      console.log(chalk.green("\n🎉 All components installed successfully!"))
      console.log("You can now import and use them in your project.")
    }
    
    if (failed.length > 0) {
      process.exit(1)
    }
    
  } catch (error) {
    spinner.fail("Failed to fetch components")
    console.error(chalk.red("❌ Error:"), (error as Error).message)
    console.log(chalk.yellow("\n⚠️  Registry temporarily unavailable"))
    console.log("Try these alternatives:")
    console.log("  • Check your internet connection")
    console.log("  • Use --retry flag: npx buildy-ui@latest add --all --retry")
    console.log("  • Use VPN if available")
    console.log("  • Install from URL: npx buildy-ui@latest add 'https://...'")
    console.log("  • Check https://buildy.tw for manual download")
    process.exit(1)
  }
}

async function installComponentFiles(
  component: Component, 
  componentsDir: string, 
  force = false
): Promise<void> {
  for (const file of component.files) {
    // Extract just the filename from the full path
    const fileName = path.basename(file.path)
    
    // Determine the full path based on the component type for utility structure
    let targetPath: string
    if (component.type === "registry:ui") {
      targetPath = path.join(process.cwd(), "utility", "ui", fileName)
    } else if (component.type === "registry:block") {
      targetPath = path.join(process.cwd(), "utility", "blocks", fileName)
    } else if (component.type === "registry:lib") {
      targetPath = path.join(process.cwd(), "lib", fileName)
    } else {
      // registry:component and others go to utility/components
      const targetDir = file.target || getTargetDirFromType(component.type)
      targetPath = path.join(process.cwd(), "utility", targetDir, fileName)
    }
    
    // Check if file already exists
    if (!force && await fs.pathExists(targetPath)) {
      console.log(`   ⚠️  Skipped ${fileName} (already exists, use --force to overwrite)`)
      continue
    }
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(targetPath))
    
    // Write file
    await fs.writeFile(targetPath, file.content, "utf-8")
  }
}

function getTargetDirFromType(type: string): string {
  switch (type) {
    case "registry:ui":
      return "ui"
    case "registry:block":
      return "blocks"
    case "registry:component":
      return "components"
    case "registry:lib":
      return "lib"
    default:
      return "components"
  }
}

async function installDependencies(dependencies: string[]): Promise<void> {
  const spinner = ora("Installing dependencies...").start()
  
  try {
    // Detect package manager
    const packageManager = await detectPackageManager()
    
    const installCommand = packageManager === "npm" 
      ? ["install", ...dependencies]
      : ["add", ...dependencies]
    
    await execa(packageManager, installCommand, {
      cwd: process.cwd(),
      stdio: "pipe"
    })
    
    spinner.succeed("Dependencies installed")
  } catch (error) {
    spinner.fail("Failed to install dependencies")
    throw new Error(`Failed to install dependencies: ${(error as Error).message}`)
  }
}

async function detectPackageManager(): Promise<string> {
  if (await fs.pathExists("bun.lock")) return "bun"
  if (await fs.pathExists("pnpm-lock.yaml")) return "pnpm"
  if (await fs.pathExists("yarn.lock")) return "yarn"
  return "npm"
} 