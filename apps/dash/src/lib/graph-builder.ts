export type GraphNode = { id: string; label: string; kind: 'component' | 'tag' | 'category' };
export type GraphEdge = { id: string; source: string; target: string; kind: 'has_tag' | 'has_category' | 'co_tag' };

export function buildGraphFromPoints(points: any[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  function ensureNode(id: string, label: string, kind: GraphNode['kind']) {
    if (!nodesMap.has(id)) nodesMap.set(id, { id, label, kind });
  }

  // Gather co-occurrence counts for tags
  const coCounts = new Map<string, number>();

  for (const p of points) {
    const id = String(p?.id ?? '');
    const payload = p?.payload ?? {};
    const category = payload?.category ?? payload?.qdrant?.category;
    const tags = (payload?.tags ?? payload?.qdrant?.tags ?? []) as string[];

    if (!id) continue;
    ensureNode(id, id, 'component');

    if (category) {
      const catId = `category:${category}`;
      ensureNode(catId, category, 'category');
      const eid = `${id}->${catId}`;
      if (!edgesMap.has(eid)) edgesMap.set(eid, { id: eid, source: id, target: catId, kind: 'has_category' });
    }

    const tagIds = [] as string[];
    for (const t of tags) {
      const tagId = `tag:${t}`;
      tagIds.push(tagId);
      ensureNode(tagId, t, 'tag');
      const eid = `${id}->${tagId}`;
      if (!edgesMap.has(eid)) edgesMap.set(eid, { id: eid, source: id, target: tagId, kind: 'has_tag' });
    }

    // co-occurrence pairs within this component's tags
    for (let i = 0; i < tagIds.length; i++) {
      for (let j = i + 1; j < tagIds.length; j++) {
        const a = tagIds[i];
        const b = tagIds[j];
        const key = a < b ? `${a}|${b}` : `${b}|${a}`;
        coCounts.set(key, (coCounts.get(key) ?? 0) + 1);
      }
    }
  }

  // Optionally add co-tag edges if frequent (threshold 2)
  for (const [key, count] of coCounts) {
    if (count < 2) continue;
    const [a, b] = key.split('|');
    const eid = `${a}<->${b}`;
    if (!edgesMap.has(eid)) edgesMap.set(eid, { id: eid, source: a, target: b, kind: 'co_tag' });
  }

  return { nodes: Array.from(nodesMap.values()), edges: Array.from(edgesMap.values()) };
}


