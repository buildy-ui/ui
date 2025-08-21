import { createElement } from "react";
import type { ReactNode } from "react";
import { GridFooter } from "./GridFooter";
import { SplitFooter } from "./SplitFooter";
import { createBlocksRegistry } from "../registry";

// Shared footer types
export type FooterTypeId = "footer.grid" | "footer.split";

export type FooterVariant = string;

export interface FooterBlockNode {
  id?: string;
  type: FooterTypeId;
  variant?: FooterVariant;
  props?: Record<string, any>;
  slots?: Record<string, FooterBlockNode[] | FooterBlockNode | undefined>;
}

export interface FooterBlockPreset {
  id: string;
  type: FooterTypeId;
  variant?: FooterVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface FooterBlockDefinition {
  type: FooterTypeId;
  name: string;
  variants: FooterVariant[];
  render: (node: FooterBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: FooterBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridFooterDef: FooterBlockDefinition = {
  type: "footer.grid",
  name: "Grid Footer",
  variants: ["columns", "mega", "compact", "newsletter", "sitemap"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridFooter as any, {
      variant: (variant as any) || "columns",
      ...props
    });
  }
};

const splitFooterDef: FooterBlockDefinition = {
  type: "footer.split",
  name: "Split Footer",
  variants: ["brand", "newsletter", "contact", "social", "minimal"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitFooter as any, {
      variant: (variant as any) || "brand",
      ...props,
      slots: slots as any
    });
  }
};

export const registerFooterBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridFooterDef as any);
  registry.register(splitFooterDef as any);
  return registry;
};

export const createFooterRegistry = () => {
  const r = createBlocksRegistry();
  return registerFooterBlocks(r);
};
