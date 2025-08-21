import { z } from 'zod';

export const SplitFAQPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'buttonText': z.string(),
			'faqs': z.any(),
			'contactInfo': z.object({
				'title': z.string(),
				'description': z.string(),
				'email': z.string(),
				'phone': z.string(),
				'hours': z.string()
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
			'searchPlaceholder': z.string(),
			'categories': z.any(),
			'faqs': z.any(),
			'stats': z.object({
				'totalQuestions': z.string(),
				'avgResponseTime': z.string(),
				'satisfactionRate': z.string()
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
			'categories': z.any(),
			'faqs': z.any()
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
			'faqs': z.any(),
			'stats': z.object({
				'totalQuestions': z.string(),
				'avgResponseTime': z.string(),
				'satisfactionRate': z.string()
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
			'faqs': z.any()
		}),
		'leftMedia': z.boolean()
	}).optional()
})]);
