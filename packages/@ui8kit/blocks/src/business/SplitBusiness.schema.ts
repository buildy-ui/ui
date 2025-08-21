import { z } from 'zod';

export const SplitBusinessPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'secondaryButtonText': z.string(),
			'metrics': z.any(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			})
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'subtitle': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'stats': z.object({
				'clients': z.string(),
				'projects': z.string(),
				'satisfaction': z.string(),
				'years': z.string()
			})
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean(),
		'className': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'testimonials': z.any(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			})
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean(),
		'className': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'secondaryButtonText': z.string(),
			'features': z.any()
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'subtitle': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'secondaryButtonText': z.string(),
			'cards': z.any(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			})
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
})]);
