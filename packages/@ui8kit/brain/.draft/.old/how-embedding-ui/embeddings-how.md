### What to encode for retrieval (focused on `@business/GridBusiness.tsx`)
Each GridBusiness variant has a clear intent and schema. Create one embedding document per template variant, with rich, structured metadata for filtering and LLM re‑ranking.

- • Variant mapping
  - • gridBusinessCardsGallery: Services/features showcase in a 1‑2‑3 column grid; items have title, description, icon; optional card spans.
  - • gridBusinessSolutionsGrid: Solutions with optional image and stat badge per item; visual emphasis on icon/image + copy.
  - • gridBusinessPricing: Price cards with name, description, price, feature list, CTA; “Most Popular” support.
  - • gridBusinessPricingYear: Same as Pricing + monthly/yearly toggle and strikethrough; subscription orientation.
  - • gridBusinessCareer: Job openings with location/department/type/salary tags + Apply CTA.

- • Content schema cues (embed as text + store as metadata)
  - • Common: badge, title, description, optional button, items array.
  - • CardsGallery items: {title, description, lucideIcon, colSpan, rowSpan}.
  - • Solutions items: {title, description, lucideIcon, image?, stats?}.
  - • Pricing items: {name, description, price/monthlyPrice/yearlyPrice, features[], isPopular, buttonVariant}.
  - • Career items: {title, location, department?, type?, salary?, link?} and categories[].

### Suggested vector record shape
Embed a compact, descriptive “document” string; keep everything else as filterable metadata. One record per template variant.

```json
{
  "id": "gridBusinessPricing",
  "doc": "Pricing grid for business offerings. 1-2-3 columns. Each plan has name, description, price, feature list, and a CTA. Supports 'Most Popular' highlighting. Suited for productized services, packages, menus, or tiered offers.",
  "metadata": {
    "category": "business",
    "variant": "pricing",
    "layout": "grid",
    "columns": "1-2-3",
    "supports": ["pricing", "features", "cta", "badges"],
    "item_fields": ["name", "description", "price", "features[]", "isPopular", "buttonText", "buttonVariant"],
    "funnel_stage": ["consideration", "conversion"],
    "personas": ["owner", "marketer"],
    "intents": ["sell", "packages", "promotion", "offer", "pricing", "bundles"],
    "visual_emphasis": ["cards", "highlight-popular", "grid"],
    "good_for_industries": ["restaurants", "agencies", "repair", "saas", "local_services"],
    "seasonality": ["campaign_ready"]
  }
}
```

Replicate for:
- gridBusinessCardsGallery → intents: ["showcase", "features", "benefits"], funnel: ["awareness", "consideration"], supports: ["icons", "cards"].
- gridBusinessSolutionsGrid → intents: ["solutions", "capabilities", "case_oriented"], supports: ["image", "icon", "stats"].
- gridBusinessPricingYear → add metadata.toggle = "monthly_yearly", intents: ["subscriptions"].
- gridBusinessCareer → intents: ["hiring", "jobs"], funnel: ["recruitment"], supports: ["location", "department", "type", "salary"].

### Indexing guidelines
- • One doc per template variant across all 120+ blocks.
- • Use multilingual embeddings or bilingual keywords; include EN+RU synonyms in doc and metadata (e.g., “pricing/цены/тарифы/пакеты”).
- • Keep doc 300–800 chars; express purpose, layout, content types, best use cases.
- • Metadata fields (non-exhaustive):
  - • category: "business" | "cta" | "gallery" | ...
  - • variant
  - • layout: "grid" | "split" | "centered"
  - • columns: "1-2-3" | "1-2" | ...
  - • supports: ["pricing","features","image","stats","cta","logos","search","filters",...]
  - • item_fields: names of content properties present
  - • funnel_stage: ["awareness","consideration","conversion","retention","recruitment"]
  - • intents: ["sell","promote","announce","hire","educate","collect_leads"]
  - • personas: ["owner","marketer","hr","sales","founder"]
  - • good_for_industries: tag array (curated + auto-expanded synonyms)
  - • seasonality: ["campaign_ready","holiday","new_year","black_friday"] where relevant
  - • complexity: "low" | "medium" | "high"
  - • has_cta: boolean
  - • images/icons/stats: booleans
  - • example_queries: short strings to aid re-rank prompts

### Retrieval pipeline (to get 20–40 best matches)
- • Step 1: Classify query → {industry, intent, funnel_stage, seasonality}.
- • Step 2: Apply metadata filters (e.g., intent=pricing OR supports contains pricing; funnel_stage in conversion; good_for_industries includes or is generic).
- • Step 3: Hybrid search = dense embeddings + sparse BM25 (on doc + keywords); union top‑K (e.g., 100).
- • Step 4: LLM re-rank with rubric: fit(industry) + fit(intent/funnel) + structural fit (supports) + campaign readiness + diversity. Return 20–40.
- • Step 5: Optional diversification by category/layout to avoid monotony.

### Example mappings (your sample niches)
- • Ресторан, новогодняя акция, блюда на мангале
  - • Strong: gridBusinessPricing (bundles/sets), gridBusinessCardsGallery (signature dishes/features), CTA split variants for promos, Gallery grid for imagery.
  - • Filters: industry=restaurants, intent in ["promotion","packages"], funnel in ["conversion","consideration"], seasonality includes ["new_year","campaign_ready"].

- • Маркетолог продаёт услуги по рекламе
  - • Strong: gridBusinessPricing (packages), gridBusinessSolutionsGrid (capabilities + stats), testimonials, case-study grids, CTA split.
  - • Filters: industry=["agencies","b2b_services"], intent in ["sell","packages","proof"], supports in ["pricing","stats","cta"].

- • Спецтехника и ремонт грузовиков
  - • Strong: gridBusinessSolutionsGrid (service lines + images + stats), gridBusinessCardsGallery (diagnostics/repairs), pricing if productized, portfolio/case blocks.
  - • Filters: industry=["automotive","industrial"], intent in ["sell","services"], supports in ["image","stats","features"].

### Tagging playbook (semi-automated)
- • Auto-infer from code: layout, columns, item_fields, supports (e.g., presence of price/features/stats/image/icon/cta).
- • Heuristic intents: if price/features list + CTA → "pricing" + "conversion"; if openings → "hiring".
- • Curate industry tags: a base generic set + hand‑picked fits per variant; periodically expand via LLM suggestions.
- • Add example_queries per variant to steer re-ranker.

### Model choices
- • Embeddings: multilingual model (e.g., OpenAI text-embedding-3-large) or top open models (e.g., bge-m3) for RU/EN.
- • Re-rank: lightweight cross‑encoder or a GPT re-rank prompt with the metadata shown to reduce token load.

### Minimal record examples (5 variants)
```json
{"id":"gridBusinessCardsGallery","doc":"Feature/service cards in a 1-2-3 grid with icons; short descriptions; good for showcasing offerings or highlights.","metadata":{"category":"business","variant":"cardsGallery","layout":"grid","columns":"1-2-3","supports":["icons","cards","cta?","badge"],"item_fields":["title","description","lucideIcon","colSpan","rowSpan"],"funnel_stage":["awareness","consideration"],"intents":["showcase","features","promotion"],"good_for_industries":["restaurants","agencies","repair","local_services"]}}
{"id":"gridBusinessSolutionsGrid","doc":"Solution cards with optional image and stat chip; visual emphasis; suitable for capabilities/solutions overviews.","metadata":{"category":"business","variant":"solutionsGrid","layout":"grid","columns":"1-2-3","supports":["image","stats","icons","cards"],"item_fields":["title","description","image?","stats?"],"funnel_stage":["consideration"],"intents":["solutions","capabilities","proof"],"good_for_industries":["agencies","saas","automotive","industrial"]}}
{"id":"gridBusinessPricing","doc":"Pricing grid with plans, feature lists, and CTA; supports 'Most Popular'.","metadata":{"category":"business","variant":"pricing","layout":"grid","columns":"1-2-3","supports":["pricing","features","cta","badges"],"item_fields":["name","description","price","features[]","isPopular","buttonText"],"funnel_stage":["consideration","conversion"],"intents":["pricing","packages","sell"],"good_for_industries":["restaurants","agencies","saas","repair"]}}
{"id":"gridBusinessPricingYear","doc":"Pricing grid with monthly/yearly toggle and crossed-out monthly price; subscription-oriented.","metadata":{"category":"business","variant":"pricingYear","layout":"grid","columns":"1-2-3","supports":["pricing","toggle","features","cta"],"item_fields":["monthlyPrice","yearlyPrice","features[]"],"funnel_stage":["conversion"],"intents":["subscriptions","pricing"],"good_for_industries":["saas","memberships"]}}
{"id":"gridBusinessCareer","doc":"Job openings list with department, location, type, salary; 'Apply' CTA.","metadata":{"category":"business","variant":"career","layout":"grid","columns":"1-2","supports":["jobs","location","department","type","salary","cta"],"item_fields":["title","location","department?","type?","salary?"],"funnel_stage":["recruitment"],"intents":["hiring"],"good_for_industries":["any"]}}
```

- Store RU/EN synonyms in metadata.intents and add a compact bilingual “doc” to improve cross‑lingual recall.

### Why this works
- Dense embeddings capture purpose; metadata filters narrow by structure and intent; LLM re‑rank chooses the best 20–40 with clear rubrics. The schema is stable across 120+ templates and directly reflects each block’s structural affordances.

- • If you want, I can draft the full JSON catalog for all `business` variants in your repo and a rubric prompt for re‑ranking.

- Focused outcome: consistent, high‑precision block selection for niche, campaign, and persona‑driven queries.

- Added a normalized embedding record schema for each GridBusiness variant with filters aligned to funnel stage, intent, and industry.
- Proposed hybrid retrieval + LLM re‑rank with a rubric for selecting 20–40 top blocks.
- Included RU/EN tagging guidance for robust cross‑lingual search.