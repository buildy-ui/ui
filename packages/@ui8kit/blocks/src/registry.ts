import type { ReactNode } from "react";
import { createElement } from "react";
import { SplitHero } from "./hero/SplitHero";
import { GridFeatures } from "./features/GridFeatures";

// Types
export type BlockTypeId = "hero.split" | "features.grid";
export type BlockVariant = string;

export interface BlockNode {
  id?: string;
  type: BlockTypeId;
  variant?: BlockVariant;
  props?: Record<string, any>;
  slots?: Record<string, BlockNode[] | BlockNode | undefined>;
}

export interface BlockPreset {
  id: string;
  type: BlockTypeId;
  variant?: BlockVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
}

export interface BlockDefinition {
  type: BlockTypeId;
  name: string;
  variants: BlockVariant[];
  render: (node: BlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: BlockPreset[];
}

export interface BlocksRegistry {
  register: (definition: BlockDefinition) => void;
  get: (type: BlockTypeId) => BlockDefinition | undefined;
  list: () => BlockDefinition[];
  findPreset: (presetId: string) => BlockPreset | undefined;
  listPresets: (type?: BlockTypeId) => BlockPreset[];
}

export const createBlocksRegistry = (): BlocksRegistry & { renderNode: (node: BlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode | null } => {
  const defs = new Map<BlockTypeId, BlockDefinition>();
  const presets = new Map<string, BlockPreset>();

  return {
    register(def) {
      defs.set(def.type, def);
      def.presets?.forEach((p) => presets.set(p.id, p));
    },
    get(type) {
      return defs.get(type);
    },
    list() {
      return Array.from(defs.values());
    },
    findPreset(presetId) {
      return presets.get(presetId);
    },
    listPresets(type) {
      const all = Array.from(presets.values());
      return type ? all.filter((p) => p.type === type) : all;
    },
    renderNode(node, renderedSlots) {
      const def = defs.get(node.type);
      if (!def) return null;
      return def.render(node, renderedSlots);
    }
  };
};

// Default definitions and presets (pilot)

const heroSplitPresets: BlockPreset[] = [
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
    }
  }
];

const featuresGridPresets: BlockPreset[] = [
  {
    id: "preset:features.grid:gridMediaCards:solutions",
    type: "features.grid",
    variant: "gridMediaCards",
    name: "Solutions Media Cards",
    description: "Grid of solution cards with media",
    props: {
      content: {
        badge: "Solutions",
        title: "Comprehensive solutions for every need",
        description:
          "Discover our range of specialized solutions designed to address specific business challenges and drive growth.",
        items: [
          {
            id: "1",
            title: "E-commerce Platform",
            description:
              "Complete e-commerce solution with payment processing, inventory management, and customer analytics.",
            image: {
              src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              alt: "E-commerce platform"
            }
          },
          {
            id: "2",
            title: "Data Analytics Suite",
            description:
              "Advanced analytics tools for data visualization, reporting, and business intelligence insights.",
            image: {
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              alt: "Data analytics dashboard"
            }
          },
          {
            id: "3",
            title: "Team Collaboration",
            description: "Streamline team communication and project management with our collaboration tools.",
            image: {
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              alt: "Team collaboration"
            }
          }
        ]
      },
      useContainer: true
    }
  }
];

const heroSplitDef: BlockDefinition = {
  type: "hero.split",
  name: "Split Hero",
  variants: ["media", "gallery", "withTopButton", "leftMedia", "security"],
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitHero as any, {
      variant: (variant as any) || "media",
      ...props,
      slots: slots as any
    });
  },
  presets: heroSplitPresets
};

const featuresGridDef: BlockDefinition = {
  type: "features.grid",
  name: "Grid Features",
  variants: ["threeColumns", "threeColumnsIcons", "gridMediaCards", "careerPositions", "careerStats"],
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridFeatures as any, {
      variant: (variant as any) || "threeColumns",
      ...props
    });
  },
  presets: featuresGridPresets
};

export const createDefaultBlocksRegistry = () => {
  const registry = createBlocksRegistry();
  registry.register(heroSplitDef);
  registry.register(featuresGridDef);
  return registry;
};


