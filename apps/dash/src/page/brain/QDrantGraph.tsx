import { useEffect, useMemo, useState } from "react";
import { Box, Card, Stack, Title, Text, Button } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import '@react-sigma/core/lib/style.css'

import { pickDisplayFields, listCollections, getPointsFirstN } from "@/services/qdrant";
import type { GraphNode, GraphEdge } from "@/lib/graph-builder";
import { ResizableSheet } from "@/components/ResizableSheet";
import { agentSearchAndRefine } from "@/services/agent";
import { buildTopologyGraph, buildCosineGraph } from "@/services/graphology";
import { useThemeColors } from "@/hooks/useThemeColors";
import { GraphCanvas } from "@/components/GraphCanvas";

const STORAGE_KEY = 'qdrantGraphRows';

type Row = ReturnType<typeof pickDisplayFields> & { _score?: number; _collection?: string };

export function QDrantGraph() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [collectionsInput, setCollectionsInput] = useState(""); // empty = all collections
  const filterFormId = "qg-filters";
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [mode, setMode] = useState<'topology' | 'cosine'>("topology");
  const [fa2, setFa2] = useState({ gravity: 1, scalingRatio: 1, strongGravityMode: true as boolean, slowDown: 1 });
  const themeColors = useThemeColors();

  // Initial load: show up to 100 points across all collections
  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const cols = await listCollections();
        const found: any[] = [];
        for (const col of cols) {
          if (found.length >= 100) break;
          const pts = await getPointsFirstN(col, 100);
          for (const p of pts) {
            if (found.length >= 100) break;
            found.push({ ...p, _collection: col });
          }
        }
        const formatted = found
          .map((p: any) => ({ ...pickDisplayFields(p), _score: undefined, _collection: p?._collection }))
          .slice(0, 100);
        setRows(formatted);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function saveRowsToStorage(data: Row[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  function handleSaveJson() {
    try {
      const data = { rows };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date();
      const timestamp = ts.toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `qdrant-results-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to save JSON');
    }
  }

  async function runSearch() {
    setError(null);
    setLoading(true);
    try {
      if (!query.trim()) {
        // No-op if query is empty
        return;
      }
      const result = await agentSearchAndRefine(query, 10);
      setRows(result);
      saveRowsToStorage(result);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Build Sigma graph whenever rows or mode change
  useEffect(() => {
    (async () => {
      if (mode === 'topology') {
        const { nodes, edges } = await buildTopologyGraph(rows.map(r => ({ id: r.id as any, category: r.category as any, tags: r.tags as any })));
        setGraphNodes(nodes);
        setGraphEdges(edges);
        return;
      }
      const { nodes, edges } = await buildCosineGraph(rows.map(r => ({ id: r.id as any, _collection: r._collection as any })));
      setGraphNodes(nodes);
      setGraphEdges(edges);
    })();
  }, [rows, mode]);

  const hasRows = useMemo(() => rows.length > 0, [rows]);

  return (
    <Box w="full">
      <Stack gap="lg" align="start">
        <Title size="2xl" c="secondary-foreground" mt="lg">Qdrant Graph</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <input className="w-full px-3 py-2 rounded-md border bg-background" placeholder="Ask something…" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button disabled={!query || loading} onClick={runSearch}>{loading ? 'Searching…' : 'Search'}</Button>
              <label htmlFor={filterFormId} className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">Filters</label>
            </div>
          </div>
        </Card>
        <ResizableSheet id={filterFormId} title="Graph filters">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-32 text-xs text-muted-foreground">Collections</span>
              <input className="flex-1 px-3 py-2 rounded-md border bg-background" placeholder="components,cta,blog (empty = all)" value={collectionsInput} onChange={(e) => setCollectionsInput(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={async () => {
                setError(null);
                setLoading(true);
                try {
                  const cols = collectionsInput.split(',').map(s => s.trim()).filter(Boolean);
                  const allCols = cols.length ? cols : await listCollections();
                  const found: any[] = [];
                  for (const col of allCols) {
                    if (found.length >= 100) break;
                    const pts = await getPointsFirstN(col, 100);
                    for (const p of pts) {
                      if (found.length >= 100) break;
                      found.push({ ...p, _collection: col });
                    }
                  }
                  const formatted = found.map((p: any) => ({ ...pickDisplayFields(p), _score: undefined, _collection: p?._collection }));
                  setRows(formatted);
                  saveRowsToStorage(formatted);
                } catch (e: any) {
                  setError(e?.message || String(e));
                } finally {
                  setLoading(false);
                }
              }}>Apply filters</Button>
            </div>
          </div>
        </ResizableSheet>
        {error && (
          <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Text c="destructive">{error}</Text>
          </Card>
        )}
        <Card p="sm" rounded="md" shadow="sm" bg="card" w="full">
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Gravity</span>
                <input type="number" className="w-20 px-2 py-1 rounded-md border bg-background text-xs" value={fa2.gravity} step={0.1} onChange={(e) => setFa2(v => ({ ...v, gravity: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Scaling</span>
                <input type="number" className="w-20 px-2 py-1 rounded-md border bg-background text-xs" value={fa2.scalingRatio} step={0.1} onChange={(e) => setFa2(v => ({ ...v, scalingRatio: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">SlowDown</span>
                <input type="number" className="w-20 px-2 py-1 rounded-md border bg-background text-xs" value={fa2.slowDown} step={0.1} onChange={(e) => setFa2(v => ({ ...v, slowDown: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={fa2.strongGravityMode} onChange={(e) => setFa2(v => ({ ...v, strongGravityMode: e.target.checked }))} />
                  Strong gravity
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Mode</span>
              <select className="px-2 py-1 rounded-md border bg-background text-sm" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                <option value="topology">Topology</option>
                <option value="cosine">Cosine</option>
              </select>
            </div>
          </div>
        </Card>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <GraphCanvas nodes={graphNodes} edges={graphEdges} mode={mode} fa2={fa2} background={themeColors.background} labelColor={themeColors.foreground} edgeColor={themeColors.border} />
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
            <div className="w-full flex justify-end mt-3">
              <Button variant="outline" onClick={handleSaveJson}>Save JSON</Button>
            </div>
          </Card>
        )}
      </Stack>
    </Box>
  );
}



