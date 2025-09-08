import * as React from "react";
import Konva from "konva";
import type { RectangleNode, TextNode } from "./types";
import { useFlowStore } from "./store";

type Props = { width: number; height: number };

export function DrawCanvas({ width, height }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const layerRef = React.useRef<Konva.Layer | null>(null);
  const { graph, activeTool, addNode, updateNode, removeNode, addEdge, selectNode, setTool } = useFlowStore() as any;
  const drawingIdRef = React.useRef<string | null>(null);
  const dragRectRef = React.useRef<{ id: string; startX: number; startY: number } | null>(null);
  const edgeDraftRef = React.useRef<{ fromId: string; startX: number; startY: number; arrow: Konva.Arrow } | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const stage = new Konva.Stage({ container: containerRef.current, width, height });
    const layer = new Konva.Layer();
    stage.add(layer);
    stageRef.current = stage;
    layerRef.current = layer;

    const down = (evt: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const pos = stage.getPointerPosition();
      if (!pos) return;
      const id = `n_${Date.now()}`;
      const tool = (useFlowStore as any).getState().activeTool as string;
      if (tool === "rectangle") {
        // Start drag-to-create
        const node: RectangleNode = { id, type: "rectangle", position: { x: pos.x, y: pos.y }, size: { width: 1, height: 1 } };
        addNode(node);
        dragRectRef.current = { id, startX: pos.x, startY: pos.y };
        selectNode(id);
      } else if (tool === "text") {
        const node: TextNode = { id, type: "text", position: { x: pos.x, y: pos.y }, label: "Text" };
        addNode(node);
        selectNode(id);
        setTool("select");
      } else if (tool === "freehand") {
        addNode({ id, type: "freehand", position: { x: 0, y: 0 }, points: [{ x: pos.x, y: pos.y }] });
        drawingIdRef.current = id;
      }
    };
    const move = () => {
      const id = drawingIdRef.current;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      if (id) {
        const node = (graph.nodes as any[]).find((n: any) => n.id === id && n.type === "freehand") as any;
        if (node) {
          const next = [...node.points, { x: pos.x, y: pos.y }];
          updateNode(id, { points: next } as any);
        }
      }
      if (dragRectRef.current) {
        const { id: rid, startX, startY } = dragRectRef.current;
        const x = Math.min(startX, pos.x);
        const y = Math.min(startY, pos.y);
        const w = Math.abs(pos.x - startX);
        const h = Math.abs(pos.y - startY);
        updateNode(rid, { position: { x, y }, size: { width: Math.max(1, w), height: Math.max(1, h) } } as any);
      }
      if (edgeDraftRef.current) {
        const ed = edgeDraftRef.current;
        ed.arrow.points([ed.startX, ed.startY, pos.x, pos.y]);
        layer.batchDraw();
      }
    };
    const up = () => {
      drawingIdRef.current = null;
      if (dragRectRef.current) {
        const { id } = dragRectRef.current;
        dragRectRef.current = null;
        // Read latest graph from store to avoid stale closure
        const latestGraph = (useFlowStore as any).getState().graph as any;
        const node = (latestGraph.nodes as any[]).find((n: any) => n.id === id) as any;
        const w = node?.size?.width ?? 0;
        const h = node?.size?.height ?? 0;
        if (w < 10 || h < 10) {
          removeNode(id);
        }
        // After creating rectangle, switch back to Select like React Flow
        setTool("select");
      }
      if (edgeDraftRef.current) {
        // If we released not on a node, cancel draft
        edgeDraftRef.current.arrow.destroy();
        edgeDraftRef.current = null;
        layer.draw();
      }
    };

    stage.on("mousedown touchstart", down);
    stage.on("mousemove touchmove", move);
    stage.on("mouseup touchend", up);

    return () => {
      stage.off("mousedown touchstart", down);
      stage.off("mousemove touchmove", move);
      stage.off("mouseup touchend", up);
      stage.destroy();
    };
  }, []);

  React.useEffect(() => {
    const layer = layerRef.current;
    const stage = stageRef.current;
    if (!layer || !stage) return;
    layer.destroyChildren();
    // Draw nodes
    for (const n of graph.nodes as any[]) {
      if (n.type === "rectangle") {
        const w = n.size?.width ?? 120;
        const h = n.size?.height ?? 60;
        const rect = new Konva.Rect({ x: n.position.x, y: n.position.y, width: w, height: h, stroke: "#888", cornerRadius: 8, draggable: activeTool === "select" });
        rect.on("dragend", (e) => updateNode(n.id, { position: { x: rect.x(), y: rect.y() } } as any));
        // Handle for edge creation (center)
        const cx = n.position.x + w / 2;
        const cy = n.position.y + h / 2;
        const handle = new Konva.Circle({ x: cx, y: cy, radius: 4, fill: "#999" });
        handle.on("mousedown", () => {
          if (activeTool !== "arrow") return;
          const arrow = new Konva.Arrow({ points: [cx, cy, cx, cy], stroke: "#777" });
          layer.add(arrow);
          edgeDraftRef.current = { fromId: n.id, startX: cx, startY: cy, arrow };
          layer.draw();
        });
        rect.on("mouseup", () => {
          // finalize edge if drafting
          if (edgeDraftRef.current && edgeDraftRef.current.fromId !== n.id) {
            addEdge({ id: `e_${Date.now()}`, from: edgeDraftRef.current.fromId, to: n.id });
            edgeDraftRef.current.arrow.destroy();
            edgeDraftRef.current = null;
            layer.draw();
            setTool("select");
          }
        });
        layer.add(rect);
        layer.add(handle);
      } else if (n.type === "text") {
        const text = new Konva.Text({ x: n.position.x, y: n.position.y, text: n.label ?? "Text", fontSize: 16, fill: "#aaa" });
        layer.add(text);
      } else if (n.type === "freehand") {
        const points = (n.points as any[]).flatMap((p: any) => [p.x, p.y]);
        const line = new Konva.Line({ points, stroke: "#666", strokeWidth: 2, lineCap: "round", lineJoin: "round" });
        layer.add(line);
      }
    }
    // Draw edges from store
    for (const e of graph.edges as any[]) {
      const from = (graph.nodes as any[]).find((n: any) => n.id === e.from);
      const to = (graph.nodes as any[]).find((n: any) => n.id === e.to);
      if (!from || !to) continue;
      const sx = from.position.x + (from.size?.width ?? 120) / 2;
      const sy = from.position.y + (from.size?.height ?? 60) / 2;
      const tx = to.position.x + (to.size?.width ?? 120) / 2;
      const ty = to.position.y + (to.size?.height ?? 60) / 2;
      const arrow = new Konva.Arrow({ points: [sx, sy, tx, ty], stroke: "#777" });
      layer.add(arrow);
    }
    layer.draw();
  }, [graph.updatedAt, graph.id]);

  return <div ref={containerRef} style={{ width, height }} />;
}


