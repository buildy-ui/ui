import { useMemo, useState, useRef, Suspense, type Dispatch, type SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Stack, Title, Button, Text } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { Sheet } from "@ui8kit/core";
import { allTemplates } from "@/blocks";
import { upsertMeta, getMeta, type BlockMeta } from "@/services/blocksMeta";
import { Input, Textarea, Select, Label } from "@ui8kit/form";

function getTemplateCategoryFromId(templateId: string): string {
    const parts = templateId.match(/[A-Z]+[a-z]*|^[a-z]+/g) || [];
    // Heuristic: the second token is the category (e.g., grid | Blog | Cards)
    const token = parts[1] || parts[0] || "";
    return token.toLowerCase();
}

const allCategories = Array.from(
    new Set((allTemplates as any[]).map(t => getTemplateCategoryFromId(t.id)))
).sort();

export function BlocksCategory() {
    const { category = allCategories[0] || "" } = useParams();
    const templates = useMemo(() => allTemplates.filter(t => getTemplateCategoryFromId(t.id) === category), [category]);

    return (
        <Box w="full">
            <Stack gap="lg" align="start">
                <Title size="2xl" c="secondary-foreground" mt="lg">Blocks: {category}</Title>
                <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.map((t) => (
                                <Row key={t.id} category={category} templateId={t.id} name={t.name} description={t.description} Component={t.component} defaultProps={(t as any).defaultProps} />
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Stack>
        </Box>
    );
}

function Row({ category, templateId, name, description, Component, defaultProps }: { category: string; templateId: string; name: string; description: string; Component: any; defaultProps?: Record<string, any> }) {
    const leftId = `preview-${templateId}`;
    const existing = getMeta(category, templateId);
    const [payload, setPayload] = useState<BlockMeta["payload"]>(
        existing?.payload || {
            name,
            description,
            tags: [],
            category,
            path: `@/blocks/${templateId}`,
            imports: `import { ${templateId} } from "@/blocks"`,
            export: templateId,
        }
    );
    const formAnchorRef = useRef<HTMLDivElement | null>(null);

    function save() {
        upsertMeta(category, { id: templateId, vector: null, payload });
    }

    return (
        <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>
                <Text size="xs" c="muted">{description}</Text>
            </TableCell>
            <TableCell title={(getMeta(category, templateId)?.payload.tags || []).join(", ") || undefined}>
                <div className="max-w-[100px] truncate text-xs text-muted-foreground">
                    {(getMeta(category, templateId)?.payload.tags || []).join(", ") || "—"}
                </div>
            </TableCell>
            <TableCell>
                <label htmlFor={leftId} className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">Preview</label>
                <SheetForm Component={Component} defaultProps={defaultProps} payload={payload} setPayload={setPayload} leftId={leftId} formAnchorRef={formAnchorRef} save={save} />
            </TableCell>
        </TableRow>
    );
}

function SheetForm({ Component, defaultProps, payload, setPayload, leftId, formAnchorRef, save }: { Component: any; defaultProps: Record<string, any> | undefined; payload: BlockMeta["payload"]; setPayload: Dispatch<SetStateAction<BlockMeta["payload"]>>; leftId: string; formAnchorRef: React.RefObject<HTMLDivElement | null>; save: () => void }) {
    return (
        <Sheet id={leftId} side="left" size="xl" title="Preview" showTrigger={false}>
        <Box overflow="auto" h="screen" p="sm">
        <div className="relative overflow-hidden bg-background rounded-lg border border-transparent hover:border-accent transition-all duration-300 aspect-video group">
  <div className="transform scale-[0.25] origin-top-left min-w-[400%] min-h-[400%] overflow-hidden">
    <Suspense fallback={<div className="flex items-center justify-center h-20 bg-muted/50 rounded text-xs text-muted-foreground">Loading...</div>}>
      <Component content={{}} {...defaultProps} />
    </Suspense>
  </div>
  <div className="absolute inset-0 z-10 bg-transparent" />
</div>
            <div ref={formAnchorRef} />
            <Box component="form" h="full" p="md">
            <Stack gap="md" className="mt-4">
                <Label>Name</Label>
                <Input value={payload.name} onChange={e => setPayload((prev) => ({ ...prev, name: (e.target as HTMLInputElement).value }))} />

                <Label>Description</Label>
                <Textarea value={payload.description} onChange={e => setPayload((prev) => ({ ...prev, description: (e.target as HTMLTextAreaElement).value }))} />

                <Label>Tags (comma separated)</Label>
                <Input value={payload.tags.join(", ")} onChange={e => setPayload((prev) => ({ ...prev, tags: (e.target as HTMLInputElement).value.split(",").map(t => t.trim()).filter(Boolean) }))} />

                <Label>Category</Label>
                <Select value={payload.category} onChange={e => setPayload((prev) => ({ ...prev, category: (e.target as HTMLSelectElement).value }))}>
                    {allCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </Select>

                <Label>Path</Label>
                <Input value={payload.path} onChange={e => setPayload((prev) => ({ ...prev, path: (e.target as HTMLInputElement).value }))} />

                <Label>Imports</Label>
                <Input value={payload.imports} onChange={e => setPayload((prev) => ({ ...prev, imports: (e.target as HTMLInputElement).value }))} />

                <Label>Export</Label>
                <Input value={payload.export} onChange={e => setPayload((prev) => ({ ...prev, export: (e.target as HTMLInputElement).value }))} />

                <Button variant="default" onClick={save}>Save</Button>
            </Stack>
            </Box>
        </Box>
</Sheet>
    );
}
