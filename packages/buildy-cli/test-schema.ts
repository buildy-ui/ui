import { registryItemSchema, type RegistryItem } from "./src/registry/build-schema.js"

// Тестовый объект с новыми полями
const testItem: RegistryItem = {
  name: "test-button",
  type: "registry:ui",
  title: "Test Button Component",
  description: "A test button component",
  dependencies: ["react"],
  devDependencies: ["@types/react"],
  registryDependencies: ["utils", "cn"],
  files: [
    {
      path: "ui/button.tsx",
      content: "export const Button = () => <button>Test</button>",
    }
  ],
  tailwind: {
    config: {
      content: ["./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          colors: {
            primary: "hsl(var(--primary))"
          }
        }
      },
      plugins: ["@tailwindcss/typography"]
    }
  },
  cssVars: {
    theme: {
      "--primary": "220 14.3% 4.1%"
    },
    light: {
      "--primary": "220 14.3% 4.1%"
    },
    dark: {
      "--primary": "220 14.3% 95.9%"
    }
  },
  meta: {
    version: "1.0.0",
    author: "BuildY Team",
    category: "ui",
    tags: ["button", "interactive"]
  }
}

// Валидация схемы
try {
  const validatedItem = registryItemSchema.parse(testItem)
  console.log("✅ Схема валидна!")
  console.log("Новые поля:")
  console.log("- title:", validatedItem.title)
  console.log("- registryDependencies:", validatedItem.registryDependencies)
  console.log("- tailwind:", validatedItem.tailwind ? "✅" : "❌")
  console.log("- cssVars:", validatedItem.cssVars ? "✅" : "❌")
  console.log("- meta:", validatedItem.meta ? "✅" : "❌")
} catch (error) {
  console.error("❌ Ошибка валидации:", error)
} 