import { useEffect, useState } from "react";
import { Box, Card, Stack, Title, Button, Text } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { Form } from "@ui8kit/form";
import { useForm } from "@ui8kit/form";
import { loadItems, updateItem, type Item } from "@/services/items";
import { AutoFields, makeSchemaTransport } from "@ui8kit/form";
import * as qdrant from "@/schema/item-schema-qdrant";
import { ResizableSheet } from "@/components/ResizableSheet";
import { embedTexts, lastEmbeddingTokenCount } from "@/services/embeddings";
import { ensureCollection, deleteAllPoints, upsertPoints } from "@/services/qdrant";

const schema = makeSchemaTransport(qdrant as any);

function dotGet(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function ItemsList() {
	const [items, setItems] = useState<Item[]>([]);
	useEffect(() => { loadItems().then(setItems); }, []);

	const [collection, setCollection] = useState<string>("components");
	const [sending, setSending] = useState<boolean>(false);

	function refresh() {
		loadItems().then(setItems);
	}

	async function sendToQdrant() {
		if (!items.length) return;
		setSending(true);
		try {
			const descriptions = items.map((i) => (i as any)?.payload?.qdrant?.description ?? "");
			const vectors = await embedTexts(descriptions);
			const dim = vectors[0]?.length ?? 0;
			if (!dim) throw new Error('Embedding dimension is 0');
			await ensureCollection(collection, dim);
			await deleteAllPoints(collection);
			const points = items.map((it, idx) => ({
				id: it.id,
				vector: vectors[idx],
				payload: {
					id: it.id,
					category: (it as any)?.payload?.qdrant?.category,
					tags: (it as any)?.payload?.qdrant?.tags,
					description: (it as any)?.payload?.qdrant?.description,
					type: (it as any).type,
					variant: (it as any).variant,
				},
			}));
			await upsertPoints(collection, points);
			alert(`Uploaded ${points.length} items to Qdrant collection '${collection}'. Token count: ${lastEmbeddingTokenCount}`);
		} catch (e: any) {
			alert(e?.message || String(e));
		} finally {
			setSending(false);
		}
	}

	return (
		<Box w="full">
			<Stack gap="lg" align="start">
				<Title size="2xl" c="secondary-foreground" mt="lg">Items</Title>
				<Card p="md" rounded="md" shadow="lg" bg="card" w="full">
					<div className="flex items-center gap-2 w-full">
						<input
							className="w-full px-3 py-2 rounded-md border bg-background"
							placeholder="Qdrant collection (e.g. components)"
							value={collection}
							onChange={(e) => setCollection(e.target.value)}
						/>
						<Button variant="default" disabled={!items.length || sending} onClick={sendToQdrant}>
							{sending ? 'Sending…' : 'Send to Qdrant'}
						</Button>
					</div>
				</Card>
				<Card p="md" rounded="md" shadow="lg" bg="card" w="full">
					<Table>
						<TableHeader>
							<TableRow>
								{schema.ItemFieldOrder.filter((k) => schema.ItemUi[k]?.table).map((k) => (
									<TableHead key={k}>{schema.ItemUi[k]?.label ?? k}</TableHead>
								))}
								<TableHead>Created</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((p) => (
								<Row key={p.id} item={p} onSaved={refresh} />
							))}
						</TableBody>
					</Table>
				</Card>
			</Stack>
		</Box>
	);
}

function Row({ item, onSaved }: { item: Item; onSaved: () => void }) {
	const id = `edit-${item.id}`;
	const form = useForm<any>({
		defaultValues: schema.toFormValues(item),
		mode: "onBlur",
	});

	const onSubmit = form.handleSubmit(async (_values) => {
		// Build flat values keyed by schema UI (supports dot-paths)
		const flat: Record<string, any> = {};
		for (const k of Object.keys(schema.ItemUi)) {
			flat[k] = form.getValues(k as any);
		}
		const domain = schema.toDomain(flat as any);
		await updateItem(item.id, domain);
		onSaved();
		const checkbox = document.getElementById(id) as HTMLInputElement | null;
		if (checkbox) checkbox.checked = false;
	});

	return (
		<TableRow>
			{schema.ItemFieldOrder.filter((k) => schema.ItemUi[k]?.table).map((k) => (
				<TableCell key={k}>
					<Text size="xs" c="muted">{String(dotGet(item, k) ?? "—")}</Text>
				</TableCell>
			))}
			<TableCell>
				<Text size="xs" c="muted">{new Date(item.createdAt).toLocaleString()}</Text>
			</TableCell>
			<TableCell>
				<label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">Edit</label>
				{/* Replace fixed-size Sheet with ResizableSheet (default 28rem, up to 50% viewport) */}
				<ResizableSheet id={id} title="Edit item">
					<form onSubmit={onSubmit} noValidate>
						<Form {...form}>
							<Stack gap="md">
								<AutoFields form={form} fields={schema.ItemFieldOrder as any} ui={schema.ItemUi as any} />
								<Button type="submit" variant="default">Save changes</Button>
							</Stack>
						</Form>
					</form>
				</ResizableSheet>
			</TableCell>
		</TableRow>
	);
}


