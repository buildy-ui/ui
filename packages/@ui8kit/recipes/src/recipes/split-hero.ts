import type { Recipe } from '../schema/recipe';

// Minimal SplitHero recipe describing semantic structure
export const splitHeroRecipe: Recipe = {
  id: 'split-hero',
  name: 'Split Hero',
  description: 'Hero with media and content split',
  componentName: 'SplitHero',
  imports: ['Block', 'Stack', 'Grid', 'Group', 'Title', 'Text', 'Badge', 'Button', 'Image', 'Icon', 'Box'],
  themeImport: '@ui8kit/theme',
  defaults: {},
  root: {
    slot: 'root',
    element: 'section',
    dataClass: 'split-hero',
    className: 'w-full py-lg',
    children: [
      {
        slot: 'grid',
        element: 'div',
        dataClass: 'split-grid',
        className: 'grid grid-cols-1 md:grid-cols-2 gap-xl items-center',
        children: [
          { slot: 'media', element: 'div', dataClass: 'split-hero-media', className: '' },
          {
            slot: 'content',
            element: 'div',
            dataClass: 'split-hero-content',
            className: '',
            children: [
              { slot: 'badge', element: 'div', dataClass: 'split-hero-badge', className: '' },
              { slot: 'title', element: 'h1', dataClass: 'split-hero-title', className: 'text-4xl font-bold tracking-tight' },
              { slot: 'description', element: 'p', dataClass: 'split-hero-description', className: 'text-secondary-foreground max-w-[42rem]' },
              {
                slot: 'actions',
                element: 'div',
                dataClass: 'split-hero-actions',
                className: 'flex items-center gap-md'
              }
            ]
          }
        ]
      }
    ]
  }
};


