import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import { registrySchema, registryItemSchema } from "../registry/build-schema.js"

interface BuildOptions {
  cwd: string
  registryFile: string
  outputDir: string
}

export async function buildCommand(
  registryPath = "./utility/registry.json",
  options: { output?: string; cwd?: string } = {}
) {
  const buildOptions: BuildOptions = {
    cwd: path.resolve(options.cwd || process.cwd()),
    registryFile: path.resolve(registryPath),
    outputDir: path.resolve(options.output || "./packages/registry/r/utility"),
  }

  console.log(chalk.blue("🔨 Building utility registry..."))
  
  try {
    // Read registry.json from utility directory
    const registryContent = await fs.readFile(buildOptions.registryFile, "utf-8")
    const registryData = JSON.parse(registryContent)
    
    // Validate schema
    const registry = registrySchema.parse(registryData)
    
    // Create output directory
    await fs.ensureDir(buildOptions.outputDir)
    
    const spinner = ora("Processing utility components...").start()
    
    for (const item of registry.items) {
      spinner.text = `Building ${item.name}...`
      
      // Add schema
      item.$schema = "https://buildy.tw/schema/registry-item.json"
      
      // Read file contents from utility structure
      for (const file of item.files) {
        const filePath = path.resolve(buildOptions.cwd, file.path)
        
        if (await fs.pathExists(filePath)) {
          file.content = await fs.readFile(filePath, "utf-8")
        } else {
          throw new Error(`File not found: ${file.path}`)
        }
      }
      
      // Validate final item
      const validatedItem = registryItemSchema.parse(item)
      
      // Determine output directory by type
      const typeDir = getOutputDir(validatedItem.type)
      const outputPath = path.join(buildOptions.outputDir, typeDir)
      await fs.ensureDir(outputPath)
      
      // Write file
      const outputFile = path.join(outputPath, `${validatedItem.name}.json`)
      await fs.writeFile(outputFile, JSON.stringify(validatedItem, null, 2))
    }
    
    spinner.succeed(`Built ${registry.items.length} utility components`)
    
    // Create index file
    await createIndexFile(registry, buildOptions.outputDir)
    
    console.log(chalk.green("✅ Utility registry built successfully!"))
    console.log(`Output: ${buildOptions.outputDir}`)
    
  } catch (error) {
    console.error(chalk.red("❌ Build failed:"), (error as Error).message)
    process.exit(1)
  }
}

function getOutputDir(type: string): string {
  switch (type) {
    case "registry:ui":
      return "ui"
    case "registry:component":
      return "components"
    case "registry:block":
      return "blocks"
    case "registry:lib":
      return "lib"
    case "registry:template":
      return "templates"
    default:
      return "misc"
  }
}

async function createIndexFile(registry: any, outputDir: string) {
  const index = {
    $schema: "https://buildy.tw/schema/registry.json",
    components: registry.items.map((item: any) => ({
      name: item.name,
      type: item.type,
      description: item.description,
    })),
    categories: ["ui", "components", "blocks", "lib", "templates"],
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    registry: "utility", // Mark this as utility registry
  }
  
  await fs.writeFile(
    path.join(outputDir, "index.json"),
    JSON.stringify(index, null, 2)
  )
}
