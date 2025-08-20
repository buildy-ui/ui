import { z } from 'zod';

export const SplitFeaturesPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'features': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'features': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'lucideIcon': z.any().optional()
			}))
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
			'description': z.string(),
			'features': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional()
			}))
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean(),
		'py': z.string(),
		'gap': z.string(),
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
			'features': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'lucideIcon': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'primaryButtonIcon': z.any()
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean(),
		'gap': z.string(),
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
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'features': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
})]);
