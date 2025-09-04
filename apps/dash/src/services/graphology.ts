import { buildGraphFromPoints, type GraphNode, type GraphEdge } from '@/lib/graph-builder';
import { recommendByOriginalIds } from '@/services/qdrant';

export type SimplePoint = { id: string; payload?: { category?: string; tags?: string[] } };

export async function buildTopologyGraph(rows: Array<{ id: string; category?: string; tags?: string[] }>): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const points: SimplePoint[] = rows.map(r => ({ id: String(r.id), payload: { category: r.category, tags: r.tags } }));
  return buildGraphFromPoints(points as any[]);
}

export async function buildCosineGraph(rows: Array<{ id: string; _collection?: string }>): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const nodeIds = new Set(rows.map(r => String(r.id)));
  const nodes: GraphNode[] = Array.from(nodeIds).map(id => ({ id, label: id, kind: 'component' }));
  const edgeMap = new Map<string, { a: string; b: string; w: number }>();
  const byCollection: Record<string, string[]> = {};
  for (const r of rows) {
    const col = String(r._collection || '');
    if (!byCollection[col]) byCollection[col] = [];
    byCollection[col].push(String(r.id));
  }
  for (const col of Object.keys(byCollection)) {
    const seeds = byCollection[col].slice(0, 20);
    try {
      const recs = await recommendByOriginalIds(col, seeds, 10);
      for (const rec of recs) {
        const from = String(rec?.payload?.originalId ?? rec?.id);
        const toCandidates = seeds;
        for (const to of toCandidates) {
          if (!nodeIds.has(from) || !nodeIds.has(to) || from === to) continue;
          const a = from < to ? from : to;
          const b = from < to ? to : from;
          const key = `${a}|${b}`;
          const w = typeof rec?.score === 'number' ? rec.score : 1;
          const prev = edgeMap.get(key);
          if (!prev || w > prev.w) edgeMap.set(key, { a, b, w });
        }
      }
    } catch {}
  }
  const edges: GraphEdge[] = Array.from(edgeMap.values()).map(e => ({ id: `${e.a}<~>${e.b}`, source: e.a, target: e.b, kind: 'cosine', weight: e.w }));
  return { nodes, edges };
}


