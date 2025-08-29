export type Post = {
	id: string;
	title: string;
	excerpt: string;
	content: string;
	image?: string; // base64 data URL
	tags: string[];
	category?: string;
	slug: string;
	createdAt: number;
	updatedAt: number;
};

const STORAGE_KEY = "crud-example-1";

// Lazy seed import to avoid TS issues if JSON resolution is not enabled
async function importSeed(): Promise<Post[]> {
	try {
		const mod = await import("@/data/crud-example-1.json");
		return (mod as any).default as Post[];
	} catch {
		return [];
	}
}

export async function loadPosts(): Promise<Post[]> {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (raw) {
		try {
			return JSON.parse(raw) as Post[];
		} catch {
			// fall through to seed
		}
	}
	const seed = await importSeed();
	if (seed.length) {
		await savePosts(seed);
	}
	return seed;
}

export async function savePosts(posts: Post[]): Promise<void> {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export async function createPost(input: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
	const posts = await loadPosts();
	const now = Date.now();
	const newPost: Post = {
		...input,
		id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
		createdAt: now,
		updatedAt: now,
	};
	posts.unshift(newPost);
	await savePosts(posts);
	return newPost;
}

export async function updatePost(id: string, changes: Partial<Omit<Post, "id" | "createdAt">>): Promise<Post | undefined> {
	const posts = await loadPosts();
	const idx = posts.findIndex(p => p.id === id);
	if (idx === -1) return undefined;
	const updated: Post = {
		...posts[idx],
		...changes,
		updatedAt: Date.now(),
	};
	posts[idx] = updated;
	await savePosts(posts);
	return updated;
}

export async function getPostById(id: string): Promise<Post | undefined> {
	const posts = await loadPosts();
	return posts.find(p => p.id === id);
}

export async function deletePost(id: string): Promise<boolean> {
	const posts = await loadPosts();
	const next = posts.filter(p => p.id !== id);
	const changed = next.length !== posts.length;
	if (changed) await savePosts(next);
	return changed;
}

export function makeSlug(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}


