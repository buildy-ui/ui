import { FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Textarea, Select } from "@ui8kit/form";
import { ItemUi } from "./item-schema";
import { Text } from "@ui8kit/core";

type FieldName = keyof typeof ItemUi;

export function AutoFields({
	form,
	fields,
}: {
	form: any;
	fields?: FieldName[];
}) {
	const fieldList: FieldName[] = (fields as FieldName[] | undefined) || (Object.keys(ItemUi) as FieldName[]);

	async function handleFileChange(name: FieldName, file?: File | null) {
		if (!file) {
			form.setValue(name as any, "", { shouldDirty: true });
			return;
		}
		const reader = new FileReader();
		const data: string = await new Promise((resolve) => {
			reader.onload = () => resolve(String(reader.result || ""));
			reader.readAsDataURL(file);
		});
		form.setValue(name as any, data, { shouldDirty: true });
	}

	return (
		<>
			{fieldList.map((name) => {
				const meta = ItemUi[name];
				const watched = form.watch(name as any);
				return (
					<FormField
						key={String(name)}
						control={form.control}
						name={name as any}
						rules={undefined}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{meta.label}</FormLabel>
								<FormControl>
									{(() => {
										switch (meta.widget) {
											case "input":
												return <Input {...field} placeholder={meta.placeholder} />;
											case "textarea":
												return <Textarea {...field} placeholder={meta.placeholder} />;
											case "select":
												return (
													<Select {...field}>
														{(meta.options || []).map((opt) => (
															<option key={opt.value} value={opt.value}>{opt.label}</option>
														))}
													</Select>
												);
											case "file":
												return <Input type="file" accept="image/*" onChange={(e) => handleFileChange(name, e.target.files?.[0])} />;
											default:
												return <Input {...field} />;
										}
									})()}
								</FormControl>
								{meta.widget === "file" && !!watched && (
									<Text size="xs" c="muted">Image loaded</Text>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
				);
			})}
		</>
	);
}


