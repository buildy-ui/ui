import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Stack, Title, Button, Grid, Text } from "@ui8kit/core";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@ui8kit/form";
import { Input, Textarea, Select } from "@ui8kit/form";
import { useForm } from "@ui8kit/form";
import { createPost, makeSlug } from "@/services/crud";

export function CrudCreate() {
	const navigate = useNavigate();
	const [imageData, setImageData] = useState<string | undefined>(undefined);
	const form = useForm<{ title: string; excerpt: string; content: string; image?: string; tags: string; category: string; slug: string }>({
		defaultValues: {
			title: "",
			excerpt: "",
			content: "",
			image: undefined,
			tags: "",
			category: "",
			slug: "",
		},
		mode: "onBlur",
	});

	const onSubmit = form.handleSubmit(async (values) => {
		const tags = values.tags
			.split(",")
			.map(t => t.trim())
			.filter(Boolean);
		const slug = values.slug || makeSlug(values.title || "post");
		await createPost({
			title: values.title,
			excerpt: values.excerpt,
			content: values.content,
			image: imageData,
			tags,
			category: values.category,
			slug,
		});
		navigate("/crud/list");
	});

	function onPickFile(file?: File | null) {
		if (!file) {
			setImageData(undefined);
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			setImageData(reader.result as string);
		};
		reader.readAsDataURL(file);
	}

	return (
		<Box w="full" maxW="xl" mx="auto">
			<Stack gap="lg" align="start">
				<Title size="2xl" c="secondary-foreground" mt="lg">Create Post</Title>
				<Card p="md" rounded="md" shadow="lg" bg="card" w="full">
					<form onSubmit={onSubmit} noValidate>
						<Form {...form}>
							<Stack gap="md">
								<Grid cols="1-2" gap="md" w="full">
									<FormField
										control={form.control}
										name="title"
										rules={{ required: "Title is required" }}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input placeholder="Post title" {...field} onBlur={(e) => {
														field.onBlur();
														if (!form.getValues("slug") && e.target.value) {
															form.setValue("slug", makeSlug(e.target.value), { shouldDirty: true });
														}
													}} />
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
								</Grid>

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

								<Grid cols="1-2" gap="md" w="full">
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
								</Grid>

								<FormItem>
									<FormLabel>Image</FormLabel>
									<FormControl>
										<Input type="file" accept="image/*" onChange={(e) => onPickFile(e.target.files?.[0])} />
									</FormControl>
									{imageData && (
										<Text size="xs" c="muted">Image loaded</Text>
									)}
								</FormItem>

								<Button type="submit" variant="default">Save</Button>
							</Stack>
						</Form>
					</form>
				</Card>
			</Stack>
		</Box>
	);
}


