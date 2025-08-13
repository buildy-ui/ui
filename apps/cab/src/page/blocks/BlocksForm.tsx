import { Plus, Loader2 } from "lucide-react";
import { Suspense, memo } from "react";
import { Card, Button } from "@ui8kit/core";
import type { Template } from "@/types";
import { allTemplates } from "@/blocks";

export function BlocksForm() {

  const BlockPreview = memo(({ template }: { template: Template }) => {
    const PreviewComponent = template.component;
    
    // Debug: log undefined components
    if (!PreviewComponent) {
      console.error('❌ Undefined component for template:', template.id, template);
      console.log('Template keys:', Object.keys(template));
      console.log('Component type:', typeof template.component);
      return (
        <div className="p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 text-sm">❌ Component not found</p>
          <p className="text-red-600 text-xs">{template.id}</p>
        </div>
      );
    }
    
    return (
      <div className="relative overflow-hidden bg-background rounded-lg border border-transparent hover:border-accent transition-all duration-300 group">
          <Suspense fallback={
            <div className="flex items-center justify-center h-20 bg-muted/50 rounded">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          }>
            <PreviewComponent 
              content={{}}
              {...template?.defaultProps}
            />
          </Suspense>
        
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 text-white pointer-events-none">
          <h4 className="font-semibold text-sm">{template.name}</h4>
          <p className="text-xs opacity-90">{template.description}</p>
        </div>
        <Button
          className="absolute top-2 right-2 h-8 w-8"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  });

  return (
    <div className="w-full h-full bg-card flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Blocks</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {allTemplates.map((template: Template) => (
            <Card key={template.id} className="p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
              <BlockPreview template={template} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}