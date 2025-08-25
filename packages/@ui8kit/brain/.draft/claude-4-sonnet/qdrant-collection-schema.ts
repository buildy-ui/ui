// Complete QDrant collection schema for UI blocks
// Designed for text-embedding-3-small with comprehensive filtering and semantic search

export interface QDrantBlockDocument {
  // Primary identification
  id: string;                    // Format: "{type}#{variant}#{index}"
  type: string;                  // e.g., "hero.centered", "business.grid"
  variant: string;               // e.g., "simple", "withImage", "pricing"
  category: string;              // e.g., "hero", "business", "cta"
  
  // File system reference
  source: {
    path: string;                // e.g., "packages/@ui8kit/blocks/src/hero/CenteredHero.preset.ts"
    export_name: string;         // e.g., "CenteredHeroPreset"
    preset_index: number;        // Index in the preset array
  };

  // Embedding content (what gets vectorized)
  embedding: {
    model: "text-embedding-3-small";
    text: string;                // Natural language description combining content + structure
    tokens_estimate: number;     // Estimated token count
  };

  // QDrant payload for filtering and metadata
  payload: {
    // Core QDrant fields (for RAG system)
    qdrant: {
      description: string;       // Concise RU/EN description (150-250 chars)
      tags: string[];           // Filterable key:value tags
      category: string;         // Duplicate for convenience
    };

    // Structural metadata (extracted from code)
    structure: {
      layout: "grid" | "split" | "centered" | "stack";
      columns?: string;          // "1-2-3", "1-2", etc. (grid only)
      media_position?: "left" | "right" | "center" | "below" | "above";
      container: boolean;        // useContainer prop
      responsive: boolean;       // Always true for UI8Kit blocks
      density: "low" | "medium" | "high";  // Visual information density
    };

    // Content analysis (extracted from preset data)
    content: {
      // Text elements
      has_badge: boolean;
      has_title: boolean;
      has_description: boolean;
      has_subtitle: boolean;
      
      // Interactive elements
      cta_count: number;         // 0, 1, 2, etc.
      cta_types: string[];       // ["primary", "secondary", "outline"]
      has_form: boolean;
      has_links: boolean;
      
      // Media elements
      media_type: "none" | "image" | "video" | "icon" | "gallery" | "stats";
      media_count: number;       // Number of media items
      has_background: boolean;   // Background image/gradient
      
      // Data collections
      collections: {
        [key: string]: {         // "faqs", "features", "plans", etc.
          count: number;
          item_fields: string[]; // Fields in collection items
        };
      };
    };

    // Semantic classification (inferred from content)
    semantics: {
      // Business context
      industries: string[];      // ["saas", "ecommerce", "consulting"]
      personas: string[];        // ["developer", "marketer", "founder"]
      company_size: string[];    // ["startup", "enterprise", "smb"]
      
      // User intent
      intents: string[];         // ["conversion", "information", "engagement"]
      funnel_stages: string[];   // ["awareness", "consideration", "conversion"]
      use_cases: string[];       // ["landing_page", "product_page", "about_page"]
      
      // Campaign context
      seasonality: string[];     // ["new_year", "black_friday", "launch"]
      urgency: "low" | "medium" | "high";
      tone: string[];           // ["professional", "friendly", "urgent"]
    };

    // Technical metadata
    technical: {
      // Component info
      component_name: string;    // "CenteredHero", "GridBusiness"
      schema_available: boolean; // Has .schema.ts file
      
      // Dependencies (extracted from imports)
      ui_components: string[];   // ["Button", "Badge", "Title", "Text"]
      icons_used: string[];      // ["ArrowRight", "Play", "Shield"]
      
      // Styling hints
      themes_supported: string[]; // ["skyOS", "modernUI"]
      has_gradient: boolean;
      has_animation: boolean;
      
      // Complexity indicators
      complexity: "simple" | "moderate" | "complex";
      customization_level: "low" | "medium" | "high";
    };

    // Performance and quality metadata
    quality: {
      // Content quality
      content_completeness: number;  // 0-1 score based on filled fields
      text_quality: "basic" | "good" | "excellent";
      
      // Design quality
      visual_hierarchy: "flat" | "structured" | "rich";
      accessibility_level: "basic" | "enhanced" | "full";
      
      // Reusability
      reusability_score: number;     // 0-1 based on content flexibility
      template_quality: "basic" | "production" | "showcase";
    };

    // Usage statistics (can be updated later)
    usage: {
      popularity_score: number;      // 0-1 based on usage
      last_updated: string;          // ISO date
      version: string;               // Semantic version
      status: "active" | "deprecated" | "experimental";
    };
  };
}

// QDrant collection configuration
export interface QDrantCollectionConfig {
  name: string;                      // "ui8kit_blocks"
  vector_config: {
    size: 1536;                      // text-embedding-3-small dimensions
    distance: "Cosine";              // Similarity metric
  };
  
  // Optimized for filtering
  payload_schema: {
    // Enable filtering on key fields
    "payload.qdrant.category": { type: "keyword", index: true };
    "payload.structure.layout": { type: "keyword", index: true };
    "payload.content.cta_count": { type: "integer", index: true };
    "payload.semantics.industries": { type: "keyword", index: true };
    "payload.semantics.intents": { type: "keyword", index: true };
    "payload.semantics.funnel_stages": { type: "keyword", index: true };
    "payload.quality.template_quality": { type: "keyword", index: true };
    "payload.usage.status": { type: "keyword", index: true };
  };
  
  // Hybrid search configuration (optional)
  sparse_vectors?: {
    text: {
      index: {
        type: "text";
        tokenizer: "word";
        min_token_len: 2;
        max_token_len: 20;
        lowercase: true;
      };
    };
  };
}

// Helper types for tag generation
export type TagCategory = 
  | "category"      // category:hero
  | "layout"        // layout:grid
  | "variant"       // variant:pricing
  | "columns"       // columns:1-2-3
  | "media"         // media:image
  | "cta_count"     // cta_count:2
  | "industry"      // industry:saas
  | "intent"        // intent:conversion
  | "funnel"        // funnel:consideration
  | "complexity"    // complexity:simple
  | "quality"       // quality:production
  | "use_case"      // use_case:landing_page
  | "persona"       // persona:developer
  | "seasonality"   // seasonality:new_year
  | "tone";         // tone:professional

export interface TaggedField {
  category: TagCategory;
  value: string;
}

// Utility functions for tag generation
export const createTag = (category: TagCategory, value: string): string => 
  `${category}:${value.toLowerCase().replace(/\s+/g, '_')}`;

export const parseTag = (tag: string): TaggedField | null => {
  const [category, value] = tag.split(':', 2);
  if (!category || !value) return null;
  return { category: category as TagCategory, value };
};

// Embedding text templates
export const EmbeddingTemplates = {
  // Primary template for natural description
  natural: (data: {
    title?: string;
    description?: string;
    layout: string;
    variant: string;
    mediaInfo: string;
    ctaInfo: string;
    useCase: string;
  }) => {
    const parts = [
      data.title ? `${data.title}.` : '',
      `${data.layout} layout${data.mediaInfo ? ` with ${data.mediaInfo}` : ''}.`,
      data.description ? `${data.description}` : '',
      data.ctaInfo ? `${data.ctaInfo}.` : '',
      `${data.useCase}.`
    ].filter(Boolean);
    
    return parts.join(' ').trim();
  },

  // Structural template for precise matching
  structural: (data: {
    type: string;
    variant: string;
    layout: string;
    columns?: string;
    mediaPosition?: string;
    ctaCount: number;
    collections: string[];
  }) => {
    const parts = [
      `${data.type} ${data.variant} variant.`,
      `${data.layout} layout${data.columns ? ` ${data.columns} columns` : ''}${data.mediaPosition ? ` ${data.mediaPosition} media` : ''}.`,
      data.ctaCount > 0 ? `${data.ctaCount} CTA buttons.` : 'No CTA.',
      data.collections.length > 0 ? `Collections: ${data.collections.join(', ')}.` : ''
    ].filter(Boolean);
    
    return parts.join(' ').trim();
  }
};

export default QDrantBlockDocument;
