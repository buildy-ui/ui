import fs from "fs-extra"
import * as path from "path"
import { glob } from "glob"

async function testScan() {
  const baseDir = process.cwd()
  console.log("Base directory:", baseDir)
  
  // Тестируем разные варианты паттернов
  const patterns = [
    // Вариант 1: с baseDir
    "packages/ui/src/components/ui/**/*.{ts,tsx}",
    // Вариант 2: абсолютный путь
    path.join(baseDir, "packages/ui/src/components/ui/**/*.{ts,tsx}"),
    // Вариант 3: простой паттерн
    "packages/ui/src/components/ui/*.tsx",
    // Вариант 4: с нормализацией пути
    path.posix.join("packages/ui/src/components/ui/**/*.{ts,tsx}")
  ]
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    console.log(`\nTesting pattern ${i + 1}: ${pattern}`)
    
    try {
      // Пробуем разные опции glob
      const files1 = await glob(pattern)
      console.log(`  Default options: ${files1.length} files`)
      
      const files2 = await glob(pattern, { windowsPathsNoEscape: true })
      console.log(`  Windows paths: ${files2.length} files`)
      
      const files3 = await glob(pattern, { 
        cwd: baseDir,
        windowsPathsNoEscape: true 
      })
      console.log(`  With cwd: ${files3.length} files`)
      
      // Показываем найденные файлы
      const allFiles = [...new Set([...files1, ...files2, ...files3])]
      if (allFiles.length > 0) {
        console.log("  Found files:")
        allFiles.forEach(file => console.log(`    - ${file}`))
      }
      
    } catch (error) {
      console.log(`  Error: ${(error as Error).message}`)
    }
  }
  
  // Прямая проверка существования файлов
  console.log("\n🔍 Direct file check:")
  const directPaths = [
    "packages/ui/src/components/ui/button.tsx",
    "packages/ui/src/lib/utils.ts", 
    "packages/ui/src/components/blocks/hero-section.tsx"
  ]
  
  for (const filePath of directPaths) {
    const fullPath = path.join(baseDir, filePath)
    const exists = await fs.pathExists(fullPath)
    console.log(`  ${filePath}: ${exists ? '✅' : '❌'}`)
    
    if (exists) {
      const content = await fs.readFile(fullPath, "utf-8")
      console.log(`    Size: ${content.length} chars`)
      console.log(`    Preview: ${content.substring(0, 100)}...`)
    }
  }
}

testScan().catch(console.error)
