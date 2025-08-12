// bun run packages/@ui8kit/recipes/src/bun-scripts/extract-schema.ts
import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

type Slot = {
  slot: string;
  element?: string;
  uiComponent?: string;
  dataClass: string;
  className?: string;
  variants?: Record<string, any>;
  content?: { text?: string; prop?: string };
  ifProp?: string;
  children?: Slot[];
};

type Recipe = {
  id: string;
  name: string;
  description?: string;
  componentName: string;
  imports: string[];
  extraImports?: string[];
  themeImport?: string;
  defaults?: Record<string, any>;
  props?: Array<{ name: string; default?: any }>;
  contentProps?: Array<{ name: string; type: 'string' | 'icon' }>;
  root: Slot;
};

const ARTIFACTS_DIR = path.resolve('packages/@ui8kit/recipes/src/artifacts');
const OUT_DIR = path.resolve('packages/@ui8kit/recipes/src/schema');

const VARIANT_KEYS = new Set([
  'w','h','minW','maxW','minH','maxH','py','px','p','m','mx','my',
  'gap','gapX','gapY','align','justify','ta','order','size','fw','variant','rounded','c',
  'display','position','z','overflow','overflowX','overflowY'
]);

const CORE_COMPONENTS = new Set([
  'Block','Container','Grid','Flex','Box','Stack','Group','Card','Badge','Button','Title','Text','Icon','Image','Sheet','Accordion','AccordionItem','AccordionTrigger','AccordionContent','Input','Label','Link','Table','Textarea','Skeleton'
]);

function isDomTag(name: string) {
  return /^[a-z]/.test(name);
}

function kebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function attrStringValue(attr: t.JSXAttribute | t.JSXSpreadAttribute | null | undefined): string | undefined {
  if (!attr || !t.isJSXAttribute(attr)) return undefined;
  const val = attr.value;
  if (!val) return '';
  if (t.isStringLiteral(val)) return val.value;
  if (t.isJSXExpressionContainer(val)) {
    if (t.isStringLiteral(val.expression)) return val.expression.value;
  }
  return undefined;
}

function attrAnyValue(attr: t.JSXAttribute | t.JSXSpreadAttribute | null | undefined): any {
  if (!attr || !t.isJSXAttribute(attr)) return undefined;
  const val = attr.value;
  if (!val) return true;
  if (t.isStringLiteral(val)) return val.value;
  if (t.isJSXExpressionContainer(val)) {
    const expr = val.expression;
    if (t.isStringLiteral(expr)) return expr.value;
    if (t.isNumericLiteral(expr)) return expr.value;
    if (t.isBooleanLiteral(expr)) return expr.value;
    // theme tokens / identifiers -> skip or stringify
    return generate(expr).code;
  }
  return undefined;
}

function collectContentExpr(children: (t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment)[]): { text?: string; prop?: string } | undefined {
  for (const ch of children) {
    if (t.isJSXExpressionContainer(ch)) {
      const expr = ch.expression;
      // content?.prop or content.prop
      if (t.isOptionalMemberExpression(expr)) {
        const obj = expr.object as any;
        const prop = expr.property as any;
        if (t.isIdentifier(obj) && obj.name === 'content' && t.isIdentifier(prop)) {
          return { prop: prop.name };
        }
      }
      if (t.isMemberExpression(expr)) {
        const obj = expr.object as any;
        const prop = expr.property as any;
        if (t.isIdentifier(obj) && obj.name === 'content' && t.isIdentifier(prop)) {
          return { prop: prop.name };
        }
      }
    } else if (t.isJSXText(ch)) {
      const txt = ch.value.trim();
      if (txt) return { text: txt };
    }
  }
  return undefined;
}

function findIfProp(path: NodePath<t.JSXElement>): string | undefined {
  const parentExpr = path.findParent(p => p.isJSXExpressionContainer()) as NodePath<t.JSXExpressionContainer> | null;
  if (parentExpr) {
    const e = parentExpr.node.expression;
    const props: string[] = [];
    const collect = (node: t.Node) => {
      if (t.isMemberExpression(node)) {
        if (t.isIdentifier(node.object) && node.object.name === 'content' && t.isIdentifier(node.property)) {
          props.push(node.property.name);
        }
      } else if (t.isOptionalMemberExpression(node)) {
        if (t.isIdentifier(node.object as any) && (node.object as any).name === 'content' && t.isIdentifier(node.property)) {
          props.push((node.property as t.Identifier).name);
        }
      } else {
        for (const key of Object.keys(node)) {
          const val: any = (node as any)[key];
          if (val && typeof val === 'object' && 'type' in val) collect(val);
          else if (Array.isArray(val)) val.forEach(v => v && typeof v === 'object' && 'type' in v && collect(v));
        }
      }
    };
    collect(e);
    if (props.length) return props.join('||');
  }
  return undefined;
}

function extractSlot(path: NodePath<t.JSXElement>): Slot {
  const node = path.node;
  const opening = node.openingElement;
  const name = t.isJSXIdentifier(opening.name) ? opening.name.name : generate(opening.name).code;
  const uiComponent = CORE_COMPONENTS.has(name) ? name : undefined;
  const element = !uiComponent && isDomTag(name) ? name : undefined;

  // data-class or default
  let dataClass = attrStringValue(opening.attributes.find(a => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === 'data-class') as any);
  if (!dataClass) dataClass = kebab(name);

  // className
  const className = attrStringValue(opening.attributes.find(a => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === 'className') as any);

  // variants
  const variants: Record<string, any> = {};
  for (const attr of opening.attributes) {
    if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name)) continue;
    const key = attr.name.name;
    if (VARIANT_KEYS.has(key)) {
      variants[key] = attrAnyValue(attr);
    }
    if (key === 'component' && uiComponent === 'Block') {
      // map to element
      const el = attrStringValue(attr);
      if (el) {
        variants[key] = undefined; // not a variant
      }
    }
  }
  if (Object.keys(variants).length === 0) delete (variants as any).component;

  const content = extractSlotContent(node.children);

  const ifProp = findIfProp(path);

  // children
  const children: Slot[] = [];
  path.get('children').forEach((c) => {
    if (c.isJSXElement()) children.push(extractSlot(c));
  });

  const slot: Slot = { slot: kebab(name), element, uiComponent, dataClass: dataClass!, className, variants, content, ifProp, children: children.length ? children : undefined };
  return slot;
}

function extractSlotContent(children: t.JSXElement['children']): { text?: string; prop?: string } | undefined {
  return collectContentExpr(children as any);
}

function extractImports(ast: t.File) {
  const core: string[] = [];
  const icons: string[] = [];
  traverse(ast, {
    ImportDeclaration(p) {
      const src = (p.node.source.value || '') as string;
      if (src === '@ui8kit/core') {
        p.node.specifiers.forEach(s => {
          if (t.isImportSpecifier(s) && t.isIdentifier(s.imported)) core.push(s.imported.name);
        });
      }
      if (src === 'lucide-react') {
        p.node.specifiers.forEach(s => {
          if (t.isImportSpecifier(s) && t.isIdentifier(s.imported)) icons.push(s.imported.name);
        });
      }
    }
  });
  return { core: Array.from(new Set(core)), icons: Array.from(new Set(icons)) };
}

function extractComponentName(ast: t.File, fallback: string): string {
  let name: string | undefined;
  traverse(ast, {
    ExportNamedDeclaration(p) {
      const d = p.node.declaration;
      if (t.isVariableDeclaration(d)) {
        d.declarations.forEach(dec => {
          if (t.isIdentifier(dec.id)) name = dec.id.name;
        });
      }
    }
  });
  return name || fallback;
}

function extractRootReturn(ast: t.File): NodePath<t.JSXElement> | null {
  let found: NodePath<t.JSXElement> | null = null;
  traverse(ast, {
    ReturnStatement(p) {
      if (found) return;
      const arg = p.node.argument;
      if (t.isJSXElement(arg)) {
        found = p.get('argument') as NodePath<t.JSXElement>;
      }
    }
  });
  return found;
}

function buildRecipeFromFile(filePath: string): Recipe {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  const fileName = path.basename(filePath, path.extname(filePath));
  const componentName = extractComponentName(ast as any, fileName);
  const { core, icons } = extractImports(ast as any);
  const ret = extractRootReturn(ast as any);
  if (!ret) throw new Error(`No JSX return found in ${filePath}`);
  const rootSlot = extractSlot(ret);
  const recipe: Recipe = {
    id: kebab(componentName),
    name: componentName,
    description: `${componentName} extracted from artifact`,
    componentName,
    imports: core.length ? core : ['Block','Stack','Group','Title','Text','Button','Icon'],
    extraImports: icons.length ? icons : undefined,
    themeImport: '@ui8kit/theme',
    defaults: {},
    root: rootSlot
  };
  return recipe;
}

function writeSchemaFile(recipe: Recipe, outFile: string) {
  const varName = kebab(recipe.componentName).replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Recipe';
  const content = `import type { Recipe } from '../schema/recipe';

export const ${varName}: Recipe = ${JSON.stringify(recipe, null, 2)};
`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content);
}

function run() {
  const files = fs.readdirSync(ARTIFACTS_DIR).filter(f => f.endsWith('.tsx'));
  for (const f of files) {
    const filePath = path.join(ARTIFACTS_DIR, f);
    const recipe = buildRecipeFromFile(filePath);
    const outFile = path.join(OUT_DIR, `${kebab(recipe.componentName)}-schema.ts`);
    writeSchemaFile(recipe, outFile);
    // eslint-disable-next-line no-console
    console.log(`Schema generated: ${outFile}`);
  }
}

run();


