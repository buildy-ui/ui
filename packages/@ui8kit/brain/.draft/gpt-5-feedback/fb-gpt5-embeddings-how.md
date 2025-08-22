### План работ (коротко)
- **Таксономия и словарь**: зафиксировать единые поля и значения (category, variant, layout, columns, supports, item_fields, funnel_stage, intents, personas, industries, seasonality, complexity, has_cta, images/icons/stats).
- **Формат записи**: договориться о форме `qdrant` (описание RU+EN + нормализованные теги как key:value, без лишней вложенности).
- **Инвентаризация 120+ блоков**: пройти по `packages/@ui8kit/blocks/src/**`, собрать список вариантов из `registry.ts` и `*.schema.ts`.
- **Автогенерация метаданных**: скриптом вытащить structure cues из schema/preset (item_fields, supports, layout, columns); вручную дополнять intents/funnel/industries.
- **Док-описания**: для каждого варианта написать 300–600 симв. RU+EN “doc” с целью и структурой.
- **Эмбеддинги и загрузка**: выбрать модель (bge-m3 или text-embedding-3-large), создать коллекцию в Qdrant с фильтруемым payload и (по возможности) гибридным поиском dense+sparse.
- **Ретривал пайплайн**: классификация запроса → фильтры → гибридный topK → LLM re-rank (20–30 финальных).
- **Валидация**: тестовые запросы (в т.ч. “блюда на мангале…”) и корректировка таксономии/доков.

### Обратная связь по embeddings-how.md
- **Сильные стороны**: один документ на вариант, чёткая метадата, гибридный поиск + LLM re-rank, RU/EN, рубрика ре‑ранкинга, ориентация на структурные признаки. Это именно то, что нужно для “смысл+структура”.
- **Рекомендации**:
  - **Док-описание**: держать 300–600 символов; явно указывать ключевую структуру: “grid 1–2–3”, “split image-text”, “form/no-form”, “cta: 1/2”.
  - **Метадата**: добавить компактные бинарные/счётные признаки для ре‑ранка: `image_count`, `cta_count`, `has_form`, `media_ratio` (16:9/1:1), `content_density` (low/med/high), `tone` (corporate/minimal/playful).
  - **Tags RU+EN**: дублировать основные intents/industries RU/EN в тегах для устойчивости.
  - **Гибридный поиск**: в Qdrant лучше сразу использовать multi-vector (dense + sparse для bge‑m3) вместо отдельного BM25-сервера.
  - **Диверсификация**: добавить soft-diversity по `category/layout` на этапе отбора top‑K перед ре‑ранком (убирает монотонность выдачи).
  - **Negative cues**: иногда полезно явно указывать, чего нет: `no_map`, `no_testimonials`, `no_pricing` — помогает структурной фильтрации.

### Предлагаемый формат qdrant (минимально совместимый с вашим)
- Сохраняем ваш объект, но делаем теги нормализованными key:value, чтобы сразу использовать фильтры Qdrant.
- Описание — двуязычное, компактное, структурно насыщенное.

```json
{
  "qdrant": {
    "description": "RU: Сетка ценовых планов 1–2–3 с CTA и списками фич. EN: Pricing grid with 1–2–3 columns, feature lists, and CTA; supports 'Most Popular'.",
    "tags": [
      "category:business",
      "variant:pricing",
      "layout:grid",
      "columns:1-2-3",
      "supports:pricing",
      "supports:features",
      "supports:cta",
      "supports:badges",
      "funnel:consideration",
      "funnel:conversion",
      "intent:pricing",
      "intent:packages",
      "persona:owner",
      "persona:marketer",
      "industry:restaurants",
      "industry:agencies",
      "seasonality:campaign_ready",
      "cta_count:1",
      "content_density:medium"
    ],
    "category": "business"
  }
}
```

- Для Career, SolutionsGrid, CardsGallery и др. — тот же принцип: короткое RU+EN описание + нормализованные `tags`.
- Если захотим богаче payload, можно параллельно хранить структурное `metadata` (JSON) — но фильтрация и так будет работать поверх `tags`.

### Ретривал пайплайн (практично)
- **Классификация запроса**: `industry, intent, funnel, seasonality` (легковесный LLM-классификатор).
- **Фильтры**: по `intent`, `funnel`, иногда `industry/seasonality`.
- **Гибридный поиск**: Qdrant dense+sparse (bge‑m3) topK≈100.
- **LLM re-rank**: рубрика “соответствие индустрии, интенту, структурной форме (supports/layout/columns), campaign readiness, диверсификация” → 20–30 итоговых.
- **Fallback**: если фильтр слишком узкий — ослабляем до `supports`/`layout` без индустрии.

### Практика в Cursor IDE (векторный поиск по коду)
- **Что работает лучше всего**:
  - Добавляйте в компоненты короткие TSDoc-комментарии с назначением и структурой — Cursor извлекает такие описания при RAG по репо.
  - Делайте единый `registry.ts`/`index.ts` с экспортами и человекочитаемыми именами вариантов — это повышает recall в кодовом поиске.
  - Стабильные названия файлов/папок (`Grid*`, `Split*`, `Centered*`) помогают семантической навигации.
- **Когда не хватает встроенного поиска**:
  - Для 120+ шаблонов итог лучше даёт наша внешняя Qdrant-коллекция с нормализованной метаданной и гибридным поиском, а Cursor используем как “IDE помощника” при редактировании кода.
- **Трюки для крупных баз**:
  - Автоматически генерируйте короткий README/INDEX в каждой категории с перечнем вариантов и их структурных признаков — это хорошо индексируется и улучшает ответы “по коду”.
  - Избегайте дублирующих названий; в именах компонентов отражайте layout и intent.

### Что сделаю дальше по вашему ОК
- Зафиксирую словарь тегов (список допустимых значений по каждому полю).
- Сгенерирую 10 образцов (business: pricing/solutions/cards/career, hero, cta, gallery и т.д.) в вашем формате `qdrant`.
- Предложу мини-скрипт-инвенторизацию вариантов из `@ui8kit/blocks` и автозаполнение `supports/item_fields/layout/columns`.

- Подход из `embeddings-how.md` валиден; усилил критерии описаний, расширил таксономию тегов, рекомендовал гибридный multi‑vector в Qdrant и зафиксировал минимальный формат `qdrant` с key:value тегами. Готов сделать первые 10 записей и словарь тегов для утверждения.