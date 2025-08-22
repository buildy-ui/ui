import { z } from 'zod';

export const SplitGalleryPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'subtitle': z.string(),
			'description': z.string(),
			'badge': z.string(),
			'images': z.array(z.object({
				'id': z.any().optional(),
				'src': z.any().optional(),
				'alt': z.any().optional(),
				'title': z.any().optional(),
				'category': z.any().optional(),
				'description': z.any().optional()
			})),
			'stats': z.object({
				'totalImages': z.string(),
				'categories': z.string(),
				'views': z.string()
			}),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string()
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
			'badge': z.string(),
			'images': z.array(z.object({
				'id': z.any().optional(),
				'src': z.any().optional(),
				'alt': z.any().optional(),
				'title': z.any().optional(),
				'category': z.any().optional()
			})),
			'stats': z.object({
				'totalImages': z.string(),
				'categories': z.string(),
				'views': z.string()
			}),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string()
		}),
		'leftMedia': z.boolean()
	}).optional()
})]);
