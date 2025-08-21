import { createElement } from "react";
import type { ReactNode } from "react";
import { SplitFeatures } from "./SplitFeatures";
import { GridFeatures } from "./GridFeatures";
import { createBlocksRegistry } from "../registry";

// Shared features types
export type FeaturesTypeId = "features.split" | "features.grid";

export type FeaturesVariant = string;

export interface FeaturesBlockNode {
  id?: string;
  type: FeaturesTypeId;
  variant?: FeaturesVariant;
  props?: Record<string, any>;
  slots?: Record<string, FeaturesBlockNode[] | FeaturesBlockNode | undefined>;
}

export interface FeaturesBlockPreset {
  id: string;
  type: FeaturesTypeId;
  variant?: FeaturesVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface FeaturesBlockDefinition {
  type: FeaturesTypeId;
  name: string;
  variants: FeaturesVariant[];
  render: (node: FeaturesBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: FeaturesBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const splitFeaturesDef: FeaturesBlockDefinition = {
  type: "features.split",
  name: "Split Features",
  variants: ["media", "leftMedia", "features", "analytics", "security", "performance"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitFeatures as any, {
      variant: (variant as any) || "media",
      ...props,
      slots: slots as any
    });
  }
};

const gridFeaturesDef: FeaturesBlockDefinition = {
  type: "features.grid",
  name: "Grid Features",
  variants: ["threeColumns", "threeColumnsIcons", "gridMediaCards", "careerPositions", "careerStats"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridFeatures as any, {
      variant: (variant as any) || "threeColumns",
      ...props
    });
  }
};

export const registerFeaturesBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(splitFeaturesDef as any);
  registry.register(gridFeaturesDef as any);
  return registry;
};

export const createFeaturesRegistry = () => {
  const r = createBlocksRegistry();
  return registerFeaturesBlocks(r);
};


