import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import { isViteProject, hasReact, getConfig, saveConfig, ensureDir } from "../utils/project.js"
import { Config } from "../registry/schema.js"
import { SCHEMA_CONFIG } from "../utils/schema-config.js"
import { canUseRegistry, handleValidationError } from "../utils/registry-validator.js"
import path from "path"
import fs from "fs/promises"

interface InitOptions {
  yes?: boolean
  registry?: string
}

export async function initCommand(options: InitOptions) {
  const registryName = options.registry || SCHEMA_CONFIG.defaultRegistryType
  const registryPath = `./${registryName}`
  
  console.log(chalk.blue(`🚀 Initializing UI8Kit buildy in your project (${registryName} registry)...`))
  
  // Validate registry usage (ensure utility is initialized first for non-utility registries)
  const validation = await canUseRegistry(registryName)
  if (!validation.isValid) {
    handleValidationError(validation)
  }
  
  // Check if it's a Vite project
  if (!(await isViteProject())) {
    console.error(chalk.red("❌ This doesn't appear to be a Vite project."))
    console.log("Please run this command in a Vite project directory.")
    process.exit(1)
  }
  
  // Check if React is installed
  if (!(await hasReact())) {
    console.error(chalk.red("❌ React is not installed in this project."))
    console.log("Please install React first: npm install react react-dom")
    process.exit(1)
  }
  
  // Check if already initialized for this registry
  const existingConfig = await getConfig(registryPath)
  if (existingConfig && !options.yes) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `UI8Kit buildy is already initialized for ${registryName} registry. Overwrite configuration?`,
      initial: false
    })
    
    if (!overwrite) {
      console.log(chalk.yellow("⚠️  Initialization cancelled."))
      return
    }
  }

  const aliases = {
    "@": "./src",
    "@/components": `${registryPath}/components`,
    "@/ui": `${registryPath}/ui`,
    "@/blocks": `${registryPath}/blocks`,
    "@/lib": "./lib",
    "@/utility": "./utility",
    "@/semantic": "./semantic",
    "@/theme": "./theme",
  }

  let config: Config
  
  if (options.yes) {
    // Use defaults for UI8Kit structure
    config = {
      $schema: "https://buildy.tw/schema.json",
      framework: "vite-react",
      typescript: true,
      aliases,
      registry: "@ui8kit",
      componentsDir: `${registryPath}/ui`,
      libDir: "./lib",
    }
  } else {
    // Interactive setup
    const responses = await prompts([
      {
        type: "confirm",
        name: "typescript",
        message: "Are you using TypeScript?",
        initial: true
      }
    ])
    
    config = {
      $schema: "https://buildy.tw/schema.json",
      framework: "vite-react",
      typescript: responses.typescript,
      aliases,
      registry: "@ui8kit",
      componentsDir: `${registryPath}/ui`,
      libDir: "./lib",
    }
  }
  
  const spinner = ora(`Setting up UI8Kit ${registryName} structure...`).start()
  
  try {
    // Save configuration to registry-specific directory
    await saveConfig(config, registryPath)
    
    // Create UI8Kit directory structure
    await ensureDir(config.libDir)
    await ensureDir(config.componentsDir)
    await ensureDir(`${registryPath}/components`)
    await ensureDir(`${registryPath}/blocks`)
    
    // Create utils.ts file in lib directory (only for utility registry)
    if (registryName === "utility") {
      await createUtilsFile(config.libDir, config.typescript)
    }
    
    spinner.succeed(`UI8Kit ${registryName} structure initialized successfully!`)
    
    console.log(chalk.green(`\n✅ UI8Kit ${registryName} Setup complete!`))
    console.log("\nDirectories created:")
    if (registryName === "utility") {
      console.log(`  ${chalk.cyan("lib/")} - Utils, helpers, functions`)
    }
    console.log(`  ${chalk.cyan(`${registryPath}/ui/`)} - UI components`)
    console.log(`  ${chalk.cyan(`${registryPath}/components/`)} - Complex components`)
    console.log(`  ${chalk.cyan(`${registryPath}/blocks/`)} - Component blocks`)
    
    console.log("\nNext steps:")
    console.log(`  ${chalk.cyan(`npx buildy-ui@latest add button --registry ${registryName}`)} - Add a button component`)
    console.log(`  ${chalk.cyan(`npx buildy-ui@latest add card input --registry ${registryName}`)} - Add multiple components`)
    console.log(`  ${chalk.cyan(`npx buildy-ui@latest add --all --registry ${registryName}`)} - Add all components`)
    console.log(`  ${chalk.cyan('npx buildy-ui@latest add "https://example.com/component.json"')} - Add from external URL`)

  } catch (error) {
    spinner.fail(`Failed to initialize UI8Kit ${registryName}`)
    console.error(chalk.red("❌ Error:"), (error as Error).message)
    process.exit(1)
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
