import { createElement } from "react";
import type { ReactNode } from "react";
import { GridBlog } from "./GridBlog";
import { createBlocksRegistry } from "../registry";
import { SplitBlog } from "./SplitBlog";

// Shared blog types
export type BlogTypeId = "blog.grid" | "blog.split";

export type BlogVariant = string;

export interface BlogBlockNode {
  id?: string;
  type: BlogTypeId;
  variant?: BlogVariant;
  props?: Record<string, any>;
  slots?: Record<string, BlogBlockNode[] | BlogBlockNode | undefined>;
}

export interface BlogBlockPreset {
  id: string;
  type: BlogTypeId;
  variant?: BlogVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface BlogBlockDefinition {
  type: BlogTypeId;
  name: string;
  variants: BlogVariant[];
  render: (node: BlogBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: BlogBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridBlogDef: BlogBlockDefinition = {
  type: "blog.grid",
  name: "Grid Blog",
  variants: ["cards", "postsGrid", "filtered", "compact", "featured"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridBlog as any, {
      variant: (variant as any) || "cards",
      ...props
    });
  },
  presets: []
};

const splitBlogDef: BlogBlockDefinition = {

  type: "blog.split",
  name: "Split Blog",
  variants: ["news", "slider", "featured", "newsletter", "timeline"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitBlog as any, {
      variant: (variant as any) || "news",
      ...props,
      slots: slots as any
    });
  }
};

export const registerBlogBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridBlogDef as any);
  registry.register(splitBlogDef as any);
  return registry;
};

export const createBlogRegistry = () => {
  const r = createBlocksRegistry();
  return registerBlogBlocks(r);
};
