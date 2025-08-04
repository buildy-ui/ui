Изучу структуру старых блоков в `@hero/` и сравню с новой архитектурой `@hero-v2/`, чтобы составить техническое задание.
Read file: packages/@ui8kit/blocks/src/hero/index.ts
Read file: packages/@ui8kit/blocks/src/hero/SplitHero.tsx
Read file: packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
Теперь изучу больше структуры старых компонентов:
Read file: packages/@ui8kit/blocks/src/hero/SplitHero.tsx
Read file: packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
Теперь изучу средние части файлов, чтобы понять полную структуру:
Read file: packages/@ui8kit/blocks/src/hero/SplitHero.tsx
Read file: packages/@ui8kit/blocks/src/hero/SplitHero.tsx
Теперь у меня есть полное понимание архитектуры. Составлю техническое задание:

# 📋 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: Преобразование монолитных блоков в составную архитектуру

## 🎯 ЦЕЛЬ
Преобразовать существующие монолитные блоки (аналогично `@hero/`) в новую составную архитектуру (аналогично `@hero-v2/`) с разделением на атомарные UI компоненты, составные компоненты и готовые пресеты.

## 📊 АНАЛИЗ ТЕКУЩЕЙ АРХИТЕКТУРЫ

### ❌ ПРОБЛЕМЫ СТАРОЙ АРХИТЕКТУРЫ (`@hero/`):
1. **Монолитные компоненты** - вся логика в одном файле (530+ строк)
2. **Использование `className`** - нарушает стандарты проекта
3. **Жестко закодированная логика** - сложно переиспользовать части
4. **Смешанные ответственности** - UI, логика и данные в одном месте
5. **Дублирование кода** - похожие элементы повторяются в разных вариантах

### ✅ ПРЕИМУЩЕСТВА НОВОЙ АРХИТЕКТУРЫ (`@hero-v2/`):
1. **Атомарные UI компоненты** - переиспользуемые элементы
2. **Составные компоненты** - логические группировки
3. **Готовые пресеты** - конечные варианты для использования
4. **Чистые пропы** - без `className`, только встроенные пропы
5. **Единый источник правды** - централизованные типы и контент

## 🏗️ СТРУКТУРА ПРЕОБРАЗОВАНИЯ

### 1. СОЗДАТЬ СТРУКТУРУ ДИРЕКТОРИЙ
```
@[block-name]-v2/
├── ui/                    # Атомарные UI компоненты
│   ├── index.ts
│   ├── [block]-badge.tsx
│   ├── [block]-title.tsx
│   ├── [block]-description.tsx
│   ├── [block]-button.tsx
│   ├── [block]-actions.tsx
│   └── [additional-ui-components].tsx
├── components/            # Составные компоненты
│   ├── index.ts
│   ├── [block]-section.tsx
│   ├── [block]-content.tsx
│   ├── [block]-media.tsx
│   └── [additional-composite-components].tsx
├── presets/              # Готовые пресеты
│   ├── index.ts
│   ├── [variant1]-[block].tsx
│   └── [variant2]-[block].tsx
├── types.ts              # Интерфейсы и типы
├── content.ts            # Дефолтный контент
├── schema.ts             # JSON схемы валидации
├── index.ts              # Главный экспорт
└── EXAMPLE.md            # Документация и примеры
```

### 2. ЭТАПЫ ПРЕОБРАЗОВАНИЯ

#### ЭТАП 1: Анализ исходного блока
1. **Изучить монолитный компонент** - понять все варианты и функциональность
2. **Выделить UI элементы** - определить атомарные компоненты
3. **Определить составные части** - логические группировки элементов
4. **Проанализировать варианты** - какие пресеты нужны

#### ЭТАП 2: Создание типов и контента
1. **`types.ts`** - создать интерфейсы:
   ```typescript
   // Основные данные блока
   export interface [Block]Data {
     // поля из старого интерфейса
   }
   
   // UI компоненты (БЕЗ className!)
   export interface [Block]BadgeProps {
     children: React.ReactNode;
   }
   // ... остальные UI интерфейсы
   
   // Составные компоненты (БЕЗ className!)
   export interface [Block]SectionProps {
     children: React.ReactNode;
     layout?: string;
   }
   // ... остальные составные интерфейсы
   ```

2. **`content.ts`** - перенести дефолтный контент:
   ```typescript
   export const [block]Content = {
     [variant1]: { /* данные из старых defaults */ },
     [variant2]: { /* данные из старых defaults */ },
   } satisfies Record<string, [Block]Data>;
   ```

3. **`schema.ts`** - перенести схему валидации:
   ```typescript
   export const [block]Schema = {
     // схема из старого файла
   } as const;
   ```

#### ЭТАП 3: Создание UI компонентов (`ui/`)
**КРИТИЧЕСКИ ВАЖНО**: Все UI компоненты должны быть БЕЗ `className`!

Для каждого UI элемента создать отдельный файл:
```typescript
import { forwardRef } from "react";
import { [CoreComponent] } from "@ui8kit/core";
import type { [Block][Element]Props } from "../types";

export const [Block][Element] = forwardRef<HTMLElement, [Block][Element]Props>(
  ({ children, ...props }, ref) => {
    return (
      <[CoreComponent]
        ref={ref}
        // ТОЛЬКО встроенные пропы, НЕТ className!
        variant="..."
        size="..."
        {...props}
      >
        {children}
      </[CoreComponent>>
    );
  }
);

[Block][Element].displayName = "[Block][Element]";
```

**Правила для UI компонентов**:
- ❌ НЕТ `className` в интерфейсах
- ❌ НЕТ `className` в компонентах  
- ✅ Только встроенные пропы (@ui8kit/core)
- ✅ Для кастомных стилей использовать `style={{ ... }}`
- ✅ Заменить Tailwind классы на пропы:
  - `tracking-tight` → убрать (встроенный в Title)
  - `max-w-[42rem]` → `style={{ maxWidth: "42rem" }}`
  - `flex-wrap` → `wrap="wrap"`
  - `leading-none` → `style={{ lineHeight: 1 }}`

#### ЭТАП 4: Создание составных компонентов (`components/`)
Составные компоненты группируют UI элементы:
```typescript
export const [Block]Section = forwardRef<HTMLElement, [Block]SectionProps>(
  ({ children, layout = "default", ...props }, ref) => {
    return (
      <Block
        ref={ref}
        component="section"
        w="full"
        py="xl"
        {...props}
      >
        <Container size="lg" px="md" centered>
          {/* логика компоновки */}
        </Container>
      </Block>
    );
  }
);
```

#### ЭТАП 5: Создание пресетов (`presets/`)
Готовые варианты для использования:
```typescript
interface [Variant][Block]Props {
  content?: Partial<[Block]Data>;
  variant?: "variant1" | "variant2";
  // НЕТ className!
}

export const [Variant][Block] = forwardRef<HTMLElement, [Variant][Block]Props>(
  ({ content = {}, variant = "default", ...props }, ref) => {
    // Логика слияния контента
    const mergedContent = useMemo(() => {
      if (Object.keys(content).length > 0) {
        return {
          ...content,
          title: content.title || "Untitled",
          description: content.description || "No description provided"
        };
      }
      return defaultContent;
    }, [content, defaultContent]);

    return (
      <[Block]Section ref={ref} layout="..." {...props}>
        {/* Использование UI и составных компонентов */}
      <[Block]Section>
    );
  }
);
```

#### ЭТАП 6: Главный экспорт (`index.ts`)
```typescript
// Atomic components
export * from "./ui";

// Composite components  
export * from "./components";

// Ready-to-use presets
export * from "./presets";

// Types, content, and schema
export * from "./types";
export * from "./content";
export * from "./schema";

// Templates for integration
export const [block]Templates = {
  [variant1]: {
    id: "[variant1][Block]",
    name: "...",
    description: "...",
    component: [Variant1][Block],
    defaultProps: { variant: "..." as const },
    defaults: [block]Content.[variant1],
    schema: [block]Schema
  },
  // ... остальные варианты
};
```

## 🔧 ПРАВИЛА ПРЕОБРАЗОВАНИЯ

### ✅ ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ:
1. **БЕЗ `className`** - везде, полностью
2. **Только встроенные пропы** основных компонентов
3. **Атомарность UI компонентов** - один элемент = один компонент
4. **Единообразие интерфейсов** - следовать паттернам из hero-v2
5. **Переиспользование логики** - DRY принцип

### ❌ ЗАПРЕЩЕНО:
- Использовать `className` в любом виде
- Смешивать UI и бизнес-логику в одном компоненте
- Дублировать код между компонентами
- Жестко кодировать стили

### 🎯 РЕЗУЛЬТАТ:
После преобразования должна получиться модульная архитектура:
- **UI компоненты** - переиспользуемые в любых блоках
- **Составные компоненты** - логические группировки
- **Пресеты** - готовые решения для конкретных задач
- **Чистый код** - без `className`, только пропы
- **Типобезопасность** - полная типизация всех компонентов

## 🚀 ПРИМЕР ИСПОЛЬЗОВАНИЯ ПОСЛЕ ПРЕОБРАЗОВАНИЯ:
```typescript
// Использование готового пресета
<SplitHero content={{ title: "Custom title" }} variant="media" />

// Использование отдельных компонентов
<HeroSection layout="split">
  <HeroContent>
    <HeroTitle>Custom Title</HeroTitle>
    <HeroDescription>Custom description</HeroDescription>
  </HeroContent>
</HeroSection>
```

Это техническое задание обеспечит единообразное преобразование всех блоков в новую архитектуру с соблюдением всех стандартов проекта.