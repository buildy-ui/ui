### Разбор ключевых фрагментов
```1:4:packages/@ui8kit/brain/.draft/gpt-5-feedback/how-made-description.md
# QDrant векторная база данных для эффективного поиска UI компонентов

Эмбединги для QDrant готовит:  `text-embedding-3-small`
```
- **Ок**: зафиксирована модель эмбеддингов и цель.

```7:13:packages/@ui8kit/brain/.draft/gpt-5-feedback/how-made-description.md
1. **Тип компонента и его основное назначение**
2. **Ключевые структурные элементы**
3. **Адаптивность**
4. **Основные пропсы**
5. **Типичные случаи использования**
```
- **Ок**: 5 пунктов покрывают смысл+структуру.  
- **Уточнение**: добавить явные структурные маркеры (layout/columns/media/cta/form) и отрицательные признаки (чего нет).

```36:38:packages/@ui8kit/brain/.draft/gpt-5-feedback/how-made-description.md
"description": "[Hero component] designed for [centered content with a top button]. [Includes a badge button, a centrally aligned title and description, and a set of call-to-action buttons]. [Fully responsive and centered layout]. [Customizable badges, button styles, and text alignment]. [Perfect for focusing user attention on a single call-to-action]."
```
- **Хорошо**: сжато и структурно.  
- **Уточнение**: квадратные скобки лучше убрать — естественные фразы работают стабильнее для эмбеддингов. Сразу указывать layout/slots/колонки/cta_count.

```56:60:packages/@ui8kit/brain/.draft/gpt-5-feedback/how-made-description.md
"description": "[Тип компонента] для [основное назначение]. [Структура и ключевые элементы]. [Адаптивность]. [Кастомизация]. [Сценарии использования]".
```
- **Ок**: каркас валиден.  
- **Уточнение**: заменить на 5–7 коротких предложений без скобок; добавить явные маркеры структуры.

### Уточнения и улучшения
- **Длина**: 350–600 символов вместо “до 800”. Короткие, насыщенные описания дают лучшее ранжирование и меньше шума.
- **Язык**: оставить EN-описание, а RU-дубликаты — в тегах (`intent`, `industry`, `seasonality`) для русских запросов.
- **Структурные маркеры в тексте**: всегда явно указывать:
  - **layout**: centered/split/grid/masonry/list
  - **columns**: 1/2/3/1–2–3
  - **media**: image/video/none + позиция (left/right/top)
  - **cta_count**: 0/1/2; **has_form**: true/false
  - **slots**: badge/title/subtitle/description/buttons/stats/icons/cards
- **Отрицательные признаки**: добавлять при необходимости — “no_pricing”, “no_testimonials”, “no_map”, “no_form” (повышает точность структурного поиска).
- **Пропсы в описании**: указывать не типы, а пользовательские слоты/группы: `badge.text`, `title`, `description`, `buttons[]`, `media`. Этого достаточно для семантики.
- **Теги**: нормализовать в формате key:value (для фильтров QDrant), дублировать RU/EN в ключевых интентах/индустриях.
- **Payload**: не класть большой `export`-код в payload (раздувает документы). Лучше:
  - `export_signature`: "HeroCenteredWithTopButton(props)"
  - `imports_min`: ["@/components/ui/button", "lucide-react"]
  - `code_sha`: "<sha1>" и `path`
- **Эмбеддинги**: если остаёмся на `text-embedding-3-small`, усиливаем текст структурными токенами. Опционально позже перейти на гибрид (dense+sparse) или bge-m3.
- **Консистентность словаря**: зафиксировать разрешённые значения для `layout/columns/media/cta_count/form/tone/industry/intent/funnel/seasonality`.

### Рекомендованный шаблон описания (без скобок)
- **Формат**: 5–7 коротких предложений, природный английский.
- **Скелет**:
  1) Type + purpose.  
  2) Layout + columns + media position.  
  3) Core slots.  
  4) Responsiveness.  
  5) Props surface (by slots).  
  6) Typical use cases.  
  7) Optional negatives.

### Примеры улучшенных описаний
- **HeroCenteredWithTopButton**
  - “Centered hero for primary messaging and conversion. Layout: centered content with a top badge button; no side media. Slots: badge button, H1 title, paragraph, 1–2 CTA buttons. Responsive container with vertical rhythm and comfortable spacing. Props: badge.text, title, description, buttons[]. Ideal for launches, product announcements, or landing page intros. No form, no pricing.”
- **PricingGrid123**
  - “Pricing section for plans comparison. Layout: grid with 1–2–3 columns; optional ‘Most popular’ badge. Slots: plan name, price, feature list, CTA per card. Fully responsive with single-column stacking on mobile. Props: plans[], features[], cta label/variant, highlighted plan. Used for SaaS subscriptions and service packages. Includes 1 CTA per card; no testimonials, no map.”
- **GalleryMasonry**
  - “Visual gallery for showcasing images. Layout: masonry grid with variable image heights; 2–4 columns depending on viewport. Slots: image, caption/label, optional category tag. Responsive with fluid columns and lazy loading potential. Props: items[], image.src/alt, caption, columns breakpoints. Ideal for portfolios, product showcases, and campaigns. No pricing, no form, no CTA.”

### Мини-чеклист перед отправкой
- **Тип + назначение** есть в первом предложении.
- **Layout/columns/media/cta/form** явно указаны.
- **Slots** перечислены едиными терминами.
- **Адаптивность** описана кратко и понятно.
- **Props** перечислены как пользовательские слоты, не типы.
- **Use cases** названы 1–2 релевантных.
- **Negative cues** добавлены при необходимости.
- **Длина** в диапазоне 350–600 символов.

### Что скорректировать в схеме payload
- **tags**: key:value (напр. `layout:centered`, `columns:1-2-3`, `cta_count:2`, `has_form:false`, `industry:restaurants|рестораны`, `seasonality:new_year|новый_год`).
- **Минимизировать код**: хранить `path`, `export_signature`, `imports_min`, `code_sha`.
- **Опционально**: отдельный `metadata` JSON со структурными полями для фильтров (дублирующимися в `tags` для простоты).

- Готов применить шаблон и прислать 10 первых описаний по вашим блокам для проверки стиля и покрытия структуры.