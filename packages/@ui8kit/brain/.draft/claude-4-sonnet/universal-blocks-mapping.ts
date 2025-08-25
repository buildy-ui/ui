// Universal mapping configuration for block analysis
// No hardcoded dependencies - purely pattern-based detection

export interface UniversalMapping {
  // Layout detection patterns
  layoutPatterns: {
    grid: {
      typePattern: RegExp,
      requiredProps: string[],
      optionalProps: string[]
    },
    split: {
      typePattern: RegExp,
      requiredProps: string[],
      optionalProps: string[]
    },
    centered: {
      typePattern: RegExp,
      requiredProps: string[],
      optionalProps: string[]
    }
  };

  // Content entity detection patterns
  contentPatterns: {
    // Text content
    textual: string[],
    
    // Interactive elements
    cta: string[],
    
    // Media elements
    media: string[],
    
    // Data collections
    collections: {
      // Business/service oriented
      business: string[],
      
      // Content oriented
      content: string[],
      
      // Statistics/proof
      stats: string[],
      
      // Navigation/structure
      structure: string[]
    }
  };

  // Variant classification patterns
  variantPatterns: {
    // Purpose-based variants
    purpose: Record<string, RegExp>,
    
    // Layout-based variants
    layout: Record<string, RegExp>
  };

  // Industry/intent inference patterns
  semanticPatterns: {
    // Industry indicators in content
    industries: Record<string, string[]>,
    
    // Intent indicators
    intents: Record<string, string[]>,
    
    // Funnel stage indicators
    funnel: Record<string, string[]>
  },

  // UI/UX characteristics
  uiPatterns: {
    // Visual density indicators
    density: Record<string, string[]>,
    
    // Interaction patterns
    interaction: Record<string, string[]>
  }
}

// Utility functions for pattern matching
export const createPatternMatcher = () => ({
  // Detect layout from type and props
  detectLayout(type: string, props: Record<string, any>) {
    if (/\.grid$/.test(type)) return 'grid';
    if (/\.split$/.test(type)) return 'split'; 
    if (/\.centered$/.test(type)) return 'centered';
    return 'stack'; // fallback
  },

  // Extract content entities
  extractContentEntities(content: Record<string, any>) {
    const entities: Record<string, any> = {};
    
    // Text content
    ['badge', 'title', 'description', 'subtitle', 'promo'].forEach(key => {
      if (content[key]) entities[key] = content[key];
    });
    
    // Collections
    Object.keys(content).forEach(key => {
      if (Array.isArray(content[key]) && content[key].length > 0) {
        entities[key] = {
          type: 'collection',
          count: content[key].length,
          sample: content[key][0]
        };
      }
    });
    
    return entities;
  },

  // Classify variant purpose
  classifyVariant(variant: string, content: Record<string, any>) {
    const text = `${variant} ${JSON.stringify(content)}`.toLowerCase();
    
    const classifications = [];
    
    // Check purpose patterns
    if (/pricing|plan|tier/.test(text)) classifications.push('pricing');
    if (/career|job|opening/.test(text)) classifications.push('career');
    if (/testimonial|review/.test(text)) classifications.push('testimonial');
    if (/feature|benefit/.test(text)) classifications.push('features');
    if (/faq|question/.test(text)) classifications.push('faq');
    
    return classifications;
  },

  // Infer semantic context
  inferSemantics(content: Record<string, any>) {
    const text = JSON.stringify(content).toLowerCase();
    const context: Record<string, string[]> = {
      industries: [],
      intents: [],
      funnel: []
    };
    
    // Industry detection
    if (/platform|dashboard|api|saas/.test(text)) context.industries.push('saas');
    if (/product|shop|ecommerce/.test(text)) context.industries.push('ecommerce');
    if (/solution|consulting|strategy/.test(text)) context.industries.push('consulting');
    
    // Intent detection
    if (/get started|sign up|try free/.test(text)) context.intents.push('conversion');
    if (/learn more|discover|explore/.test(text)) context.intents.push('information');
    if (/contact|demo|consultation/.test(text)) context.intents.push('engagement');
    
    // Funnel detection
    if (/discover|explore|learn/.test(text)) context.funnel.push('awareness');
    if (/compare|features|why choose/.test(text)) context.funnel.push('consideration');
    if (/get started|buy now|contact sales/.test(text)) context.funnel.push('conversion');
    
    return context;
  }
});

export const universalMapping: UniversalMapping = {
  layoutPatterns: {
    grid: {
      typePattern: /\.grid$/,
      requiredProps: ['cols'],
      optionalProps: ['useContainer', 'className']
    },
    split: {
      typePattern: /\.split$/,
      requiredProps: ['leftMedia'],
      optionalProps: ['useContainer', 'className']
    },
    centered: {
      typePattern: /\.centered$/,
      requiredProps: [],
      optionalProps: ['useContainer', 'className']
    }
  },

  contentPatterns: {
    textual: ['badge', 'title', 'description', 'subtitle', 'promo'],
    cta: ['buttonText', 'buttons', 'primaryButtonText', 'secondaryButtonText'],
    media: ['image', 'images', 'imageUrl', 'backgroundImage'],
    collections: {
      business: ['plans', 'solutions', 'metrics', 'features', 'cards'],
      content: ['faqs', 'posts', 'testimonials', 'team', 'portfolio'],
      stats: ['stats', 'achievements', 'numbers', 'kpis'],
      structure: ['categories', 'brands', 'tags', 'openings']
    }
  },

  variantPatterns: {
    purpose: {
      pricing: /pricing|plans|tier/i,
      career: /career|job|opening/i,
      testimonial: /testimonial|review/i,
      features: /feature|benefit/i,
      gallery: /gallery|portfolio|showcase/i,
      faq: /faq|question|help/i,
      contact: /contact|support/i,
      about: /about|story|mission/i
    },
    layout: {
      simple: /simple|basic|clean/i,
      withMedia: /with(Image|Media|Logo|Background)/i,
      withStats: /with(Stats|Numbers|Metrics)/i,
      withFeatures: /with(Features|Benefits)/i,
      compact: /compact|minimal|condensed/i
    }
  },

  semanticPatterns: {
    industries: {
      saas: ['platform', 'dashboard', 'api', 'integration', 'automation'],
      ecommerce: ['product', 'shop', 'cart', 'payment', 'order'],
      finance: ['payment', 'billing', 'subscription', 'pricing', 'cost'],
      healthcare: ['health', 'medical', 'patient', 'care', 'treatment'],
      education: ['learn', 'course', 'student', 'education', 'training'],
      consulting: ['solution', 'strategy', 'consulting', 'advisory', 'expertise'],
      agency: ['creative', 'design', 'marketing', 'campaign', 'brand'],
      tech: ['technology', 'innovation', 'development', 'engineering', 'digital']
    },
    intents: {
      conversion: ['get started', 'sign up', 'try free', 'start trial', 'join now'],
      information: ['learn more', 'read more', 'discover', 'explore', 'find out'],
      engagement: ['contact', 'demo', 'consultation', 'call', 'schedule'],
      social_proof: ['testimonial', 'review', 'case study', 'success story'],
      pricing: ['pricing', 'plans', 'compare', 'choose', 'upgrade']
    },
    funnel: {
      awareness: ['discover', 'explore', 'learn', 'understand', 'introduction'],
      consideration: ['compare', 'features', 'benefits', 'why choose', 'solution'],
      conversion: ['get started', 'sign up', 'buy now', 'start trial', 'contact sales'],
      retention: ['support', 'help', 'faq', 'resources', 'community']
    }
  },

  uiPatterns: {
    density: {
      high: ['grid', 'cards', 'compact', 'list'],
      medium: ['split', 'features', 'standard'],
      low: ['centered', 'hero', 'simple', 'minimal']
    },
    interaction: {
      form: ['form', 'input', 'submit', 'contact'],
      navigation: ['menu', 'tabs', 'categories', 'filter'],
      media: ['gallery', 'carousel', 'slideshow', 'video'],
      accordion: ['accordion', 'expandable', 'collapse']
    }
  }
};
