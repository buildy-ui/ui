import * as React from "react";
import Konva from "konva";
import ELK from "elkjs/lib/elk.bundled.js";
import { useFlowStore } from "./store";

const elk = new ELK();

type Props = { width: number; height: number };

export function FlowCanvas({ width, height }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const layerRef = React.useRef<Konva.Layer | null>(null);
  const { graph } = useFlowStore();
  const [layouted, setLayouted] = React.useState<typeof graph | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return undefined;
    const stage = new Konva.Stage({ container: containerRef.current, width, height });
    const layer = new Konva.Layer();
    stage.add(layer);
    stageRef.current = stage;
    layerRef.current = layer;
    return () => { stage.destroy(); };
  }, []);

  React.useEffect(() => {
    const run = async () => {
      const elkGraph = {
        id: graph.id,
        layoutOptions: { "elk.algorithm": "layered", "elk.spacing.nodeNode": "48" },
        children: graph.nodes.map((n) => ({ id: n.id, width: n.size?.width ?? 120, height: n.size?.height ?? 60 })),
        edges: graph.edges.map((e) => ({ id: e.id, sources: [e.from], targets: [e.to] })),
      } as any;
      const res = await elk.layout(elkGraph);
      const next = { ...graph };
      for (const c of res.children || []) {
        const node = next.nodes.find((n) => n.id === c.id);
        if (node && c.x != null && c.y != null) {
          node.position = { x: c.x, y: c.y } as any;
        }
      }
      setLayouted(next);
    };
    run();
  }, [graph.id, graph.updatedAt]);

  React.useEffect(() => {
    const layer = layerRef.current;
    const g = layouted ?? graph;
    if (!layer) return;
    layer.destroyChildren();
    for (const n of g.nodes) {
      const rect = new Konva.Rect({ x: n.position.x, y: n.position.y, width: n.size?.width ?? 120, height: n.size?.height ?? 60, stroke: "#888", cornerRadius: 8 });
      layer.add(rect);
      if (n.label) {
        const text = new Konva.Text({ x: n.position.x + 8, y: n.position.y + 8, text: n.label, fontSize: 14, fill: "#aaa" });
        layer.add(text);
      }
    }
    for (const e of g.edges) {
      const from = g.nodes.find((n) => n.id === e.from);
      const to = g.nodes.find((n) => n.id === e.to);
      if (!from || !to) continue;
      const sx = from.position.x + (from.size?.width ?? 120) / 2;
      const sy = from.position.y + (from.size?.height ?? 60) / 2;
      const tx = to.position.x + (to.size?.width ?? 120) / 2;
      const ty = to.position.y + (to.size?.height ?? 60) / 2;
      const arrow = new Konva.Arrow({ points: [sx, sy, tx, ty], stroke: "#777" });
      layer.add(arrow);
    }
    layer.draw();
  }, [layouted, graph.updatedAt]);

  return <div ref={containerRef} style={{ width, height }} />;
}


