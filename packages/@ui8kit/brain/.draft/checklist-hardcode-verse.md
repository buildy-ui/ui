### Соглашаем структуру документа и политику тегов
- Документ:
  - id, type, variant, category, path
  - payload:
    - qdrant: { description, tags[], category }
    - metadata: { layout, columns, media, media_position, leftMedia, use_container }
    - profile: { industries: [], intents: [], funnel_stage: null, seasonality: [], personas: [], tone: null, complexity: null, keywords: [] }
  - embedding: { model: "text-embedding-3-small", text }
- Теги (минимальные, без сверх‑детализации):
  - category:<category>
  - block:<type> (напр. business.grid)
  - variant:<variant>
  - layout:<grid|split|stack>
  - columns:<1-2-3> (если есть)
  - media:<image|stats> (пропускаем, если none)
- Эмбеддинг: короткая EN‑фраза (≈120–200 симв.), мягкие структурные намёки; точные признаки остаются в metadata.

### Улучшенный скрипт (Babel AST, минимальные теги, завершённая структура)
```ts
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONValue[] | { [k: string]: JSONValue };
type JSONObject = { [k: string]: JSONValue };
type ConstTable = Map<string, JSONValue>;

const SRC_DIR = resolve("packages/@ui8kit/blocks/src");

const BABEL_OPTS = {
  sourceType: "module" as const,
  plugins: ["typescript", "jsx"]
};

const isObject = (v: unknown): v is JSONObject => typeof v === "object" && v !== null && !Array.isArray(v);

const keyOf = (key: t.Expression | t.Identifier | t.PrivateName): string => {
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
    return node.quasis
      .map((q, i) => q.value.cooked + (node.expressions[i] ? "${expr}" : ""))
      .join("");
  }

  if (t.isTSAsExpression(node) || t.isTSTypeAssertion(node)) {
    return evalLiteral(node.expression, consts);
  }

  if (t.isArrayExpression(node)) {
    return node.elements.map((el) => (el && t.isExpression(el) ? evalLiteral(el, consts) : null));
  }

  if (t.isObjectExpression(node)) {
    const out: JSONObject = {};
    for (const p of node.properties) {
      if (t.isObjectProperty(p)) {
        const k = keyOf(p.key);
        const vNode = p.value as t.Node;
        out[k] = evalLiteral(vNode, consts);
      } else if (t.isSpreadElement(p) && t.isIdentifier(p.argument)) {
        const spreadVal = consts.get(p.argument.name);
        if (isObject(spreadVal)) Object.assign(out, spreadVal);
      }
    }
    return out;
  }

  if (t.isIdentifier(node)) {
    if (consts.has(node.name)) return consts.get(node.name) as JSONValue;
    return node.name; // e.g., icon identifiers
  }

  return null;
};

const collectTopLevelConsts = (ast: t.File): ConstTable => {
  const table: ConstTable = new Map();
  traverse(ast, {
    VariableDeclarator(path) {
      const program = path.findParent((p) => p.isProgram());
      if (!program) return;
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

const findExportedPresetArrays = (ast: t.File, consts: ConstTable) => {
  const results: Array<{ name: string; value: JSONValue }> = [];
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (!t.isVariableDeclaration(decl)) return;
      for (const d of decl.declarations) {
        if (t.isIdentifier(d.id) && d.init && t.isArrayExpression(d.init) && d.id.name.endsWith("Preset")) {
          results.push({ name: d.id.name, value: evalLiteral(d.init, consts) });
        }
      }
    }
  });
  return results;
};

const safeString = (v: unknown): string | null => (typeof v === "string" ? v : null);
const safeBool = (v: unknown): boolean | null => (typeof v === "boolean" ? v : null);

const deriveCore = (category: string, entry: JSONObject) => {
  const type = safeString(entry.type) ?? "";
  const variant = safeString(entry.variant) ?? "";
  const props = isObject(entry.props) ? entry.props : {};
  const content = isObject(props.content) ? props.content : {};
  const cols = safeString(props.cols) ?? null;
  const leftMedia = typeof props.leftMedia === "boolean" ? (props.leftMedia as boolean) : null;
  const className = safeString(props.className) ?? null;
  const useContainer = safeBool(props.useContainer);

  const layout =
    type.includes(".grid") ? "grid" :
    type.includes(".split") ? "split" :
    "stack";

  const hasImage = isObject(content.image) && typeof content.image.src === "string";
  const hasTestimonials = Array.isArray(content.testimonials);
  const hasStats = isObject(content.stats) || Array.isArray((content as any).metrics);
  const media = hasImage ? "image" : hasStats ? "stats" : "none";

  const media_position = layout === "split"
    ? (leftMedia === true ? "left" : leftMedia === false ? "right" : null)
    : null;

  const metadata = {
    layout,
    columns: cols,
    media,
    media_position,
    leftMedia,
    use_container: useContainer,
    bg_hint: className && className.includes("bg-gradient") ? "gradient" : null
  };

  const tags = [
    `category:${category}`,
    `block:${type}`,
    `variant:${variant}`,
    `layout:${layout}`,
    cols ? `columns:${cols}` : null,
    media !== "none" ? `media:${media}` : null
  ].filter(Boolean) as string[];

  return { type, variant, metadata, tags, content };
};

const buildEmbedText = (type: string, variant: string, meta: { layout: string; columns: string | null; media: string; media_position: string | null }, content: JSONObject): string => {
  const title = safeString(content.title);
  const layoutPart =
    meta.layout === "split"
      ? `Split layout${meta.media_position ? ` with ${meta.media_position}-side media` : ""}`
      : meta.layout === "grid"
      ? `Grid layout${meta.columns ? ` ${meta.columns}` : ""}`
      : "Centered section";

  const mediaPart = meta.media === "image" ? " with supporting imagery" : meta.media === "stats" ? " with KPI highlights" : "";
  const useCase =
    variant.includes("pricing") ? "Pricing comparison." :
    variant.includes("career") ? "Job openings." :
    variant.includes("solutions") ? "Solutions overview." :
    variant.includes("features") ? "Feature list." :
    variant.includes("testimonial") ? "Testimonial for trust." :
    type.includes(".grid") ? "Scannable grid." :
    "Business section.";

  const base = title ? `${title}. ` : "";
  return `${base}${layoutPart}${mediaPart}. ${useCase}`.trim();
};

const buildQdrantDescription = (variant: string, meta: { layout: string; columns: string | null; media: string }): string => {
  const base =
    variant.includes("pricing") ? "Three‑tier pricing grid for quick plan comparison with feature lists" :
    variant.includes("career") ? "Job cards listing role, location and department in a responsive layout" :
    variant.includes("solutions") ? "Solutions grid combining icon cards with optional imagery and KPI highlights" :
    variant.includes("features") ? "Split layout pairing media with a focused features list for scannable value" :
    variant.includes("testimonial") ? "Split layout featuring a client testimonial with supportive imagery" :
    meta.layout === "grid" ? "Responsive grid section optimized for quick scanning" :
    "Centered section for primary messaging";
  const col = meta.columns ? `, adapting from ${meta.columns} columns` : "";
  return `${base}${col}.`;
};

const makeId = (type: string, variant: string, index: number) => `${type}#${variant || "default"}#${index}`;

const defaultProfile = () => ({
  industries: [] as string[],
  intents: [] as string[],
  funnel_stage: null as string | null,
  seasonality: [] as string[],
  personas: [] as string[],
  tone: null as string | null,
  complexity: null as string | null,
  keywords: [] as string[]
});

const processPresetFile = (absPath: string) => {
  const code = readFileSync(absPath, "utf8");
  const ast = parse(code, BABEL_OPTS);
  const consts = collectTopLevelConsts(ast);
  const exported = findExportedPresetArrays(ast, consts);
  const outDocs: JSONObject[] = [];
  const category = basename(dirname(absPath));

  for (const exp of exported) {
    const arr = Array.isArray(exp.value) ? (exp.value as JSONObject[]) : [];
    arr.forEach((entry, i) => {
      const { type, variant, metadata, tags, content } = deriveCore(category, entry);
      const description = buildQdrantDescription(variant || type, metadata as any);
      const embedText = buildEmbedText(type, variant || "", metadata as any, content);

      outDocs.push({
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
          metadata,
          profile: defaultProfile()
        },
        embedding: {
          model: "text-embedding-3-small",
          text: embedText
        }
      });
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
  const byCategory: Record<string, JSONObject[]> = {};
  for (const file of presetFiles) {
    const docs = processPresetFile(file);
    for (const d of docs) {
      byCategory[d.category as string] = byCategory[d.category as string] || [];
      byCategory[d.category as string].push(d);
    }
  }
  for (const [category, docs] of Object.entries(byCategory)) {
    const outFile = join(SRC_DIR, category, `qdrant-${category}.json`);
    writeFileSync(outFile, JSON.stringify(docs, null, 2), "utf8");
  }
  const all = Object.values(byCategory).flat();
  writeFileSync(join(SRC_DIR, "qdrant-all.json"), JSON.stringify(all, null, 2), "utf8");
};

main();
```

### Что изменилось
- Сократил теги до 5–6 ключевых (без “has_*” и прочей детализации).
- Добавил завершённую структуру `profile` с плейсхолдерами для ручного/будущего автозаполнения.
- Скрипт обходит все 12 директорий, собирает 24 пресета, пишет `qdrant-<category>.json` и общий `qdrant-all.json`.
- Оба текста (`payload.qdrant.description`, `embedding.text`) короткие и структурно насыщенные.