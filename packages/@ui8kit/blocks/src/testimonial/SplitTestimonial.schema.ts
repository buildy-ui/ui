import { z } from 'zod';

export const SplitTestimonialPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'badge': z.string(),
			'testimonials': z.any(),
			'ctaText': z.string()
		}),
		'mediaPosition': z.string(),
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
		'mediaPosition': z.string(),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'testimonials': z.any(),
			'stats': z.object({
				'totalReviews': z.string(),
				'averageRating': z.string(),
				'satisfied': z.string()
			}),
			'ctaText': z.string()
		}),
		'mediaPosition': z.string(),
		'useContainer': z.boolean()
	}).optional()
})]);
