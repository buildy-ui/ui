import { SigmaContainer, useSigma } from '@react-sigma/core';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { useEffect } from 'react';
import type { GraphNode, GraphEdge } from '@/lib/graph-builder';

function GraphLoader({ nodes, edges, mode, fa2, edgeBaseColor }: { nodes: GraphNode[]; edges: GraphEdge[]; mode: 'topology' | 'cosine'; fa2: { gravity: number; scalingRatio: number; strongGravityMode: boolean; slowDown: number }; edgeBaseColor: string }) {
  const sigma = useSigma();
  useEffect(() => {
    const g = sigma.getGraph() as any;
    g.clear();
    const kindColor: Record<string, string> = { component: '#2563eb', tag: '#16a34a', category: '#f59e0b' };

    for (const n of nodes) {
      if (!g.hasNode(n.id)) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        g.addNode(n.id, { label: n.label, size: n.kind === 'component' ? 12 : n.kind === 'category' ? 10 : 8, color: kindColor[n.kind] ?? '#64748b', x, y });
      }
    }

    for (const e of edges) {
      try { if (g.hasNode(e.source) && g.hasNode(e.target)) g.addEdgeWithKey(e.id, e.source, e.target, { label: e.kind, size: 1, color: edgeBaseColor }); } catch {}
    }

    try {
      if (g.order > 0) {
        forceAtlas2.assign(g, { iterations: 50, settings: { gravity: fa2.gravity, scalingRatio: fa2.scalingRatio, strongGravityMode: fa2.strongGravityMode, slowDown: fa2.slowDown, edgeWeightInfluence: mode === 'cosine' ? 1 : 0 } });
      }
    } catch {}

    try { sigma.refresh(); } catch {}
  }, [sigma, nodes, edges, mode, fa2.gravity, fa2.scalingRatio, fa2.strongGravityMode, fa2.slowDown, edgeBaseColor]);
  return null;
}

export function GraphCanvas({ nodes, edges, mode, fa2, width = '100%', height = 520, background, labelColor, edgeColor }: { nodes: GraphNode[]; edges: GraphEdge[]; mode: 'topology' | 'cosine'; fa2: { gravity: number; scalingRatio: number; strongGravityMode: boolean; slowDown: number }; width?: string | number; height?: number; background: string; labelColor: string; edgeColor: string }) {
  return (
    <div style={{ width, height }}>
      <SigmaContainer className="rounded-md" key={`${background}-${labelColor}-${mode}`} style={{ width: '100%', height: '100%', background }} settings={{ allowInvalidContainer: true, renderLabels: true, defaultNodeType: 'circle', defaultEdgeType: 'line', labelSize: 14, labelColor: { color: labelColor }, nodeColor: { color: '#777' }, edgeColor: { color: edgeColor }, minCameraRatio: 0.1, maxCameraRatio: 10 }}>
        <GraphLoader nodes={nodes} edges={edges} mode={mode} fa2={fa2} edgeBaseColor={edgeColor} />
      </SigmaContainer>
    </div>
  );
}


