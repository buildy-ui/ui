import chalk from "chalk"
import ora from "ora"
import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import { getComponent } from "../registry/api.js"
import { getConfig } from "../utils/project.js"
import { Component, ComponentFile } from "../registry/schema.js"

interface AddOptions {
  semantic?: boolean
  force?: boolean
  dryRun?: boolean
}

export async function addCommand(components: string[], options: AddOptions) {
  if (components.length === 0) {
    console.error(chalk.red("❌ Please specify at least one component to add."))
    console.log("Example: buildy add button card")
    process.exit(1)
  }
  
  // Get project configuration
  const config = await getConfig()
  if (!config) {
    console.error(chalk.red("❌ buildy is not initialized in this project."))
    console.log("Run 'buildy init' first.")
    process.exit(1)
  }
  
  const category = options.semantic ? "semantic" : "ui"
  const results: Array<{ name: string; status: "success" | "error"; error?: string }> = []
  
  for (const componentName of components) {
    const spinner = ora(`Installing ${componentName}...`).start()
    
    try {
      // Get component data
      const component = await getComponent(componentName, category)
      
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
      console.error(chalk.red(`   Error: ${error.message}`))
      results.push({ 
        name: componentName, 
        status: "error", 
        error: error.message 
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

async function installComponentFiles(
  component: Component, 
  componentsDir: string, 
  force = false
): Promise<void> {
  for (const file of component.files) {
    const targetDir = file.target || component.type
    const targetPath = path.join(process.cwd(), componentsDir, targetDir, file.path)
    
    // Check if file already exists
    if (!force && await fs.pathExists(targetPath)) {
      throw new Error(`File ${file.path} already exists. Use --force to overwrite.`)
    }
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(targetPath))
    
    // Write file
    await fs.writeFile(targetPath, file.content, "utf-8")
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
    throw new Error(`Failed to install dependencies: ${error.message}`)
  }
}

async function detectPackageManager(): Promise<string> {
  if (await fs.pathExists("bun.lockb")) return "bun"
  if (await fs.pathExists("pnpm-lock.yaml")) return "pnpm"
  if (await fs.pathExists("yarn.lock")) return "yarn"
  return "npm"
} 