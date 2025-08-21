import { z } from 'zod';

export const SplitPortfolioPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'projects': z.any(),
			'stats': z.object({
				'totalProjects': z.string(),
				'yearsExperience': z.string(),
				'happyClients': z.string(),
				'awards': z.string()
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
			'projects': z.any(),
			'categories': z.any(),
			'stats': z.object({
				'totalProjects': z.string(),
				'yearsExperience': z.string(),
				'happyClients': z.string(),
				'awards': z.string()
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
			'buttonText': z.string(),
			'projects': z.any(),
			'categories': z.any(),
			'skills': z.array(z.string())
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
			'projects': z.any(),
			'testimonial': z.object({
				'text': z.string(),
				'author': z.string(),
				'role': z.string(),
				'company': z.string()
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
			'buttonText': z.string(),
			'projects': z.any(),
			'skills': z.array(z.string())
		}),
		'leftMedia': z.boolean()
	}).optional()
})]);
