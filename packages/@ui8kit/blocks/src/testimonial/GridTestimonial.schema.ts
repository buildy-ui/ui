import { z } from 'zod';

export const GridTestimonialPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'badge': z.string(),
			'testimonials': z.any(),
			'stats': z.object({
				'averageRating': z.string(),
				'totalReviews': z.string()
			})
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.string(),
			'testimonials': z.any()
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.string(),
			'badge': z.string(),
			'testimonials': z.any()
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'badge': z.string(),
			'testimonials': z.any(),
			'stats': z.object({
				'totalReviews': z.string(),
				'averageRating': z.string()
			})
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'testimonials': z.any()
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'testimonials': z.any()
		}),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.string(),
			'badge': z.string(),
			'testimonials': z.any(),
			'stats': z.object({
				'totalReviews': z.string(),
				'averageRating': z.string(),
				'satisfied': z.string()
			})
		}),
		'useContainer': z.boolean()
	}).optional()
})]);
