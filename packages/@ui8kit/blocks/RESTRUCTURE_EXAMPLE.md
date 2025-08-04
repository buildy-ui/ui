# Результат реструктуризации блоков

## Что изменилось:

### 1. Закрытые интерфейсы
```typescript
// ❌ Было:
export interface HeroData { ... }

// ✅ Стало:
interface HeroData { ... } // internal only
```

### 2. Извлеченные defaults из examples
```typescript
// ✅ Новая структура:
const splitHeroDefaults = {
  media: {
    badge: "New Release",
    title: "Build the future with modern technology",
    description: "Transform your ideas...",
    // ... все данные из examples
  },
  leftMedia: { ... },
  gallery: { ... },
  // etc
};
```

### 3. Добавлены схемы данных
```typescript
const splitHeroSchema = {
  type: "object",
  required: ["title", "description"],
  properties: {
    badge: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    image: {
      type: "object",
      properties: {
        src: { type: "string" },
        alt: { type: "string" }
      }
    },
    // ... полная схема
  }
};
```

### 4. Обновленные templates с domain support
```typescript
export const splitHeroTemplates = {
  media: {
    id: "splitHeroMedia",
    name: "Split Hero with Media",
    description: "Split layout hero with media content",
    component: SplitHero,
    defaultProps: { variant: "media" as const },
    defaults: splitHeroDefaults.media,    // 🆕 Base defaults
    schema: splitHeroSchema               // 🆕 Schema for validation
  },
  // ... все остальные templates
};
```

### 5. Content merging в компонентах
```typescript
export const SplitHero = forwardRef<HTMLElement, SplitHeroProps>(
  ({ content, variant = "media", ...props }, ref) => {

    // 🆕 Content merging logic
    const mergedContent = useMemo(() => {
      const defaultContent = splitHeroDefaults[variant as keyof typeof splitHeroDefaults] || {};
      return {
        ...defaultContent,    // Priority 3: Base defaults
        // TODO: ...domainContent,  // Priority 2: Domain content (@ui8kit/domains)
        ...content           // Priority 1: User overrides
      };
    }, [content, variant]);

    // Используем mergedContent вместо content
    return (
      <SplitBlock
        content={mergedContent}
        // ...
      />
    );
  }
);
```

## Готовность для domain system:

### Архитектура слоев:
1. **Base defaults** (Priority 3) - в блоках
2. **Domain content** (Priority 2) - `@ui8kit/domains` 
3. **User overrides** (Priority 1) - из JSON проекта

### Схемы для `@ui8kit/domains`:
- `hero.content.schema.json` (SplitHero + CenteredHero)
- `blog.content.schema.json` (SplitBlog + GridBlog)
- `features.content.schema.json` (SplitFeatures + GridFeatures)

### Поддержка templateId mapping:
```json
// buildy_project.json
{
  "type": "splitHeroMedia",
  "content": {
    "title": "Custom title"  // User override
  }
}
```

## Результат:
✅ Блоки готовы для domain injection
✅ Интерфейсы закрыты (clean exports)
✅ Content merging реализован
✅ Schemas готовы для валидации
✅ Graceful fallbacks при пустом content