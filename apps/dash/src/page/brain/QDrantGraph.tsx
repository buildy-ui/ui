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
    console.log('GraphLoader: updating graph with', { nodesCount: nodes.length, edgesCount: edges.length, nodes: nodes.slice(0, 3), edges: edges.slice(0, 3) });
    
    const g = sigma.getGraph() as any;
    g.clear();
    const kindColor: Record<string, string> = { component: '#2563eb', tag: '#16a34a', category: '#f59e0b' };
    
    // Add nodes with random initial positions
    for (const n of nodes) {
      if (!g.hasNode(n.id)) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        g.addNode(n.id, {
          label: n.label,
          size: n.kind === 'component' ? 12 : n.kind === 'category' ? 10 : 8,
          color: kindColor[n.kind] ?? '#64748b',
          x,
          y,
        });
      }
    }
    console.log('GraphLoader: added', g.order, 'nodes');
    
    // Add edges
    for (const e of edges) {
      try {
        if (g.hasNode(e.source) && g.hasNode(e.target)) {
          g.addEdgeWithKey(e.id, e.source, e.target, { label: e.kind, size: 1 });
        }
      } catch (err) {
        console.warn('Failed to add edge:', e, err);
      }
    }
    console.log('GraphLoader: added', g.size, 'edges');
    
    // Apply force layout
    try {
      if (g.order > 0) {
        forceAtlas2.assign(g, { 
          iterations: 50, 
          settings: { 
            gravity: 1,
            scalingRatio: 1,
            strongGravityMode: true,
            slowDown: 1
          } 
        });
        console.log('GraphLoader: applied force layout');
      }
    } catch (err) {
      console.warn('Force layout failed:', err);
    }
    
    // Fit camera to graph bounds
    try {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      g.forEachNode((_: any, attrs: any) => {
        if (typeof attrs.x === 'number' && typeof attrs.y === 'number') {
          if (attrs.x < minX) minX = attrs.x;
          if (attrs.x > maxX) maxX = attrs.x;
          if (attrs.y < minY) minY = attrs.y;
          if (attrs.y > maxY) maxY = attrs.y;
        }
      });
      const container = sigma.getContainer() as HTMLElement | null;
      const width = Math.max(1, container?.clientWidth || 1);
      const height = Math.max(1, container?.clientHeight || 1);
      const graphWidth = Math.max(1e-3, maxX - minX);
      const graphHeight = Math.max(1e-3, maxY - minY);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      // Compute zoom ratio so that the graph fits entirely in the container.
      const fitScale = Math.max(graphWidth / width, graphHeight / height);
      const ratio = Math.max(1, fitScale * 1.2);
      const camera = sigma.getCamera() as any;
      if (typeof camera.animatedReset === 'function' && fitScale <= 1) {
        camera.animatedReset({ duration: 0 });
      } else {
        camera.setState({ x: centerX, y: centerY, ratio });
      }
      console.log('GraphLoader: fitted camera', { centerX, centerY, ratio, width, height, graphWidth, graphHeight });
    } catch (err) {
      console.warn('Camera fit failed:', err);
    }
    
    // Refresh sigma to ensure it renders
    try {
      sigma.refresh();
      console.log('GraphLoader: refreshed sigma');
    } catch (err) {
      console.warn('Sigma refresh failed:', err);
    }
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
      console.log('Search results formatted:', { count: formatted.length, first: formatted[0] });
      setRows(formatted);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Build Sigma graph whenever rows change
  useEffect(() => {
    console.log('Building graph from rows:', { rowsCount: rows.length, firstRow: rows[0] });
    const points = rows.map((r) => ({ id: r.id, payload: { category: r.category, tags: r.tags } }));
    console.log('Points for graph builder:', { pointsCount: points.length, firstPoint: points[0] });
    const { nodes, edges } = buildGraphFromPoints(points as any[]);
    console.log('Built graph:', { nodesCount: nodes.length, edgesCount: edges.length });
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
          <div style={{ width: '100%', height: 520, border: '1px solid #ccc' }}>
            {graphNodes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No graph data available. Search for items to populate the graph.
              </div>
            ) : (
              <SigmaContainer 
                style={{ width: '100%', height: '100%', backgroundColor: '#fafafa' }}
                settings={{ 
                  allowInvalidContainer: true,
                  renderLabels: true,
                  defaultNodeType: 'circle',
                  defaultEdgeType: 'line',
                  labelSize: 14,
                  labelColor: { color: '#333' },
                  nodeColor: { color: '#666' },
                  edgeColor: { color: '#999' },
                  minCameraRatio: 0.1,
                  maxCameraRatio: 10,
                }}
              >
                <GraphLoader nodes={graphNodes} edges={graphEdges} />
              </SigmaContainer>
            )}
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


