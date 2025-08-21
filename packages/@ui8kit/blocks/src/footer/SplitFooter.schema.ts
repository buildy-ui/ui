import { z } from 'zod';

export const SplitFooterPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'mediaPosition': z.string(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'mediaPosition': z.string(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'mediaPosition': z.string(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'mediaPosition': z.string(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'mediaPosition': z.string(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
})]);
