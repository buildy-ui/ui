export type GraphTriple = {
  node: string;
  target_node: string;
  relationship: string;
};

export type GraphExtraction = {
  graph: GraphTriple[];
};

export type NodesMap = Record<string, string>; // name -> uuid
export type Relationship = { source: string; target: string; type: string };


// ------- DTOs for ingestion -------
export type QdrantItemDTO = {
  id: string;
  description: string; // text to embed and store in Qdrant
  payload?: Record<string, any>;
};

export type ComponentDTO = {
  id: string;
  name: string;
  category?: string;
  tags?: string[];
  props?: Record<string, any>;
};

export type IngestRequestDTO = {
  collection: string;
  qdrant?: QdrantItemDTO[];
  components?: ComponentDTO[];
  relationships?: Array<{ sourceId: string; targetId: string; type: string; props?: Record<string, any> }>;
};


