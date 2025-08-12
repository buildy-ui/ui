import type { Recipe } from '../schema/recipe';

export const centeredHeroRecipe: Recipe = {
  id: 'centered-hero',
  name: 'Centered Hero',
  description: 'Centered hero with title, description and two actions',
  componentName: 'CenteredHero',
  imports: ['Block', 'Stack', 'Group', 'Title', 'Text', 'Button', 'Icon'],
  extraImports: ['Info', 'Rocket'],
  themeImport: '@ui8kit/theme',
  // Expose py prop on component with default "lg"
  props: [
    { name: 'py', default: 'lg' }
  ],
  // Extra content fields for icons
  contentProps: [
    { name: 'primaryButtonIcon', type: 'icon' },
    { name: 'secondaryButtonIcon', type: 'icon' }
  ],
  defaults: {},
  root: {
    slot: 'root',
    element: 'section',
    uiComponent: 'Block',
    dataClass: 'centered-hero',
    className: 'w-full py-lg',
    variants: { w: 'full' },
    children: [
      {
        slot: 'container',
        element: 'div',
        uiComponent: 'Stack',
        dataClass: 'centered-hero-stack',
        className: 'gap-xl items-center text-center max-w-4xl mx-auto',
        variants: { gap: 'xl', align: 'center', ta: 'center' },
        children: [
          { slot: 'title', element: 'h1', uiComponent: 'Title', dataClass: 'centered-hero-title', className: 'tracking-tight leading-tight', variants: { order: 1, size: '5xl', fw: 'bold', ta: 'center' }, content: { prop: 'title' } },
          { slot: 'description', element: 'p', uiComponent: 'Text', dataClass: 'centered-hero-description', className: 'text-secondary-foreground max-w-[42rem]', variants: { c: 'secondary-foreground', ta: 'center' }, content: { prop: 'description' } },
          {
            slot: 'actions',
            element: 'div',
            uiComponent: 'Group',
            dataClass: 'centered-hero-actions',
            className: 'gap-md items-center justify-center',
            variants: { gap: 'md', align: 'center', justify: 'center' },
            ifProp: 'primaryButtonText||secondaryButtonText',
            children: [
              { slot: 'primary', element: 'button', uiComponent: 'Button', dataClass: 'centered-hero-primary', className: '', variants: { variant: 'default' }, content: { prop: 'primaryButtonText' } },
              { slot: 'secondary', element: 'button', uiComponent: 'Button', dataClass: 'centered-hero-secondary', className: '', variants: { variant: 'outline' }, content: { prop: 'secondaryButtonText' } }
            ]
          }
        ]
      }
    ]
  }
};


