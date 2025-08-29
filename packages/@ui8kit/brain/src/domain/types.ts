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

// ------- zod Schemas -------
import { z } from 'zod';

export const QdrantItemSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  payload: z.record(z.any()).optional(),
});

export const ComponentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  props: z.record(z.any()).optional(),
});

export const RelationshipSchema = z.object({
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.any()).optional(),
});

export const IngestRequestSchema = z.object({
  collection: z.string().min(1),
  qdrant: z.array(QdrantItemSchema).optional(),
  components: z.array(ComponentSchema).optional(),
  relationships: z.array(RelationshipSchema).optional(),
});

// ------- Fragment JSON -------
export type FragmentJSON = {
  description: string;
  tags?: string[];
  category?: string;
};

export const FragmentSchema = z.object({
  description: z.string().min(1),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});


