import { createElement } from "react";
import type { ReactNode } from "react";
import { SplitHero } from "./SplitHero";
import { CenteredHero } from "./CenteredHero";
import { createBlocksRegistry } from "../registry";

// Shared hero types
export type HeroTypeId = "hero.split" | "hero.centered";

export type HeroVariant = string;

export interface HeroBlockNode {
  id?: string;
  type: HeroTypeId;
  variant?: HeroVariant;
  props?: Record<string, any>;
  slots?: Record<string, HeroBlockNode[] | HeroBlockNode | undefined>;
}

export interface HeroBlockPreset {
  id: string;
  type: HeroTypeId;
  variant?: HeroVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface HeroBlockDefinition {
  type: HeroTypeId;
  name: string;
  variants: HeroVariant[];
  render: (node: HeroBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: HeroBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const splitHeroDef: HeroBlockDefinition = {
  type: "hero.split",
  name: "Split Hero",
  variants: ["media", "gallery", "withTopButton", "leftMedia", "security"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitHero as any, {
      variant: (variant as any) || "media",
      ...props,
      slots: slots as any
    });
  }
};

const centeredHeroDef: HeroBlockDefinition = {
  type: "hero.centered",
  name: "Centered Hero",
  variants: ["simple", "withTopButton", "withImage", "withStats"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(CenteredHero as any, {
      variant: (variant as any) || "simple",
      ...props
    });
  }
};

export const registerHeroBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(splitHeroDef as any);
  registry.register(centeredHeroDef as any);
  return registry;
};

export const createHeroRegistry = () => {
  const r = createBlocksRegistry();
  return registerHeroBlocks(r);
};


