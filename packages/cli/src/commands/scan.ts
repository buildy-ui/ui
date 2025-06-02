import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import { glob } from "glob"
import * as ts from "typescript"

interface ScanOptions {
  cwd: string
  outputFile: string
  sourceDir: string
}

interface ComponentFile {
  path: string
  content?: string
  target?: string
}

interface RegistryItem {
  name: string
  type: string
  description?: string
  dependencies: string[]
  files: ComponentFile[]
}

export async function scanCommand(
  options: { output?: string; cwd?: string; source?: string } = {}
) {
  const scanOptions: ScanOptions = {
    cwd: path.resolve(options.cwd || process.cwd()),
    outputFile: path.resolve(options.output || "./utility/registry.json"),
    sourceDir: path.resolve(options.source || "./utility"),
  }

  console.log(chalk.blue("🔍 Scanning utility components..."))
  
  try {
    const spinner = ora("Scanning directories...").start()
    
    // Scan different component types
    const uiComponents = await scanDirectory(path.join(scanOptions.sourceDir, "ui"), "registry:ui")
    const blockComponents = await scanDirectory(path.join(scanOptions.sourceDir, "blocks"), "registry:block")
    const componentComponents = await scanDirectory(path.join(scanOptions.sourceDir, "components"), "registry:component")
    const templateComponents = await scanDirectory(path.join(scanOptions.sourceDir, "templates"), "registry:template")
    
    // Scan lib directory (at root level)
    const libDir = path.join(scanOptions.cwd, "lib")
    const libComponents = await scanDirectory(libDir, "registry:lib")
    
    const allComponents = [
      ...uiComponents,
      ...blockComponents,
      ...componentComponents,
      ...templateComponents,
      ...libComponents
    ]
    
    spinner.text = `Found ${allComponents.length} components, analyzing...`
    
    // Analyze each component for dependencies
    for (const component of allComponents) {
      component.dependencies = await analyzeDependencies(component.files, scanOptions.cwd)
    }
    
    // Create registry
    const registry = {
      $schema: "https://buildy.tw/schema/registry.json",
      items: allComponents,
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      registry: "utility"
    }
    
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(scanOptions.outputFile))
    
    // Write registry file
    await fs.writeFile(scanOptions.outputFile, JSON.stringify(registry, null, 2))
    
    spinner.succeed(`Scanned ${allComponents.length} components`)
    
    console.log(chalk.green("✅ Registry generated successfully!"))
    console.log(`Output: ${scanOptions.outputFile}`)
    
    // Show summary
    const summary = allComponents.reduce((acc, comp) => {
      acc[comp.type] = (acc[comp.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log(chalk.blue("\n📊 Component Summary:"))
    Object.entries(summary).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })
    
  } catch (error) {
    console.error(chalk.red("❌ Scan failed:"), (error as Error).message)
    process.exit(1)
  }
}

async function scanDirectory(dirPath: string, type: string): Promise<RegistryItem[]> {
  if (!(await fs.pathExists(dirPath))) {
    return []
  }
  
  const components: RegistryItem[] = []
  
  // Find all TypeScript/JavaScript files
  const pattern = path.join(dirPath, "**/*.{ts,tsx,js,jsx}").replace(/\\/g, "/")
  const files = await glob(pattern, { windowsPathsNoEscape: true })
  
  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/")
    const fileName = path.basename(filePath, path.extname(filePath))
    
    // Skip index files and files starting with underscore
    if (fileName === "index" || fileName.startsWith("_")) {
      continue
    }
    
    try {
      const content = await fs.readFile(filePath, "utf-8")
      const description = extractDescription(content)
      
      // Check if file has valid exports
      if (!hasValidExports(content)) {
        continue
      }
      
      components.push({
        name: fileName,
        type,
        description,
        dependencies: [], // Will be filled later
        files: [{
          path: relativePath,
          target: getTargetFromType(type)
        }]
      })
    } catch (error) {
      console.warn(`Warning: Could not process ${filePath}:`, (error as Error).message)
    }
  }
  
  return components
}

function extractDescription(content: string): string {
  // Look for JSDoc comment at the top of the file
  const jsdocMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n\s*\*\//s)
  if (jsdocMatch) {
    return jsdocMatch[1].trim()
  }
  
  // Look for single line comment
  const commentMatch = content.match(/^\/\/\s*(.+)$/m)
  if (commentMatch) {
    return commentMatch[1].trim()
  }
  
  return ""
}

function hasValidExports(content: string): boolean {
  // Check for export statements
  return /export\s+(default\s+)?(function|const|class|interface|type)/m.test(content) ||
         /export\s*\{/.test(content)
}

async function analyzeDependencies(files: ComponentFile[], cwd: string): Promise<string[]> {
  const dependencies = new Set<string>()
  
  for (const file of files) {
    try {
      const filePath = path.resolve(cwd, file.path)
      const content = await fs.readFile(filePath, "utf-8")
      
      // Parse TypeScript/JavaScript to extract imports
      const sourceFile = ts.createSourceFile(
        file.path,
        content,
        ts.ScriptTarget.Latest,
        true
      )
      
      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
          const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text
          
          // Only include external dependencies (not relative imports)
          if (!moduleSpecifier.startsWith(".") && !moduleSpecifier.startsWith("/")) {
            dependencies.add(moduleSpecifier)
          }
        }
        
        ts.forEachChild(node, visit)
      }
      
      visit(sourceFile)
    } catch (error) {
      console.warn(`Warning: Could not analyze dependencies for ${file.path}:`, (error as Error).message)
    }
  }
  
  return Array.from(dependencies)
}

function getTargetFromType(type: string): string {
  switch (type) {
    case "registry:ui":
      return "ui"
    case "registry:block":
      return "blocks"
    case "registry:component":
      return "components"
    case "registry:template":
      return "templates"
    case "registry:lib":
      return "lib"
    default:
      return "components"
  }
} 