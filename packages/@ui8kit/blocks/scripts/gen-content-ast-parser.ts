/*
	Generic schema generator using Babel AST. Captures full nested content objects
	and keeps duplicate samples (even for the same variant).

	Usage:
	  bun x packages/@ui8kit/blocks/scripts/gen-schemas-babel.ts --blocks features

	- Scans: packages/@ui8kit/blocks/src/<category>/**\/*.examples.tsx
	- Infers BlockName from file name (e.g., GridFeatures.examples.tsx → GridFeatures)
	- For each JSX <BlockName ... content={...} variant="..." />:
	    - If content is an identifier (usually "content"), resolves nearest const content = { ... }
	    - Builds a JSON Schema for that single sample (required = keys present in this sample)
	    - Adds it to anyOf list for this BlockName, preserving duplicates
	- Emits: packages/@ui8kit/blocks/schemas/<category>/<BlockName>.content.schema.json

	Requires dev deps:
	  @babel/parser, @babel/traverse, @babel/types
*/

import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

type JsonSchema = Record<string, any>;

// Convert a Babel AST node into a plain JS value (object/array/literal)
function valueFromNode(node: t.Node): any {
  if (!node) return undefined;
  if (t.isObjectExpression(node)) return objectFromObjectExpression(node);
  if (t.isArrayExpression(node)) {
    return node.elements.map((el) => {
      if (!el || el.type === "SpreadElement") return null;
      return valueFromNode(el as t.Node);
    });
  }
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return (node as any).value;
  if (node.type === "BooleanLiteral") return (node as any).value;
  if (node.type === "NullLiteral") return null;
  if ((node as any).type === "Identifier") return (node as any).name;
  return undefined;
}

function objectFromObjectExpression(obj: t.ObjectExpression): any {
  const out: any = {};
  for (const prop of obj.properties) {
    if (prop.type !== "ObjectProperty") continue;
    const key = prop.key.type === "Identifier" ? prop.key.name : (prop.key.type === "StringLiteral" ? prop.key.value : undefined);
    if (!key) continue;
    if (!prop.value) continue;
    out[key] = valueFromNode(prop.value as t.Node);
  }
  return out;
}

// Convert AST node to TypeScript source (preserving identifiers)
function nodeToTs(node: t.Node, used: Set<string>): string {
	if (!node) return 'undefined';
	if (t.isStringLiteral(node)) return JSON.stringify(node.value);
	if (t.isNumericLiteral(node)) return String((node as any).value);
	if (node.type === 'BooleanLiteral') return String((node as any).value);
	if (node.type === 'NullLiteral') return 'null';
	if (t.isIdentifier(node)) {
		used.add(node.name);
		return node.name;
	}
	if (t.isObjectExpression(node)) {
		const parts: string[] = [];
		for (const prop of node.properties) {
			if (prop.type !== 'ObjectProperty') continue;
			const key = prop.key.type === 'Identifier' ? prop.key.name : (prop.key.type === 'StringLiteral' ? prop.key.value : undefined);
			if (!key) continue;
			// @ts-ignore
			const val = nodeToTs(prop.value, used);
			parts.push(`${key}: ${val}`);
		}
		return `{ ${parts.join(', ')} }`;
	}
	if (t.isArrayExpression(node)) {
		const items = node.elements.map(el => {
			if (!el) return 'null';
			// @ts-ignore
			return nodeToTs(el as t.Node, used);
		});
		return `[${items.join(', ')}]`;
	}
	if (t.isMemberExpression(node)) {
		// object.property or object['prop']
		const obj = node.object as t.Node;
		const prop = node.property as t.Node;
		let objTs = nodeToTs(obj, used);
		let propTs = '';
		if (t.isIdentifier(prop) && !node.computed) {
			propTs = `.${(prop as t.Identifier).name}`;
		} else {
			propTs = `[${nodeToTs(prop, used)}]`;
		}
		return `${objTs}${propTs}`;
	}
	// fallback: try valueFromNode then JSON stringify
	const v = valueFromNode(node);
	try { return JSON.stringify(v); } catch { return 'undefined'; }
}

function attrValueToTs(attr: t.JSXAttribute | null | undefined, used: Set<string>): string {
	if (!attr || !attr.value) return 'true';
	if (attr.value.type === 'StringLiteral') return JSON.stringify(attr.value.value);
	if (attr.value.type === 'JSXExpressionContainer') {
		const expr = attr.value.expression;
		return nodeToTs(expr as t.Node, used);
	}
	// other (rare) types
	return 'undefined';
}

// --- end helpers ---

const argv = process.argv;
const blocksArgIdx = argv.indexOf("--blocks");
if (blocksArgIdx === -1 || !argv[blocksArgIdx + 1]) {
	console.error("[gen-schemas-babel] Missing --blocks <category>. E.g., --blocks features");
	process.exit(1);
}
const category = argv[blocksArgIdx + 1];

const srcRoot = resolve(__dirname, "..", "src", category);
const outDir = resolve(__dirname, "..", "content", category);

function ensureDir(path: string) {
	try { mkdirSync(path, { recursive: true }); } catch {}
}

function walk(dir: string): string[] {
	const result: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const st = statSync(full);
		if (st.isDirectory()) result.push(...walk(full));
		else if (st.isFile() && /\.examples\.tsx$/.test(entry)) result.push(full);
	}
	return result;
}

function parseSource(code: string, file: string) {
	return parse(code, {
		sourceType: "module",
		plugins: ["typescript", "jsx", "decorators-legacy"],
		sourceFilename: file
	});
}

function isIdentifierName(node: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName): node is t.JSXIdentifier {
	return node.type === "JSXIdentifier";
}

function getAttr(node: t.JSXOpeningElement, name: string): t.JSXAttribute | undefined {
	const attrs = node.attributes.filter((a: t.JSXAttribute | t.JSXSpreadAttribute) => a.type === "JSXAttribute") as t.JSXAttribute[];
	if (!attrs) return undefined;
	return attrs.find(a => a.name.name === name);
}

function readStringValue(attr?: t.JSXAttribute): string | undefined {
	if (!attr || !attr.value) return undefined;
	if (attr.value.type === "StringLiteral") return attr.value.value;
	if (attr.value.type === "JSXExpressionContainer" && attr.value.expression.type === "StringLiteral") return attr.value.expression.value;
	return undefined;
}

function schemaFromNode(node: t.Node): JsonSchema {
	if (t.isStringLiteral(node)) return { type: "string" };
	if (t.isNumericLiteral(node)) return { type: "number" };
	if (node.type === "BooleanLiteral") return { type: "boolean" };
	if (node.type === "NullLiteral") return { type: "null" };
	if (t.isArrayExpression(node)) {
		const itemSchemas = node.elements.map(el => (el && el.type !== "SpreadElement" && el !== null) ? schemaFromNode(el as t.Node) : {});
		return { type: "array", items: mergeItemSchemas(itemSchemas) };
	}
	if (t.isObjectExpression(node)) return schemaFromObject(node);
	return {};
}

function schemaFromObject(obj: t.ObjectExpression): JsonSchema {
	const properties: Record<string, JsonSchema> = {};
	const required: string[] = [];
	for (const prop of obj.properties) {
		if (prop.type !== "ObjectProperty") continue;
		const key = prop.key.type === "Identifier" ? prop.key.name : (prop.key.type === "StringLiteral" ? prop.key.value : undefined);
		if (!key) continue;
		if (!prop.value) continue;
		properties[key] = mergeSchemas(properties[key], schemaFromNode(prop.value));
		required.push(key);
	}
	return { type: "object", properties, required };
}

function mergeItemSchemas(schemas: JsonSchema[]): JsonSchema {
	if (schemas.length === 0) return {};
	const allObjects = schemas.every(s => s && s.type === "object");
	if (allObjects) {
		const mergedProps: Record<string, JsonSchema> = {};
		for (const s of schemas) {
			const props = s.properties || {};
			for (const [k, v] of Object.entries(props)) mergedProps[k] = mergeSchemas(mergedProps[k], v as JsonSchema);
		}
		return { type: "object", properties: mergedProps };
	}
	const primitive = Array.from(new Set(schemas.map(s => s.type).filter(Boolean)));
	if (primitive.length === 1) return { type: primitive[0] } as JsonSchema;
	return {};
}

function mergeSchemas(a: JsonSchema | undefined, b: JsonSchema): JsonSchema {
	if (!a) return b;
	if (!b) return a;
	if (a.type === "object" && b.type === "object") {
		const props: Record<string, JsonSchema> = { ...(a.properties || {}) };
		for (const [k, v] of Object.entries(b.properties || {})) props[k] = mergeSchemas(props[k], v as JsonSchema);
		// required stays per-sample, so do not merge here (each sample carries its own required)
		return { type: "object", properties: props };
	}
	if (a.type === "array" && b.type === "array") return { type: "array", items: mergeSchemas(a.items || {}, b.items || {}) };
	return {};
}

function findNearestContent(objects: Array<{ start: number; node: t.ObjectExpression }>, jsxStart: number) {
	let cand: t.ObjectExpression | undefined;
	for (const o of objects) {
		if (o.start < jsxStart) cand = o.node; else break;
	}
	return cand;
}

function generate() {
	ensureDir(outDir);
	const files = walk(srcRoot);
	for (const file of files) {
		const code = readFileSync(file, 'utf8');
		const ast = parseSource(code, file);
		const blockName = basename(file).replace(/\.examples\.tsx$/, '');

		const contentObjects: Array<{ start: number; node: t.ObjectExpression }> = [];
		const samplesTs: string[] = [];

		// map local import name -> { source, type, imported }
		const importMap: Record<string, { source: string; type: 'named' | 'default' | 'ns'; imported?: string }> = {};

		traverse(ast, {
			ImportDeclaration(path) {
				const src = path.node.source.value as string;
				for (const spec of path.node.specifiers) {
					if (t.isImportSpecifier(spec)) {
						const local = spec.local.name;
						const imported = (spec.imported && spec.imported.type === 'Identifier') ? spec.imported.name : local;
						importMap[local] = { source: src, type: 'named', imported };
					} else if (t.isImportDefaultSpecifier(spec)) {
						importMap[spec.local.name] = { source: src, type: 'default' };
					} else if (t.isImportNamespaceSpecifier(spec)) {
						importMap[spec.local.name] = { source: src, type: 'ns' };
					}
				}
			},
			VariableDeclarator(path) {
				const id = path.node.id;
				if (t.isIdentifier(id) && id.name === 'content' && path.node.init && t.isObjectExpression(path.node.init)) {
					contentObjects.push({ start: path.node.start || 0, node: path.node.init });
				}
			},
			JSXOpeningElement(path) {
				const opening = path.node;
				if (!isIdentifierName(opening.name)) return;
				if (opening.name.name !== blockName) return;

				const used = new Set<string>();
				const variant = blockName.replace(/Hero$/, '').toLowerCase();
				let variantValue: string | undefined = undefined;
				const propsParts: string[] = [];

				for (const a of (opening.attributes as any[])) {
					if (a.type !== 'JSXAttribute') continue;
					const aName = (a.name as any).name;
					if (!aName) continue;
					if (aName === 'variant') {
						const v = readStringValue(a as t.JSXAttribute);
						if (typeof v === 'string') variantValue = v;
						continue;
					}
					if (aName === 'content') {
						let contentTs = 'undefined';
						if (a.value && a.value.type === 'JSXExpressionContainer') {
							const expr = a.value.expression;
							if (t.isObjectExpression(expr)) {
								contentTs = nodeToTs(expr, used);
							} else if (t.isIdentifier(expr) && expr.name === 'content') {
								const nearest = findNearestContent(contentObjects, opening.start || 0);
								if (nearest) contentTs = nodeToTs(nearest, used);
							}
						}
						propsParts.push(`content: ${contentTs}`);
						continue;
					}
					// other props
					const valTs = attrValueToTs(a as t.JSXAttribute, used);
					propsParts.push(`${aName}: ${valTs}`);
				}

				const sampleType = `${category}.${variant}`;
				const sampleVariant = variantValue ?? variant;
				const sampleCode = `{
				type: ${JSON.stringify(sampleType)},
				variant: ${JSON.stringify(sampleVariant)},
				props: { ${propsParts.join(', ')} }
			}`;
				samplesTs.push(sampleCode);
			}
		});

		if (samplesTs.length > 0) {
			// Build imports for used identifiers
			const usedNames = new Set<string>();
			// collect used names by scanning samplesTs for identifiers that match importMap keys
			for (const src of samplesTs) {
				for (const local of Object.keys(importMap)) {
					if (new RegExp(`\\b${local}\\b`).test(src)) usedNames.add(local);
				}
			}

			// group by source
			const importsBySource: Record<string, { named: Array<{ imported: string; local: string }>; defaults: string[]; ns: string[] }> = {};
			for (const name of usedNames) {
				const info = importMap[name];
				if (!info) continue;
				const src = info.source;
				if (!importsBySource[src]) importsBySource[src] = { named: [], defaults: [], ns: [] };
				if (info.type === 'named') importsBySource[src].named.push({ imported: info.imported || name, local: name });
				else if (info.type === 'default') importsBySource[src].defaults.push(name);
				else if (info.type === 'ns') importsBySource[src].ns.push(name);
			}

			let header = '';
			for (const [src, group] of Object.entries(importsBySource)) {
				if (group.ns.length > 0) {
					for (const n of group.ns) header += `import * as ${n} from '${src}';\n`;
				}
				if (group.defaults.length > 0) {
					for (const d of group.defaults) header += `import ${d} from '${src}';\n`;
				}
				if (group.named.length > 0) {
					const parts = group.named.map(it => it.imported === it.local ? it.imported : `${it.imported} as ${it.local}`);
					header += `import { ${parts.join(', ')} } from '${src}';\n`;
				}
			}

			const outPath = join(outDir, `${blockName}.content.ts`);
			ensureDir(outDir);
			const fileContent = `${header}\nexport default [\n${samplesTs.join(',\n')}\n];\n`;
			writeFileSync(outPath, fileContent, 'utf8');
			// eslint-disable-next-line no-console
			console.log(`[gen-content-ast-parser] Wrote ${outPath}`);
		}
	}
}

generate();


