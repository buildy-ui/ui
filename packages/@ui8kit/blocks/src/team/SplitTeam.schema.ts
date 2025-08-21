import { z } from 'zod';

export const SplitTeamPresetSchema = z.union([z.object({
	'type': z.string(),
	variant: z.string().optional(),
	props: z.object({
		'content': z.object({
			'title': z.string(),
			'description': z.string(),
			'badge': z.string(),
			'members': z.any(),
			'stats': z.object({
				'totalMembers': z.string(),
				'departments': z.string(),
				'locations': z.string()
			})
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
			'members': z.any()
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
			'members': z.any(),
			'hiring': z.object({
				'title': z.string(),
				'description': z.string(),
				'ctaText': z.string(),
				'openPositions': z.number()
			})
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
			'members': z.any(),
			'stats': z.object({
				'totalMembers': z.string(),
				'locations': z.string(),
				'departments': z.string()
			})
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
			'members': z.any(),
			'stats': z.object({
				'totalMembers': z.string(),
				'departments': z.string(),
				'locations': z.string()
			})
		}),
		'mediaPosition': z.string(),
		'useContainer': z.boolean()
	}).optional()
})]);
