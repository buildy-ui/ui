import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import { glob } from "glob"
import * as ts from "typescript"
import { SCHEMA_CONFIG, isExternalDependency, TYPE_TO_FOLDER } from "../utils/schema-config.js"
import { CLI_MESSAGES } from "../utils/cli-messages.js"

interface ScanOptions {
  cwd: string
  registry: string
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
  devDependencies: string[]
  files: ComponentFile[]
}

interface ASTAnalysis {
  dependencies: string[]
  devDependencies: string[]
  description?: string
  hasExports: boolean
}

// Dev dependency patterns
const DEV_PATTERNS = [
  '@types/',
  'eslint',
  'prettier',
  'typescript',
  'jest',
  'vitest',
  'testing-library',
  '@testing-library/',
  'storybook',
  '@storybook/',
  'webpack',
  'vite',
  'rollup',
  'babel',
  '@babel/',
  'postcss',
  'tailwindcss',
  'autoprefixer'
] as const

export async function scanCommand(
  options: { cwd?: string; registry?: string; output?: string; source?: string } = {}
) {
  const registryName = options.registry || SCHEMA_CONFIG.defaultRegistryType
  const registryPath = `./${registryName}`
  
  const scanOptions: ScanOptions = {
    cwd: path.resolve(options.cwd || process.cwd()),
    registry: path.resolve(registryPath),
    outputFile: path.resolve(options.output || registryPath + "/registry.json"),
    sourceDir: path.resolve(options.source || "./src"),
  }

  console.log(chalk.blue(`🔍 ${CLI_MESSAGES.info.scanningComponents(registryName)}`))
  
  try {
    const spinner = ora(CLI_MESSAGES.info.scanningDirectories).start()
    
    // Scan different component types
    const uiComponents = await scanDirectory(path.join(scanOptions.sourceDir, "ui"), "registry:ui")
    const blockComponents = await scanDirectory(path.join(scanOptions.sourceDir, "blocks"), "registry:block")
    const componentComponents = await scanDirectory(path.join(scanOptions.sourceDir, "components"), "registry:component")
    const layoutComponents = await scanDirectory(path.join(scanOptions.sourceDir, "layouts"), "registry:layout")
    
    // Scan lib directory (under src)
    const libDir = path.join(scanOptions.cwd, "src", "lib")
    const libComponents = await scanDirectory(libDir, "registry:lib")
    
    const allComponents = [
      ...uiComponents,
      ...blockComponents,
      ...componentComponents,
      ...layoutComponents,
      ...libComponents
    ]
    
    spinner.text = CLI_MESSAGES.info.analyzingDeps.replace("{count}", allComponents.length.toString())
    
    // Analyze each component for dependencies and devDependencies
    for (const component of allComponents) {
      const analysis = await analyzeComponentDependencies(component.files, scanOptions.cwd)
      component.dependencies = analysis.dependencies
      component.devDependencies = analysis.devDependencies
      
      // Update description if found during analysis
      if (analysis.description && !component.description) {
        component.description = analysis.description
      }
    }
    
    // Create registry with dynamic registry name
    const registry = {
      $schema: "https://buildy.tw/schema/registry.json",
      items: allComponents,
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      registry: registryName
    }
    
    // Ensure output directory exists
    await fs.ensureDir(path.dirname(scanOptions.outputFile))
    
    // Write registry file
    await fs.writeFile(scanOptions.outputFile, JSON.stringify(registry, null, 2))
    
    spinner.succeed(CLI_MESSAGES.status.scannedComponents(allComponents.length))
    
    console.log(chalk.green(`✅ ${CLI_MESSAGES.success.registryGenerated(registryName)}`))
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
    
    // Show dependency summary
    const allDeps = new Set<string>()
    const allDevDeps = new Set<string>()
    allComponents.forEach(comp => {
      comp.dependencies.forEach(dep => allDeps.add(dep))
      comp.devDependencies.forEach(dep => allDevDeps.add(dep))
    })
    
    console.log(chalk.blue("\n📦 Dependencies Summary:"))
    console.log(`   Dependencies: ${allDeps.size} unique (${Array.from(allDeps).join(", ") || "none"})`)
    console.log(`   DevDependencies: ${allDevDeps.size} unique (${Array.from(allDevDeps).join(", ") || "none"})`)
    
  } catch (error) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.scanFailed}`), (error as Error).message)
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
        dependencies: [],
        devDependencies: [],
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

async function analyzeComponentDependencies(files: ComponentFile[], cwd: string): Promise<{
  dependencies: string[]
  devDependencies: string[]
  description?: string
}> {
  const allDependencies = new Set<string>()
  const allDevDependencies = new Set<string>()
  let description: string | undefined
  
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
      
      const analysis = analyzeAST(sourceFile)
      
      // Merge dependencies
      analysis.dependencies.forEach(dep => allDependencies.add(dep))
      analysis.devDependencies.forEach(dep => allDevDependencies.add(dep))
      
      // Use first found description
      if (analysis.description && !description) {
        description = analysis.description
      }
      
    } catch (error) {
      console.warn(CLI_MESSAGES.errors.failedToAnalyzeDeps(file.path), (error as Error).message)
    }
  }
  
  return {
    dependencies: Array.from(allDependencies),
    devDependencies: Array.from(allDevDependencies),
    description
  }
}

function analyzeAST(sourceFile: ts.SourceFile): ASTAnalysis {
  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  let description: string | undefined
  let hasExports = false
  
  function visit(node: ts.Node) {
    // Analyze imports
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier
      if (ts.isStringLiteral(moduleSpecifier)) {
        const moduleName = moduleSpecifier.text
        
        // Add only external dependencies using the same logic as generate-registry.ts
        if (isExternalDependency(moduleName)) {
          // Determine if it's a dev dependency based on common patterns
          if (isDevDependency(moduleName)) {
            devDependencies.add(moduleName)
          } else {
            dependencies.add(moduleName)
          }
        }
      }
    }
    
    // Analyze exports
    if (ts.isExportDeclaration(node)) {
      hasExports = true
    } else if (ts.isExportAssignment(node)) {
      hasExports = true
    } else if (hasExportModifier(node)) {
      hasExports = true
    }
    
    // Search for JSDoc comments
    const jsDocComment = getJSDocComment(node)
    if (jsDocComment && !description) {
      description = jsDocComment
    }
    
    ts.forEachChild(node, visit)
  }
  
  visit(sourceFile)
  
  return {
    dependencies: Array.from(dependencies),
    devDependencies: Array.from(devDependencies),
    description,
    hasExports
  }
}

function isDevDependency(moduleName: string): boolean {
  return DEV_PATTERNS.some(pattern => moduleName.includes(pattern))
}

function hasExportModifier(node: ts.Node): boolean {
  if ('modifiers' in node && node.modifiers) {
    return (node.modifiers as ts.NodeArray<ts.Modifier>).some(
      mod => mod.kind === ts.SyntaxKind.ExportKeyword
    )
  }
  return false
}

function getJSDocComment(node: ts.Node): string | undefined {
  try {
    // Get JSDoc comments
    const jsDocTags = ts.getJSDocCommentsAndTags(node)
    
    for (const tag of jsDocTags) {
      if (ts.isJSDoc(tag) && tag.comment) {
        if (typeof tag.comment === 'string') {
          return tag.comment.trim()
        } else if (Array.isArray(tag.comment)) {
          return tag.comment.map(part => part.text).join('').trim()
        }
      }
    }
  } catch (error) {
    // Ignore JSDoc parsing errors
  }
  
  return undefined
}

function getTargetFromType(type: string): string {
  const folder = TYPE_TO_FOLDER[type as keyof typeof TYPE_TO_FOLDER]
  return folder || "components"
} 