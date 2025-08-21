import { z } from 'zod';

export const GridFooterPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'sections': z.any()
		}),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'sections': z.any()
		}),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.any(),
		'useContainer': z.boolean(),
		'py': z.string()
	}).optional()
})]);
