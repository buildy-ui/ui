// Schema selector gateway: choose qdrant or crud at build time via env
import * as qdrant from "./item-schema-qdrant";
import * as crud from "./item-schema-crud";

const TARGET = (import.meta as any).env?.VITE_ITEM_SCHEMA === "crud" ? crud : qdrant;

// Re-export selected schema surface
export const ItemFormSchema = (TARGET as any).ItemFormSchema;
export const ItemDomainSchema = (TARGET as any).ItemDomainSchema;
export const ItemUi = (TARGET as any).ItemUi as Record<string, {
	label: string;
	widget: "input" | "textarea" | "select" | "file";
	placeholder?: string;
	options?: { value: string; label: string }[];
	table?: boolean;
}>;
export const itemFormDefaults = (TARGET as any).itemFormDefaults as () => any;
export const toDomain = (TARGET as any).toDomain as (values: any) => any;
export const toFormValues = (TARGET as any).toFormValues as (item: any) => any;
export const ItemFieldOrder = (TARGET as any).ItemFieldOrder as string[];



