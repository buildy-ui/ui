import { z } from 'zod';

export const SplitPostPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			
		}),
		'leftMedia': z.boolean()
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
				'role': z.string(),
				'bio': z.string()
			}),
			'meta': z.object({
				'category': z.string(),
				'readTime': z.string()
			}),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
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
			'subtitle': z.string(),
			'meta': z.object({
				'category': z.string(),
				'readTime': z.string()
			}),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'tags': z.array(z.string())
		}),
		'leftMedia': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
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
			}),
			'relatedLinks': z.array(z.object({
				'title': z.any().optional(),
				'href': z.any().optional()
			}))
		}),
		'leftMedia': z.boolean()
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
				'readTime': z.string(),
				'views': z.string(),
				'likes': z.string(),
				'comments': z.string()
			}),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'tags': z.array(z.string())
		}),
		'leftMedia': z.boolean(),
		'className': z.string()
	}).optional()
})]);
