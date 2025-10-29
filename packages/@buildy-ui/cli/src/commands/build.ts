import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import { registrySchema, registryItemSchema } from "../registry/build-schema.js"
import { generateConfigSchema, generateRegistrySchema, generateRegistryItemSchema } from "../utils/schema-generator.js"
import { TYPE_TO_FOLDER, SCHEMA_CONFIG } from "../utils/schema-config.js"
import { CLI_MESSAGES } from "../utils/cli-messages.js"

interface BuildOptions {
  cwd: string
  registryFile: string
  outputDir: string
}

export async function buildCommand(
  registryPath = "./src/registry.json",
  options: { output?: string; cwd?: string } = {}
) {
  const buildOptions: BuildOptions = {
    cwd: path.resolve(options.cwd || process.cwd()),
    registryFile: path.resolve(registryPath),
    outputDir: path.resolve(options.output || "./packages/registry/r/ui"),
  }

  console.log(chalk.blue(CLI_MESSAGES.info.building))
  
  try {
    // Read registry.json
    const registryContent = await fs.readFile(buildOptions.registryFile, "utf-8")
    const registryData = JSON.parse(registryContent)
    
    // Validate schema
    const registry = registrySchema.parse(registryData)
    
    // Create output directory
    await fs.ensureDir(buildOptions.outputDir)
    
    // Generate schema files
    await generateSchemaFiles(buildOptions.outputDir)
    
    const spinner = ora(CLI_MESSAGES.info.processingComponents).start()
    
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
          throw new Error(CLI_MESSAGES.errors.fileNotFound(file.path))
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
    
    spinner.succeed(CLI_MESSAGES.status.builtComponents(registry.items.length))
    
    // Create index file
    await createIndexFile(registry, buildOptions.outputDir)
    
    // Copy core-classes.json to registry if it exists
    await copyCoreClassesFile(buildOptions)
    
    console.log(chalk.green(`✅ ${CLI_MESSAGES.success.registryBuilt}`))
    console.log(`Output: ${buildOptions.outputDir}`)
    console.log(chalk.green(`✅ ${CLI_MESSAGES.success.schemasGenerated}`))
    
  } catch (error) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.buildFailed}`), (error as Error).message)
    process.exit(1)
  }
}

function getOutputDir(type: string): string {
  const folder = TYPE_TO_FOLDER[type as keyof typeof TYPE_TO_FOLDER]
  return folder || "misc"
}

async function createIndexFile(registry: any, outputDir: string) {
  const index = {
    $schema: "https://buildy.tw/schema/registry.json",
    components: registry.items.map((item: any) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
    })),
    categories: SCHEMA_CONFIG.componentCategories,
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    registry: registry?.registry || path.basename(outputDir),
  }
  
  await fs.writeFile(
    path.join(outputDir, "index.json"),
    JSON.stringify(index, null, 2)
  )
}

async function copyCoreClassesFile(buildOptions: BuildOptions) {
  const sourceFile = path.join(buildOptions.cwd, "src/lib/core-classes.json")
  const libDir = path.join(buildOptions.outputDir, "lib")
  const targetFile = path.join(libDir, "core-classes.json")
  
  try {
    if (await fs.pathExists(sourceFile)) {
      await fs.ensureDir(libDir)
      await fs.copy(sourceFile, targetFile)
      console.log(chalk.gray(`   📄 Copied core-classes.json to lib/`))
    }
  } catch (error) {
    console.log(chalk.yellow(`   ⚠️  Could not copy core-classes.json: ${(error as Error).message}`))
  }
}

async function generateSchemaFiles(outputDir: string) {
  const registryBaseDir = path.dirname(outputDir)
  
  // Create schema directory
  const schemaDir = path.join(registryBaseDir, "schema")
  await fs.ensureDir(schemaDir)
  
  // Generate schemas dynamically from Zod schemas
  const configSchemaJson = generateConfigSchema()
  const registrySchemaJson = generateRegistrySchema()
  const registryItemSchemaJson = generateRegistryItemSchema()
  
  // Write schema files
  await fs.writeFile(
    path.join(registryBaseDir, "schema.json"),
    JSON.stringify(configSchemaJson, null, 2)
  )
  
  await fs.writeFile(
    path.join(schemaDir, "registry.json"),
    JSON.stringify(registrySchemaJson, null, 2)
  )
  
  await fs.writeFile(
    path.join(schemaDir, "registry-item.json"),
    JSON.stringify(registryItemSchemaJson, null, 2)
  )
}
