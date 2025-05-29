import fs from "fs-extra"
import * as path from "path"

async function quickTest() {
  const baseDir = process.cwd()
  console.log("🔍 Quick component test")
  
  const files = [
    "packages/ui/src/components/ui/button.tsx",
    "packages/ui/src/lib/utils.ts",
    "packages/ui/src/components/blocks/hero-section.tsx"
  ]
  
  for (const file of files) {
    const fullPath = path.join(baseDir, file)
    const exists = await fs.pathExists(fullPath)
    
    if (exists) {
      const content = await fs.readFile(fullPath, "utf-8")
      const hasExport = /export\s+(const|function|class|default|{)/.test(content)
      const imports = content.match(/import\s+.*?\s+from\s+["']([^"']+)["']/g) || []
      
      console.log(`✅ ${file}`)
      console.log(`   Size: ${content.length} chars`)
      console.log(`   Has exports: ${hasExport}`)
      console.log(`   Imports: ${imports.length}`)
      
      // Показываем внешние зависимости
      const externalDeps = imports
        .map(imp => imp.match(/from\s+["']([^"']+)["']/)?.[1])
        .filter(dep => dep && !dep.startsWith('.') && !dep.startsWith('@/'))
      
      if (externalDeps.length > 0) {
        console.log(`   Dependencies: ${externalDeps.join(', ')}`)
      }
    } else {
      console.log(`❌ ${file} - not found`)
    }
  }
}

quickTest().catch(console.error)
