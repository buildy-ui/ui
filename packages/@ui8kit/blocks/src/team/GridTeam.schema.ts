import { z } from 'zod';

export const GridTeamPresetSchema = z.union([z.object({
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
				'openPositions': z.number()
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
			'members': z.any(),
			'stats': z.object({
				'totalMembers': z.string(),
				'departments': z.string(),
				'locations': z.string()
			})
		}),
		'useContainer': z.boolean()
	}).optional()
})]);
