import Ajv from "ajv";
import centeredContentSchema from "../../../../packages/@ui8kit/blocks/schemas/hero/CenteredHero.content.schema.json" with { type: "json" };
import splitContentSchema from "../../../../packages/@ui8kit/blocks/schemas/hero/SplitHero.content.schema.json" with { type: "json" };

const ajv = new Ajv({ allErrors: false }); // stop at first error

const vCentered = ajv.compile(centeredContentSchema as any);
const vSplit = ajv.compile(splitContentSchema as any);

function formatAjvError(type: string, validate: any) {
  const err = (validate.errors && validate.errors[0]) || null;
  if (!err) return `${type}: invalid content`;
  const path = (err.instancePath || err.dataPath || "")
    .replace(/^\//, "")
    .replace(/^\./, "");
  const missing = err.params && (err.params as any).missingProperty;
  const field = missing ? (path ? `${path}.${missing}` : missing) : path || "content";
  const msg = err.keyword === "required" ? "is required" : (err.message || "invalid");
  return `${type}: ${field} ${msg}`;
}

export function validateBlocksTree(tree: Array<any>) {
  // if (!import.meta.env.DEV) return; // keep it only in dev
  for (const node of tree) {
    if (!node?.props?.content) continue;

    if (node.type === "hero.centered" && node.variant === "simple" && !vCentered(node.props.content)) {
      throw new Error(formatAjvError("hero.centered", vCentered));
    }
    if (node.type === "hero.split" && node.variant === "security" && !vSplit(node.props.content)) {
      throw new Error(formatAjvError("hero.split", vSplit));
    }
  }
}