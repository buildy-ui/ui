# ✅ Hero блоки полностью реструктурированы

## Что сделано:

### 1. **SplitHero.tsx** - полностью готов для domain system
- ✅ Интерфейсы закрыты (`interface HeroData` - internal only)
- ✅ Defaults извлечены из examples (5 вариантов)
- ✅ Добавлена JSON schema 
- ✅ Templates обновлены с `defaults` и `schema`
- ✅ Content merging реализован с `useMemo`

### 2. **CenteredHero.tsx** - полностью готов для domain system  
- ✅ Интерфейсы закрыты (`interface CenteredHeroData` - internal only)
- ✅ Defaults извлечены из examples (5 вариантов)
- ✅ Добавлена JSON schema
- ✅ Templates обновлены с `defaults` и `schema`
- ✅ Content merging реализован с `useMemo`

### 3. **hero.content.schema.json** - общая схема создана
- ✅ Unified schema для SplitHero + CenteredHero
- ✅ Все поля покрыты валидацией
- ✅ Примеры данных включены
- ✅ Готово для `@ui8kit/domains`

### 4. **Очистка**
- ✅ `SplitHero.examples.tsx` - удален
- ✅ `CenteredHero.examples.tsx` - удален
- ✅ `index.ts` - обновлен (убраны exports examples)

## Архитектура готова для domain system:

### Content Merging (Priority System):
```typescript
const mergedContent = useMemo(() => {
  const defaultContent = heroDefaults[variant] || {};
  return {
    ...defaultContent,    // Priority 3: Base defaults (в блоках)
    // TODO: ...domainContent,  // Priority 2: Domain content (@ui8kit/domains)
    ...content           // Priority 1: User overrides (из JSON)
  };
}, [content, variant]);
```

### Templates Enhancement:
```typescript
export const splitHeroTemplates = {
  media: {
    id: "splitHeroMedia",
    component: SplitHero,
    defaults: splitHeroDefaults.media,    // 🆕 Base defaults
    schema: splitHeroSchema               // 🆕 Schema for validation
  }
  // ... все варианты
};
```

### Schema для @ui8kit/domains:
- `hero.content.schema.json` - unified schema
- Поддерживает все варианты hero блоков
- Готово для валидации domain content

## Следующие шаги:
1. Аналогично реструктурировать `blog` и `features`
2. Создать `@ui8kit/domains` package
3. Реализовать domain injection логику

Hero блоки теперь полностью готовы для domain system! 🎉