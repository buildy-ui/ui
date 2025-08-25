// bun run packages/@ui8kit/blocks/scripts/wet-ast-blocks-parser.ts
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
// ESM default export compatibility
// @ts-ignore
const traverse: any = (traverseModule as any).default || (traverseModule as any);
import * as t from "@babel/types";

type JsonSchema = Record<string, any>;

type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };
type ConstTable = Map<string, JSONValue>;

const SRC_DIR = resolve("packages/@ui8kit/blocks/src");

const BABEL_OPTS = {
  sourceType: "module" as const,
  plugins: ["typescript", "jsx", "importAssertions"] as any
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
    VariableDeclarator(path: any) {
      if (!path.parentPath.parentPath) return;
      const parent = path.parentPath.parentPath.node;
      const isTopLevel = t.isProgram(path.findParent((p: any) => p.isProgram())?.node as t.Node);
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
    ExportNamedDeclaration(path: any) {
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
    ExportNamedDeclaration(path: any) {
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

// Extract a generic content signature from the provided content object.
// No domain-specific keys, only structural signals.
const extractContentSignature = (content: any) => {
  const keys = Object.keys(content || {});
  const collections: string[] = [];
  const mediaKeys: string[] = [];
  const actionKeys: string[] = [];
  const headerKeys: string[] = [];

  for (const k of keys) {
    const v = (content as any)[k];
    if (Array.isArray(v)) collections.push(k);
    else if (v && typeof v === "object") {
      // Heuristic media object: contains src or alt or key name hints
      const vk = Object.keys(v);
      if (vk.includes("src") || vk.includes("alt") || /image|media/i.test(k)) mediaKeys.push(k);
    } else if (typeof v === "string") {
      if (/title|subtitle|badge|description/i.test(k)) headerKeys.push(k);
      if (/button/i.test(k)) actionKeys.push(k);
    }
  }

  const elements = {
    header: headerKeys.length > 0,
    media: mediaKeys.length > 0,
    collections: collections.length > 0,
    actions: actionKeys.length > 0
  };

  return { keys, collections, mediaKeys, actionKeys, headerKeys, elements };
};

const deriveMetadataAndTags = (category: string, entry: any) => {
  const type: string = entry?.type || "";
  const variant: string = entry?.variant || "";
  const props: any = entry?.props || {};
  const content: any = props?.content || {};
  const cols = props?.cols || props?.gridCols || null;
  const leftMedia = props?.leftMedia ?? null;

  // Infer layout generically from type string; default to stack.
  const layout = type.includes(".grid") ? "grid" : type.includes(".split") ? "split" : "stack";

  // Orientation is a generic split hint; null for non-split layouts.
  const orientation = layout === "split"
    ? (leftMedia === true ? "media-left" : leftMedia === false ? "media-right" : null)
    : null;

  const contentSig = extractContentSignature(content);

  const structure = {
    layout,
    columns: cols,
    orientation
  };

  const tags = [
    `category:${category}`,
    `layout:${layout}`,
    `variant:${variant}`,
    cols ? `columns:${cols}` : null,
    orientation ? `orientation:${orientation}` : null,
    contentSig.elements.header ? "element:header" : null,
    contentSig.elements.media ? "element:media" : null,
    contentSig.elements.collections ? "element:collections" : null,
    contentSig.elements.actions ? "element:actions" : null
  ].filter(Boolean) as string[];

  return { structure, contentSig, tags };
};

const buildEmbedText = (
  category: string,
  type: string,
  variant: string,
  structure: { layout: string; columns: string | null; orientation: string | null },
  contentSig: { elements: { header: boolean; media: boolean; collections: boolean; actions: boolean } },
  content: any
): string => {
  const title = content?.title || "";
  const base = title ? `${title}. ` : "";

  const layoutPhrase =
    structure.layout === "grid"
      ? `Grid layout${structure.columns ? ` ${structure.columns}` : ""}`
      : structure.layout === "split"
      ? `Split layout${structure.orientation ? ` (${structure.orientation})` : ""}`
      : "Stacked (centered) section";

  const elements: string[] = [];
  if (contentSig.elements.header) elements.push("header");
  if (contentSig.elements.media) elements.push("media");
  if (contentSig.elements.collections) elements.push("collections");
  if (contentSig.elements.actions) elements.push("actions");
  const elemPhrase = elements.length ? ` with ${elements.join(", ")}` : "";

  // Generic, domain-agnostic purpose/use-case line
  const purpose =
    structure.layout === "grid"
      ? "Designed to present multiple items clearly and scan-friendly."
      : structure.layout === "split"
      ? "Balances narrative copy with supporting visuals."
      : "Optimized for primary messaging and conversion.";

  return `${base}${layoutPhrase}${elemPhrase}. ${purpose}`.trim();
};

// Build a concise, generic description following the agreed pattern.
const buildQdrantDescription = (
  type: string,
  variant: string,
  structure: { layout: string; columns: string | null; orientation: string | null },
  contentSig: { elements: { header: boolean; media: boolean; collections: boolean; actions: boolean } }
): string => {
  const typePart = `${type || "UI block"}`;
  const purposePart =
    structure.layout === "grid"
      ? "for presenting collections clearly"
      : structure.layout === "split"
      ? "for pairing content with visuals"
      : "for focused messaging";

  const structureBits: string[] = [];
  structureBits.push(structure.layout);
  if (structure.columns) structureBits.push(`columns ${structure.columns}`);
  if (structure.orientation) structureBits.push(structure.orientation);

  const elements: string[] = [];
  if (contentSig.elements.header) elements.push("header");
  if (contentSig.elements.media) elements.push("media");
  if (contentSig.elements.collections) elements.push("collections");
  if (contentSig.elements.actions) elements.push("actions");

  const structurePart = `${structureBits.join(", ")}${elements.length ? "; elements: " + elements.join(", ") : ""}`;
  const responsivePart = "Responsive layout for common breakpoints.";
  const customizationPart = "Content-driven and easily customizable.";
  const useCasePart = "Suitable for landing pages and marketing sections.";

  return `${typePart} ${purposePart}. ${structurePart}. ${responsivePart} ${customizationPart} ${useCasePart}`;
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
      const { structure, contentSig, tags } = deriveMetadataAndTags(category, entry);

      const description = buildQdrantDescription(type, variant, structure, contentSig);
      const embedText = buildEmbedText(category, type, variant || "", structure, contentSig, content);

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
          structure,
          content_signature: contentSig
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