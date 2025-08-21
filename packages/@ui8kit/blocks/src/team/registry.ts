import { createElement } from "react";
import type { ReactNode } from "react";
import { GridTeam } from "./GridTeam";
import { SplitTeam } from "./SplitTeam";
import { createBlocksRegistry } from "../registry";

// Shared team types
export type TeamTypeId = "team.grid" | "team.split";

export type TeamVariant = string;

export interface TeamBlockNode {
  id?: string;
  type: TeamTypeId;
  variant?: TeamVariant;
  props?: Record<string, any>;
  slots?: Record<string, TeamBlockNode[] | TeamBlockNode | undefined>;
}

export interface TeamBlockPreset {
  id: string;
  type: TeamTypeId;
  variant?: TeamVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface TeamBlockDefinition {
  type: TeamTypeId;
  name: string;
  variants: TeamVariant[];
  render: (node: TeamBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: TeamBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// ===== Definitions =====

const gridTeamDef: TeamBlockDefinition = {
  type: "team.grid",
  name: "Grid Team",
  variants: ["grid", "cards", "minimal", "showcase", "directory"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridTeam as any, {
      variant: (variant as any) || "grid",
      ...props
    });
  }
};

const splitTeamDef: TeamBlockDefinition = {
  type: "team.split",
  name: "Split Team",
  variants: ["leadership", "showcase", "hiring", "culture", "departments"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitTeam as any, {
      variant: (variant as any) || "leadership",
      ...props,
      slots: slots as any
    });
  }
};

export const registerTeamBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridTeamDef as any);
  registry.register(splitTeamDef as any);
  return registry;
};

export const createTeamRegistry = () => {
  const r = createBlocksRegistry();
  return registerTeamBlocks(r);
};
