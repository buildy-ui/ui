import { z } from 'zod';

export const GridFeaturesPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'items': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional()
			}))
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
			'items': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'lucideIcon': z.any().optional()
			}))
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
			'items': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'image': z.object({
					'src': z.any().optional(),
					'alt': z.any().optional()
				}).optional(),
				'lucideIcon': z.any().optional()
			}))
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
			'items': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'department': z.any().optional(),
				'location': z.any().optional(),
				'lucideIcon': z.any().optional()
			}))
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
			'items': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'stats': z.object({
					'value': z.any().optional(),
					'label': z.any().optional()
				}).optional(),
				'lucideIcon': z.any().optional()
			}))
		}),
		'cols': z.string()
	}).optional()
})]);
