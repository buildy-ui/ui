import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ui8kit/form";
import { cn } from "@ui8kit/core";
import { useState, useRef, useEffect } from "react";

export const MODELS = [
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5-high",
  // OpenRouter namespaced examples (kept for compatibility if user passes fully-qualified names)
  "x-ai/grok-code-fast-1",
] as const;

export type Model = (typeof MODELS)[number];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabledModels?: string[];
  models?: readonly string[];
  className?: string;
  position?: 'top' | 'bottom';
}

export function ModelSelector({ value, onChange, disabledModels, models, className, position = 'bottom' }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const options = models && models.length > 0 ? models : MODELS;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleTriggerClick = () => {
    setOpen(!open);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SelectTrigger onClick={handleTriggerClick} className="w-full">
        <SelectValue placeholder="Select model" value={value} />
      </SelectTrigger>
      {open && (
        <SelectContent
          position={position}
          className={cn(
            "p-2",
          )}
        >
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
              className={cn(disabledModels?.includes(model) ? "opacity-50 cursor-not-allowed pointer-events-none" : "")}
            >
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </div>
  );
}


