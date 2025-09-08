import type { ZodTypeAny } from "zod";

export type FlowMode = "draw" | "flow";

export type Tool = "select" | "rectangle" | "arrow" | "text" | "freehand";

export type Vec2 = { x: number; y: number };

export type NodeType = "rectangle" | "text" | "freehand";

export interface BaseNode {
  id: string;
  type: NodeType;
  position: Vec2;
  size?: { width: number; height: number };
  rotation?: number;
  label?: string;
  schema?: ZodTypeAny | null;
}

export interface RectangleNode extends BaseNode {
  type: "rectangle";
}

export interface TextNode extends BaseNode {
  type: "text";
}

export interface FreehandNode extends BaseNode {
  type: "freehand";
  points: Vec2[];
}

export type Node = RectangleNode | TextNode | FreehandNode;

export type Edge = {
  id: string;
  from: string; // node id
  to: string;   // node id
  label?: string;
};

export type Graph = {
  id: string;
  nodes: Node[];
  edges: Edge[];
  updatedAt: number;
};

export type FlowState = {
  mode: FlowMode;
  activeTool: Tool;
  graph: Graph;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
};

export type FlowActions = {
  setMode: (mode: FlowMode) => void;
  setTool: (tool: Tool) => void;
  setGraphId: (id: string) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, patch: Partial<Node>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  updateEdge: (id: string, patch: Partial<Edge>) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clear: () => Promise<void>;
  save: () => Promise<void>;
  load: (id: string) => Promise<void>;
};

export type FlowStore = FlowState & FlowActions;


