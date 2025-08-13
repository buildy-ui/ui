export type BlockPayload = {
	name: string;
	description: string;
	tags: string[];
	category: string;
	path: string;
	imports: string;
	export: string;
};

export type BlockMeta = {
	id: string;
	vector?: number[] | null;
	payload: BlockPayload;
};

const STORAGE_KEY = "blocks-meta";

type Store = Record<string /* category */, Record<string /* id */, BlockMeta>>;

function readStore(): Store {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		return JSON.parse(raw) as Store;
	} catch {
		return {};
	}
}

function writeStore(store: Store) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function listByCategory(category: string): BlockMeta[] {
	const store = readStore();
	return Object.values(store[category] || {});
}

export function getMeta(category: string, id: string): BlockMeta | undefined {
	const store = readStore();
	return store[category]?.[id];
}

export function upsertMeta(category: string, meta: BlockMeta): void {
	const store = readStore();
	store[category] = store[category] || {};
	store[category]![meta.id] = meta;
	writeStore(store);
}

export function getTags(category: string, id: string): string[] {
    return getMeta(category, id)?.payload.tags || [];
}


