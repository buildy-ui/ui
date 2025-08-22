import { z } from 'zod';

export const CenteredPostPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			
		})
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.any(),
			'excerpt': z.any()
		})
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'excerpt': z.string(),
			'author': z.object({
				'name': z.string(),
				'role': z.string()
			}),
			'meta': z.object({
				'category': z.string()
			})
		})
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.string(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'meta': z.object({
				'category': z.string(),
				'views': z.string(),
				'likes': z.string(),
				'comments': z.string()
			})
		}),
		'className': z.string()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.string(),
			'author': z.object({
				'name': z.string(),
				'role': z.string()
			}),
			'meta': z.object({
				'category': z.string(),
				'readTime': z.string()
			}),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			})
		})
	}).optional()
})]);
