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
  
  // In core/form model, registry is always usable
  
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
    "@/components": `./src/components`,
    "@/ui": `./src/ui`,
    "@/blocks": `./src/blocks`,
    "@/lib": "./src/lib"
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
      componentsDir: `./src/ui`,
      libDir: "./src/lib",
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
      componentsDir: `./src/ui`,
      libDir: "./src/lib",
    }
  }
  
  const spinner = ora(`Setting up UI8Kit ${registryName} structure...`).start()
  
  try {
    // Save configuration at project root or registry root
    await saveConfig(config, registryPath)
    
    // Create src-based directory structure
    await ensureDir(config.libDir)
    await ensureDir(config.componentsDir)
    await ensureDir(`./src/components`)
    await ensureDir(`./src/blocks`)
    
    spinner.succeed(`UI8Kit ${registryName} structure initialized successfully!`)
    
    console.log(chalk.green(`\n✅ UI8Kit ${registryName} Setup complete!`))
    console.log("\nDirectories created:")
    console.log(`  ${chalk.cyan("src/lib/")} - Utils, helpers, functions`)
    console.log(`  ${chalk.cyan("src/ui/")} - UI components`)
    console.log(`  ${chalk.cyan("src/components/")} - Complex components`)
    console.log(`  ${chalk.cyan("src/blocks/")} - Component blocks`)
    
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
