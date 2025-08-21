import { z } from 'zod';

export const SplitCTAPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttons': z.array(z.object({
				'id': z.any().optional(),
				'text': z.any().optional(),
				'variant': z.any().optional(),
				'lucideIcon': z.any().optional()
			})),
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
		'leftMedia': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttons': z.array(z.object({
				'id': z.any().optional(),
				'text': z.any().optional(),
				'variant': z.any().optional(),
				'lucideIcon': z.any().optional()
			})),
			'backgroundImage': z.string(),
			'stats': z.object({
				'users': z.string(),
				'rating': z.string(),
				'downloads': z.string()
			})
		}),
		'leftMedia': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'buttons': z.array(z.object({
				'id': z.any().optional(),
				'text': z.any().optional(),
				'variant': z.any().optional(),
				'lucideIcon': z.any().optional()
			})),
			'stats': z.object({
				'users': z.string(),
				'rating': z.string(),
				'downloads': z.string()
			})
		}),
		'leftMedia': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttons': z.array(z.object({
				'id': z.any().optional(),
				'text': z.any().optional(),
				'variant': z.any().optional(),
				'lucideIcon': z.any().optional()
			})),
			'devices': z.object({
				'desktop': z.string(),
				'mobile': z.string(),
				'tablet': z.string()
			})
		}),
		'leftMedia': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttons': z.array(z.object({
				'id': z.any().optional(),
				'text': z.any().optional(),
				'variant': z.any().optional(),
				'lucideIcon': z.any().optional()
			})),
			'features': z.array(z.object({
				'id': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional(),
				'lucideIcon': z.any().optional()
			}))
		}),
		'leftMedia': z.boolean()
	}).optional()
})]);
