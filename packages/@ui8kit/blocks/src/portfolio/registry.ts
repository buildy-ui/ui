import { createElement } from "react";
import type { ReactNode } from "react";
import { GridPortfolio } from "./GridPortfolio";
import { SplitPortfolio } from "./SplitPortfolio";
import { createBlocksRegistry } from "../registry";

// Shared portfolio types
export type PortfolioTypeId = "portfolio.grid" | "portfolio.split";

export type PortfolioVariant = string;

export interface PortfolioBlockNode {
  id?: string;
  type: PortfolioTypeId;
  variant?: PortfolioVariant;
  props?: Record<string, any>;
  slots?: Record<string, PortfolioBlockNode[] | PortfolioBlockNode | undefined>;
}

export interface PortfolioBlockPreset {
  id: string;
  type: PortfolioTypeId;
  variant?: PortfolioVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface PortfolioBlockDefinition {
  type: PortfolioTypeId;
  name: string;
  variants: PortfolioVariant[];
  render: (node: PortfolioBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: PortfolioBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridPortfolioDef: PortfolioBlockDefinition = {
  type: "portfolio.grid",
  name: "Grid Portfolio",
  variants: ["cards", "masonry", "minimal", "detailed", "showcase"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridPortfolio as any, {
      variant: (variant as any) || "cards",
      ...props
    });
  }
};

const splitPortfolioDef: PortfolioBlockDefinition = {
  type: "portfolio.split",
  name: "Split Portfolio",
  variants: ["showcase", "about", "skills", "testimonial", "process"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitPortfolio as any, {
      variant: (variant as any) || "showcase",
      ...props,
      slots: slots as any
    });
  }
};

export const registerPortfolioBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridPortfolioDef as any);
  registry.register(splitPortfolioDef as any);
  return registry;
};

export const createPortfolioRegistry = () => {
  const r = createBlocksRegistry();
  return registerPortfolioBlocks(r);
};
