import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import { isViteProject, hasReact, getConfig, saveConfig, ensureDir } from "../utils/project.js"
import { Config } from "../registry/schema.js"

interface InitOptions {
  yes?: boolean
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue("🚀 Initializing buildy in your project..."))
  
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
      message: "buildy is already initialized. Overwrite configuration?",
      initial: false
    })
    
    if (!overwrite) {
      console.log(chalk.yellow("⚠️  Initialization cancelled."))
      return
    }
  }
  
  let config: Config
  
  if (options.yes) {
    // Use defaults
    config = {
      framework: "vite-react",
      typescript: true,
      aliases: {
        "@": "./src",
        "@/components": "./src/components",
        "@/ui": "./src/components/ui",
        "@/blocks": "./src/components/blocks",
      },
      registry: "@ui8kit",
      componentsDir: "./src/components",
    }
  } else {
    // Interactive setup
    const responses = await prompts([
      {
        type: "confirm",
        name: "typescript",
        message: "Are you using TypeScript?",
        initial: true
      },
      {
        type: "text",
        name: "componentsDir",
        message: "Where would you like to store your components?",
        initial: "./src/components"
      }
    ])
    
    config = {
      framework: "vite-react",
      typescript: responses.typescript,
      aliases: {
        "@": "./src",
        "@/components": "./src/components",
        "@/ui": "./src/components/ui",
        "@/blocks": "./src/components/blocks",
      },
      registry: "@ui8kit",
      componentsDir: responses.componentsDir,
    }
  }
  
  const spinner = ora("Setting up buildy...").start()
  
  try {
    // Save configuration
    await saveConfig(config)
    
    // Create directories
    await ensureDir(config.componentsDir)
    await ensureDir(`${config.componentsDir}/ui`)
    await ensureDir(`${config.componentsDir}/blocks`)
    
    spinner.succeed("buildy initialized successfully!")
    
    console.log(chalk.green("\n✅ Setup complete!"))
    console.log("\nNext steps:")
    console.log(`  ${chalk.cyan("buildy add button")} - Add a button component`)
    console.log(`  ${chalk.cyan("buildy add card --semantic")} - Add a semantic card component`)
    console.log(`  ${chalk.cyan('buildy add "https://example.com/component.json"')} - Add from external URL`)
    
  } catch (error) {
    spinner.fail("Failed to initialize buildy")
    console.error(chalk.red("❌ Error:"), error.message)
    process.exit(1)
  }
} 