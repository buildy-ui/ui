import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import Dexie, { Table } from "dexie";
import type { Edge, FlowStore, Graph, Node } from "./types";

class FlowDB extends Dexie {
  graphs!: Table<Graph, string>;
  constructor() {
    super("ui8kit_flow_db");
    this.version(1).stores({
      graphs: "id, updatedAt",
    });
  }
}

const db = new FlowDB();

const emptyGraph = (id: string): Graph => ({ id, nodes: [], edges: [], updatedAt: Date.now() });

export const useFlowStore = create<FlowStore>()(
  immer((set, get) => ({
    mode: "draw",
    activeTool: "select",
    graph: emptyGraph("default"),
    selectedNodeId: null,
    selectedEdgeId: null,

    setMode: (mode) => set((s) => { s.mode = mode; }),
    setTool: (tool) => set((s) => { s.activeTool = tool; }),
    setGraphId: (id) => set((s) => { if (s.graph.id !== id) s.graph = emptyGraph(id); }),

    addNode: (node: Node) => set((s) => { s.graph.nodes.push(node); s.graph.updatedAt = Date.now(); }),
    updateNode: (id: string, patch: Partial<Node>) => set((s) => {
      const n = s.graph.nodes.find((n) => n.id === id);
      if (n) Object.assign(n, patch);
      s.graph.updatedAt = Date.now();
    }),
    removeNode: (id: string) => set((s) => {
      s.graph.nodes = s.graph.nodes.filter((n) => n.id !== id);
      s.graph.edges = s.graph.edges.filter((e) => e.from !== id && e.to !== id);
      s.graph.updatedAt = Date.now();
    }),

    addEdge: (edge: Edge) => set((s) => { s.graph.edges.push(edge); s.graph.updatedAt = Date.now(); }),
    updateEdge: (id: string, patch: Partial<Edge>) => set((s) => {
      const e = s.graph.edges.find((e) => e.id === id);
      if (e) Object.assign(e, patch);
      s.graph.updatedAt = Date.now();
    }),
    removeEdge: (id: string) => set((s) => {
      s.graph.edges = s.graph.edges.filter((e) => e.id !== id);
      s.graph.updatedAt = Date.now();
    }),

    selectNode: (id) => set((s) => { s.selectedNodeId = id; s.selectedEdgeId = null; }),
    selectEdge: (id) => set((s) => { s.selectedEdgeId = id; s.selectedNodeId = null; }),

    clear: async () => {
      const g = get().graph;
      await db.graphs.delete(g.id);
      set((s) => { s.graph = emptyGraph(g.id); s.selectedNodeId = null; s.selectedEdgeId = null; });
    },

    save: async () => {
      const g = get().graph;
      const toSave: Graph = { ...g, updatedAt: Date.now() };
      await db.graphs.put(toSave);
      set((s) => { s.graph.updatedAt = toSave.updatedAt; });
    },

    load: async (id: string) => {
      const found = await db.graphs.get(id);
      set((s) => { s.graph = found ?? emptyGraph(id); s.selectedNodeId = null; s.selectedEdgeId = null; });
    },
  }))
);

export { db as flowDB };


