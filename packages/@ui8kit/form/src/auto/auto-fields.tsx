import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Select } from "../select";

type UiMap = Record<string, {
  label: string;
  widget: "input" | "textarea" | "select" | "file";
  placeholder?: string;
  options?: { value: string; label: string }[];
}>;

export function AutoFields({
  form,
  fields,
  ui,
}: {
  form: any;
  fields: string[];
  ui: UiMap;
}) {
  async function handleFileChange(name: string, file?: File | null) {
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
      {fields.map((name) => {
        const meta = ui[name];
        const watched = form.watch(name as any);
        return (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as any}
            rules={undefined}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{meta?.label ?? name}</FormLabel>
                <FormControl>
                  {(() => {
                    switch (meta?.widget) {
                      case "input":
                        return <Input {...field} placeholder={meta?.placeholder} />;
                      case "textarea":
                        return <Textarea {...field} placeholder={meta?.placeholder} />;
                      case "select":
                        return (
                          <Select {...field}>
                            {(meta?.options || []).map((opt) => (
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
                {meta?.widget === "file" && !!watched && (
                  <span className="text-xs text-muted-foreground">File loaded</span>
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


