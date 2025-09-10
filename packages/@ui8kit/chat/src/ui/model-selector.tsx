import { Select } from "@ui8kit/form";
import type { ComponentProps } from "react";

export const MODELS = [
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5-high",
] as const;

export type Model = (typeof MODELS)[number];

interface ModelSelectorProps extends Omit<ComponentProps<typeof Select>, "onChange" | "value"> {
  value: Model;
  onChange: (value: Model) => void;
  disabledModels?: Model[];
}

export function ModelSelector({ value, onChange, disabledModels, ...props }: ModelSelectorProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as Model)}
      {...props}
    >
      <option value="" disabled>
        Select model
      </option>
      {MODELS.map((model) => (
        <option
          key={model}
          value={model}
          disabled={disabledModels?.includes(model)}
        >
          {model}
        </option>
      ))}
    </Select>
  );
}


