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

const argv = process.argv;
const blocksArgIdx = argv.indexOf("--blocks");
if (blocksArgIdx === -1 || !argv[blocksArgIdx + 1]) {
	console.error("[gen-schemas-babel] Missing --blocks <category>. E.g., --blocks features");
	process.exit(1);
}
const category = argv[blocksArgIdx + 1];

const srcRoot = resolve(__dirname, "..", "src", category);
const outDir = resolve(__dirname, "..", "schemas", category);

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
		const code = readFileSync(file, "utf8");
		const ast = parseSource(code, file);
		const blockName = basename(file).replace(/\.examples\.tsx$/, "");

		const contentObjects: Array<{ start: number; node: t.ObjectExpression }> = [];
		const samples: any[] = [];

		traverse(ast, {
			VariableDeclarator(path) {
				const id = path.node.id;
				if (t.isIdentifier(id) && id.name === "content" && path.node.init && t.isObjectExpression(path.node.init)) {
					contentObjects.push({ start: path.node.start || 0, node: path.node.init });
				}
			},
			JSXOpeningElement(path) {
				const opening = path.node;
				if (!isIdentifierName(opening.name)) return;
				if (opening.name.name !== blockName) return;

				// build sample
				const variant = blockName.replace(/Hero$/, "").toLowerCase();
				const sample: any = { type: `${category}.${variant}`, variant, props: {} };

				// process attributes
				for (const a of (opening.attributes as any[])) {
					if (a.type !== "JSXAttribute") continue;
					const aName = (a.name as any).name;
					if (!aName) continue;
					if (aName === "variant") {
						const v = readStringValue(a as t.JSXAttribute);
						if (typeof v === "string") sample.variant = v;
						continue;
					}
					if (aName === "content") {
						let contentSchema: JsonSchema | undefined;
						if (a.value && a.value.type === "JSXExpressionContainer") {
							const expr = a.value.expression;
							if (t.isObjectExpression(expr)) {
								contentSchema = schemaFromObject(expr);
							} else if (t.isIdentifier(expr) && expr.name === "content") {
								const nearest = findNearestContent(contentObjects, opening.start || 0);
								if (nearest) contentSchema = schemaFromObject(nearest);
							}
						}
						sample.props.content = contentSchema || {};
						continue;
					}
					// Other props
					let value: any = undefined;
					if (!a.value) {
						value = true;
					} else if (a.value.type === "StringLiteral") {
						value = a.value.value;
					} else if (a.value.type === "JSXExpressionContainer") {
						const expr = a.value.expression;
						switch (expr.type) {
							case "StringLiteral": value = (expr as any).value; break;
							case "NumericLiteral": value = (expr as any).value; break;
							case "BooleanLiteral": value = (expr as any).value; break;
							case "NullLiteral": value = null; break;
							case "ObjectExpression": value = schemaFromObject(expr); break;
							default: value = undefined;
						}
					} else if (a.value.type === "BooleanLiteral") {
						value = (a.value as any).value;
					}
					(sample.props as any)[aName] = value;
				}
				// push sample
				samples.push(sample);
			}
		});

		/*if (samples.length > 0) {
			const outPath = join(outDir, `${blockName}.content.schema.json`);
			writeFileSync(outPath, JSON.stringify(samples, null, 2), "utf8");
			// eslint-disable-next-line no-console
			console.log(`[gen-schemas-babel] Wrote ${outPath}`);
		}*/

		if (samples.length > 0) {
			// build zod schema code from samples
			function jsonSchemaToZod(schema: JsonSchema, indent = 0): string {
				const pad = '\t'.repeat(indent);
				if (!schema || Object.keys(schema).length === 0) return 'z.any()';
				if (schema.type === 'string') return 'z.string()';
				if (schema.type === 'number') return 'z.number()';
				if (schema.type === 'boolean') return 'z.boolean()';
				if (schema.type === 'null') return 'z.null()';
				if (schema.type === 'array') {
					const items = schema.items || {};
					return `z.array(${jsonSchemaToZod(items, indent)})`;
				}
				if (schema.type === 'object') {
					const props = schema.properties || {};
					const req: string[] = schema.required || [];
					const lines: string[] = [];
					for (const [k, v] of Object.entries(props)) {
						const sub = jsonSchemaToZod(v as JsonSchema, indent + 1);
						const isReq = req.includes(k);
						lines.push(`'${k}': ${sub}${isReq ? '' : '.optional()'}`);
					}
					return `z.object({\n${pad}\t${lines.join(`,\n${pad}\t`)}\n${pad}})`;
				}
				return 'z.any()';
			}

			function propValueToZod(value: any): string {
				if (value == null) return 'z.any()';
				if (typeof value === 'string') return 'z.string()';
				if (typeof value === 'number') return 'z.number()';
				if (typeof value === 'boolean') return 'z.boolean()';
				if (typeof value === 'object') {
					// assume it's already a JSON schema for object/array
					if (value.type) return jsonSchemaToZod(value as JsonSchema, 2);
					return 'z.any()';
				}
				return 'z.any()';
			}

			function sampleToZod(sample: any): string {
				// root object shape
				const props = sample.props || {};
				const propLines: string[] = [];
				for (const [k, v] of Object.entries(props)) {
					const z = propValueToZod(v);
					propLines.push(`'${k}': ${z}`);
				}

				const propsBlock = propLines.length ? `z.object({\n\t\t${propLines.join(',\n\t\t')}\n\t})` : 'z.object({}).optional()';

				// build final sample schema
				const variantLine = `variant: ${sample.variant ? 'z.string().optional()' : 'z.string().optional()'}`;
				const root = `z.object({\n\t'type': z.string(),\n\t${variantLine},\n\tprops: ${propsBlock}.optional()\n})`;
				return root;
			}

			let zodRoot = '';
			if (samples.length === 1) {
				zodRoot = sampleToZod(samples[0]);
			} else {
				const parts = samples.map(s => sampleToZod(s));
				zodRoot = `z.union([${parts.join(', ')}])`;
			}

			const tsOutPath = join(outDir, `${blockName}.preset.schema.ts`);
			const tsCode = "import { z } from 'zod';\n\n" +
				`export const ${blockName}PresetSchema = ${zodRoot};\n`;
			writeFileSync(tsOutPath, tsCode, "utf8");
			// eslint-disable-next-line no-console
			console.log(`[gen-schemas-babel] Wrote ${tsOutPath}`);
		}
	}
}

generate();


