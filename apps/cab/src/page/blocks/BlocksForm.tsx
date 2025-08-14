import { Plus, Loader2 } from "lucide-react";
import { Suspense, memo, useMemo, useRef, useState } from "react";
import { Card, Button, Box, Stack, Text } from "@ui8kit/core";
import { Sheet } from "@ui8kit/core";
import { Input, Textarea, Select, Label } from "@ui8kit/form";
import type { Template } from "@/types";
import { allTemplates } from "@/blocks";
import { upsertMeta, getMeta, type BlockMeta } from "@/services/blocksMeta";

function getTemplateCategoryFromId(templateId: string): string {
  const parts = templateId.match(/[A-Z]+[a-z]*|^[a-z]+/g) || [];
  const token = parts[1] || parts[0] || "";
  return token.toLowerCase();
}

export function BlocksForm() {
  const allCategories = useMemo(
    () => Array.from(new Set((allTemplates as any[]).map(t => getTemplateCategoryFromId(t.id)))).sort(),
    []
  );

  const BlockPreview = memo(({ template }: { template: Template }) => {
    const PreviewComponent = template.component;
    const sheetId = `edit-${template.id}`;
    const category = getTemplateCategoryFromId(template.id);
    const existing = getMeta(category, template.id);
    const [payload, setPayload] = useState<BlockMeta["payload"]>(
      existing?.payload || {
        name: template.name,
        description: template.description,
        tags: [],
        category,
        path: `@/blocks/${template.id}`,
        imports: `import { ${template.id} } from "@/blocks"`,
        export: template.id,
      }
    );
    const formAnchorRef = useRef<HTMLDivElement | null>(null);

    function save() {
      upsertMeta(category, { id: template.id, vector: null, payload });
      const checkbox = document.getElementById(sheetId) as HTMLInputElement | null;
      if (checkbox) checkbox.checked = false;
    }
    
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
          className="absolute top-2 right-2 h-8 w-8 z-10"
          size="icon"
          onClick={() => {
            const el = document.getElementById(sheetId) as HTMLInputElement | null;
            if (el) el.checked = true;
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
        {/* Transparent overlay to block interactions */}
        <div className="absolute inset-0 z-5 bg-transparent" />
        <Sheet id={sheetId} side="right" size="2xl" title="Edit block" showTrigger={false}>
        <Box p="sm" style={{ height: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
          <Box component="form" py="md">
            <Stack gap="md">
              <Text c="muted" size="sm">{template.id}</Text>
              <div ref={formAnchorRef} />
              <Label>Name</Label>
              <Input value={payload.name} onChange={e => setPayload(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))} />

              <Label>Description</Label>
              <Textarea rows={5} value={payload.description} onChange={e => setPayload(prev => ({ ...prev, description: (e.target as HTMLTextAreaElement).value }))} />

              <Label>Tags (comma separated)</Label>
              <Input value={payload.tags.join(", ")} onChange={e => setPayload(prev => ({ ...prev, tags: (e.target as HTMLInputElement).value.split(",").map(t => t.trim()).filter(Boolean) }))} />

              <Label>Category</Label>
              <Select value={payload.category} onChange={e => setPayload(prev => ({ ...prev, category: (e.target as HTMLSelectElement).value }))}>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>

              <Label>Path</Label>
              <Input value={payload.path} onChange={e => setPayload(prev => ({ ...prev, path: (e.target as HTMLInputElement).value }))} />

              <Label>Imports</Label>
              <Input value={payload.imports} onChange={e => setPayload(prev => ({ ...prev, imports: (e.target as HTMLInputElement).value }))} />

              <Label>Export</Label>
              <Input value={payload.export} onChange={e => setPayload(prev => ({ ...prev, export: (e.target as HTMLInputElement).value }))} />

              <Button variant="default" onClick={save}>Save</Button>
            </Stack>
            </Box>
          </Box>
        </Sheet>
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