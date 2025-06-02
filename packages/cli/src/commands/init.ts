import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import { isViteProject, hasReact, getConfig, saveConfig, ensureDir } from "../utils/project.js"
import { Config } from "../registry/schema.js"
import path from "path"
import fs from "fs/promises"

interface InitOptions {
  yes?: boolean
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue("🚀 Initializing UI8Kit buildy in your project..."))
  
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
  
  // Check if already initialized
  const existingConfig = await getConfig()
  if (existingConfig && !options.yes) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "UI8Kit buildy is already initialized. Overwrite configuration?",
      initial: false
    })
    
    if (!overwrite) {
      console.log(chalk.yellow("⚠️  Initialization cancelled."))
      return
    }
  }

  const aliases = {
    "@": "./src",
    "@/components": "./utility/components",
    "@/ui": "./utility/ui",
    "@/blocks": "./utility/blocks",
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
      componentsDir: "./utility/ui",
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
      componentsDir: "./utility/ui",
      libDir: "./lib",
    }
  }
  
  const spinner = ora("Setting up UI8Kit structure...").start()
  
  try {
    // Save configuration
    await saveConfig(config)
    
    // Create UI8Kit directory structure
    await ensureDir(config.libDir)
    
    // Create utils.ts file in lib directory
    await createUtilsFile(config.libDir, config.typescript)
    
    spinner.succeed("UI8Kit structure initialized successfully!")
    
    console.log(chalk.green("\n✅ UI8Kit Setup complete!"))
    console.log("\nDirectory created:")
    console.log(`  ${chalk.cyan("lib/")} - Utils, helpers, functions`)
    
    console.log("\nNext steps:")
    console.log(`  ${chalk.cyan("npx buildy-ui@latest add button")} - Add a button component`)
    console.log(`  ${chalk.cyan("npx buildy-ui@latest add card input")} - Add multiple components`)
    console.log(`  ${chalk.cyan("npx buildy-ui@latest add --all")} - Add all components`)
    console.log(`  ${chalk.cyan('npx buildy-ui@latest add "https://example.com/component.json"')} - Add from external URL`)

  } catch (error) {
    spinner.fail("Failed to initialize UI8Kit")
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
