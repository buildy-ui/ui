import { z } from 'zod';

export const GridFAQPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'faqs': z.any()
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
			'buttonText': z.string(),
			'faqs': z.any()
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
			'categories': z.any(),
			'faqs': z.any()
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
			'faqs': z.any()
		}),
		'cols': z.string(),
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
			'buttonText': z.string(),
			'faqs': z.any(),
			'contactInfo': z.object({
				'title': z.string(),
				'description': z.string(),
				'email': z.string(),
				'phone': z.string()
			})
		}),
		'cols': z.string(),
		'className': z.string()
	}).optional()
})]);
