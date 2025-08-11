import type { Recipe } from '../schema/recipe';

export const centeredHeroRecipe: Recipe = {
  id: 'centered-hero',
  name: 'Centered Hero',
  description: 'Centered hero with title, description and two actions',
  componentName: 'CenteredHero',
  imports: ['Block', 'Stack', 'Group', 'Title', 'Text', 'Button', 'Icon'],
  extraImports: ['Info', 'Rocket'],
  themeImport: '@ui8kit/theme',
  defaults: {},
  root: {
    slot: 'root',
    element: 'section',
    uiComponent: 'Block',
    dataClass: 'centered-hero',
    className: 'w-full py-lg',
    children: [
      {
        slot: 'container',
        element: 'div',
        uiComponent: 'Stack',
        dataClass: 'centered-hero-stack',
        className: 'gap-xl items-center text-center max-w-4xl mx-auto',
        children: [
          { slot: 'title', element: 'h1', uiComponent: 'Title', dataClass: 'centered-hero-title', className: 'tracking-tight leading-tight', variants: {}, content: { prop: 'title' } },
          { slot: 'description', element: 'p', uiComponent: 'Text', dataClass: 'centered-hero-description', className: 'text-secondary-foreground max-w-[42rem]', variants: {}, content: { prop: 'description' } },
          {
            slot: 'actions',
            element: 'div',
            uiComponent: 'Group',
            dataClass: 'centered-hero-actions',
            className: 'gap-md items-center justify-center',
            children: [
              { slot: 'primary', element: 'button', uiComponent: 'Button', dataClass: 'centered-hero-primary', className: '', content: { prop: 'primaryButtonText' } },
              { slot: 'secondary', element: 'button', uiComponent: 'Button', dataClass: 'centered-hero-secondary', className: '', content: { prop: 'secondaryButtonText' } }
            ]
          }
        ]
      }
    ]
  }
};


