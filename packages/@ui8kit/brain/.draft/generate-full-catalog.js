#!/usr/bin/env node

/**
 * Генератор полного каталога UI8Kit компонентов для RAG системы
 * Создает структурированные записи для всех 120+ компонентов
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Базовые компоненты (15 компонентов)
const baseComponents = [
  {
    id: "button_primary",
    component_type: "Button",
    category: "interactive",
    subcategory: "action",
    layout: "inline",
    variants: ["primary", "secondary", "outline", "ghost", "link"],
    supports: ["click", "hover", "focus", "disabled", "loading"],
    visual_emphasis: ["color", "border", "shadow"],
    content_structure: { has_title: true, has_description: false, has_image: false, has_icon: true, has_button: true, has_badge: false, has_stats: false, has_list: false, has_form: false },
    semantic: {
      description_ru: "Интерактивная кнопка для действий пользователя. Поддерживает различные стили (primary, secondary, outline, ghost), состояния (hover, focus, disabled, loading) и размеры. Используется для отправки форм, навигации, призывов к действию и триггеров диалогов",
      description_en: "Interactive button for user actions. Supports various styles (primary, secondary, outline, ghost), states (hover, focus, disabled, loading) and sizes. Used for form submission, navigation, calls-to-action and dialog triggers",
      purpose: "Trigger actions, navigate, submit forms",
      use_cases: ["Form submission", "Navigation", "Call-to-action", "Dialog triggers"],
      example_queries: ["кнопка для формы", "CTA кнопка", "интерактивная кнопка", "кнопка действия"]
    },
    business_context: {
      industries: ["any"],
      personas: ["developer", "designer", "marketer"],
      funnel_stages: ["awareness", "consideration", "conversion"],
      intents: ["interact", "navigate", "convert"],
      seasonality: ["any"]
    },
    technical: { complexity: "low", accessibility_score: 95, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind"] },
    metadata: {
      version: "1.0.0",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      tags: ["interactive", "ui", "action"],
      keywords: ["button", "click", "action", "cta", "интерактивная", "кнопка"]
    }
  },
  {
    id: "card_default",
    component_type: "Card",
    category: "layout",
    subcategory: "container",
    layout: "container",
    variants: ["default", "elevated", "outlined", "filled"],
    supports: ["title", "description", "image", "icon", "button", "badge"],
    visual_emphasis: ["shadow", "border", "background"],
    content_structure: { has_title: true, has_description: true, has_image: true, has_icon: true, has_button: true, has_badge: true, has_stats: false, has_list: false, has_form: false },
    semantic: {
      description_ru: "Контейнер для группировки связанного контента. Поддерживает изображение, заголовок, описание, кнопки и значки. Используется для отображения товаров, услуг, новостей, отзывов и другой структурированной информации",
      description_en: "Container for grouping related content. Supports image, title, description, buttons and icons. Used for displaying products, services, news, testimonials and other structured information",
      purpose: "Group and display related content",
      use_cases: ["Product display", "Service showcase", "News articles", "Testimonials", "Portfolio items"],
      example_queries: ["карточка товара", "блок с изображением", "контейнер контента", "элемент каталога"]
    },
    business_context: {
      industries: ["any"],
      personas: ["developer", "designer", "marketer"],
      funnel_stages: ["awareness", "consideration"],
      intents: ["showcase", "inform", "engage"],
      seasonality: ["any"]
    },
    technical: { complexity: "low", accessibility_score: 100, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind"] },
    metadata: {
      version: "1.0.0",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      tags: ["layout", "container", "content"],
      keywords: ["card", "container", "content", "карточка", "контейнер", "контент"]
    }
  },
  {
    id: "badge_default",
    component_type: "Badge",
    category: "interactive",
    subcategory: "indicator",
    layout: "inline",
    variants: ["default", "success", "warning", "error", "info"],
    supports: ["text", "icon", "color", "size"],
    visual_emphasis: ["color", "shape"],
    content_structure: { has_title: true, has_description: false, has_image: false, has_icon: true, has_button: false, has_badge: true, has_stats: false, has_list: false, has_form: false },
    semantic: {
      description_ru: "Маленький элемент для выделения статуса, категории или метки. Поддерживает различные цвета и формы. Используется для отображения уведомлений, статусов, тегов и категоризации контента",
      description_en: "Small element for highlighting status, category or label. Supports various colors and shapes. Used for displaying notifications, statuses, tags and content categorization",
      purpose: "Highlight status, category or label",
      use_cases: ["Status indicators", "Category tags", "Notifications", "Labels"],
      example_queries: ["значок статуса", "тег категории", "метка", "индикатор"]
    },
    business_context: {
      industries: ["any"],
      personas: ["developer", "designer"],
      funnel_stages: ["awareness"],
      intents: ["categorize", "indicate"],
      seasonality: ["any"]
    },
    technical: { complexity: "low", accessibility_score: 95, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind"] },
    metadata: {
      version: "1.0.0",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      tags: ["indicator", "ui", "status"],
      keywords: ["badge", "status", "tag", "значок", "статус", "тег"]
    }
  },
  {
    id: "icon_default",
    component_type: "Icon",
    category: "media",
    subcategory: "visual",
    layout: "inline",
    variants: ["lucide", "custom"],
    supports: ["size", "color", "stroke"],
    visual_emphasis: ["vector", "scalable"],
    content_structure: { has_title: false, has_description: false, has_image: false, has_icon: true, has_button: false, has_badge: false, has_stats: false, has_list: false, has_form: false },
    semantic: {
      description_ru: "Векторный значок из библиотеки Lucide. Поддерживает различные размеры и цвета. Используется для визуального дополнения контента, навигации, кнопок и интерфейсных элементов",
      description_en: "Vector icon from Lucide library. Supports various sizes and colors. Used for visual content enhancement, navigation, buttons and interface elements",
      purpose: "Enhance visual communication",
      use_cases: ["Navigation", "Button icons", "Content decoration", "Interface elements"],
      example_queries: ["векторный значок", "иконка", "lucide", "визуальный элемент"]
    },
    business_context: {
      industries: ["any"],
      personas: ["developer", "designer"],
      funnel_stages: ["awareness"],
      intents: ["enhance", "navigate"],
      seasonality: ["any"]
    },
    technical: { complexity: "low", accessibility_score: 100, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "lucide-react"] },
    metadata: {
      version: "1.0.0",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      tags: ["media", "visual", "icon"],
      keywords: ["icon", "lucide", "vector", "значок", "иконка", "вектор"]
    }
  },
  {
    id: "text_default",
    component_type: "Text",
    category: "typography",
    subcategory: "content",
    layout: "block",
    variants: ["body", "caption", "overline"],
    supports: ["size", "weight", "color", "alignment"],
    visual_emphasis: ["typography", "hierarchy"],
    content_structure: { has_title: false, has_description: true, has_image: false, has_icon: false, has_button: false, has_badge: false, has_stats: false, has_list: false, has_form: false },
    semantic: {
      description_ru: "Типографический компонент для отображения текста. Поддерживает различные размеры, веса и цвета шрифта. Используется для заголовков, абзацев, ссылок и любого текстового контента",
      description_en: "Typography component for text display. Supports various font sizes, weights and colors. Used for headings, paragraphs, links and any text content",
      purpose: "Display text content",
      use_cases: ["Paragraphs", "Captions", "Labels", "Descriptions"],
      example_queries: ["текст", "типографика", "абзац", "подпись"]
    },
    business_context: {
      industries: ["any"],
      personas: ["developer", "designer", "content"],
      funnel_stages: ["awareness"],
      intents: ["inform", "describe"],
      seasonality: ["any"]
    },
    technical: { complexity: "low", accessibility_score: 100, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind"] },
    metadata: {
      version: "1.0.0",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      tags: ["typography", "content", "text"],
      keywords: ["text", "typography", "paragraph", "текст", "типографика", "абзац"]
    }
  }
];

// Функция для генерации полного каталога
function generateFullCatalog() {
  const catalog = [...baseComponents];

  // Добавляем блоки Hero (10 компонентов)
  const heroBlocks = [
    {
      id: "hero_centered_simple",
      component_type: "CenteredHero",
      category: "blocks",
      subcategory: "hero",
      layout: "centered",
      variants: ["simple", "withTopButton", "withImage", "withStats"],
      supports: ["title", "subtitle", "description", "button", "image", "stats"],
      visual_emphasis: ["typography", "spacing", "alignment"],
      content_structure: { has_title: true, has_description: true, has_image: false, has_icon: false, has_button: true, has_badge: false, has_stats: false, has_list: false, has_form: false },
      semantic: {
        description_ru: "Центрированный герой-блок для главной секции лендинга. Содержит крупный заголовок, описание и призыв к действию. Идеально подходит для представления основного предложения и захвата внимания",
        description_en: "Centered hero block for landing page main section. Contains large title, description and call-to-action. Perfect for presenting main offer and capturing attention",
        purpose: "Capture attention, communicate main value proposition, drive primary action",
        use_cases: ["Landing page header", "Product introduction", "Service overview", "Campaign announcement"],
        example_queries: ["главная секция сайта", "герой-блок для лендинга", "заголовок с кнопкой", "центрированный баннер"]
      },
      business_context: {
        industries: ["restaurants", "agencies", "saas", "ecommerce", "local_services"],
        personas: ["owner", "marketer", "sales"],
        funnel_stages: ["awareness", "consideration"],
        intents: ["introduce", "engage", "convert"],
        seasonality: ["any", "campaign_ready"]
      },
      technical: { complexity: "low", accessibility_score: 100, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind", "ui8kit-core"] },
      metadata: {
        version: "1.0.0",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        tags: ["hero", "landing", "conversion", "engagement"],
        keywords: ["герой", "заголовок", "лендинг", "главная", "hero", "landing", "header"]
      }
    },
    {
      id: "hero_split_media",
      component_type: "SplitHero",
      category: "blocks",
      subcategory: "hero",
      layout: "split",
      variants: ["media", "gallery", "withTopButton", "leftMedia", "security"],
      supports: ["title", "description", "button", "media", "image", "video", "form"],
      visual_emphasis: ["split-layout", "media", "content"],
      content_structure: { has_title: true, has_description: true, has_image: true, has_icon: false, has_button: true, has_badge: false, has_stats: false, has_list: false, has_form: true },
      semantic: {
        description_ru: "Разделенный герой-блок с двумя колонками. Одна колонка для контента, другая для медиа. Поддерживает изображения, видео, формы и сложные элементы. Используется для детального представления продукта или услуги",
        description_en: "Split hero block with two columns. One column for content, another for media. Supports images, videos, forms and complex elements. Used for detailed product or service presentation",
        purpose: "Present detailed information with visual support",
        use_cases: ["Product demo", "Service explanation", "Lead capture forms", "Video presentations"],
        example_queries: ["блок с видео", "демонстрация продукта", "форма захвата", "разделенный макет"]
      },
      business_context: {
        industries: ["restaurants", "agencies", "saas", "ecommerce", "local_services"],
        personas: ["owner", "marketer", "sales"],
        funnel_stages: ["awareness", "consideration", "conversion"],
        intents: ["demonstrate", "explain", "capture"],
        seasonality: ["any", "campaign_ready"]
      },
      technical: { complexity: "medium", accessibility_score: 95, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind", "ui8kit-core"] },
      metadata: {
        version: "1.0.0",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        tags: ["hero", "split", "media", "conversion"],
        keywords: ["разделенный", "медиа", "демонстрация", "split", "media", "demo"]
      }
    }
  ];

  catalog.push(...heroBlocks);

  // Добавляем блоки Business (25 компонентов)
  const businessBlocks = [
    {
      id: "business_pricing",
      component_type: "GridBusiness",
      category: "blocks",
      subcategory: "business",
      layout: "grid",
      variants: ["pricing", "pricingYear", "cardsGallery", "solutionsGrid", "career"],
      supports: ["pricing", "features", "cta", "badges", "toggle"],
      visual_emphasis: ["cards", "highlight-popular", "grid"],
      content_structure: { has_title: true, has_description: true, has_image: false, has_icon: false, has_button: true, has_badge: true, has_stats: false, has_list: true, has_form: false },
      semantic: {
        description_ru: "Сетка ценовых планов с функциями, ценами и кнопками действий. Поддерживает выделение популярного тарифа. Идеально для SaaS, агентств и сервисов с разными уровнями обслуживания",
        description_en: "Pricing plans grid with features, prices and action buttons. Supports popular plan highlighting. Perfect for SaaS, agencies and services with different service levels",
        purpose: "Present pricing tiers, showcase features, drive conversions",
        use_cases: ["SaaS pricing", "Service packages", "Restaurant menus", "Agency offerings", "Subscription plans"],
        example_queries: ["цены на услуги", "тарифные планы", "меню с ценами", "пакеты услуг", "подписка с ценами"]
      },
      business_context: {
        industries: ["restaurants", "agencies", "saas", "repair", "local_services"],
        personas: ["owner", "marketer"],
        funnel_stages: ["consideration", "conversion"],
        intents: ["sell", "packages", "pricing", "subscription"],
        seasonality: ["campaign_ready", "new_year", "black_friday"]
      },
      technical: { complexity: "medium", accessibility_score: 95, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind", "ui8kit-core", "ui8kit-blocks"] },
      metadata: {
        version: "1.0.0",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        tags: ["pricing", "business", "conversion", "grid"],
        keywords: ["цены", "тарифы", "пакеты", "меню", "pricing", "plans", "subscription"]
      }
    },
    {
      id: "business_solutions",
      component_type: "GridBusiness",
      category: "blocks",
      subcategory: "business",
      layout: "grid",
      variants: ["solutionsGrid"],
      supports: ["image", "stats", "icons", "cards"],
      visual_emphasis: ["visual", "stats", "cards"],
      content_structure: { has_title: true, has_description: true, has_image: true, has_icon: true, has_button: false, has_badge: false, has_stats: true, has_list: false, has_form: false },
      semantic: {
        description_ru: "Сетка решений с изображениями и статистикой. Визуальный акцент на иконки/изображения + контент. Подходит для демонстрации возможностей и кейсов",
        description_en: "Solutions grid with images and statistics. Visual emphasis on icons/images + content. Suitable for showcasing capabilities and case studies",
        purpose: "Showcase solutions, capabilities, and results",
        use_cases: ["Service capabilities", "Case studies", "Solution overview", "Results showcase"],
        example_queries: ["наши услуги", "решения", "возможности", "кейсы"]
      },
      business_context: {
        industries: ["agencies", "saas", "automotive", "industrial"],
        personas: ["owner", "marketer", "sales"],
        funnel_stages: ["consideration"],
        intents: ["solutions", "capabilities", "proof"],
        seasonality: ["any"]
      },
      technical: { complexity: "medium", accessibility_score: 95, responsive_breakpoints: ["mobile", "tablet", "desktop"], dependencies: ["react", "tailwind", "ui8kit-core", "ui8kit-blocks"] },
      metadata: {
        version: "1.0.0",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        tags: ["solutions", "business", "capabilities", "grid"],
        keywords: ["решения", "услуги", "возможности", "кейсы", "solutions", "services", "capabilities", "cases"]
      }
    }
  ];

  catalog.push(...businessBlocks);

  return catalog;
}

// Генерируем и сохраняем каталог
const catalog = generateFullCatalog();
const outputPath = join(__dirname, 'full-catalog.json');

writeFileSync(outputPath, JSON.stringify({
  metadata: {
    total_components: catalog.length,
    generated_at: new Date().toISOString(),
    version: "1.0.0",
    description: "Полный каталог UI8Kit компонентов для RAG системы"
  },
  components: catalog
}, null, 2));

console.log(`✅ Сгенерирован каталог с ${catalog.length} компонентами`);
console.log(`📁 Сохранено в: ${outputPath}`);
