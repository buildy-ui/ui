import { useNavigate } from "react-router-dom";
import { Box, Card, Stack, Title, Button } from "@ui8kit/core";
import { Form } from "@ui8kit/form";
import { useForm } from "@ui8kit/form";
import { AutoFields } from "@ui8kit/form";
import { createItem } from "@/services/items";
import * as qdrant from "@/schema/item-schema-qdrant";
import { makeSchemaTransport } from "@ui8kit/form";

const transport = makeSchemaTransport(qdrant as any);
const itemFormDefaults = transport.itemFormDefaults;
const toDomain = transport.toDomain;
const ItemFieldOrder = transport.ItemFieldOrder;
const ItemUi = transport.ItemUi;

export function NewItem() {
	const navigate = useNavigate();
	const form = useForm<any>({
		defaultValues: itemFormDefaults(),
		mode: "onBlur",
	});

	const onSubmit = form.handleSubmit(async (values) => {
		const domain = toDomain(values);
		await createItem(domain);
		navigate("/brain/items");
	});

	return (
		<Box w="full" maxW="xl" mx="auto">
			<Stack gap="lg" align="start">
				<Title size="2xl" c="secondary-foreground" mt="lg">Create Item</Title>
				<Card p="md" rounded="md" shadow="lg" bg="card" w="full">
					<form onSubmit={onSubmit} noValidate>
						<Form {...form}>
							<Stack gap="md">
								<AutoFields form={form} fields={ItemFieldOrder as any} ui={ItemUi as any} />
								<Button type="submit" variant="default">Save</Button>
							</Stack>
						</Form>
					</form>
				</Card>
			</Stack>
		</Box>
	);
}


