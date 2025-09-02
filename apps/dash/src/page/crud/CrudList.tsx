import { useEffect, useState } from "react";
import { Box, Card, Stack, Title, Button, Text } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { Sheet } from "@ui8kit/core";
import { loadPosts, updatePost, savePosts, type Post } from "@/services/crud";
import { Form,useForm } from "@ui8kit/form";
import { AutoFields, makeSchemaTransport } from "@ui8kit/form";
import * as crud from "@/schema/item-schema-crud";

const schema = makeSchemaTransport(crud as any);

export function CrudList() {
	const [posts, setPosts] = useState<Post[]>([]);
	useEffect(() => { loadPosts().then(setPosts); }, []);

	function refresh() {
		loadPosts().then(setPosts);
	}

	async function onImportFile(file?: File | null) {
		if (!file) return;
		const text = await file.text();
		try {
			const json = JSON.parse(text);
			if (!Array.isArray(json)) return;
			const now = Date.now();
			const mapped: Post[] = json.map((r: any): Post => {
				const tags: string[] = Array.isArray(r?.tags)
					? r.tags.map((t: any) => String(t))
					: String(r?.tags || "")
						.split(",")
						.map((t) => t.trim())
						.filter(Boolean);
				return {
					id: String(r?.id || `${now}-${Math.random().toString(36).slice(2, 8)}`),
					title: String(r?.title || ""),
					excerpt: String(r?.excerpt || ""),
					content: String(r?.content || ""),
					image: r?.image ? String(r.image) : undefined,
					tags,
					category: r?.category ? String(r.category) : undefined,
					slug: String(r?.slug || ""),
					createdAt: Number(r?.createdAt || now),
					updatedAt: now,
				};
			});
			await savePosts(mapped);
			refresh();
			alert(`Imported ${mapped.length} posts`);
		} catch {
			alert("Invalid JSON file");
		}
	}

	async function onExportFile() {
		const data = await loadPosts();
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "crud-export.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<Box w="full">
			<Stack gap="lg" align="start">
				<Title size="2xl" c="secondary-foreground" mt="lg">Posts</Title>
				<Box w="full" className="ml-auto flex justify-end gap-4">
					<Card p="md" rounded="md" shadow="lg" bg="card">
						<Stack gap="sm">
							<Title size="lg">Import posts</Title>
							<Text c="muted">Load CRUD posts from a local JSON file.</Text>
							<input type="file" accept="application/json" onChange={(e) => onImportFile(e.target.files?.[0] || null)} />
						</Stack>
					</Card>
					<Card p="md" rounded="md" shadow="lg" bg="card">
						<Stack gap="sm">
							<Title size="lg">Export posts</Title>
							<Text c="muted">Download current posts as JSON.</Text>
							<Button variant="default" onClick={onExportFile}>Export JSON</Button>
						</Stack>
					</Card>
				</Box>
				<Card p="md" rounded="md" shadow="lg" bg="card" w="full">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Title</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Tags</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{posts.map((p) => (
								<Row key={p.id} post={p} onSaved={refresh} />
							))}
						</TableBody>
					</Table>
				</Card>
			</Stack>
		</Box>
	);
}

function Row({ post, onSaved }: { post: Post; onSaved: () => void }) {
	const id = `edit-${post.id}`;
	const form = useForm<any>({
		defaultValues: schema.toFormValues({
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			image: post.image,
			tags: post.tags,
			category: post.category,
			slug: post.slug,
		} as any),
		mode: "onBlur",
	});

	const onSubmit = form.handleSubmit(async () => {
		const domain = schema.toDomain(form.getValues());
		await updatePost(post.id, domain as any);
		onSaved();
		const checkbox = document.getElementById(id) as HTMLInputElement | null;
		if (checkbox) checkbox.checked = false;
	});

	return (
		<TableRow>
			<TableCell>{post.title}</TableCell>
			<TableCell>{post.category || "—"}</TableCell>
			<TableCell>
				<Text size="xs" c="muted">{post.tags.join(", ") || "—"}</Text>
			</TableCell>
			<TableCell>
				<Text size="xs" c="muted">{new Date(post.createdAt).toLocaleString()}</Text>
			</TableCell>
			<TableCell>
				<label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">Edit</label>
				<Sheet id={id} side="right" size="xl" title="Edit post" showTrigger={false}>
					<form onSubmit={onSubmit} noValidate>
						<Form {...form}>
							<Stack gap="md">
								<AutoFields form={form} fields={schema.ItemFieldOrder as any} ui={schema.ItemUi as any} />
								<Button type="submit" variant="default">Save changes</Button>
							</Stack>
						</Form>
					</form>
				</Sheet>
			</TableCell>
		</TableRow>
	);
}


