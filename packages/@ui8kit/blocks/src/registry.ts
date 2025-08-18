import type { ReactNode } from "react";

// Types
export type BlockTypeId = string;
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

// Default aggregator (empty by default).
// Apps can compose by registering specific domain blocks (e.g., hero, features, cta).
export const createDefaultBlocksRegistry = () => createBlocksRegistry();

