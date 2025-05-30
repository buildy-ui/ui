import * as ts from "typescript"
import fs from "fs-extra"
import * as path from "path"
import { glob } from "glob"

interface ComponentInfo {
  name: string
  type: "registry:ui" | "registry:lib" | "registry:block" | "registry:component"
  description?: string
  dependencies: string[]
  devDependencies: string[]
  files: Array<{
    path: string
    target: string
  }>
}

interface ScanConfig {
  pattern: string
  type: ComponentInfo["type"]
  target: string
}

const scanConfigs: ScanConfig[] = [
  {
    pattern: "packages/ui/src/ui/*.{ts,tsx}",
    type: "registry:ui",
    target: "ui"
  },
  {
    pattern: "packages/ui/src/lib/*.{ts,tsx}",
    type: "registry:lib",
    target: "lib"
  },
  {
    pattern: "packages/ui/src/blocks/*.{ts,tsx}",
    type: "registry:block",
    target: "blocks"
  },
  {
    pattern: "packages/ui/src/components/*.{ts,tsx}",
    type: "registry:component",
    target: "components"
  }
]

async function generateRegistry() {
  console.log("🔍 Scanning for components...")
  
  const baseDir = process.cwd()
  console.log("📂 Base directory:", baseDir)
  
  const components: ComponentInfo[] = []
  
  for (const config of scanConfigs) {
    console.log(`\n📁 Scanning pattern: ${config.pattern}`)
    const patternComponents = await scanByPattern(baseDir, config)
    components.push(...patternComponents)
  }
  
  // Generate registry.json
  const registry = {
    $schema: "https://buildy.tw/schema/registry.json",
    items: components
  }
  
  const outputPath = path.join(baseDir, "packages/ui/src/registry.json")
  await fs.ensureDir(path.dirname(outputPath))
  await fs.writeFile(outputPath, JSON.stringify(registry, null, 2))
  
  console.log(`\n✅ Generated registry with ${components.length} components`)
  console.log(`📄 Output: ${outputPath}`)
  
  // Display found components
  if (components.length > 0) {
    console.log("\n📦 Found components:")
    components.forEach(comp => {
      console.log(`  - ${comp.name} (${comp.type})`)
      console.log(`    File: ${comp.files[0].path}`)
      console.log(`    Dependencies: ${comp.dependencies.join(', ') || 'none'}`)
      if (comp.description) {
        console.log(`    Description: ${comp.description}`)
      }
    })
  } else {
    console.log("\n⚠️  No components found!")
  }
}

async function scanByPattern(baseDir: string, config: ScanConfig): Promise<ComponentInfo[]> {
  try {
    // Use working options from test-scan
    const files = await glob(config.pattern, { 
      cwd: baseDir,
      windowsPathsNoEscape: true 
    })
    
    console.log(`  📄 Found ${files.length} files`)
    files.forEach(file => console.log(`    - ${file}`))
    
    const components: ComponentInfo[] = []
    
    for (const filePath of files) {
      console.log(`  🔍 Analyzing: ${path.basename(filePath)}`)
      const component = await analyzeComponent(filePath, config, baseDir)
      if (component) {
        console.log(`    ✅ Component found: ${component.name}`)
        components.push(component)
      } else {
        console.log(`    ❌ No exports found`)
      }
    }
    
    return components
  } catch (error) {
    console.error(`❌ Error scanning pattern ${config.pattern}:`, (error as Error).message)
    return []
  }
}

async function analyzeComponent(
  filePath: string,
  config: ScanConfig,
  baseDir: string
): Promise<ComponentInfo | null> {
  try {
    const fullPath = path.join(baseDir, filePath)
    const content = await fs.readFile(fullPath, "utf-8")
    
    console.log(`    📄 File content length: ${content.length}`)
    
    const sourceFile = ts.createSourceFile(
      fullPath,
      content,
      ts.ScriptTarget.Latest,
      true
    )
    
    // Use path.posix for Unix-style paths
    const unixPath = filePath.split(path.sep).join(path.posix.sep)
    
    const componentInfo: ComponentInfo = {
      name: path.basename(filePath, path.extname(filePath)),
      type: config.type,
      dependencies: [],
      devDependencies: [],
      files: [{
        path: unixPath,
        target: config.target
      }]
    }
    
    // Analyze AST
    const analysis = analyzeAST(sourceFile)
    console.log(`    🔍 Analysis result:`, {
      hasExports: analysis.hasExports,
      dependencies: analysis.dependencies.length,
      description: analysis.description ? 'found' : 'none'
    })
    
    componentInfo.dependencies = analysis.dependencies
    componentInfo.description = analysis.description
    
    // Filter only exportable components
    if (analysis.hasExports) {
      return componentInfo
    }
    
    return null
  } catch (error) {
    console.warn(`⚠️  Failed to analyze ${filePath}:`, (error as Error).message)
    return null
  }
}

interface ASTAnalysis {
  dependencies: string[]
  description?: string
  hasExports: boolean
}

function analyzeAST(sourceFile: ts.SourceFile): ASTAnalysis {
  const dependencies = new Set<string>()
  let description: string | undefined
  let hasExports = false
  
  function visit(node: ts.Node) {
    // Analyze imports
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier
      if (ts.isStringLiteral(moduleSpecifier)) {
        const moduleName = moduleSpecifier.text
        console.log(`      📦 Import found: ${moduleName}`)
        
        // Add only external dependencies
        if (!moduleName.startsWith(".") && 
            !moduleName.startsWith("@/") && 
            !moduleName.startsWith("~/")) {
          dependencies.add(moduleName)
        }
      }
    }
    
    // Analyze exports
    if (ts.isExportDeclaration(node)) {
      console.log(`      🚀 Export declaration found`)
      hasExports = true
    } else if (ts.isExportAssignment(node)) {
      console.log(`      🚀 Export assignment found`)
      hasExports = true
    } else if (hasExportModifier(node)) {
      if (ts.isFunctionDeclaration(node)) {
        console.log(`      🚀 Exported function: ${node.name?.text || 'anonymous'}`)
      } else if (ts.isVariableStatement(node)) {
        console.log(`      🚀 Exported variable statement`)
      } else if (ts.isClassDeclaration(node)) {
        console.log(`      🚀 Exported class: ${node.name?.text || 'anonymous'}`)
      }
      hasExports = true
    }
    
    // Search for JSDoc comments
    const jsDocComment = getJSDocComment(node)
    if (jsDocComment && !description) {
      console.log(`      📝 Description found: ${jsDocComment.substring(0, 50)}...`)
      description = jsDocComment
    }
    
    ts.forEachChild(node, visit)
  }
  
  visit(sourceFile)
  
  return {
    dependencies: Array.from(dependencies),
    description,
    hasExports
  }
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

// Run
generateRegistry().catch(console.error)
