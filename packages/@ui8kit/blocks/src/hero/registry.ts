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

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register hero definitions via helpers below.

// ===== Presets (kept close to hero code) =====

const splitHeroPresets: HeroBlockPreset[] = [
  {
    id: "preset:hero.split:gallery:funding",
    type: "hero.split",
    variant: "gallery",
    name: "Funding Announcement",
    description: "Hero with top button and gallery",
    props: {
      content: {
        topButton: { text: "🎉 Announcing our Series A funding", href: "#" },
        badge: "Funding News",
        title: "We raised $50M to accelerate innovation",
        description:
          "With this new funding, we're doubling down on our mission to democratize technology and make powerful tools accessible to everyone.",
        images: [
          { id: "1", src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Portfolio showcase 1" },
          { id: "2", src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Portfolio showcase 2" },
          { id: "3", src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Portfolio showcase 3" }
        ],
        primaryButtonText: "Read Announcement",
        secondaryButtonText: "Join Journey"
      },
      useContainer: true,
      className: "bg-gradient-to-br from-primary/10 to-secondary/10"
    },
    version: 1
  }
];

const centeredHeroPresets: HeroBlockPreset[] = [
  {
    id: "preset:hero.centered:simple:launch",
    type: "hero.centered",
    variant: "simple",
    name: "Product Launch",
    description: "Simple centered hero with actions",
    props: {
      content: {
        badge: "New",
        title: "Appy Launch your next big thing",
        description: "Build with confidence using a modern, composable UI kit.",
        primaryButtonText: "Get Started",
        secondaryButtonText: "Learn More"
      },
      useContainer: true
    },
    version: 1
  }
];

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
  },
  presets: splitHeroPresets
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
  },
  presets: centeredHeroPresets
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


