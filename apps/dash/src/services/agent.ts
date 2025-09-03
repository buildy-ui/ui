import { embedTexts } from '@/services/embeddings';
import { listCollections, searchTopK, pickDisplayFields } from '@/services/qdrant';
import { llmDecideRefine } from '@/services/llm';

export type AgentRow = ReturnType<typeof pickDisplayFields> & { _score?: number; _collection?: string };

async function searchAcrossAllCollections(vector: number[], perCollectionTopK = 10): Promise<AgentRow[]> {
  const collections = await listCollections();
  const results: AgentRow[] = [];
  for (const col of collections) {
    try {
      const pts = await searchTopK(col, vector, perCollectionTopK);
      for (const p of pts) {
        results.push({ ...pickDisplayFields(p), _score: p?.score, _collection: col });
      }
    } catch {}
  }
  // Sort by descending score and dedupe by id
  const seen = new Set<string>();
  const sorted = results
    .sort((a, b) => (b._score ?? 0) - (a._score ?? 0))
    .filter((r) => {
      const id = String(r.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  return sorted;
}

export async function agentSearchAndRefine(userQuery: string, topK = 10): Promise<AgentRow[]> {
  if (!userQuery || !userQuery.trim()) return [];

  // Step 1: initial vector search across all collections
  console.groupCollapsed('[Agent] Initial search');
  console.log('query', userQuery);
  const [vector] = await embedTexts([userQuery]);
  console.log('vectorDim', Array.isArray(vector) ? vector.length : 0);
  const initial = await searchAcrossAllCollections(vector, topK);
  const initialTop = initial.slice(0, topK);
  console.log('initialTop ids', initialTop.map(r => r.id));

  // Prepare ids for LLM decision
  const initialIds = initialTop.map((r) => String(r.id));

  // Step 2: ask LLM if we should refine the query (MVP: one pass)
  const decision = await llmDecideRefine(userQuery, initialIds);
  console.log('LLM decision', decision);
  if (decision?.acceptAll || !decision?.refinedQuery) {
    console.groupEnd();
    return initialTop;
  }

  // Step 3: refined vector search across all collections
  const [refinedVector] = await embedTexts([decision.refinedQuery]);
  console.log('refinedQuery', decision.refinedQuery);
  console.log('refinedVectorDim', Array.isArray(refinedVector) ? refinedVector.length : 0);
  const refined = await searchAcrossAllCollections(refinedVector, topK);
  const finalTop = refined.slice(0, topK);
  console.log('finalTop ids', finalTop.map(r => r.id));
  console.groupEnd();
  return finalTop;
}


