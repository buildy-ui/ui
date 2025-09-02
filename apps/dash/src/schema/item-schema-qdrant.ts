import { z } from "zod";

// Form schema (authoring) using flat values for easy inputs
export const ItemFormSchema = z.object({
	id: z.string().optional().default(""),
	type: z.string().min(1, "Type is required").default("hero.centered"),
	variant: z.string().min(1, "Variant is required").default("simple"),
	category: z.string().min(1, "Category is required").default("hero"),
	path: z.string().min(1, "Path is required").default("CenteredHero.preset.ts"),
	"payload.qdrant.description": z.string().min(1, "Description is required").default("The future of work is here"),
	"payload.qdrant.tags": z.string().optional().default("category:hero,layout:stack,variant:simple,element:header,element:actions"),
	"payload.qdrant.category": z.string().min(1).default("hero"),
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;

// Domain model (stored)
export const ItemDomainSchema = z.object({
	id: z.string(),
	type: z.string(),
	variant: z.string(),
	category: z.string(),
	path: z.string(),
	payload: z.object({
		qdrant: z.object({
			description: z.string(),
			tags: z.array(z.string()),
			category: z.string(),
		}),
	}),
});

export type ItemDomainInput = z.infer<typeof ItemDomainSchema>;

export const ItemUi: Record<string, {
	label: string;
	widget: "input" | "textarea" | "select" | "file";
	placeholder?: string;
	options?: { value: string; label: string }[];
	table?: boolean;
}> = {
	id: { label: "ID", widget: "input", placeholder: "hero.centered#simple#0", table: true },
	type: { label: "Type", widget: "input", placeholder: "hero.centered", table: true },
	variant: { label: "Variant", widget: "input", placeholder: "simple", table: true },
	category: { label: "Category", widget: "select", options: [ { value: "hero", label: "hero" } ], table: true },
	path: { label: "Path", widget: "input", placeholder: "CenteredHero.preset.ts", table: false },
	"payload.qdrant.description": { label: "Description", widget: "textarea", placeholder: "The future of work is here", table: false },
	"payload.qdrant.category": { label: "Payload Category", widget: "select", options: [ { value: "hero", label: "hero" } ], table: false },
	"payload.qdrant.tags": { label: "Tags", widget: "input", placeholder: "comma,separated,tags", table: true },
};

export function itemFormDefaults(): ItemFormValues {
	return ItemFormSchema.parse({});
}

export function parseTagsInput(value: string): string[] {
	return value
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
}

export function formatTagsForInput(tags: string[]): string {
	return tags.join(",");
}

export function toDomain(values: ItemFormValues): ItemDomainInput {
	const v = ItemFormSchema.parse(values);
	return ItemDomainSchema.parse({
		id: v.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		type: v.type,
		variant: v.variant,
		category: v.category,
		path: v.path,
		payload: {
			qdrant: {
				description: v["payload.qdrant.description"],
				tags: parseTagsInput(v["payload.qdrant.tags"] || ""),
				category: v["payload.qdrant.category"],
			},
		},
	});
}

export function toFormValues(item: ItemDomainInput): ItemFormValues {
	return ItemFormSchema.parse({
		id: item.id,
		type: item.type,
		variant: item.variant,
		category: item.category,
		path: item.path,
		"payload.qdrant.description": item.payload.qdrant.description,
		"payload.qdrant.tags": formatTagsForInput(item.payload.qdrant.tags),
		"payload.qdrant.category": item.payload.qdrant.category,
	});
}

export const ItemFieldOrder: string[] = [
	"id",
	"type",
	"variant",
	"category",
	"path",
	"payload.qdrant.description",
	"payload.qdrant.category",
	"payload.qdrant.tags",
];



