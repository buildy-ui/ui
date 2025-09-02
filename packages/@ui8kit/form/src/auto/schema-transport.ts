export type SchemaModule = {
  ItemFormSchema: any;
  ItemDomainSchema: any;
  ItemUi: Record<string, {
    label: string;
    widget: "input" | "textarea" | "select" | "file";
    placeholder?: string;
    options?: { value: string; label: string }[];
    table?: boolean;
  }>;
  itemFormDefaults: () => any;
  toDomain: (values: any) => any;
  toFormValues: (item: any) => any;
  ItemFieldOrder: string[];
};

export function makeSchemaTransport(schema: SchemaModule) {
  return {
    ItemFormSchema: schema.ItemFormSchema,
    ItemDomainSchema: schema.ItemDomainSchema,
    ItemUi: schema.ItemUi,
    itemFormDefaults: schema.itemFormDefaults,
    toDomain: schema.toDomain,
    toFormValues: schema.toFormValues,
    ItemFieldOrder: schema.ItemFieldOrder,
  } as const;
}


