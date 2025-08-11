import { z } from 'zod';

export const VariantValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined()
]);

export const VariantMapSchema = z.record(z.string(), VariantValue);

export const SlotSchema:any = z.object({
  slot: z.string(),
  element: z.string().optional(),
  dataClass: z.string(),
  className: z.string().optional(),
  variants: VariantMapSchema.optional(),
  children: z.array(z.lazy(() => SlotSchema)).optional()
});

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  componentName: z.string(),
  imports: z.array(z.string()),
  themeImport: z.string().optional(),
  defaults: VariantMapSchema.optional(),
  root: SlotSchema,
});

export type VariantMap = z.infer<typeof VariantMapSchema>;
export type Slot = z.infer<typeof SlotSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;

