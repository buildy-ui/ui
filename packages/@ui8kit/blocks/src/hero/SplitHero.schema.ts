import { z } from 'zod';

export const SplitHeroPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
		}),
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
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
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
			'images': z.array(z.object({
				'id': z.any().optional(),
				'src': z.any().optional(),
				'alt': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean()
	}).optional()
}), z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'topButton': z.object({
				'text': z.string(),
				'href': z.string()
			}),
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
			'images': z.array(z.object({
				'id': z.any().optional(),
				'src': z.any().optional(),
				'alt': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
		}),
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
			'image': z.object({
				'src': z.string(),
				'alt': z.string()
			}),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any(),
			'secondaryButtonIcon': z.any()
		}),
		'leftMedia': z.boolean(),
		'useContainer': z.boolean(),
		'className': z.string()
	}).optional()
})]);
