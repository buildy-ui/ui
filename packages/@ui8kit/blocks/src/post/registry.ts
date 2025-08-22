import { createElement } from "react";
import type { ReactNode } from "react";
import { CenteredPost } from "./CenteredPost";
import { SplitPost } from "./SplitPost";
import { createBlocksRegistry } from "../registry";

// Shared post types
export type PostTypeId = "post.centered" | "post.split";

export type PostVariant = string;

export interface PostBlockNode {
  id?: string;
  type: PostTypeId;
  variant?: PostVariant;
  props?: Record<string, any>;
  slots?: Record<string, PostBlockNode[] | PostBlockNode | undefined>;
}

export interface PostBlockPreset {
  id: string;
  type: PostTypeId;
  variant?: PostVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface PostBlockDefinition {
  type: PostTypeId;
  name: string;
  variants: PostVariant[];
  render: (node: PostBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: PostBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const centeredPostDef: PostBlockDefinition = {
  type: "post.centered",
  name: "Centered Post",
  variants: ["classic", "minimal", "magazine", "featured", "editorial"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(CenteredPost as any, {
      variant: (variant as any) || "classic",
      ...props
    });
  }
};

const splitPostDef: PostBlockDefinition = {
  type: "post.split",
  name: "Split Post",
  variants: ["standard", "author", "media", "sidebar", "hero"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitPost as any, {
      variant: (variant as any) || "standard",
      ...props,
      slots: slots as any
    });
  }
};

export const registerPostBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(centeredPostDef as any);
  registry.register(splitPostDef as any);
  return registry;
};

export const createPostRegistry = () => {
  const r = createBlocksRegistry();
  return registerPostBlocks(r);
};
