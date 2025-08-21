import { createElement } from "react";
import type { ReactNode } from "react";
import { GridBusiness } from "./GridBusiness";
import { SplitBusiness } from "./SplitBusiness";
import { createBlocksRegistry } from "../registry";

// Shared business types
export type BusinessTypeId = "business.grid" | "business.split";

export type BusinessVariant = string;

export interface BusinessBlockNode {
  id?: string;
  type: BusinessTypeId;
  variant?: BusinessVariant;
  props?: Record<string, any>;
  slots?: Record<string, BusinessBlockNode[] | BusinessBlockNode | undefined>;
}

export interface BusinessBlockPreset {
  id: string;
  type: BusinessTypeId;
  variant?: BusinessVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface BusinessBlockDefinition {
  type: BusinessTypeId;
  name: string;
  variants: BusinessVariant[];
  render: (node: BusinessBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: BusinessBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridBusinessDef: BusinessBlockDefinition = {
  type: "business.grid",
  name: "Grid Business",
  variants: ["cardsGallery", "solutionsGrid", "pricing", "pricingYear", "career"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridBusiness as any, {
      variant: (variant as any) || "cardsGallery",
      ...props
    });
  },
  presets: []
};

const splitBusinessDef: BusinessBlockDefinition = {
  type: "business.split",
  name: "Split Business",
  variants: ["solutions", "metrics", "testimonials", "features", "about"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitBusiness as any, {
      variant: (variant as any) || "solutions",
      ...props,
      slots: slots as any
    });
  },
  presets: []
};

export const registerBusinessBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridBusinessDef as any);
  registry.register(splitBusinessDef as any);
  return registry;
};

export const createBusinessRegistry = () => {
  const r = createBlocksRegistry();
  return registerBusinessBlocks(r);
};
