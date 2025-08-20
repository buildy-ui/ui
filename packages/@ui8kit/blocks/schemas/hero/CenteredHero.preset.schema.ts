import { z } from 'zod';

export const CenteredHeroPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
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
			'topButton': z.object({
				'text': z.string(),
				'href': z.string()
			}),
			'badge': z.string(),
			'title': z.string(),
			'description': z.string(),
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
			'title': z.string(),
			'description': z.string(),
			'imageUrl': z.string(),
			'imageAlt': z.string(),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string()
		}),
		'useContainer': z.boolean(),
		'data-class': z.string(),
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
			'stats': z.array(z.object({
				'id': z.any().optional(),
				'value': z.any().optional(),
				'label': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any()
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
			'stats': z.array(z.object({
				'id': z.any().optional(),
				'value': z.any().optional(),
				'label': z.any().optional()
			})),
			'primaryButtonText': z.string(),
			'secondaryButtonText': z.string(),
			'primaryButtonIcon': z.any()
		}),
		'useContainer': z.boolean(),
		'className': z.string()
	}).optional()
})]);
