import { useEffect, useMemo, useState } from "react";
import { Box, Card, Stack, Title, Text, Button } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import '@react-sigma/core/lib/style.css'

import { pickDisplayFields, listCollections, getPointsFirstN, searchTopK } from "@/services/qdrant";
import type { GraphNode, GraphEdge } from "@/lib/graph-builder";
import { ResizableSheet } from "@/components/ResizableSheet";
import { getTopologyGraph, getCosineGraph } from "@/services/graphology";
import { useThemeColors } from "@/hooks/useThemeColors";
import { GraphCanvas } from "@/components/GraphCanvas";
import { ChatSheet } from "@/components/ChatSheet";
import { embedTexts } from "@/services/embeddings";
import { exportSession, logSearchQuery } from "@/services/sessionLog";

const STORAGE_KEY = 'qdrantGraphRows';
const LAST_QUERY_KEY = 'qdrantGraphLastQuery';

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
  const themeColors = useThemeColors();
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [showTags, setShowTags] = useState<boolean>(true);

  const defaultFA2 = { gravity: 1, scalingRatio: 1, strongGravityMode: true as boolean, slowDown: 1 };

  // Initial load: try vector search using last saved query; otherwise show up to 100 points across all collections
  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const lastQuery = (typeof window !== 'undefined' ? window.localStorage.getItem(LAST_QUERY_KEY) : null) || '';
        if (lastQuery && lastQuery.trim()) {
          setQuery(lastQuery);
          const [v] = await embedTexts([lastQuery]);
          const cols = await listCollections();
          const found: any[] = [];
          for (const col of cols) {
            const pts = await searchTopK(col, v, 20);
            for (const p of pts) found.push({ ...p, _collection: col });
          }
          const formatted = found
            .map((p: any) => ({ ...pickDisplayFields(p), _score: p?.score, _collection: p?._collection }))
            .sort((a: any, b: any) => (b._score ?? 0) - (a._score ?? 0))
            .slice(0, 10);
          setRows(formatted);
          saveRowsToStorage(formatted);
          return;
        }
        // Fallback: no last query — show initial sample without scores
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

  function hasData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return true;
    }
    return false;
  }

  async function runSearch() {
    setError(null);
    setLoading(true);
    try {
      if (!query.trim()) {
        // No-op if query is empty
        return;
      }
      const [v] = await embedTexts([query]);
      const cols = await listCollections();
      const found: any[] = [];
      for (const col of cols) {
        const pts = await searchTopK(col, v, 20);
        for (const p of pts) found.push({ ...p, _collection: col });
      }
      const formatted = found
        .map((p: any) => ({ ...pickDisplayFields(p), _score: p?.score, _collection: p?._collection }))
        .sort((a: any, b: any) => (b._score ?? 0) - (a._score ?? 0))
        .slice(0, 10);
      setRows(formatted);
      saveRowsToStorage(formatted);
      try { localStorage.setItem(LAST_QUERY_KEY, query); } catch {}
      logSearchQuery(query, formatted.map((r: any) => String(r.id)));
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleSaveJson() {
    try {
      const data = { rows: displayRows, query, lastQuery: (typeof window !== 'undefined' ? window.localStorage.getItem(LAST_QUERY_KEY) : null), session: exportSession() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date();
      const timestamp = ts.toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `qdrant-session-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to save JSON');
    }
  }

  // Build Sigma graph whenever rows or toggles change
  useEffect(() => {
    (async () => {
      const togglesOff = !showCategories && !showTags;
      if (!togglesOff) {
        const { nodes, edges } = await getTopologyGraph(rows.map(r => ({ id: r.id as any, category: r.category as any, tags: r.tags as any })));
        const filteredEdges = edges.filter((e) => {
          if (e.kind === 'has_category' && !showCategories) return false;
          if ((e.kind === 'has_tag' || e.kind === 'co_tag') && !showTags) return false;
          return true;
        });
        const connectedIds = new Set<string>();
        for (const e of filteredEdges) { connectedIds.add(e.source); connectedIds.add(e.target); }
        const filteredNodes = nodes.filter((n) => {
          if (n.kind === 'component') return true;
          if (n.kind === 'tag') return showTags && connectedIds.has(n.id);
          if (n.kind === 'category') return showCategories && connectedIds.has(n.id);
          return false;
        });
        setGraphNodes(filteredNodes);
        setGraphEdges(filteredEdges);
        return;
      }
      const { nodes, edges } = await getCosineGraph(rows.map(r => ({ id: r.id as any, _collection: r._collection as any })));
      setGraphNodes(nodes);
      setGraphEdges(edges);
    })();
  }, [rows, showCategories, showTags]);

  const derivedMode: 'topology' | 'cosine' = (!showCategories && !showTags) ? 'cosine' : 'topology';
  const displayRows = useMemo(() => {
    if (rows.length === 0) return rows;
    if (derivedMode === 'cosine') {
      const withScore = rows.map((r: any) => ({ ...r }));
      withScore.sort((a: any, b: any) => (b._score ?? -Infinity) - (a._score ?? -Infinity));
      return withScore;
    }
    return rows;
  }, [derivedMode, rows]);

  return (
    <Box w="full" mb="2xl">
      <Stack gap="md" align="start">
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
        {hasData() && (
        <Box w="full" justify="center" align="center" py="md" className="flex">
          <label htmlFor="chat-review" className="outline-button">Review & Improve</label>
        </Box>
        )}
        <ChatSheet id="chat-review" title="Review & Improve" query={query} items={rows.slice(0, 10).map(r => ({ id: String(r.id), description: r.description, category: r.category, tags: r.tags }))} />
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
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={showCategories} onChange={(e) => setShowCategories(e.target.checked)} />
                Categories
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={showTags} onChange={(e) => setShowTags(e.target.checked)} />
                Labels (tags)
              </label>
            </div>
          </div>
        </Card>
        <Card p="none" rounded="md" shadow="lg" w="full">
          <GraphCanvas nodes={graphNodes} edges={graphEdges} mode={derivedMode} fa2={defaultFA2} background={themeColors.background} labelColor={themeColors.foreground} edgeColor={themeColors.border} />
        </Card>
        {displayRows.length > 0 && (
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
                {displayRows.map((r, idx) => (
                  <TableRow key={`${r.id}-${idx}`}>
                    <TableCell><Text size="xs" c="muted">{String(r.id ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{String((r as any).category ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{Array.isArray((r as any).tags) ? (r as any).tags.join(', ') : String((r as any).tags ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{String((r as any).description ?? '—')}</Text></TableCell>
                    <TableCell><Text size="xs" c="muted">{(() => { const s = (r as any)._score; return typeof s === 'number' ? s.toFixed(3) : '—'; })()}</Text></TableCell>
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



