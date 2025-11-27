import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import { isViteProject, hasReact, getConfig, saveConfig, ensureDir } from "../utils/project.js"
import { Config } from "../registry/schema.js"
import { SCHEMA_CONFIG } from "../utils/schema-config.js"
import { CLI_MESSAGES } from "../utils/cli-messages.js"
import path from "path"
import fs from "fs-extra"

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
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.blocks)
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.layouts)
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.variants)
    await ensureDir(SCHEMA_CONFIG.defaultDirectories.ui)
    
    spinner.succeed(CLI_MESSAGES.success.initialized(registryName))
    
    console.log(chalk.green(`\n✅ ${CLI_MESSAGES.success.setupComplete(registryName)}`))
    console.log("\nDirectories created:")
    Object.entries(CLI_MESSAGES.directories).forEach(([dir, description]) => {
      console.log(`  ${chalk.cyan(`src/${dir}/`)} - ${description}`)
    })
    
    console.log("\nNext steps:")
    CLI_MESSAGES.examples.init.forEach(example => console.log(`  ${chalk.cyan(example)}`))

  } catch (error) {
    spinner.fail(CLI_MESSAGES.errors.buildFailed)
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
