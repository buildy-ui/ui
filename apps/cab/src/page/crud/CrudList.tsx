import { useEffect, useState } from "react";
import { Box, Card, Stack, Title, Button, Text } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { Sheet } from "@ui8kit/core";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@ui8kit/form";
import { Input, Textarea, Select } from "@ui8kit/form";
import { useForm } from "@ui8kit/form";
import { loadPosts, updatePost, type Post } from "@/services/crud";

export function CrudList() {
	const [posts, setPosts] = useState<Post[]>([]);
	useEffect(() => { loadPosts().then(setPosts); }, []);

	function refresh() {
		loadPosts().then(setPosts);
	}

	return (
		<Box w="full">
			<Stack gap="lg" align="start">
				<Title size="2xl" c="secondary-foreground" mt="lg">Posts</Title>
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
	const form = useForm<{ title: string; excerpt: string; content: string; tags: string; category: string; slug: string }>({
		defaultValues: {
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			tags: post.tags.join(","),
			category: post.category || "",
			slug: post.slug,
		},
		mode: "onBlur",
	});

	const onSubmit = form.handleSubmit(async (values) => {
		await updatePost(post.id, {
			title: values.title,
			excerpt: values.excerpt,
			content: values.content,
			tags: values.tags.split(",").map(t => t.trim()).filter(Boolean),
			category: values.category,
			slug: values.slug,
		});
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
								<FormField
									control={form.control}
									name="title"
									rules={{ required: "Title is required" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input placeholder="Post title" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="slug"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<FormControl>
												<Input placeholder="post-slug" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="excerpt"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Excerpt</FormLabel>
											<FormControl>
												<Textarea placeholder="Short summary" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Content</FormLabel>
											<FormControl>
												<Textarea placeholder="Write your content here..." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<FormControl>
												<Select {...field}>
													<option value="">Select category</option>
													<option value="tech">Tech</option>
													<option value="design">Design</option>
													<option value="news">News</option>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tags</FormLabel>
											<FormControl>
												<Input placeholder="comma,separated,tags" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" variant="default">Save changes</Button>
							</Stack>
						</Form>
					</form>
				</Sheet>
			</TableCell>
		</TableRow>
	);
}


