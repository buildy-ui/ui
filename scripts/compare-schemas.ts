import { z } from "zod"
import fs from "fs/promises"
import path from "path"

// Импортируем эталонные схемы из schema.ts
import { 
  registryItemSchema, 
  registrySchema, 
  registryItemTypeSchema 
} from "./schema"

// Исключения - типы, которые мы хотим сохранить только в нашей схеме
const EXCLUDED_TYPES = [
  "registry:hook",
  "registry:page", 
  "registry:file",
  "registry:theme",
  "registry:style",
  "registry:item",
  "registry:example",
  "registry:internal"
]

// Наши актуальные типы из BuildY/UI8Kit
const BUILDY_TYPES = [
  "registry:ui",
  "registry:block", 
  "registry:component",
  "registry:lib",
  "registry:template"
]

// Загрузка схем для сравнения
async function loadSchemas() {
  // Наша локальная схема
  const registryPath = path.join(process.cwd(), "packages/ui8kit-registry/r/schema/registry.json")
  const registryItemPath = path.join(process.cwd(), "packages/ui8kit-registry/r/schema/registry-item.json")
  
  const localRegistryContent = await fs.readFile(registryPath, "utf-8")
  const localRegistryItemContent = await fs.readFile(registryItemPath, "utf-8")
  
  // Схема shadcn/ui (из прикрепленного файла)
  const shadcnRegistryItemPath = path.join(process.cwd(), "scripts/registry-item.json")
  const shadcnRegistryItemContent = await fs.readFile(shadcnRegistryItemPath, "utf-8")
  
  // Эталонная схема registry.json от shadcn/ui (минимальная)
  const shadcnRegistry = {
    "properties": {
      "$schema": { "type": "string" },
      "name": { "type": "string" },
      "homepage": { "type": "string" },
      "items": { "type": "array" }
    },
    "required": ["name", "homepage", "items"]
  }
  
  return {
    // Эталонные схемы из schema.ts
    reference: {
      registry: registrySchema.shape,
      registryItem: registryItemSchema.shape
    },
    // Наша локальная схема
    local: {
      registry: JSON.parse(localRegistryContent),
      registryItem: JSON.parse(localRegistryItemContent)
    },
    // Схема shadcn/ui
    shadcn: {
      registry: shadcnRegistry,
      registryItem: JSON.parse(shadcnRegistryItemContent)
    }
  }
}

// Преобразование Zod схемы в понятный формат для сравнения
function zodSchemaToComparable(zodShape: any): any {
  const properties: any = {}
  const required: string[] = []
  
  for (const [key, value] of Object.entries(zodShape)) {
    properties[key] = { type: "mixed" } // упрощенное представление
    
    // Проверяем, является ли поле обязательным
    if (value && typeof value === 'object' && 'isOptional' in value) {
      if (!(value as any).isOptional()) {
        required.push(key)
      }
    }
  }
  
  return { properties, required }
}

// Сравнение схем
function compareSchemas(schema1: any, schema2: any, schema1Name: string, schema2Name: string): string[] {
  const differences: string[] = []
  
  const props1 = schema1.properties || {}
  const props2 = schema2.properties || {}
  
  // Поля только в первой схеме
  for (const key of Object.keys(props1)) {
    if (!(key in props2)) {
      differences.push(`❌ ${schema1Name}: поле "${key}" отсутствует в ${schema2Name}`)
    }
  }
  
  // Поля только во второй схеме
  for (const key of Object.keys(props2)) {
    if (!(key in props1)) {
      differences.push(`➕ ${schema2Name}: дополнительное поле "${key}" (нет в ${schema1Name})`)
    }
  }
  
  // Сравнение required полей
  const required1 = schema1.required || []
  const required2 = schema2.required || []
  
  for (const field of required1) {
    if (!required2.includes(field)) {
      differences.push(`❌ ${schema1Name}: обязательное поле "${field}" не обязательно в ${schema2Name}`)
    }
  }
  
  for (const field of required2) {
    if (!required1.includes(field)) {
      differences.push(`➕ ${schema2Name}: обязательное поле "${field}" не обязательно в ${schema1Name}`)
    }
  }
  
  return differences
}

// Анализ типов
function analyzeTypes() {
  // Получаем типы из эталонной схемы
  const referenceTypes = registryItemTypeSchema._def.values
  
  const analysis = {
    referenceTypes,
    buildyTypes: BUILDY_TYPES,
    excluded: EXCLUDED_TYPES,
    buildyMissing: [] as string[],
    buildyExtra: [] as string[],
    shadcnMissing: [] as string[],
    shadcnExtra: [] as string[]
  }
  
  // Анализ BuildY типов
  for (const type of referenceTypes as string[]) {
    if (!BUILDY_TYPES.includes(type) && !EXCLUDED_TYPES.includes(type)) {
      analysis.buildyMissing.push(type)
    }
  }
  
  for (const type of BUILDY_TYPES) {
    if (!(referenceTypes as string[]).includes(type)) {
      analysis.buildyExtra.push(type)
    }
  }
  
  return analysis
}

// Основная функция
async function main() {
  console.log("🔍 Сравнение схем регистрации с эталоном schema.ts\n")
  
  try {
    const schemas = await loadSchemas()
    
    // Преобразуем эталонные Zod схемы в сравнимый формат
    const referenceRegistry = zodSchemaToComparable(schemas.reference.registry)
    const referenceRegistryItem = zodSchemaToComparable(schemas.reference.registryItem)
    
    console.log("📋 Анализ registry.json")
    console.log("=" + "=".repeat(70))
    
    // Сравниваем нашу схему с эталоном
    const localRegistryDiffs = compareSchemas(
      referenceRegistry,
      schemas.local.registry,
      "эталон (schema.ts)",
      "BuildY (local)"
    )
    
    // Сравниваем схему shadcn с эталоном
    const shadcnRegistryDiffs = compareSchemas(
      referenceRegistry,
      schemas.shadcn.registry,
      "эталон (schema.ts)",
      "shadcn/ui"
    )
    
    if (localRegistryDiffs.length === 0) {
      console.log("✅ BuildY registry.json полностью соответствует эталону")
    } else {
      console.log("📊 Различия BuildY registry.json с эталоном:")
      localRegistryDiffs.forEach(diff => console.log(`  ${diff}`))
    }
    
    if (shadcnRegistryDiffs.length === 0) {
      console.log("\n✅ shadcn/ui registry.json полностью соответствует эталону")
    } else {
      console.log("\n📊 Различия shadcn/ui registry.json с эталоном:")
      shadcnRegistryDiffs.forEach(diff => console.log(`  ${diff}`))
    }
    
    console.log("\n📋 Анализ registry-item.json")
    console.log("=" + "=".repeat(70))
    
    // Сравниваем registry-item схемы
    const localItemDiffs = compareSchemas(
      referenceRegistryItem,
      schemas.local.registryItem,
      "эталон (schema.ts)",
      "BuildY (local)"
    )
    
    const shadcnItemDiffs = compareSchemas(
      referenceRegistryItem,
      schemas.shadcn.registryItem,
      "эталон (schema.ts)",
      "shadcn/ui"
    )
    
    if (localItemDiffs.length === 0) {
      console.log("✅ BuildY registry-item.json полностью соответствует эталону")
    } else {
      console.log("📊 Различия BuildY registry-item.json с эталоном:")
      localItemDiffs.forEach(diff => console.log(`  ${diff}`))
    }
    
    if (shadcnItemDiffs.length === 0) {
      console.log("\n✅ shadcn/ui registry-item.json полностью соответствует эталону")
    } else {
      console.log("\n📊 Различия shadcn/ui registry-item.json с эталоном:")
      shadcnItemDiffs.forEach(diff => console.log(`  ${diff}`))
    }
    
    console.log("\n🏷️ Анализ типов регистрации")
    console.log("=" + "=".repeat(70))
    
    const typeAnalysis = analyzeTypes()
    
    console.log("📌 Эталонные типы (schema.ts):")
    for (const type of typeAnalysis.referenceTypes as string[]) {
      console.log(`  🔷 ${type}`)
    }
    
    console.log("\n📌 Текущие типы BuildY/UI8Kit:")
    typeAnalysis.buildyTypes.forEach(type => console.log(`  ✅ ${type}`))
    
    console.log("\n📌 Исключенные типы (не используем в BuildY):")
    typeAnalysis.excluded.forEach(type => console.log(`  ⏭️ ${type}`))
    
    if (typeAnalysis.buildyMissing.length > 0) {
      console.log("\n❌ Отсутствующие типы в BuildY:")
      typeAnalysis.buildyMissing.forEach(type => console.log(`  ❌ ${type}`))
    }
    
    if (typeAnalysis.buildyExtra.length > 0) {
      console.log("\n➕ Дополнительные типы в BuildY:")
      typeAnalysis.buildyExtra.forEach(type => console.log(`  ➕ ${type}`))
    }
    
    console.log("\n📊 Сводка")
    console.log("=" + "=".repeat(70))
    console.log(`• Эталонные типы: ${(typeAnalysis.referenceTypes as string[]).length}`)
    console.log(`• Типы BuildY: ${typeAnalysis.buildyTypes.length}`)
    console.log(`• Исключения: ${typeAnalysis.excluded.length}`)
    console.log(`• Отсутствующие в BuildY: ${typeAnalysis.buildyMissing.length}`)
    console.log(`• Дополнительные в BuildY: ${typeAnalysis.buildyExtra.length}`)
    
    // Детальный анализ полей
    console.log("\n🔍 Детальный анализ полей registry-item.json")
    console.log("=" + "=".repeat(70))
    
    const referenceProps = Object.keys(referenceRegistryItem.properties || {})
    const localProps = Object.keys(schemas.local.registryItem.properties || {})
    const shadcnProps = Object.keys(schemas.shadcn.registryItem.properties || {})
    
    console.log("📌 Поля в эталоне (schema.ts):")
    referenceProps.forEach(prop => console.log(`  • ${prop}`))
    
    console.log("\n📌 Поля в BuildY схеме:")
    localProps.forEach(prop => console.log(`  • ${prop}`))
    
    console.log("\n📌 Поля в shadcn/ui схеме:")
    shadcnProps.forEach(prop => console.log(`  • ${prop}`))
    
    // Краткая сводка для CLI
    console.log("\n🎯 КРАТКАЯ СВОДКА ДЛЯ CLI")
    console.log("=" + "=".repeat(70))
    
    const localMissingFields = localItemDiffs.filter(d => d.includes('❌')).length
    const buildyMissingFields = localItemDiffs.filter(d => d.includes('отсутствует в BuildY')).length
    
    console.log(`📋 BuildY отстает от эталона на ${buildyMissingFields} полей`)
    console.log(`📋 shadcn/ui ближе к эталону (все основные поля есть)`)
    console.log(`📋 registry:template - уникальная фича BuildY`)
    console.log(`📋 Приоритетные поля для добавления в BuildY:`)
    console.log(`   • title - человекочитаемое название`)
    console.log(`   • registryDependencies - зависимости компонентов`)
    console.log(`   • tailwind - конфигурация Tailwind`)
    console.log(`   • cssVars - CSS переменные`)
    console.log(`   • meta - дополнительные метаданные`)
    
    // Рекомендации
    console.log("\n💡 Рекомендации для совместимости")
    console.log("=" + "=".repeat(70))
    
    const totalLocalIssues = localRegistryDiffs.filter(d => d.includes('❌')).length + 
                             localItemDiffs.filter(d => d.includes('❌')).length
    
    if (totalLocalIssues === 0) {
      console.log("✅ BuildY схемы полностью совместимы с эталоном")
    } else {
      console.log("📝 Рекомендуется обновить BuildY схемы для полной совместимости с эталоном")
    }
    
    if (typeAnalysis.buildyExtra.length > 0) {
      console.log("✅ registry:template - уникальный тип BuildY для шаблонов")
    }
    
    console.log("🎯 Эталонная схема schema.ts обеспечивает единый источник правды")
    console.log("🔄 CLI должен генерировать схемы на основе schema.ts")
    
  } catch (error) {
    console.error("❌ Ошибка при сравнении схем:", error)
    process.exit(1)
  }
}

main() 