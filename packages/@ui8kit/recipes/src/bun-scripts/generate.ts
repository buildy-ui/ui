import * as fs from 'node:fs';
import * as path from 'node:path';
import { RecipeSchema, type Recipe, type Slot } from '../schema/recipe';

type GenerateConfig = {
  outputTsx: string; // e.g. packages/@ui8kit/recipes/blocks/SplitHero.tsx
  outputCssDir: string; // e.g. packages/@ui8kit/recipes/assets/css/semantic
};

export function generateFromRecipe(recipe: Recipe, config: GenerateConfig) {
  // Validate
  const parsed = RecipeSchema.safeParse(recipe);
  if (!parsed.success) {
    throw new Error('Invalid recipe: ' + parsed.error.message);
  }

  // Prepare CSS map: dataClass -> utility string
  const cssMap: Record<string, string> = {};

  function pushCss(slot: Slot) {
    if (slot.className) {
      cssMap[slot.dataClass] = slot.className;
    }
    slot.children?.forEach(pushCss);
  }
  pushCss(recipe.root);

  // Build TSX via simple template function using slots
  const tsx = renderComponent(recipe);

  // Write TSX
  fs.mkdirSync(path.dirname(config.outputTsx), { recursive: true });
  fs.writeFileSync(config.outputTsx, tsx);

  // Write CSS
  const cssPieces = Object.entries(cssMap).map(([klass, utilities]) => `.${klass} {\n  @apply ${utilities};\n}`);
  fs.mkdirSync(config.outputCssDir, { recursive: true });
  fs.writeFileSync(path.join(config.outputCssDir, `${kebab(recipe.componentName)}.css`), cssPieces.join('\n\n'));
}

function kebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function renderComponent(recipe: Recipe) {
  const imports = [
    `import * as React from "react";`,
    `import { ${recipe.imports.join(', ')} } from "@ui8kit/core";`,
    `import { ${Array.isArray((recipe as any).extraImports) ? (recipe as any).extraImports.join(', ') : ''} } from "lucide-react";`,
    `import { skyOSTheme } from "@ui8kit/theme";`,
    `const currentTheme = skyOSTheme;`,
    `const theme = { theme: currentTheme, themeRounded: currentTheme.rounded, themeButtonSize: currentTheme.buttonSize };`
  ].join('\n');

  const body = renderSlotAsJsxWithData(recipe.root, 6, recipe);

  // Build component props signature based on recipe.props
  const exposedProps = (recipe as any).props as Array<{ name: string; default?: any }> | undefined;
  const propsInterfaceLines: string[] = [];
  if (exposedProps && exposedProps.length) {
    for (const p of exposedProps) {
      propsInterfaceLines.push(`  ${p.name}?: any;`);
    }
  }

  // Build destructuring with defaults
  let destructureExtras = '';
  if (exposedProps && exposedProps.length) {
    const parts = exposedProps.map(p => `${p.name}${p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : ''}`);
    destructureExtras = parts.join(', ');
  }

  return `${imports}

export interface ${recipe.componentName}Data { [key: string]: any }

export interface ${recipe.componentName}Props extends Omit<React.HTMLAttributes<HTMLElement>, 'content'> {
  content?: ${recipe.componentName}Data;
${propsInterfaceLines.join('\n')}
}

export const ${recipe.componentName} = React.forwardRef<HTMLElement, ${recipe.componentName}Props>(({ content${destructureExtras ? ', ' + destructureExtras : ''}, ...props }, ref) => {
  return (
      ${body}
  );
});
${recipe.componentName}.displayName = "${recipe.componentName}";
`;
}

function renderSlotAsJsxWithData(slot: Slot, indent: number, recipe: Recipe): string {
  const i = ' '.repeat(indent);
  const tag = slot.uiComponent || slot.element || inferElement(slot);
  const attrs = buildAttrs(slot, tag, i);
  const open = `<${tag}${attrs}>`;
  const close = `</${tag}>`;
  const children = slot.children?.map((s: Slot) => renderSlotAsJsxWithData(s, indent + 2, recipe)).join('\n') ?? '';
  const contentExpr = slot.content?.prop
    ? slot.uiComponent === 'Button'
      ? `\n${i}  {content?.${slot.content.prop} ? (<>{content?.${slot.content.prop}}</>) : null}`
      : `\n${i}  {content?.${slot.content.prop} ?? null}`
    : (slot.content?.text ? `\n${i}  ${JSON.stringify(slot.content.text)}` : '');
  const element = `${i}${open}${contentExpr}
${children}
${i}${close}`;
  if (slot.ifProp) {
    const expr = slot.ifProp.split('||').map((k: string) => `content?.${k.trim()}`).join(' || ');
    return `${i}{${expr} ? (\n${element}\n${i}) : null}`;
  }
  return element;
}

function inferElement(slot: Slot): string {
  // Minimal heuristic: map common slots to tags; fallback to div
  if (slot.slot.includes('header')) return 'header';
  if (slot.slot.includes('footer')) return 'footer';
  if (slot.slot.includes('title')) return 'h3';
  if (slot.slot.includes('figure')) return 'figure';
  if (slot.slot.includes('image')) return 'img';
  if (slot.slot.includes('content')) return 'div';
  return 'div';
}

function buildAttrs(slot: Slot, tag: string, i: string): string {
  const attrs: string[] = [];
  // semantic hook
  attrs.push(` data-class=\"${slot.dataClass}\"`);
  // map variants to props
  if (slot.variants) {
    for (const [key, val] of Object.entries(slot.variants)) {
      if (typeof val === 'number' || typeof val === 'boolean') {
        attrs.push(` ${key}={${val}}`);
      } else if (val != null) {
        attrs.push(` ${key}=\"${val}\"`);
      }
    }
  }
  // special handling
  if (tag === 'Block' && slot.element) {
    attrs.push(` component=\"${slot.element}\"`);
  }
  if (tag === 'Button') {
    // theme tokens
    attrs.push(` rounded={theme?.themeRounded.default}`);
    attrs.push(` size={theme?.themeButtonSize.default}`);
    // icon as leftSection when content prop is present
    if (slot.content?.prop) {
      if (slot.slot === 'primary') {
        attrs.push(` leftSection={content?.primaryButtonIcon ? (<Icon c=\"primary-foreground\" lucideIcon={content?.primaryButtonIcon || Info} />) : undefined}`);
      } else if (slot.slot === 'secondary') {
        attrs.push(` leftSection={content?.secondaryButtonIcon ? (<Icon lucideIcon={content?.secondaryButtonIcon || Rocket} />) : undefined}`);
      }
    }
  }
  return attrs.join('');
}

// Example CLI runner (optional): read a recipe.json and generate files
if (process.argv[1]?.endsWith('generate.ts')) {
  const recipePath = process.argv[2];
  const outTsx = process.argv[3];
  const outCssDir = process.argv[4];
  if (recipePath && outTsx && outCssDir) {
    const json = JSON.parse(fs.readFileSync(recipePath, 'utf-8')) as Recipe;
    generateFromRecipe(json, { outputTsx: outTsx, outputCssDir: outCssDir });
  }
}


