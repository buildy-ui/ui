// Schema selector gateway: choose qdrant or crud at build time via env
import * as qdrant from "./item-schema-qdrant";
// import * as crud from "./item-schema-crud";
import { makeSchemaTransport } from "@ui8kit/form";

// const TARGET = (import.meta as any).env?.VITE_ITEM_SCHEMA === "crud" ? crud : qdrant;
const transport = makeSchemaTransport(qdrant as any);

// Re-export selected schema surface
export const ItemFormSchema = transport.ItemFormSchema;
export const ItemDomainSchema = transport.ItemDomainSchema;
export const ItemUi = transport.ItemUi as Record<string, {
	label: string;
	widget: "input" | "textarea" | "select" | "file";
	placeholder?: string;
	options?: { value: string; label: string }[];
	table?: boolean;
}>;
export const itemFormDefaults = transport.itemFormDefaults as () => any;
export const toDomain = transport.toDomain as (values: any) => any;
export const toFormValues = transport.toFormValues as (item: any) => any;
export const ItemFieldOrder = transport.ItemFieldOrder as string[];



