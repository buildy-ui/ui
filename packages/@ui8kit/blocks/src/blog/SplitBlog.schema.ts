import { z } from 'zod';

export const SplitBlogPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'subtitle': z.string(),
			'description': z.string(),
			'posts': z.any()
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'tagline': z.string(),
			'title': z.string(),
			'description': z.string(),
			'viewAllText': z.string(),
			'posts': z.any()
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
			'posts': z.any(),
			'featuredPost': z.any()
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
			'posts': z.any()
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
			'viewAllText': z.string(),
			'posts': z.array(z.object({
				'date': z.any().optional(),
				'title': z.any().optional(),
				'description': z.any().optional()
			}))
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
})]);
