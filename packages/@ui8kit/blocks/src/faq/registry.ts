import { createElement } from "react";
import type { ReactNode } from "react";
import { GridFAQ } from "./GridFAQ";
import { SplitFAQ } from "./SplitFAQ";
import { createBlocksRegistry } from "../registry";

// Shared FAQ types
export type FAQTypeId = "faq.grid" | "faq.split";

export type FAQVariant = string;

export interface FAQBlockNode {
  id?: string;
  type: FAQTypeId;
  variant?: FAQVariant;
  props?: Record<string, any>;
  slots?: Record<string, FAQBlockNode[] | FAQBlockNode | undefined>;
}

export interface FAQBlockPreset {
  id: string;
  type: FAQTypeId;
  variant?: FAQVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface FAQBlockDefinition {
  type: FAQTypeId;
  name: string;
  variants: FAQVariant[];
  render: (node: FAQBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: FAQBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridFAQDef: FAQBlockDefinition = {
  type: "faq.grid",
  name: "Centered FAQ",
  variants: ["cards", "accordion", "categories", "compact", "support"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridFAQ as any, {
      variant: (variant as any) || "cards",
      ...props
    });
  },
  presets: []
};

const splitFAQDef: FAQBlockDefinition = {
  type: "faq.split",
  name: "Split FAQ",
  variants: ["contact", "search", "categories", "support", "accordion"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitFAQ as any, {
      variant: (variant as any) || "contact",
      ...props,
      slots: slots as any
    });
  },
  presets: []
};

export const registerFAQBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridFAQDef as any);
  registry.register(splitFAQDef as any);
  return registry;
};

export const createFAQRegistry = () => {
  const r = createBlocksRegistry();
  return registerFAQBlocks(r);
};
