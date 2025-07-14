# Changelog

## [Unreleased] - Schema Enhancement

### Added
- **title** - Человекочитаемое название компонента
- **registryDependencies** - Зависимости от других компонентов в реестре
- **tailwind** - Конфигурация Tailwind CSS для компонента
- **cssVars** - CSS переменные для поддержки тем (light/dark)
- **meta** - Дополнительные метаданные компонента

### Changed
- Обновлена схема `registryItemSchema` в `build-schema.ts`
- Обновлена схема `componentSchema` в `schema.ts`
- Добавлены новые типы `RegistryItemTailwind` и `RegistryItemCssVars`
- Обновлен `createIndexFile` для поддержки поля `title`

### Compatibility
- ✅ Обратная совместимость сохранена (все новые поля опциональные)
- ✅ Совместимость с shadcn/ui улучшена
- ✅ Поддержка уникального типа `registry:template`

### Priority Fields Implementation
- 🔴 **Высокий приоритет**: `title`, `registryDependencies`, `tailwind`, `cssVars` - ✅ Реализовано
- 🟡 **Средний приоритет**: `meta` - ✅ Реализовано
- 🟢 **Низкий приоритет**: `author`, `docs`, `categories`, `extends`, `css` - ⏳ Планируется

### Testing
- Добавлен `test-schema.ts` для валидации новых полей
- Все новые поля валидируются через Zod схемы
- Автоматическая генерация JSON схем из Zod 