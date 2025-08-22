### Что входит в документ для QDrant
- **id**: стабильный ключ (`<type>#<variant>#<index>`).
- **type**: из пресета, напр. `business.grid`.
- **variant**: напр. `pricing`, `solutionsGrid`.
- **category**: папка (`business`, `hero`).
- **path**: относительный путь к пресету.
- **payload.qdrant**
  - **description**: краткое EN-описание 140–220 симв. (мягкие структурные подсказки).
  - **tags**: нормализованные `key:value` (из пресета/AST).
  - **category**: дублирование для фильтров.
- **payload.metadata**: структурные поля для фильтров (удобнее, чем парсить теги):
  - layout, columns, media, media_position, leftMedia, cta_count, has_yearly_toggle, has_testimonial, has_features, has_solutions, has_pricing, has_career, stats_fields, is_popular, use_container, bg_hint.
- **embedding**:
  - **model**: `text-embedding-3-small`
  - **text**: компактная строка (EN) = 1) краткое назначение + 2) мягкие структурные маркеры. Не дублировать жёсткие признаки из `metadata`.

Пример одного элемента (для `business.grid/pricing`):
```json
{
  "id": "business.grid#pricing#0",
  "type": "business.grid",
  "variant": "pricing",
  "category": "business",
  "path": "packages/@ui8kit/blocks/src/business/GridBusiness.preset.ts",
  "payload": {
    "qdrant": {
      "description": "Three‑tier pricing grid for quick plan comparison with feature lists and a clear CTA per card. Responsive layout adapts from one to three columns.",
      "tags": [
        "category:business",
        "type:grid",
        "variant:pricing",
        "layout:grid",
        "columns:1-2-3",
        "has_pricing:true",
        "cta_count:1",
        "content_density:medium"
      ],
      "category": "business"
    },
    "metadata": {
      "layout": "grid",
      "columns": "1-2-3",
      "media": "none",
      "leftMedia": null,
      "cta_count": 1,
      "has_yearly_toggle": false,
      "has_pricing": true,
      "use_container": true,
      "bg_hint": null
    }
  },
  "embedding": {
    "model": "text-embedding-3-small",
    "text": "Three‑tier pricing section for business landing pages. Grid layout, clear comparison and 1 CTA on each card. Responsive from one to three columns."
  }
}
```

### Что отправляем в эмбеддинг
- Только `embedding.text` (EN, 140–220 симв.), собранный из:
  - цели блока + мягкие структурные подсказки (grid/split, media side, columns),
  - без “жёстких” токенов (точные значения остаются в `tags`/`metadata`).
- Такой гибрид уменьшает объём текста и повышает точность за счёт фильтров по `metadata`.

### Куда сохраняем
- Для каждой категории: в папке блока файл `qdrant-<category>.json`
  - hero → `qdrant-hero.json`
  - business → `qdrant-business.json`

### Скрипт парсинга (Babel AST, без eval)
```ts
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

type JsonSchema = Record<string, any>;

type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };
type ConstTable = Map<string, JSONValue>;

const SRC_DIR = resolve("packages/@ui8kit/blocks/src");

const BABEL_OPTS = {
  sourceType: "module" as const,
  plugins: ["typescript", "jsx", "importAssertions"]
};

const toKey = (key: t.Expression | t.Identifier | t.PrivateName): string => {
  if (t.isIdentifier(key)) return key.name;
  if (t.isStringLiteral(key)) return key.value;
  return "";
};

const evalLiteral = (node: t.Node, consts: ConstTable): JSONValue => {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node)) return null;
  if (t.isTemplateLiteral(node)) {
    return node.quasis.map((q, i) => q.value.cooked + (node.expressions[i] ? "${expr}" : "")).join("");
  }
  if (t.isTSAsExpression(node) || t.isTSTypeAssertion(node)) {
    return evalLiteral(node.expression, consts);
  }
  if (t.isArrayExpression(node)) {
    return node.elements.map((el) => (el && t.isExpression(el) ? evalLiteral(el, consts) : null));
  }
  if (t.isObjectExpression(node)) {
    const out: Record<string, JSONValue> = {};
    for (const p of node.properties) {
      if (t.isObjectProperty(p)) {
        const k = toKey(p.key);
        const vNode = p.value as t.Node;
        out[k] = evalLiteral(vNode, consts);
      } else if (t.isSpreadElement(p) && t.isIdentifier(p.argument)) {
        const spreadVal = consts.get(p.argument.name);
        if (spreadVal && typeof spreadVal === "object" && !Array.isArray(spreadVal)) {
          Object.assign(out, spreadVal as object);
        }
      }
    }
    return out;
  }
  if (t.isIdentifier(node)) {
    if (consts.has(node.name)) return consts.get(node.name) as JSONValue;
    // Unknown identifier (e.g., lucide icon): return the identifier name
    return node.name;
  }
  return null;
};

const collectTopLevelConsts = (ast: t.File): ConstTable => {
  const table: ConstTable = new Map();
  traverse(ast, {
    VariableDeclarator(path) {
      if (!path.parentPath.parentPath) return;
      const parent = path.parentPath.parentPath.node;
      const isTopLevel = t.isProgram(path.findParent((p) => p.isProgram())?.node as t.Node);
      if (!isTopLevel) return;
      if (!path.node.init) return;
      if (t.isIdentifier(path.node.id)) {
        const name = path.node.id.name;
        const value = evalLiteral(path.node.init, table);
        table.set(name, value);
      }
    }
  });
  return table;
};

const findExportedPresetArrays = (ast: t.File): Array<{ name: string; value: JSONValue }> => {
  const results: Array<{ name: string; value: JSONValue }> = [];
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (t.isVariableDeclaration(decl)) {
        for (const d of decl.declarations) {
          if (t.isIdentifier(d.id) && d.init) {
            const varName = d.id.name;
            if (varName.endsWith("Preset") && t.isArrayExpression(d.init)) {
              results.push({ name: varName, value: null });
            }
          }
        }
      }
    }
  });
  // second pass to evaluate with full consts (after we build them)
  const consts = collectTopLevelConsts(ast);
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (t.isVariableDeclaration(decl)) {
        for (const d of decl.declarations) {
          if (t.isIdentifier(d.id) && d.init) {
            const varName = d.id.name;
            if (varName.endsWith("Preset") && t.isArrayExpression(d.init)) {
              const value = evalLiteral(d.init, consts);
              const idx = results.findIndex((r) => r.name === varName);
              if (idx >= 0) results[idx].value = value;
            }
          }
        }
      }
    }
  });
  return results;
};

const pick = <T extends object>(obj: any, keys: Array<keyof any>): Partial<T> => {
  const out: any = {};
  for (const k of keys) if (k in (obj || {})) out[k as string] = obj[k as string];
  return out;
};

const bool = (v: any): boolean | null => (typeof v === "boolean" ? v : null);

const deriveMetadataAndTags = (category: string, entry: any) => {
  const type: string = entry?.type || "";
  const variant: string = entry?.variant || "";
  const props: any = entry?.props || {};
  const content: any = props?.content || {};
  const cols = props?.cols || null;
  const leftMedia = props?.leftMedia ?? null;
  const className = props?.className || null;

  const layout = type.includes(".grid") ? "grid" : type.includes(".split") ? "split" : "stack";
  const media =
    content?.image?.src ? "image" :
    content?.testimonials ? "image" :
    content?.stats || content?.metrics ? "stats" : "none";

  const media_position = layout === "split"
    ? (leftMedia === true ? "left" : leftMedia === false ? "right" : null)
    : null;

  const has_yearly_toggle = props?._showYearlyToggle === true;
  const has_pricing = !!content?.plans;
  const has_solutions = !!content?.solutions;
  const has_features = !!content?.features;
  const has_testimonial = !!content?.testimonials;
  const has_career = !!content?.openings;

  const cta_count = Number(Boolean(content?.buttonText)) + Number(Boolean(content?.secondaryButtonText));
  const is_popular = Array.isArray(content?.plans) && content.plans.some((p: any) => p?.isPopular);

  const stats_fields = content?.stats
    ? Object.keys(content.stats)
    : Array.isArray(content?.metrics) ? ["value", "label", "change"] : null;

  const use_container = props?.useContainer ?? null;
  const bg_hint = typeof className === "string" && className.includes("bg-gradient") ? "gradient" : null;

  const metadata = {
    layout,
    columns: cols,
    media,
    media_position,
    leftMedia,
    cta_count,
    has_yearly_toggle,
    has_pricing,
    has_solutions,
    has_features,
    has_testimonial,
    has_career,
    stats_fields,
    is_popular,
    use_container,
    bg_hint
  };

  const tags = [
    `category:${category}`,
    `type:${layout}`,
    `variant:${variant}`,
    cols ? `columns:${cols}` : null,
    media ? `media:${media}` : null,
    media_position ? `media_position:${media_position}` : null,
    leftMedia !== null ? `left_media:${leftMedia}` : null,
    `cta_count:${cta_count}`,
    has_yearly_toggle ? "has_yearly_toggle:true" : null,
    has_pricing ? "has_pricing:true" : null,
    has_solutions ? "has_solutions:true" : null,
    has_features ? "has_features:true" : null,
    has_testimonial ? "has_testimonial:true" : null,
    has_career ? "has_career:true" : null,
    is_popular ? "is_popular:true" : null,
    use_container !== null ? `use_container:${use_container}` : null,
    bg_hint ? `bg:${bg_hint}` : null
  ].filter(Boolean) as string[];

  return { metadata, tags };
};

const buildEmbedText = (category: string, type: string, variant: string, meta: any, content: any): string => {
  const title = content?.title || "";
  const base = title ? `${title}. ` : "";
  const layoutPart =
    meta.layout === "split"
      ? `Split layout${meta.media_position ? ` with ${meta.media_position}-side media` : ""}`
      : meta.layout === "grid"
      ? `Grid layout${meta.columns ? ` ${meta.columns}` : ""}`
      : "Centered section";
  const mediaPart =
    meta.media === "image" ? " with supporting imagery"
    : meta.media === "stats" ? " with KPI highlights"
    : "";
  const useCase =
    variant.includes("pricing") ? "Pricing comparison made scannable."
    : variant.includes("career") ? "Job openings presented clearly."
    : variant.includes("solutions") ? "Solutions overview with quick value cues."
    : variant.includes("features") ? "Feature list for fast scanning."
    : variant.includes("testimonial") ? "Trust-building testimonial."
    : "Business section for landing pages.";

  const ctaPart = meta.cta_count > 0 ? ` Includes ${meta.cta_count} CTA${meta.cta_count > 1 ? "s" : ""}.` : "";
  return `${base}${layoutPart}${mediaPart}. ${useCase}${ctaPart}`.trim();
};

const buildQdrantDescription = (variant: string, meta: any): string => {
  const base =
    variant.includes("pricing")
      ? "Three‑tier pricing grid for quick plan comparison with feature lists"
      : variant.includes("career")
      ? "Job cards listing role, location, department and type in a responsive layout"
      : variant.includes("solutions")
      ? "Solutions grid combining icon cards with optional imagery and KPI highlights"
      : variant.includes("features")
      ? "Split layout pairing media with a focused features list for scannable value"
      : variant.includes("testimonial")
      ? "Split layout featuring a client testimonial and supportive imagery to build trust"
      : meta.layout === "grid"
      ? "Responsive grid section optimized for quick scanning"
      : "Centered section for primary messaging";
  const col = meta.columns ? `, adapting from ${meta.columns} columns` : "";
  return `${base}${col}.`;
};

const makeId = (type: string, variant: string, index: number) => `${type}#${variant || "default"}#${index}`;

const processPresetFile = (absPath: string) => {
  const code = readFileSync(absPath, "utf8");
  const ast = parse(code, BABEL_OPTS);
  const exported = findExportedPresetArrays(ast);
  const outDocs: any[] = [];
  const category = basename(dirname(absPath)); // e.g., 'business' from /business/GridBusiness.preset.ts

  for (const exp of exported) {
    const arr = Array.isArray(exp.value) ? (exp.value as any[]) : [];
    arr.forEach((entry, i) => {
      const type = entry?.type || "";
      const variant = entry?.variant || "";
      const props = entry?.props || {};
      const content = props?.content || {};
      const { metadata, tags } = deriveMetadataAndTags(category, entry);

      const description = buildQdrantDescription(variant || type, metadata);
      const embedText = buildEmbedText(category, type, variant || "", metadata, content);

      const doc = {
        id: makeId(type, variant, i),
        type,
        variant,
        category,
        path: absPath.replace(resolve(".") + "/", ""),
        payload: {
          qdrant: {
            description,
            tags,
            category
          },
          metadata
        },
        embedding: {
          model: "text-embedding-3-small",
          text: embedText
        }
      };
      outDocs.push(doc);
    });
  }
  return outDocs;
};

const walk = (dir: string, fileFilter: (f: string) => boolean, files: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, fileFilter, files);
    else if (fileFilter(name)) files.push(full);
  }
  return files;
};

const main = () => {
  const presetFiles = walk(SRC_DIR, (f) => f.endsWith(".preset.ts"));
  const byCategory: Record<string, any[]> = {};
  for (const file of presetFiles) {
    const docs = processPresetFile(file);
    for (const d of docs) {
      byCategory[d.category] = byCategory[d.category] || [];
      byCategory[d.category].push(d);
    }
  }
  for (const [category, docs] of Object.entries(byCategory)) {
    const outFile = join(SRC_DIR, category, `qdrant-${category}.json`);
    writeFileSync(outFile, JSON.stringify(docs, null, 2), "utf8");
  }
  // Optional aggregate
  const all = Object.values(byCategory).flat();
  writeFileSync(join(SRC_DIR, "qdrant-all.json"), JSON.stringify(all, null, 2), "utf8");
};

main();
```

### Коротко почему так
- Описание в эмбеддинге — краткое и “человечное”; структурные детали идут в `metadata/tags` (точные фильтры).
- AST-скрипт без eval устойчиво разворачивает константы из пресетов (включая `as const`) и формирует теги/метаданные из полей (`cols`, `leftMedia`, `plans`, `solutions`, `features`, `testimonials`, `openings`, `className`, `useContainer`).
- Файлы коллекций кладём рядом с блоками: `qdrant-<category>.json` (и общий `qdrant-all.json` для удобства загрузки).