import { useMemo, useState, useRef, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Stack, Title, Button, Text } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { Sheet } from "@ui8kit/core";
import { allTemplates } from "@/blocks";
import { upsertMeta, getMeta, type BlockMeta } from "@/services/blocksMeta";

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
                <Sheet id={leftId} side="left" size="2xl" title="Preview" showTrigger={false}>
                            <Box overflow="auto" h="screen" p="sm">
                                <div className="relative overflow-hidden bg-background rounded-lg border border-transparent transition-all duration-300 aspect-video group">
                                    {/* Scaled preview content */}
                                    <div className="scroll-preview-content transform origin-top-left overflow-y-auto scrollbar-hide scale-[0.3] w-[500%] h-auto absolute left-[-25%] top-0 scale-2col">
                                        <Suspense fallback={<div className="flex items-center justify-center h-20 bg-muted/50 rounded text-xs text-muted-foreground">Loading...</div>}>
                                            <Component content={{}} {...defaultProps} />
                                        </Suspense>
                                    </div>
                                    {/* Transparent overlay to block interactions */}
                                    <div className="absolute inset-0 z-10 bg-transparent" />
                                </div>

                                <div ref={formAnchorRef} />
                                <Box component="form" h="full" p="md">
                                <Stack gap="md" className="mt-4">
                                    <label className="text-xs text-muted-foreground">Name</label>
                                    <input className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.name} onChange={e => setPayload(prev => ({ ...prev, name: e.target.value }))} />

                                    <label className="text-xs text-muted-foreground">Description</label>
                                    <textarea className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.description} onChange={e => setPayload(prev => ({ ...prev, description: e.target.value }))} />

                                    <label className="text-xs text-muted-foreground">Tags (comma separated)</label>
                                    <input className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.tags.join(", ")} onChange={e => setPayload(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))} />

                                    <label className="text-xs text-muted-foreground">Category</label>
                                    <select className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.category} onChange={e => setPayload(prev => ({ ...prev, category: e.target.value }))}>
                                        {allCategories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>

                                    <label className="text-xs text-muted-foreground">Path</label>
                                    <input className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.path} onChange={e => setPayload(prev => ({ ...prev, path: e.target.value }))} />

                                    <label className="text-xs text-muted-foreground">Imports</label>
                                    <input className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.imports} onChange={e => setPayload(prev => ({ ...prev, imports: e.target.value }))} />

                                    <label className="text-xs text-muted-foreground">Export</label>
                                    <input className="border border-input rounded-md px-2 py-1 bg-transparent" value={payload.export} onChange={e => setPayload(prev => ({ ...prev, export: e.target.value }))} />

                                    <Button variant="default" onClick={save}>Save</Button>
                                </Stack>
                                </Box>
                            </Box>
                </Sheet>
            </TableCell>
        </TableRow>
    );
}


