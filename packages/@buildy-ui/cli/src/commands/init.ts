import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import { isViteProject, hasReact, getConfig, saveConfig, ensureDir } from "../utils/project.js"
import { Config, Component } from "../registry/schema.js"
import { SCHEMA_CONFIG, getCdnUrls, type RegistryType } from "../utils/schema-config.js"
import { CLI_MESSAGES } from "../utils/cli-messages.js"
import path from "path"
import fs from "fs-extra"
import fetch from "node-fetch"

interface InitOptions {
  yes?: boolean
  registry?: string
}

export async function initCommand(options: InitOptions) {
  const registryName = options.registry || SCHEMA_CONFIG.defaultRegistryType
  const registryPath = `./${registryName}`
  
  console.log(chalk.blue(`🚀 ${CLI_MESSAGES.info.initializing(registryName)}`))
  
  // Check if it's a Vite project
  if (!(await isViteProject())) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.notViteProject}`))
    console.log("Please run this command in a Vite project directory.")
    process.exit(1)
  }
  
  // Check if React is installed
  if (!(await hasReact())) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.reactNotInstalled}`))
    console.log("Please install React first: npm install react react-dom")
    process.exit(1)
  }
  
  // Check if already initialized for this registry
  const existingConfig = await getConfig("./src")
  if (existingConfig && !options.yes) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: CLI_MESSAGES.prompts.overwrite(registryName),
      initial: false
    })
    
    if (!overwrite) {
      console.log(chalk.yellow(`⚠️  ${CLI_MESSAGES.info.installationCancelled}`))
      return
    }
  }

  const aliases = SCHEMA_CONFIG.defaultAliases

  let config: Config
  
  if (options.yes) {
    config = {
      $schema: "https://buildy.tw/schema.json",
      framework: "vite-react",
      typescript: true,
      aliases,
      registry: SCHEMA_CONFIG.defaultRegistry,
      componentsDir: SCHEMA_CONFIG.defaultDirectories.components,
      libDir: SCHEMA_CONFIG.defaultDirectories.lib,
    }
  } else {
    // Interactive setup
    const responses = await prompts([
      {
        type: "confirm",
        name: "typescript",
        message: CLI_MESSAGES.prompts.typescript,
        initial: true
      }
    ])
    
    config = {
      $schema: "https://buildy.tw/schema.json",
      framework: "vite-react",
      typescript: responses.typescript,
      aliases,
      registry: SCHEMA_CONFIG.defaultRegistry,
      componentsDir: SCHEMA_CONFIG.defaultDirectories.components,
      libDir: SCHEMA_CONFIG.defaultDirectories.lib,
    }
  }
  
  const spinner = ora(CLI_MESSAGES.info.initializing(registryName)).start()
  
  try {
    // Save configuration under ./src
    await saveConfig(config, "./src")
    
    // Create src-based directory structure
    await ensureDir(config.libDir)
    await ensureDir(config.componentsDir)
    await ensureDir(path.join(config.componentsDir, "ui")) // src/components/ui
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.blocks)
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.layouts)
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.variants)
    
    spinner.text = "Installing core utilities and variants..."
    
    // Install utils and all variants from registry
    await installCoreFiles(registryName as RegistryType, config, spinner)
    
    spinner.succeed(CLI_MESSAGES.success.initialized(registryName))
    
    console.log(chalk.green(`\n✅ ${CLI_MESSAGES.success.setupComplete(registryName)}`))
    console.log("\nDirectories created:")
    console.log(`  ${chalk.cyan("src/lib/")} - Utils, helpers, functions`)
    console.log(`  ${chalk.cyan("src/variants/")} - CVA variant configurations`)
    console.log(`  ${chalk.cyan("src/components/ui/")} - UI components`)
    console.log(`  ${chalk.cyan("src/components/")} - Complex components`)
    console.log(`  ${chalk.cyan("src/layouts/")} - Page layouts and structures`)
    console.log(`  ${chalk.cyan("src/blocks/")} - Component blocks`)
    
    console.log("\nNext steps:")
    CLI_MESSAGES.examples.init.forEach(example => console.log(`  ${chalk.cyan(example)}`))

  } catch (error) {
    spinner.fail(CLI_MESSAGES.errors.buildFailed)
    console.error(chalk.red("❌ Error:"), (error as Error).message)
    process.exit(1)
  }
}

async function installCoreFiles(registryType: RegistryType, config: Config, spinner: ora.Ora): Promise<void> {
  const cdnUrls = getCdnUrls(registryType)
  
  // Try to fetch registry index to get list of variants and utils
  let registryIndex: { components: Array<{ name: string; type: string }> } | null = null
  
  for (const baseUrl of cdnUrls) {
    try {
      const indexUrl = `${baseUrl}/index.json`
      const response = await fetch(indexUrl)
      if (response.ok) {
        registryIndex = await response.json() as typeof registryIndex
        break
      }
    } catch {
      continue
    }
  }
  
  if (!registryIndex) {
    spinner.text = "⚠️  Could not fetch registry index, creating local utils..."
    // Fallback: create utils file locally
    await createUtilsFile(config.libDir, config.typescript)
    return
  }
  
  // Filter variants and lib items
  const variantItems = registryIndex.components.filter(c => c.type === "registry:variants")
  const libItems = registryIndex.components.filter(c => c.type === "registry:lib")
  
  // Install utils (lib items)
  for (const item of libItems) {
    spinner.text = `Installing ${item.name}...`
    await installComponentFromRegistry(item.name, "registry:lib", cdnUrls, config)
  }
  
  // Install all variants
  for (const item of variantItems) {
    spinner.text = `Installing variant: ${item.name}...`
    await installComponentFromRegistry(item.name, "registry:variants", cdnUrls, config)
  }
  
  // Install variants/index.ts
  spinner.text = `Installing variants index...`
  await installVariantsIndex(cdnUrls, config)
  
  spinner.text = `✅ Installed ${libItems.length} utilities and ${variantItems.length} variants`
}

async function installComponentFromRegistry(
  name: string, 
  type: string, 
  cdnUrls: string[], 
  config: Config
): Promise<void> {
  const folder = type === "registry:lib" ? "lib" : type === "registry:variants" ? "components/variants" : "components/ui"
  
  for (const baseUrl of cdnUrls) {
    try {
      const url = `${baseUrl}/${folder}/${name}.json`
      const response = await fetch(url)
      
      if (response.ok) {
        const component = await response.json() as Component
        
        for (const file of component.files) {
          const fileName = path.basename(file.path)
          let targetDir: string
          
          if (type === "registry:lib") {
            targetDir = config.libDir
          } else if (type === "registry:variants") {
            targetDir = SCHEMA_CONFIG.defaultDirectories.variants
          } else {
            targetDir = path.join(config.componentsDir, "ui")
          }
          
          const targetPath = path.join(process.cwd(), targetDir, fileName)
          await fs.ensureDir(path.dirname(targetPath))
          await fs.writeFile(targetPath, file.content || "", "utf-8")
        }
        return
      }
    } catch {
      continue
    }
  }
}

async function installVariantsIndex(cdnUrls: string[], config: Config): Promise<void> {
  for (const baseUrl of cdnUrls) {
    try {
      // Try to fetch index component from variants
      const url = `${baseUrl}/components/variants/index.json`
      const response = await fetch(url)
      
      if (response.ok) {
        const component = await response.json() as Component
        
        for (const file of component.files) {
          const fileName = path.basename(file.path)
          const targetDir = SCHEMA_CONFIG.defaultDirectories.variants
          const targetPath = path.join(process.cwd(), targetDir, fileName)
          await fs.ensureDir(path.dirname(targetPath))
          await fs.writeFile(targetPath, file.content || "", "utf-8")
        }
        return
      }
    } catch {
      // Fallback: just continue if index doesn't exist
      continue
    }
  }
}

async function createUtilsFile(libDir: string, typescript: boolean): Promise<void> {
  const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`

  const fileName = typescript ? "utils.ts" : "utils.js"
  const filePath = path.join(process.cwd(), libDir, fileName)
  
  await fs.writeFile(filePath, utilsContent, "utf-8")
}
