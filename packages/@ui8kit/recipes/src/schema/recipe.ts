import { z } from 'zod';

export const VariantValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined()
]);

export const VariantMapSchema = z.record(z.string(), VariantValue);

// New: Component-level prop config for generated component
export const ComponentPropSchema = z.object({
  name: z.string(),
  default: VariantValue.optional()
});

// New: Additional content props not directly tied to text nodes
export const ContentPropSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'icon']).default('string')
});

export const SlotSchema:any = z.object({
  slot: z.string(),
  element: z.string().optional(),
  uiComponent: z.string().optional(),
  dataClass: z.string(),
  className: z.string().optional(),
  variants: VariantMapSchema.optional(),
  content: z
    .object({
      text: z.string().optional(),
      prop: z.string().optional(),
    })
    .optional(),
  ifProp: z.string().optional(),
  children: z.array(z.lazy(() => SlotSchema)).optional()
});

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  componentName: z.string(),
  imports: z.array(z.string()),
  extraImports: z.array(z.string()).optional(),
  themeImport: z.string().optional(),
  defaults: VariantMapSchema.optional(),
  // New: expose selected component props in generated component API
  props: z.array(ComponentPropSchema).optional(),
  // New: add extra content fields for the data interface
  contentProps: z.array(ContentPropSchema).optional(),
  root: SlotSchema,
});

export type VariantMap = z.infer<typeof VariantMapSchema>;
export type Slot = z.infer<typeof SlotSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;

