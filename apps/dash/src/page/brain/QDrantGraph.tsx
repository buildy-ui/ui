import { useEffect, useMemo, useState } from "react";
import { Box, Card, Stack, Title, Text, Button } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { SigmaContainer, useSigma } from "@react-sigma/core";
import '@react-sigma/core/lib/style.css'

import forceAtlas2 from 'graphology-layout-forceatlas2';
import { embedTexts } from "@/services/embeddings";
import { searchTopK, searchWithFilters, pickDisplayFields, listCollections } from "@/services/qdrant";
import { buildGraphFromPoints, type GraphNode, type GraphEdge } from "@/lib/graph-builder";
import { ResizableSheet } from "@/components/ResizableSheet";
import { llmRefineTagsAndCategories } from "@/services/llm";

type Row = ReturnType<typeof pickDisplayFields> & { _score?: number; _collection?: string };

function GraphLoader({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const sigma = useSigma();
  useEffect(() => {
    const g = sigma.getGraph() as any;
    g.clear();
    const kindColor: Record<string, string> = { component: '#2563eb', tag: '#16a34a', category: '#f59e0b' };
    
    // Add nodes with random initial positions
    for (const n of nodes) {
      if (!g.hasNode(n.id)) {
        g.addNode(n.id, {
          label: n.label,
          size: n.kind === 'component' ? 8 : n.kind === 'category' ? 7 : 6,
          color: kindColor[n.kind] ?? '#64748b',
          x: Math.random() * 500,
          y: Math.random() * 500,
        });
      }
    }
    
    // Add edges
    for (const e of edges) {
      try {
        if (g.hasNode(e.source) && g.hasNode(e.target)) {
          g.addEdgeWithKey(e.id, e.source, e.target, { label: e.kind, size: 1 });
        }
      } catch {}
    }
    
    // Apply force layout
    try {
      forceAtlas2.assign(g, { iterations: 100, settings: { gravity: 0.05, scalingRatio: 10 } as any });
    } catch {}
  }, [sigma, nodes, edges]);
  return null;
}

export function QDrantGraph() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [collectionsInput, setCollectionsInput] = useState("components");
  const filterFormId = "qg-filters";
  const [mustTags, setMustTags] = useState<string>("");
  const [shouldTags, setShouldTags] = useState<string>("");
  const [categories, setCategories] = useState<string>("");
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);

  async function runSearch() {
    setError(null);
    setLoading(true);
    try {
      const [v] = await embedTexts([query]);
      const cols = collectionsInput.split(',').map(s => s.trim()).filter(Boolean);
      const found: any[] = [];
      const allCols = cols.length ? cols : await listCollections();
      for (const col of allCols) {
        const pts = await searchTopK(col, v, 20);
        for (const p of pts) found.push({ ...p, _collection: col });
      }
      const formatted = found
        .map((p: any) => ({ ...pickDisplayFields(p), _score: p?.score, _collection: p?._collection }))
        .sort((a: any, b: any) => (b._score ?? 0) - (a._score ?? 0))
        .slice(0, 10);
      setRows(formatted);
      const pointsForGraph = formatted.map((r: any) => ({ id: r.id, payload: { category: r.category, tags: r.tags } }));
      const { nodes, edges } = buildGraphFromPoints(pointsForGraph as any[]);
      setGraphNodes(nodes);
      setGraphEdges(edges);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Build Sigma graph whenever rows change
  useEffect(() => {
    const points = rows.map((r) => ({ id: r.id, payload: { category: r.category, tags: r.tags } }));
    const { nodes, edges } = buildGraphFromPoints(points as any[]);
    setGraphNodes(nodes);
    setGraphEdges(edges);
  }, [rows]);

  const hasRows = useMemo(() => rows.length > 0, [rows]);

  return (
    <Box w="full">
      <Stack gap="lg" align="start">
        <Title size="2xl" c="secondary-foreground" mt="lg">Qdrant Graph</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <Stack gap="sm" align="center">
            <div className="w-full flex items-center gap-2">
              <input className="w-full px-3 py-2 rounded-md border bg-background" placeholder="Ask something…" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button disabled={!query || loading} onClick={runSearch}>{loading ? 'Searching…' : 'Search'}</Button>
              <label htmlFor={filterFormId} className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">Filters</label>
            </div>
          </Stack>
        </Card>
        <ResizableSheet id={filterFormId} title="Graph filters">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-32 text-xs text-muted-foreground">Collections</span>
              <input className="flex-1 px-3 py-2 rounded-md border bg-background" placeholder="components,cta,blog" value={collectionsInput} onChange={(e) => setCollectionsInput(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-32 text-xs text-muted-foreground">Must tags</span>
              <input className="flex-1 px-3 py-2 rounded-md border bg-background" placeholder="layout:stack,element:header" value={mustTags} onChange={(e) => setMustTags(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-32 text-xs text-muted-foreground">Should tags</span>
              <input className="flex-1 px-3 py-2 rounded-md border bg-background" placeholder="variant:simple" value={shouldTags} onChange={(e) => setShouldTags(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-32 text-xs text-muted-foreground">Categories</span>
              <input className="flex-1 px-3 py-2 rounded-md border bg-background" placeholder="hero,cta" value={categories} onChange={(e) => setCategories(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={async () => {
                setError(null);
                setLoading(true);
                try {
                  const cols = collectionsInput.split(',').map(s => s.trim()).filter(Boolean);
                  const must = mustTags.split(',').map(s => s.trim()).filter(Boolean);
                  const should = shouldTags.split(',').map(s => s.trim()).filter(Boolean);
                  const cats = categories.split(',').map(s => s.trim()).filter(Boolean);
                  const found: any[] = [];
                  const allCols = cols.length ? cols : await listCollections();
                  for (const col of allCols) {
                    const pts = await searchWithFilters(col, { category: cats[0], tagsMust: must, tagsShould: should, limit: 100 });
                    for (const p of pts) found.push({ ...p, _collection: col });
                  }
                  const formatted = found.map((p: any) => ({ ...pickDisplayFields(p), _score: undefined, _collection: p?._collection }));
                  setRows(formatted.slice(0, 10));
                } catch (e: any) {
                  setError(e?.message || String(e));
                } finally {
                  setLoading(false);
                }
              }}>Apply filters</Button>
              <Button variant="default" onClick={async () => {
                try {
                  const context = rows.map(r => ({ id: r.id, description: r.description, category: r.category, tags: r.tags }));
                  const refine = await llmRefineTagsAndCategories(context, query);
                  setMustTags(refine.mustTags.join(','));
                  setShouldTags(refine.shouldTags.join(','));
                  setCategories(refine.categories.join(','));
                } catch (e: any) {
                  alert(e?.message || String(e));
                }
              }}>Refine with LLM</Button>
            </div>
          </div>
        </ResizableSheet>
        {error && (
          <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Text c="destructive">{error}</Text>
          </Card>
        )}
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <div style={{ width: '100%', height: 520 }}>
            <SigmaContainer 
              style={{ width: '100%', height: '100%' }}
              settings={{ 
                allowInvalidContainer: true,
                renderLabels: true,
                defaultNodeType: 'circle',
                defaultEdgeType: 'line',
                labelSize: 12,
                labelColor: { color: '#000' },
              }}
            >
              <GraphLoader nodes={graphNodes} edges={graphEdges} />
            </SigmaContainer>
          </div>
        </Card>
        {hasRows && (
          <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, idx) => (
                  <TableRow key={`${r.id}-${idx}`}>
                    <TableCell><Text size="xs" c="muted">{String(r.id ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{String(r.category ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{Array.isArray(r.tags) ? r.tags.join(', ') : String(r.tags ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{String(r.description ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{typeof r._score === 'number' ? r._score.toFixed(3) : '—'}</Text></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </Stack>
    </Box>
  );
}


