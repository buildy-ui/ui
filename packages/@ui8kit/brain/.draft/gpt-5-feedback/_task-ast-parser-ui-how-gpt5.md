Найди в компонентах, что полезного парсить, чтобы максимально автоматизировать описания для эмбеддингов

### Что полезно парсить для авто-описаний

- **Варианты и layout (из TSX)**
  - Варианты напрямую в пропсах:
```51:54:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
interface CenteredHeroProps {
  content: CenteredHeroData;
  variant?: "simple" | "withTopButton" | "withImage" | "withStats";
```
  - Физический layout блока:
```359:364:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
<LayoutBlock
  ...
  layout="stack"
  useContainer={useContainer}
```
  - Выравнивание и тип заголовка (центр, H1, размер), даёт структурные маркеры:
```140:161:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
<Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
...
<Title order={1} size="5xl" fw="bold" ta="center" className="tracking-tight leading-tight">
```

- **Слоты и их условность по вариантам (из TSX + Schema)**
  - Слоты контента из интерфейса:
```31:49:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
export interface CenteredHeroData {
  badge?: string;
  title: string;
  description: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
  topButton?: { text: string; href?: string; };
  imageUrl?: string;
  imageAlt?: string;
  stats?: Array<{ id: string; value: string; label: string; }>;
}
```
  - Требуемость слотов по вариантам (через `z.union`) — база для “required/optional”:
```57:71:packages/@ui8kit/blocks/src/hero/CenteredHero.schema.ts
'content': z.object({
  'badge': z.string(),
  'title': z.string(),
  'description': z.string(),
  'stats': z.array(z.object({...})),
  'primaryButtonText': z.string(),
  'secondaryButtonText': z.string(),
  'primaryButtonIcon': z.any()
}),
```
  - Присутствие top-button только в `withTopButton`:
```24:35:packages/@ui8kit/blocks/src/hero/CenteredHero.schema.ts
'topButton': z.object({ 'text': z.string(), 'href': z.string() }),
'badge': z.string(),
'title': z.string(),
```

- **Медиа и позиционирование (из TSX)**
  - `withImage`: медиа после заголовка → `media:image`, `media_position:below_header`
```255:266:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
afterHeader: (content) => (
  content.imageUrl ? (
    <Box className="w-full max-w-4xl mx-auto">
      <Image ... />
    </Box>
  ) : null
)
```
  - `withStats`: статистика после заголовка → `stats:true`, `stats_position:below_header`
```326:341:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
afterHeader: (content) => (
  content.stats ? (
    <Group ...>
      {content.stats.map(...)}
```

- **CTA и иконки (из TSX)**
  - Счётчик CTA по факту рендера `Button` с `primaryButtonText`/`secondaryButtonText` → `cta_count ∈ {0,1,2}`
  - Наличие иконок у CTA (через `leftSection/rightSection` + `Icon`) → `cta_icon:true`, `icon_position:left|right`
```169:177:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
<Button ... leftSection={ <Icon c="primary-foreground" lucideIcon={Info} /> }>
```

- **Preheader/Top button (из TSX)**
  - `withTopButton` рендерит верхнюю кнопку до заголовка → `has_top_button:true`, `top_button_position:before_header`
```129:137:packages/@ui8kit/blocks/src/hero/CenteredHero.tsx
beforeHeader: (content) => (
  content.topButton ? (
    <Button variant="outline" size="sm" ...>
      <Icon lucideIcon={ExternalLink} />
      {content.topButton.text}
```

- **Контейнер/фон/тональность (из Preset)**
  - `useContainer` и `className` из пресетов дают: `container:true`, `bg:gradient|plain`, `shadow:true|false`
```25:28:packages/@ui8kit/blocks/src/hero/CenteredHero.preset.ts
props: { ... useContainer: true, className: "bg-gradient-to-t from-primary/10 to-secondary/15" }
```

- **Словарь и нормализации (из всех трёх)**
  - `type`/`variant` → `category:hero`, `name:centered`, `variant:*`
  - Компоненты, встречающиеся в разметке (`Badge/Title/Text/Button/Image/Icon/Group/Stack/Box`) → `slots:*`
  - Выравнивание/типографика (`ta="center"`, `Title order=1`) → `alignment:center`, `headline_level:1`

### Автоматически вычисляемые метаполя/теги
- **layout**: `stack`
- **alignment**: `center`
- **container**: boolean
- **variant**: `simple|withTopButton|withImage|withStats`
- **media**: `none|image|stats` + `media_position:below_header`
- **slots**: `badge,title,description,buttons,top_button,image,stats`
- **cta_count**: 0–2; **cta_icon**: boolean; **icon_position**: `left|right`
- **has_top_button**: boolean
- **has_stats**: boolean; `stats_fields`: `value,label`
- **negative cues**: авто-добавлять по отсутствию: `no_media`, `no_stats`, `no_form`
- **style cues (optional)**: `bg:gradient|plain`, `shadow:true|false`
- **headline_level**: 1

### Генерация описания (RU/EN) из сигналов
- Собираем 5–7 предложений из шаблонов:
  - Type + purpose (Hero, centered).
  - Layout/position: centered stack, media below header.
  - Slots: badge, H1, paragraph, CTAs (count), top button if any.
  - Responsiveness: centered, container, mobile stacking.
  - Use cases: landing intros, campaigns, announcements.
  - Negatives: no form, no pricing; media/stats по вариантам.

### Примеры auto-tags по вариантам
- **simple**: `layout:stack`, `alignment:center`, `media:none`, `cta_count:0-2`, `has_top_button:false`, `has_stats:false`
- **withTopButton**: как выше + `has_top_button:true`, `top_button_position:before_header`
- **withImage**: `media:image`, `media_position:below_header`, `has_stats:false`
- **withStats**: `media:stats`, `stats_position:below_header`, `stats_fields:value,label`, `media:none`

### Что брать из какого файла
- **TSX**: реальные рендер-слоты по вариантам, layout, позиционирование, CTA/иконки, выравнивание.
- **Schema**: обязательность/опциональность слотов, структура `stats`, наличие `topButton` в конкретном варианте.
- **Preset**: дефолты `useContainer`, `className` → стиль/фон; быстрые эвристики для тона, наличие градиента/тени.

### Мини-реализация извлечения (идея)
- AST-парсер (ts-morph):
  - Взять литералы из `variant` union.
  - Пройти `centeredHeroContentHooks[variant]` и собрать все `content.<slot>` и используемые компоненты внутри `beforeHeader/header/afterHeader`.
  - Подсчитать `Button`/`Icon` в каждом варианте → `cta_count`, `cta_icon`.
  - Проверить `Image`/`stats.map` → `media:*`, `stats:*`.
- Склеить `tags` и сгенерить RU/EN описание по шаблону.

- Ключевые сигналы уже есть “на поверхности”: варианты, layout, слоты, кнопки, медиа/статистика, позиционирование и выравнивание. Этого достаточно, чтобы генерировать точные структурные описания и теги без ручной работы.

=============================================

А что если, наш контент будет сам служить собсвенным описанием, которое будет векторизовано? А часть, которая не подойдет для содержания или будет не уместна, мы её вынесем в общее описание блока, категории и метки.

Если такой подход лишний и не стоит раздувать эмбеддинг, а лучше разработать конценрированное описание по паттернам, что в итоге будет лучше работать?

### Короткий ответ
- Лучший путь — гибрид: в контент добавить 1–2 естественных “структурных подсказки”, а остальное (жёсткие признаки) держать в тегах из парсинга. Тогда общее `qdrant.description` можно сократить до 120–220 символов. Полностью переносить всё в маркетинговый текст не нужно.

### Как обогатить контент самих блоков (без шума)
- Принцип: вплетаем мягкие, естественные маркеры структуры в заголовок/описание и alt (а не “технические токены”). Жёсткие признаки остаются в тегах: `layout`, `columns`, `leftMedia`, `has_yearly_toggle`, `cta_count`, `isPopular`.

#### `packages/@ui8kit/blocks/src/business/GridBusiness.preset.ts`
- **cardsGallery (1–2–3)**: в `description` упомянуть “icon card grid / at-a-glance / multi‑column”.
  - Пример: “Explore our services in an icon card grid designed for quick scanning. Responsive multi‑column layout adapts from one to three columns.”
- **solutionsGrid (image + stats)**: отметить “solutions grid / optional imagery / KPI highlights”.
  - Пример: “Solutions grid combining icon cards, optional imagery, and KPI highlights to surface value quickly.”
- **pricing (1–2–3, 1 CTA/карту)**: назвать “three‑tier pricing / comparison / feature lists”.
  - Пример: “Three‑tier pricing for easy plan comparison with feature lists and a clear CTA on each card.”
- **pricingYear (toggle)**: добавить “monthly/annual toggle / save”.
  - Пример: “Compare monthly vs annual billing with a simple toggle and see potential savings across three plans.”
- **career (1–2)**: назвать “job cards / role, location, department”.
  - Пример: “Job cards list role, location, department, type and salary in a responsive two‑column layout.”

Что не переносим в текст:
- `cols: "1-2-3"`, `isPopular`, `buttonVariant` — это в теги и payload.

#### `packages/@ui8kit/blocks/src/business/SplitBusiness.preset.ts`
- Общий приём: называть “split layout + сторона медиа + сущности”.
- **solutions (leftMedia: false → медиа справа)**:
  - Пример `description`: “Split layout with content-first copy and right‑side imagery, supported by KPI metrics for quick credibility.”
- **metrics (leftMedia: true)**:
  - Пример: “Split layout with left‑side media and a concise KPI summary (clients, projects, satisfaction, years) for proof at a glance.”
- **testimonial**:
  - Пример: “Split layout featuring a client testimonial with rating and supporting team imagery to build trust quickly.”
- **features (leftMedia: true)**:
  - Пример: “Split layout pairing left‑side media with a focused features list for scannable value.”
- **about (values cards + image)**:
  - Пример: “Split layout that highlights company values as compact cards with supporting team imagery.”

Что не переносим в текст:
- `leftMedia: true|false`, состав KPI/полей — в теги (`media_position`, `stats_fields`), а в тексте — лишь мягкий намёк.

#### Alt-тексты (уже есть в обоих пресетах)
- Сделать их семантически богатыми и предметными (без слова “image”):
  - “CRM dashboard with pipeline chart and metrics cards”
  - “Team collaborating in a modern office on analytics review”

### Что унести в теги (из парсинга), а не в текст
- **Структура**: `layout:grid|split`, `columns:1-2|1-2-3`, `media:image|none`, `media_position:left|right|below_header`.
- **Поведение**: `has_yearly_toggle`, `cta_count`, `isPopular`.
- **Сущности**: `cards:services`, `solutions:kpi|image`, `pricing:tiers=3`, `career:fields=role|location|department|type|salary`.

### Стоит ли полностью “замещать” описание контентом?
- Нет. Маркетинговый текст должен оставаться естественным и коротким. Микро‑подсказки (+ богатые alt) помогают эмбеддингу, но основная точность будет из нормализованных тегов и компактного `qdrant.description`. Переносить “жёсткие” токены (1–2–3, leftMedia) в видимый текст — избыточно.

### Итог
- Добавляем по 1–2 естественных структурных намёка в `description` и `alt` каждого варианта.
- Оставляем точные признаки структуре в тегах из парсинга.
- Сокращаем `qdrant.description` до 120–220 символов; контент блока + теги покрывают остальное.