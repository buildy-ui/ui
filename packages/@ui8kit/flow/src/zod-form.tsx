import * as React from "react";
import { z, type ZodTypeAny } from "zod";
import { useForm, Form, AutoFields } from "@ui8kit/form";

type ZodFormProps = {
  schema: ZodTypeAny;
  values?: Record<string, any>;
  ui?: Record<string, { label: string; widget: "input" | "textarea" | "select" | "file"; placeholder?: string; options?: { value: string; label: string }[] }>;
  onSubmit?: (values: any) => void;
};

export function ZodForm({ schema, values, ui = {}, onSubmit }: ZodFormProps) {
  const shape = (schema as any)?._def?.shape() ?? {};
  const fields = Object.keys(shape);

  const form = useForm({
    defaultValues: values || {},
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit((data) => {
    try {
      const parsed = (schema as z.ZodTypeAny).parse(data);
      onSubmit?.(parsed);
    } catch (e) {
      onSubmit?.(data);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <AutoFields form={form as any} fields={fields} ui={ui as any} />
      </form>
    </Form>
  );
}


