import { z } from 'zod';

export const GridBusinessPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'promo': z.string(),
			'title': z.string(),
			'description': z.string(),
			'cards': z.any()
		}),
		'cols': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'solutions': z.any()
		}),
		'cols': z.string(),
		'className': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'plans': z.any()
		}),
		'cols': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'plans': z.any()
		}),
		'cols': z.string(),
		'_showYearlyToggle': z.boolean(),
		'className': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'openings': z.any()
		}),
		'cols': z.string(),
		'useContainer': z.boolean()
	}).optional()
})]);
