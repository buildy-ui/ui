import type { ReactNode } from "react";
import { Fragment } from "react";
import type { BlockNode, BlocksRegistry } from "../registry/types";

export interface BlockTreeRendererProps {
  registry: BlocksRegistry;
  tree: BlockNode[];
}

const renderNodeWithSlots = (registry: BlocksRegistry, node: BlockNode): ReactNode => {
  const renderedSlots: Record<string, ReactNode> = {};

  if (node.slots) {
    for (const [slotName, value] of Object.entries(node.slots)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        renderedSlots[slotName] = (
          <>
            {value.map((child, idx) => (
              <Fragment key={child.id || `${slotName}-${idx}`}>
                {renderNodeWithSlots(registry, child) as any}
              </Fragment>
            ))}
          </>
        );
      } else {
        renderedSlots[slotName] = <>{renderNodeWithSlots(registry, value) as any}</>;
      }
    }
  }

  // We need to invoke the specific block's render with renderedSlots
  const def = registry.get(node.type as any);
  if (!def) return null;
  return def.render(node, renderedSlots);
};

export const BlockTreeRenderer = ({ registry, tree }: BlockTreeRendererProps) => {
  return (
    <>
      {tree.map((node, index) => (
        <Fragment key={node.id || `node-${index}`}>
          {renderNodeWithSlots(registry, node) as any}
        </Fragment>
      ))}
    </>
  );
};

BlockTreeRenderer.displayName = "BlockTreeRenderer";


