/*
	Generate JSON Schemas for hero blocks by parsing example files.
	- Input: hero CenteredHero.examples.tsx, SplitHero.examples.tsx
	- Output: schemas/hero/CenteredHero.props.schema.json, SplitHero.props.schema.json

	This script infers a conservative schema from example usages:
	- Groups by variant
	- Merges observed content shapes
	- Marks fields as required only if present in all examples for the same variant
	- Includes observed block-level props (e.g., py, useContainer, leftMedia, gap)

	Note: The resulting schema is best-effort and intentionally permissive for unknown fields.
*/

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import ts from "typescript";

type JsonSchema = Record<string, any>;

interface VariantAggregate {
	contentProperties: Record<string, JsonSchema>;
	contentRequiredCounts: Record<string, number>;
	contentExampleCount: number;
	blockProps: Record<string, JsonSchema>;
}

interface BlockAggregate {
	byVariant: Record<string, VariantAggregate>;
}

const root = resolve(__dirname, "..", "src", "hero");
const examplesFiles = [
	join(root, "CenteredHero.examples.tsx"),
	join(root, "SplitHero.examples.tsx")
];

const outputDir = resolve(__dirname, "..", "schemas", "hero");

function ensureDir(path: string) {
	try {
		mkdirSync(path, { recursive: true });
	} catch {}
}

function parseSource(filePath: string) {
	const code = readFileSync(filePath, "utf8");
	return ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function isJsxElementOfName(node: ts.Node, name: string): node is ts.JsxOpeningElement | ts.JsxSelfClosingElement | ts.JsxOpeningLikeElement {
	if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
		const tag = node.tagName.getText();
		return tag === name;
	}
	return false;
}

function getJsxAttribute(node: ts.JsxOpeningLikeElement, attrName: string): ts.JsxAttribute | undefined {
	const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
	return attrs.find(a => a.name.getText() === attrName);
}

function getAttrStringLiteral(attr?: ts.JsxAttribute): string | undefined {
	if (!attr || !attr.initializer) return undefined;
	if (ts.isStringLiteral(attr.initializer)) return attr.initializer.text;
	if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression && ts.isStringLiteral(attr.initializer.expression)) {
		return attr.initializer.expression.text;
	}
	return undefined;
}

function getAttrBooleanLiteral(attr?: ts.JsxAttribute): boolean | undefined {
	if (!attr) return undefined;
	if (!attr.initializer) return true; // boolean attributes without value
	if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
		if (attr.initializer.expression.kind === ts.SyntaxKind.TrueKeyword) return true;
		if (attr.initializer.expression.kind === ts.SyntaxKind.FalseKeyword) return false;
	}
	return undefined;
}

function inferSchemaFromExpression(expr: ts.Expression): JsonSchema {
	switch (expr.kind) {
		case ts.SyntaxKind.StringLiteral:
			return { type: "string" };
		case ts.SyntaxKind.NumericLiteral:
			return { type: "number" };
		case ts.SyntaxKind.TrueKeyword:
		case ts.SyntaxKind.FalseKeyword:
			return { type: "boolean" };
		case ts.SyntaxKind.NullKeyword:
			return { type: "null" };
		default:
			if (ts.isArrayLiteralExpression(expr)) {
				const itemSchemas = expr.elements.map(el => ts.isExpression(el) ? inferSchemaFromExpression(el) : {});
				const merged = mergeItemSchemas(itemSchemas);
				return { type: "array", items: merged };
			}
			if (ts.isObjectLiteralExpression(expr)) {
				return inferSchemaFromObject(expr);
			}
			// Identifier, CallExpression, etc. — unknown, keep permissive
			return {};
	}
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
	// If all items are objects, merge their properties
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
	// Otherwise, if all primitives of same type
	const primitiveTypes = new Set(schemas.map(s => s.type).filter(Boolean));
	if (primitiveTypes.size === 1) {
		const [t] = Array.from(primitiveTypes);
		return t ? { type: t } : {};
	}
	// Fallback: any
	return {};
}

function mergeSchemas(a: JsonSchema | undefined, b: JsonSchema): JsonSchema {
	if (!a) return b;
	if (!b) return a;
	// Prefer object merge
	if (a.type === "object" && b.type === "object") {
		const props: Record<string, JsonSchema> = { ...(a.properties || {}) };
		for (const [k, v] of Object.entries(b.properties || {})) {
			props[k] = mergeSchemas(props[k], v as JsonSchema);
		}
		return { type: "object", properties: props };
	}
	// Prefer array merge
	if (a.type === "array" && b.type === "array") {
		return { type: "array", items: mergeSchemas(a.items || {}, b.items || {}) };
	}
	// If types differ, relax to permissive
	return {};
}

function updateRequiredCounts(agg: VariantAggregate, objSchema: JsonSchema) {
	const props = objSchema.properties || {};
	for (const key of Object.keys(props)) {
		agg.contentRequiredCounts[key] = (agg.contentRequiredCounts[key] || 0) + 1;
	}
}

function toRequiredArray(agg: VariantAggregate): string[] {
	const required: string[] = [];
	for (const [k, count] of Object.entries(agg.contentRequiredCounts)) {
		if (count === agg.contentExampleCount) required.push(k);
	}
	return required;
}

function buildVariantSchema(variant: string, agg: VariantAggregate): JsonSchema {
	const contentSchema: JsonSchema = {
		type: "object",
		properties: agg.contentProperties,
		required: toRequiredArray(agg)
	};

	const propsSchema: JsonSchema = {
		type: "object",
		properties: {
			content: contentSchema,
			...agg.blockProps
		},
		required: ["content"]
	};

	return {
		type: "object",
		properties: {
			variant: { const: variant },
			props: propsSchema
		},
		required: ["variant", "props"]
	};
}

function aggregateExamples(): Record<string, BlockAggregate> {
	const result: Record<string, BlockAggregate> = {};

	for (const file of examplesFiles) {
		const sf = parseSource(file);
		const contentDecls = new Map<string, ts.ObjectLiteralExpression>();

		function collectContent(node: ts.Node) {
			if (ts.isVariableDeclaration(node) && node.name.getText() === "content" && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
				contentDecls.set("content", node.initializer);
			}
			node.forEachChild(collectContent);
		}
		collectContent(sf);

		function visit(node: ts.Node) {
			if (ts.isReturnStatement(node) && node.expression) {
				// Find the first JSX element within return and the target component
				let target: ts.JsxOpeningLikeElement | undefined;
				const findJsx = (n: ts.Node) => {
					if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) {
						const tag = (n as ts.JsxOpeningLikeElement).tagName.getText();
						if (tag === "CenteredHero" || tag === "SplitHero") {
							target = n as ts.JsxOpeningLikeElement;
							return;
						}
					}
					n.forEachChild(findJsx);
				};
				findJsx(node);

				if (target) {
					const blockType = target.tagName.getText() === "CenteredHero" ? "hero.centered" : "hero.split";
					const variantAttr = getJsxAttribute(target, "variant");
					const variant = getAttrStringLiteral(variantAttr) || (blockType === "hero.centered" ? "simple" : "media");
					const contentAttr = getJsxAttribute(target, "content");

					let contentSchema: JsonSchema = {};
					if (contentAttr && contentAttr.initializer && ts.isJsxExpression(contentAttr.initializer) && contentAttr.initializer.expression) {
						const expr = contentAttr.initializer.expression;
						if (ts.isIdentifier(expr)) {
							const decl = contentDecls.get(expr.text);
							if (decl) contentSchema = inferSchemaFromObject(decl);
						} else if (ts.isObjectLiteralExpression(expr)) {
							contentSchema = inferSchemaFromObject(expr);
						}
					}

					const blockProps: Record<string, JsonSchema> = {};
					const propNames = ["useContainer", "leftMedia", "py", "gap", "className", "splitSection"];
					for (const name of propNames) {
						const a = getJsxAttribute(target, name);
						if (!a) continue;
						const str = getAttrStringLiteral(a);
						const bool = getAttrBooleanLiteral(a);
						if (typeof bool === "boolean") blockProps[name] = { type: "boolean" };
						else if (typeof str === "string") blockProps[name] = { type: "string" };
						else blockProps[name] = {};
					}

					if (!result[blockType]) result[blockType] = { byVariant: {} };
					if (!result[blockType].byVariant[variant]) {
						result[blockType].byVariant[variant] = {
							contentProperties: {},
							contentRequiredCounts: {},
							contentExampleCount: 0,
							blockProps: {}
						};
					}
					const agg = result[blockType].byVariant[variant];
					agg.contentProperties = mergeSchemas(agg.contentProperties, contentSchema).properties || agg.contentProperties;
					updateRequiredCounts(agg, contentSchema);
					agg.contentExampleCount += 1;
					agg.blockProps = { ...agg.blockProps, ...blockProps };
				}
			}
			node.forEachChild(visit);
		}

		visit(sf);
	}

	return result;
}

function generateSchemas() {
	ensureDir(outputDir);
	const aggregated = aggregateExamples();

	for (const [blockType, data] of Object.entries(aggregated)) {
		const anyOf: JsonSchema[] = [];
		for (const [variant, agg] of Object.entries(data.byVariant)) {
			anyOf.push(buildVariantSchema(variant, agg));
		}
		const schema: JsonSchema = {
			$schema: "http://json-schema.org/draft-07/schema#",
			title: `${blockType} Props Schema`,
			description: `Auto-generated from examples for ${blockType}`,
			anyOf
		};

		const fileName = blockType === "hero.centered" ? "CenteredHero.props.schema.json" : "SplitHero.props.schema.json";
		writeFileSync(join(outputDir, fileName), JSON.stringify(schema, null, 2), "utf8");
	}
}

generateSchemas();


