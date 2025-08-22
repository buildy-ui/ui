import { createElement } from "react";
import type { ReactNode } from "react";
import { GridGallery } from "./GridGallery";
import { SplitGallery } from "./SplitGallery";
import { createBlocksRegistry } from "../registry";

// Shared gallery types
export type GalleryTypeId = "gallery.grid" | "gallery.split";

export type GalleryVariant = string;

export interface GalleryBlockNode {
  id?: string;
  type: GalleryTypeId;
  variant?: GalleryVariant;
  props?: Record<string, any>;
  slots?: Record<string, GalleryBlockNode[] | GalleryBlockNode | undefined>;
}

export interface GalleryBlockPreset {
  id: string;
  type: GalleryTypeId;
  variant?: GalleryVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface GalleryBlockDefinition {
  type: GalleryTypeId;
  name: string;
  variants: GalleryVariant[];
  render: (node: GalleryBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: GalleryBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridGalleryDef: GalleryBlockDefinition = {
  type: "gallery.grid",
  name: "Grid Gallery",
  variants: ["grid", "masonry", "carousel", "mosaic", "minimal", "cards", "polaroid", "magazine"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridGallery as any, {
      variant: (variant as any) || "grid",
      ...props
    });
  }
};

const splitGalleryDef: GalleryBlockDefinition = {
  type: "gallery.split",
  name: "Split Gallery",
  variants: ["showcase", "portfolio"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitGallery as any, {
      variant: (variant as any) || "showcase",
      ...props,
      slots: slots as any
    });
  }
};

export const registerGalleryBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridGalleryDef as any);
  registry.register(splitGalleryDef as any);
  return registry;
};

export const createGalleryRegistry = () => {
  const r = createBlocksRegistry();
  return registerGalleryBlocks(r);
};
