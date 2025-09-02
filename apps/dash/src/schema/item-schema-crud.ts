import { z } from "zod";

// Zod schema for form values (authoring)
export const ItemFormSchema = z.object({
	title: z.string().default(""),
	slug: z.string().default(""),
	excerpt: z.string().default(""),
	content: z.string().default(""),
	image: z.string().default(""),
	category: z.string().default(""),
	// Comma-separated in the form UI, mapped to array on submit
	tags: z.string().default(""),
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;

// Domain model input for create/update
export const ItemDomainSchema = z.object({
	title: z.string().min(1),
	excerpt: z.string().optional().default(""),
	content: z.string().optional().default(""),
	image: z.string().optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).default([]),
	slug: z.string().min(1),
});

export type ItemDomainInput = z.infer<typeof ItemDomainSchema>;

// UI metadata driving auto rendering and table columns
export const ItemUi: Record<string, {
	label: string;
	widget: "input" | "textarea" | "select" | "file";
	placeholder?: string;
	options?: { value: string; label: string }[];
	table?: boolean;
}> = {
	title: {
		label: "Title",
		widget: "input",
		placeholder: "Post title",
		table: true,
	},
	slug: {
		label: "Slug",
		widget: "input",
		placeholder: "post-slug",
		table: true,
	},
	excerpt: {
		label: "Excerpt",
		widget: "textarea",
		placeholder: "Short summary",
		table: false,
	},
	content: {
		label: "Content",
		widget: "textarea",
		placeholder: "Write your content here...",
		table: false,
	},
	image: {
		label: "Image",
		widget: "file",
		table: false,
	},
	category: {
		label: "Category",
		widget: "select",
		options: [
			{ value: "", label: "Select category" },
			{ value: "tech", label: "Tech" },
			{ value: "design", label: "Design" },
			{ value: "news", label: "News" },
		],
		table: true,
	},
	tags: {
		label: "Tags",
		widget: "input",
		placeholder: "comma,separated,tags",
		table: true,
	},
};

export function formDefaultValues(): ItemFormValues {
	return ItemFormSchema.parse({});
}

export const itemFormDefaults = formDefaultValues;

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
	const parsed = ItemFormSchema.parse(values);
	const out: ItemDomainInput = {
		title: parsed.title,
		excerpt: parsed.excerpt || "",
		content: parsed.content || "",
		image: parsed.image || undefined,
		category: parsed.category || undefined,
		tags: parseTagsInput(parsed.tags || ""),
		slug: parsed.slug || "",
	};
	return ItemDomainSchema.parse(out);
}

export function toFormValues(item: ItemDomainInput): ItemFormValues {
	return ItemFormSchema.parse({
		title: item.title,
		slug: item.slug,
		excerpt: item.excerpt || "",
		content: item.content || "",
		image: item.image || "",
		category: item.category || "",
		tags: formatTagsForInput(item.tags || []),
	});
}

export const ItemFieldOrder: string[] = [
	"title",
	"slug",
	"category",
	"tags",
	"excerpt",
	"content",
	"image",
];


