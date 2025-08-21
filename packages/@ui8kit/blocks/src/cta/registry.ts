import { createElement } from "react";
import type { ReactNode } from "react";
import { CenteredCTA } from "./CenteredCTA";
import { SplitCTA } from "./SplitCTA";
import { createBlocksRegistry } from "../registry";

// Shared CTA types
export type CTATypeId = "cta.centered" | "cta.split";

export type CTAVariant = string;

export interface CTABlockNode {
  id?: string;
  type: CTATypeId;
  variant?: CTAVariant;
  props?: Record<string, any>;
  slots?: Record<string, CTABlockNode[] | CTABlockNode | undefined>;
}

export interface CTABlockPreset {
  id: string;
  type: CTATypeId;
  variant?: CTAVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface CTABlockDefinition {
  type: CTATypeId;
  name: string;
  variants: CTAVariant[];
  render: (node: CTABlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: CTABlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const centeredCTADef: CTABlockDefinition = {
  type: "cta.centered",
  name: "Centered CTA",
  variants: ["simple", "withLogos", "withBackground", "withFeatures", "withStats"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(CenteredCTA as any, {
      variant: (variant as any) || "simple",
      ...props
    });
  },
  presets: []
};

const splitCTADef: CTABlockDefinition = {
  type: "cta.split",
  name: "Split CTA",
  variants: ["withImage", "withBackground", "withStats", "withDevices", "withFeatures"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitCTA as any, {
      variant: (variant as any) || "withImage",
      ...props,
      slots: slots as any
    });
  },
  presets: []
};

export const registerCTABlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(centeredCTADef as any);
  registry.register(splitCTADef as any);
  return registry;
};

export const createCTARegistry = () => {
  const r = createBlocksRegistry();
  return registerCTABlocks(r);
};
