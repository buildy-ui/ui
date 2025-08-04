import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@ui8kit/core";
import { useMemo, useCallback, memo } from "react";
import type { Block } from "@/types";
import { allComponents, allTemplates } from "@/blocks";

interface BuilderCanvasProps {
  blocks: Block[];
  setBlocks: (blocks: Block[] | ((prev: Block[]) => Block[])) => void;
}

// Memoized block component for better performance
const BlockItem = memo(({ block, onRemove }: { block: Block; onRemove: (id: string) => void }) => {
  const BlockComponent = allComponents[block.type as keyof typeof allComponents];
  
  // Get block name from templates
  const getBlockName = useCallback(() => {
    const template = allTemplates.find(t => t.id === block.type);
    return template?.name || block.type;
  }, [block.type]);
  
  const handleRemove = useCallback(() => {
    onRemove(block.id);
  }, [block.id, onRemove]);
  
  if (!BlockComponent) {
    return (
      <div className="group relative bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-2">
        {/* Block Name for unknown blocks */}
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-yellow-600/90 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-medium">{getBlockName()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-yellow-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Unknown Block Type</span>
        </div>
        <p className="text-sm text-yellow-600 mt-1">
          Block type "{block.type}" is not recognized
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          onClick={handleRemove}
        >
          Remove Block
        </Button>
      </div>
    );
  }
  
  return (
    <div className="group relative transition-all duration-200">
      {/* Block Name - Top Left */}
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-sm font-medium">{getBlockName()}</span>
        </div>
      </div>

      {/* Block Controls - Top Right */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-white hover:text-red-300 hover:bg-red-500/20"
            onClick={handleRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Block Content */}
      <div className="relative">
        <BlockComponent />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-400 group-hover:bg-red-500/5 transition-all duration-200 pointer-events-none rounded-lg" />
    </div>
  );
});

export default function BuilderCanvas({ blocks, setBlocks }: BuilderCanvasProps) {
  // Sort blocks by order
  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => a.order - b.order);
  }, [blocks]);

  const removeBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  }, [setBlocks]);

  const EmptyState = () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/10">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/50 to-primary/10 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Start Building</h3>
        <p className="text-muted-foreground mb-6">
          Drag blocks from the sidebar to create your page
        </p>
        <div className="text-sm text-muted-foreground">
          Choose from available blocks to get started
        </div>
      </div>
    </div>
  );

  if (sortedBlocks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-muted/10">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {sortedBlocks.map((block) => (
            <BlockItem 
              key={block.id} 
              block={block} 
              onRemove={removeBlock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}