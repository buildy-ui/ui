import { createElement } from "react";
import type { ReactNode } from "react";
import { GridTestimonial } from "./GridTestimonial";
import { SplitTestimonial } from "./SplitTestimonial";
import { createBlocksRegistry } from "../registry";

// Shared testimonial types
export type TestimonialTypeId = "testimonial.grid" | "testimonial.split";

export type TestimonialVariant = string;

export interface TestimonialBlockNode {
  id?: string;
  type: TestimonialTypeId;
  variant?: TestimonialVariant;
  props?: Record<string, any>;
  slots?: Record<string, TestimonialBlockNode[] | TestimonialBlockNode | undefined>;
}

export interface TestimonialBlockPreset {
  id: string;
  type: TestimonialTypeId;
  variant?: TestimonialVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface TestimonialBlockDefinition {
  type: TestimonialTypeId;
  name: string;
  variants: TestimonialVariant[];
  render: (node: TestimonialBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: TestimonialBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridTestimonialDef: TestimonialBlockDefinition = {
  type: "testimonial.grid",
  name: "Grid Testimonial",
  variants: ["grid", "masonry", "minimal", "cards", "compact", "slider", "magazine"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridTestimonial as any, {
      variant: (variant as any) || "grid",
      ...props
    });
  }
};

const splitTestimonialDef: TestimonialBlockDefinition = {
  type: "testimonial.split",
  name: "Split Testimonial",
  variants: ["featured", "carousel", "stats"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitTestimonial as any, {
      variant: (variant as any) || "featured",
      ...props,
      slots: slots as any
    });
  }
};

export const registerTestimonialBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridTestimonialDef as any);
  registry.register(splitTestimonialDef as any);
  return registry;
};

export const createTestimonialRegistry = () => {
  const r = createBlocksRegistry();
  return registerTestimonialBlocks(r);
};
