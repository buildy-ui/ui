// BEM Block definitions
export const BEM_BLOCKS = {
  // Layout blocks
  hero: 'hero',
  features: 'features',
  blog: 'blog',
  testimonials: 'testimonials',
  pricing: 'pricing',
  contact: 'contact',
  footer: 'footer',
  header: 'header',
  
  // Component blocks
  card: 'card',
  button: 'button',
  form: 'form',
  modal: 'modal',
  nav: 'nav',
  sidebar: 'sidebar',
} as const;

// BEM Elements for each block
export const BEM_ELEMENTS = {
  hero: ['title', 'subtitle', 'content', 'media', 'actions', 'background'] as const,
  features: ['grid', 'item', 'icon', 'title', 'description', 'list'] as const,
  blog: ['grid', 'card', 'image', 'content', 'title', 'excerpt', 'meta'] as const,
  testimonials: ['grid', 'card', 'avatar', 'quote', 'author', 'rating'] as const,
  pricing: ['grid', 'card', 'header', 'price', 'features', 'actions'] as const,
  contact: ['form', 'input', 'button', 'map', 'info'] as const,
  footer: ['columns', 'links', 'social', 'copyright'] as const,
  header: ['logo', 'nav', 'actions', 'mobile-menu'] as const,
  
  card: ['header', 'content', 'footer', 'image', 'overlay'] as const,
  button: ['icon', 'text', 'loader'] as const,
  form: ['field', 'label', 'input', 'error', 'helper'] as const,
  modal: ['overlay', 'content', 'header', 'body', 'footer', 'close'] as const,
  nav: ['list', 'item', 'link', 'dropdown'] as const,
  sidebar: ['header', 'content', 'footer', 'toggle'] as const,
} as const;

// BEM Modifiers (common across blocks)
export const BEM_MODIFIERS = [
  'primary', 'secondary', 'accent', 'muted',
  'large', 'small', 'compact', 'expanded',
  'active', 'disabled', 'loading', 'error',
  'dark', 'light', 'transparent',
  'left', 'right', 'center', 'top', 'bottom',
  'mobile', 'tablet', 'desktop',
  'highlighted', 'featured', 'special'
] as const;

// Type helpers
export type BemBlock = keyof typeof BEM_BLOCKS;
export type BemElement<T extends BemBlock> = T extends keyof typeof BEM_ELEMENTS 
  ? typeof BEM_ELEMENTS[T][number] 
  : never;
export type BemModifier = typeof BEM_MODIFIERS[number];

// Generate BEM class name types
export type BemClassName<T extends BemBlock> = 
  | T 
  | `${T}-${BemElement<T>}`
  | `${T}-${BemModifier}`
  | `${T}-${BemElement<T>}-${BemModifier}`;

// Union of all possible BEM class names
export type DataClassName = 
  | BemClassName<'hero'>
  | BemClassName<'features'>
  | BemClassName<'blog'>
  | BemClassName<'testimonials'>
  | BemClassName<'pricing'>
  | BemClassName<'contact'>
  | BemClassName<'footer'>
  | BemClassName<'header'>
  | BemClassName<'card'>
  | BemClassName<'button'>
  | BemClassName<'form'>
  | BemClassName<'modal'>
  | BemClassName<'nav'>
  | BemClassName<'sidebar'>;

// Helper functions
export function createBemClass<T extends BemBlock>(
  block: T,
  element?: BemElement<T>,
  modifier?: BemModifier
): BemClassName<T> {
  if (element && modifier) {
    return `${block}-${element}-${modifier}` as BemClassName<T>;
  }
  if (element) {
    return `${block}-${element}` as BemClassName<T>;
  }
  if (modifier) {
    return `${block}-${modifier}` as BemClassName<T>;
  }
  return block as BemClassName<T>;
}

// Validation helper
export function isValidBemClass(className: string): className is DataClassName {
  // Basic validation logic
  const parts = className.split('-');
  const block = parts[0];
  
  if (!(block in BEM_BLOCKS)) return false;
  
  if (parts.length === 1) return true; // Just block
  if (parts.length === 2) {
    const elementOrModifier = parts[1];
    const elements = BEM_ELEMENTS[block as BemBlock] || [];
    return (elements as readonly string[]).includes(elementOrModifier) || 
           (BEM_MODIFIERS as readonly string[]).includes(elementOrModifier);
  }
  if (parts.length === 3) {
    const element = parts[1];
    const modifier = parts[2];
    const elements = BEM_ELEMENTS[block as BemBlock] || [];
    return (elements as readonly string[]).includes(element) && 
           (BEM_MODIFIERS as readonly string[]).includes(modifier);
  }
  
  return false;
} 