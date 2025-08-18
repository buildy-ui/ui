/*
	Generic schema generator for blocks by parsing *.examples.tsx files in a category folder.

	Usage:
	  bun x packages/@ui8kit/blocks/scripts/gen-schemas.ts --blocks features

	Behavior:
	- Looks in packages/@ui8kit/blocks/src/<category>/**\/*.examples.tsx
	- For each examples file, infers the block name from file name (e.g., GridFeatures.examples.tsx → GridFeatures)
	- Parses each example to read `content={...}` passed into the block component and (optionally) its `variant="..."`
	- Aggregates all observed content shapes per variant and writes JSON Schema per block:
	    packages/@ui8kit/blocks/schemas/<category>/<BlockName>.content.schema.json

	Notes:
	- The schema is conservative/permissive. It marks fields as required only if present in all examples for the same variant.
	- Only `content` is modeled intentionally, to stay simple and IDE-friendly.
*/

import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import ts from "typescript";

type JsonSchema = Record<string, any>;

interface VariantAggregate {
	contentProperties: Record<string, JsonSchema>;
	contentRequiredCounts: Record<string, number>;
	contentExampleCount: number;
}

interface BlockAggregate {
	byVariant: Record<string, VariantAggregate>;
}

const argv = process.argv;
const blocksArgIdx = argv.indexOf("--blocks");
if (blocksArgIdx === -1 || !argv[blocksArgIdx + 1]) {
	console.error("[gen-schemas] Missing --blocks <category>. E.g., --blocks features");
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
		if (st.isDirectory()) {
			result.push(...walk(full));
		} else if (st.isFile() && /\.examples\.tsx$/.test(entry)) {
			result.push(full);
		}
	}
	return result;
}

function parseSource(filePath: string) {
	const code = readFileSync(filePath, "utf8");
	return ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function getJsxAttribute(node: ts.JsxOpeningLikeElement, name: string): ts.JsxAttribute | undefined {
	const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
	return attrs.find(a => a.name.getText() === name);
}

function getAttrStringLiteral(attr?: ts.JsxAttribute): string | undefined {
	if (!attr || !attr.initializer) return undefined;
	if (ts.isStringLiteral(attr.initializer)) return attr.initializer.text;
	if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression && ts.isStringLiteral(attr.initializer.expression)) {
		return attr.initializer.expression.text;
	}
	return undefined;
}

function inferSchemaFromExpression(expr: ts.Expression): JsonSchema {
	if (ts.isStringLiteral(expr)) return { type: "string" };
	if (ts.isNumericLiteral(expr)) return { type: "number" };
	if (expr.kind === ts.SyntaxKind.TrueKeyword || expr.kind === ts.SyntaxKind.FalseKeyword) return { type: "boolean" };
	if (expr.kind === ts.SyntaxKind.NullKeyword) return { type: "null" };
	if (ts.isArrayLiteralExpression(expr)) {
		const itemSchemas = expr.elements.map(el => ts.isExpression(el) ? inferSchemaFromExpression(el) : {});
		return { type: "array", items: mergeItemSchemas(itemSchemas) };
	}
	if (ts.isObjectLiteralExpression(expr)) return inferSchemaFromObject(expr);
	return {};
}

function inferSchemaFromObject(obj: ts.ObjectLiteralExpression): JsonSchema {
	const properties: Record<string, JsonSchema> = {};
	for (const prop of obj.properties) {
		if (!ts.isPropertyAssignment(prop)) continue;
		const key = prop.name.getText().replace(/['"]/g, "");
		if (!ts.isExpression(prop.initializer)) continue;
		properties[key] = mergeSchemas(properties[key], inferSchemaFromExpression(prop.initializer));
	}
	return { type: "object", properties };
}

function mergeItemSchemas(schemas: JsonSchema[]): JsonSchema {
	if (schemas.length === 0) return {};
	const allObjects = schemas.every(s => s && s.type === "object");
	if (allObjects) {
		const mergedProps: Record<string, JsonSchema> = {};
		for (const s of schemas) {
			const props = s.properties || {};
			for (const [k, v] of Object.entries(props)) {
				mergedProps[k] = mergeSchemas(mergedProps[k], v as JsonSchema);
			}
		}
		return { type: "object", properties: mergedProps };
	}
	const primitiveTypes = new Set(schemas.map(s => s.type).filter(Boolean));
	if (primitiveTypes.size === 1) {
		const [t] = Array.from(primitiveTypes);
		return t ? { type: t } : {};
	}
	return {};
}

function mergeSchemas(a: JsonSchema | undefined, b: JsonSchema): JsonSchema {
	if (!a) return b;
	if (!b) return a;
	if (a.type === "object" && b.type === "object") {
		const props: Record<string, JsonSchema> = { ...(a.properties || {}) };
		for (const [k, v] of Object.entries(b.properties || {})) props[k] = mergeSchemas(props[k], v as JsonSchema);
		return { type: "object", properties: props };
	}
	if (a.type === "array" && b.type === "array") return { type: "array", items: mergeSchemas(a.items || {}, b.items || {}) };
	return {};
}

function updateRequiredCounts(agg: VariantAggregate, objSchema: JsonSchema) {
	const props = objSchema.properties || {};
	for (const key of Object.keys(props)) agg.contentRequiredCounts[key] = (agg.contentRequiredCounts[key] || 0) + 1;
}

function toRequiredArray(agg: VariantAggregate): string[] {
	const required: string[] = [];
	for (const [k, count] of Object.entries(agg.contentRequiredCounts)) if (count === agg.contentExampleCount) required.push(k);
	return required;
}

function buildContentVariantSchema(variant: string, agg: VariantAggregate): JsonSchema {
	return {
		title: variant,
		type: "object",
		properties: agg.contentProperties,
		required: toRequiredArray(agg)
	};
}

function collectContentDecls(sf: ts.SourceFile): Array<{ pos: number; obj: ts.ObjectLiteralExpression }> {
	const decls: Array<{ pos: number; obj: ts.ObjectLiteralExpression }> = [];
	function visit(n: ts.Node) {
		if (ts.isVariableDeclaration(n) && n.name.getText() === "content" && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
			decls.push({ pos: n.pos, obj: n.initializer });
		}
		n.forEachChild(visit);
	}
	visit(sf);
	return decls.sort((a, b) => a.pos - b.pos);
}

function findNearestContentObject(contentDecls: Array<{ pos: number; obj: ts.ObjectLiteralExpression }>, jsxPos: number): ts.ObjectLiteralExpression | undefined {
	let cand: ts.ObjectLiteralExpression | undefined;
	for (const d of contentDecls) {
		if (d.pos < jsxPos) cand = d.obj; else break;
	}
	return cand;
}

function aggregateCategory(categoryDir: string) {
	const files = walk(categoryDir);
	const byBlock: Record<string, BlockAggregate> = {};

	for (const file of files) {
		const blockName = basename(file).replace(/\.examples\.tsx$/, "");
		const sf = parseSource(file);
		const contentDecls = collectContentDecls(sf);

		function visit(n: ts.Node) {
			if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) {
				const tag = (n as ts.JsxOpeningLikeElement).tagName.getText();
				if (tag === blockName) {
					const variantAttr = getJsxAttribute(n as ts.JsxOpeningLikeElement, "variant");
					const variant = getAttrStringLiteral(variantAttr) || "default";
					const contentAttr = getJsxAttribute(n as ts.JsxOpeningLikeElement, "content");

					let contentSchema: JsonSchema = {};
					if (contentAttr && contentAttr.initializer && ts.isJsxExpression(contentAttr.initializer) && contentAttr.initializer.expression) {
						const expr = contentAttr.initializer.expression;
						if (ts.isObjectLiteralExpression(expr)) contentSchema = inferSchemaFromObject(expr);
						else if (ts.isIdentifier(expr)) {
							const nearest = findNearestContentObject(contentDecls, n.pos);
							if (nearest) contentSchema = inferSchemaFromObject(nearest);
						}
					}

					if (!byBlock[blockName]) byBlock[blockName] = { byVariant: {} };
					if (!byBlock[blockName].byVariant[variant]) {
						byBlock[blockName].byVariant[variant] = {
							contentProperties: {},
							contentRequiredCounts: {},
							contentExampleCount: 0
						};
					}
					const agg = byBlock[blockName].byVariant[variant];
					agg.contentProperties = mergeSchemas(agg.contentProperties, contentSchema).properties || agg.contentProperties;
					updateRequiredCounts(agg, contentSchema);
					agg.contentExampleCount += 1;
				}
			}
			n.forEachChild(visit);
		}

		visit(sf);
	}

	return byBlock;
}

function generate() {
	ensureDir(outDir);
	const aggregated = aggregateCategory(srcRoot);
	for (const [blockName, data] of Object.entries(aggregated)) {
		const anyOf: JsonSchema[] = [];
		for (const [variant, agg] of Object.entries(data.byVariant)) anyOf.push(buildContentVariantSchema(variant, agg));
		const schema: JsonSchema = {
			$schema: "http://json-schema.org/draft-07/schema#",
			title: `${category}/${blockName} Content Schema`,
			description: `Auto-generated from examples for ${blockName}`,
			anyOf
		};
		const outPath = join(outDir, `${blockName}.content.schema.json`);
		writeFileSync(outPath, JSON.stringify(schema, null, 2), "utf8");
		// eslint-disable-next-line no-console
		console.log(`[gen-schemas] Wrote ${outPath}`);
	}
}

generate();


