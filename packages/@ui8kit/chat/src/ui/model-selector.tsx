import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ui8kit/form";
import type { ComponentProps } from "react";
import { useState } from "react";

export const MODELS = [
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5-high",
  // OpenRouter namespaced examples (kept for compatibility if user passes fully-qualified names)
  "openai/gpt-5-mini",
] as const;

export type Model = (typeof MODELS)[number];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabledModels?: string[];
  models?: readonly string[];
  className?: string;
}

export function ModelSelector({ value, onChange, disabledModels, models, className }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const options = models && models.length > 0 ? models : MODELS;

  return (
    <div className={`relative ${className}`}>
      <SelectTrigger onClick={() => setOpen(!open)} className="w-full">
        <SelectValue placeholder="Select model" value={value} />
      </SelectTrigger>
      {open && (
        <SelectContent className="border-input z-50 mt-1 w-full min-w-40 rounded-md border bg-background p-2 shadow-md absolute">
          {options.map((model) => (
            <SelectItem
              key={model}
              value={model}
              onClick={() => {
                if (!disabledModels?.includes(model)) {
                  onChange(model);
                  setOpen(false);
                }
              }}
              className={disabledModels?.includes(model) ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
            >
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </div>
  );
}


