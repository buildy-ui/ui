import neo4j, { Driver } from 'neo4j-driver';
import { ENV } from '../../config/env';

let driverSingleton: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driverSingleton) {
    driverSingleton = neo4j.driver(
      ENV.NEO4J_URI,
      neo4j.auth.basic(ENV.NEO4J_USERNAME, ENV.NEO4J_PASSWORD)
    );
  }
  return driverSingleton;
}

type NodesMap = Record<string, string>; // name -> id
type Relationship = { source: string; target: string; type: string };

export async function ingestToNeo4j(nodes: NodesMap, relationships: Relationship[]): Promise<NodesMap> {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    for (const [name, id] of Object.entries(nodes)) {
      await session.run(
        'MERGE (n:Entity {id: $id}) ON CREATE SET n.name = $name ON MATCH SET n.name = coalesce(n.name, $name)',
        { id, name }
      );
    }
    for (const rel of relationships) {
      await session.run(
        'MATCH (a:Entity {id: $source_id}), (b:Entity {id: $target_id}) MERGE (a)-[r:RELATIONSHIP {type: $type}]->(b)',
        { source_id: rel.source, target_id: rel.target, type: rel.type }
      );
    }
    return nodes;
  } finally {
    await session.close();
  }
}

export async function fetchRelatedGraph(entityIds: string[]) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  const query = `
    MATCH (e:Entity)-[r1]-(n1)-[r2]-(n2)
    WHERE e.id IN $entity_ids
    RETURN e, r1 as r, n1 as related, r2, n2
    UNION
    MATCH (e:Entity)-[r]-(related)
    WHERE e.id IN $entity_ids
    RETURN e, r, related, null as r2, null as n2
  `;
  try {
    const result = await session.run(query, { entity_ids: entityIds });
    const subgraph: Array<{ entity: any; relationship: any; related_node: any }> = [];
    for (const record of result.records) {
      subgraph.push({
        entity: record.get('e').properties,
        relationship: record.get('r').properties,
        related_node: record.get('related').properties,
      });
      const r2 = record.get('r2');
      const n2 = record.get('n2');
      if (r2 && n2) {
        subgraph.push({
          entity: record.get('related').properties,
          relationship: r2.properties,
          related_node: n2.properties,
        });
      }
    }
    return subgraph;
  } finally {
    await session.close();
  }
}

export async function upsertEntity(id: string, name: string, labels: string[] = ['Entity'], props: Record<string, any> = {}): Promise<void> {
  const driver = getNeo4jDriver();
  const session = driver.session();
  const labelsCypher = labels.map((l) => `:${sanitizeLabel(l)}`).join('');
  try {
    await session.run(
      `MERGE (n${labelsCypher} {id: $id}) SET n.name = coalesce(n.name, $name) SET n += $props`,
      { id, name, props }
    );
  } finally {
    await session.close();
  }
}

export async function upsertRelationship(sourceId: string, targetId: string, type: string, props: Record<string, any> = {}): Promise<void> {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    await session.run(
      'MATCH (a:Entity {id: $source}), (b:Entity {id: $target}) MERGE (a)-[r:RELATIONSHIP {type: $type}]->(b) SET r += $props',
      { source: sourceId, target: targetId, type, props }
    );
  } finally {
    await session.close();
  }
}

export type NodeFilter = { label?: string; props?: Record<string, any>; limit?: number; offset?: number };

export class GraphRepository {
  async getNodeById(id: string, label: string = 'Entity'): Promise<any | null> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const res = await session.run(`MATCH (n:${label} {id: $id}) RETURN n`, { id });
      const r = res.records[0]?.get('n');
      return r ? r.properties : null;
    } finally {
      await session.close();
    }
  }

  async listNodes(filter: NodeFilter = {}): Promise<any[]> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const label = filter.label ? sanitizeLabel(filter.label) : 'Entity';
    const props = filter.props ?? {};
    const whereEntries = Object.keys(props).map((k) => `n.${k} = $${k}`);
    const where = whereEntries.length ? `WHERE ${whereEntries.join(' AND ')}` : '';
    const limit = Number.isFinite(filter.limit) ? `LIMIT ${filter.limit}` : '';
    const offset = Number.isFinite(filter.offset) ? `SKIP ${filter.offset}` : '';
    try {
      const res = await session.run(`MATCH (n:${label}) ${where} RETURN n ${offset} ${limit}`, props as any);
      return res.records.map((rec) => rec.get('n').properties);
    } finally {
      await session.close();
    }
  }

  async deleteNode(id: string, detach: boolean = true, label: string = 'Entity'): Promise<void> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const cypher = detach
        ? `MATCH (n:${label} {id: $id}) DETACH DELETE n`
        : `MATCH (n:${label} {id: $id}) DELETE n`;
      await session.run(cypher, { id });
    } finally {
      await session.close();
    }
  }

  async deleteRelationship(sourceId: string, targetId: string, type: string): Promise<void> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      await session.run(
        'MATCH (a:Entity {id: $source})-[r:RELATIONSHIP {type: $type}]->(b:Entity {id: $target}) DELETE r',
        { source: sourceId, target: targetId, type }
      );
    } finally {
      await session.close();
    }
  }

  async ensureUniqueIdConstraint(label: string = 'Entity'): Promise<void> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`);
    } finally {
      await session.close();
    }
  }

  async findByName(name: string, label: string = 'Entity', limit: number = 25): Promise<any[]> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const res = await session.run(`MATCH (n:${label}) WHERE toLower(n.name) CONTAINS toLower($name) RETURN n LIMIT $limit`, {
        name,
        limit,
      });
      return res.records.map((rec) => rec.get('n').properties);
    } finally {
      await session.close();
    }
  }
}

// ------- Advanced filtering & relationship queries -------
type PropertyPredicate = { op: 'eq' | 'contains' | 'in'; value: any };

export type NodeQueryFilter = {
  labels?: string[];
  where?: Record<string, PropertyPredicate>;
  limit?: number;
  offset?: number;
  orderBy?: { key: string; direction?: 'ASC' | 'DESC' };
};

export type RelationshipQueryFilter = {
  type?: string;
  sourceLabel?: string;
  targetLabel?: string;
  sourceWhere?: Record<string, PropertyPredicate>;
  relWhere?: Record<string, PropertyPredicate>;
  targetWhere?: Record<string, PropertyPredicate>;
  limit?: number;
  offset?: number;
  orderBy?: { key: 'source.name' | 'target.name' | 'type'; direction?: 'ASC' | 'DESC' };
};

function sanitizeLabel(label: string): string {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(label) ? label : 'Entity';
}

function buildWhere(alias: string, where?: Record<string, PropertyPredicate>): { clause: string; params: Record<string, any> } {
  if (!where || Object.keys(where).length === 0) return { clause: '', params: {} };
  const parts: string[] = [];
  const params: Record<string, any> = {};
  for (const [key, pred] of Object.entries(where)) {
    const paramKey = `${alias}_${key}`;
    if (pred.op === 'eq') {
      parts.push(`${alias}.${key} = $${paramKey}`);
      params[paramKey] = pred.value;
    } else if (pred.op === 'contains') {
      parts.push(`toLower(${alias}.${key}) CONTAINS toLower($${paramKey})`);
      params[paramKey] = String(pred.value ?? '');
    } else if (pred.op === 'in') {
      parts.push(`${alias}.${key} IN $${paramKey}`);
      params[paramKey] = Array.isArray(pred.value) ? pred.value : [pred.value];
    }
  }
  const clause = parts.length ? `WHERE ${parts.join(' AND ')}` : '';
  return { clause, params };
}

export class AdvancedGraphRepository extends GraphRepository {
  async listNodesAdvanced(filter: NodeQueryFilter = {}): Promise<any[]> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const labelsCypher = (filter.labels ?? ['Entity']).map((l) => `:${sanitizeLabel(l)}`).join('');
    const whereBuilt = buildWhere('n', filter.where);
    const order = filter.orderBy ? `ORDER BY n.${filter.orderBy.key} ${filter.orderBy.direction ?? 'ASC'}` : '';
    const limit = Number.isFinite(filter.limit) ? `LIMIT ${filter.limit}` : '';
    const offset = Number.isFinite(filter.offset) ? `SKIP ${filter.offset}` : '';
    try {
      const res = await session.run(
        `MATCH (n${labelsCypher}) ${whereBuilt.clause} RETURN n ${order} ${offset} ${limit}`,
        whereBuilt.params
      );
      return res.records.map((rec) => rec.get('n').properties);
    } finally {
      await session.close();
    }
  }

  async listRelationships(filter: RelationshipQueryFilter = {}): Promise<Array<{ source: any; relationship: any; target: any }>> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const srcLabel = filter.sourceLabel ? `:${sanitizeLabel(filter.sourceLabel)}` : ':Entity';
    const tgtLabel = filter.targetLabel ? `:${sanitizeLabel(filter.targetLabel)}` : ':Entity';
    const relType = filter.type ? `:RELATIONSHIP {type: $rel_type}` : ':RELATIONSHIP';
    const srcWhere = buildWhere('a', filter.sourceWhere);
    const relWhere = buildWhere('r', filter.relWhere);
    const tgtWhere = buildWhere('b', filter.targetWhere);
    const order = filter.orderBy ? `ORDER BY ${filter.orderBy.key} ${filter.orderBy.direction ?? 'ASC'}` : '';
    const limit = Number.isFinite(filter.limit) ? `LIMIT ${filter.limit}` : '';
    const offset = Number.isFinite(filter.offset) ? `SKIP ${filter.offset}` : '';
    const params = { ...srcWhere.params, ...relWhere.params, ...tgtWhere.params } as any;
    if (filter.type) params.rel_type = filter.type;
    try {
      const res = await session.run(
        `MATCH (a${srcLabel})-[r${relType}]->(b${tgtLabel})
         ${srcWhere.clause}
         ${relWhere.clause}
         ${tgtWhere.clause}
         RETURN a, r, b ${order} ${offset} ${limit}`,
        params
      );
      return res.records.map((rec) => ({
        source: rec.get('a').properties,
        relationship: rec.get('r').properties,
        target: rec.get('b').properties,
      }));
    } finally {
      await session.close();
    }
  }

  async listNeighborsByDepth(id: string, minDepth = 1, maxDepth = 1): Promise<Array<{ source: any; relationship: any; target: any }>> {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const res = await session.run(
        'MATCH (n:Entity {id: $id})-[r*' + minDepth + '..' + maxDepth + ']-(m) WITH n, m LIMIT 100 MATCH (n)-[r1:RELATIONSHIP]->(m) RETURN n as a, r1 as r, m as b',
        { id }
      );
      return res.records.map((rec) => ({
        source: rec.get('a').properties,
        relationship: rec.get('r').properties,
        target: rec.get('b').properties,
      }));
    } finally {
      await session.close();
    }
  }
}

// ------- Bulk transactional ingests -------
export async function ingestBulkTransactional(
  nodes: Array<{ id: string; name: string; labels?: string[]; props?: Record<string, any> }>,
  relationships: Array<{ sourceId: string; targetId: string; type: string; props?: Record<string, any> }>
): Promise<void> {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    await session.executeWrite(async (tx) => {
      if (nodes.length) {
        const prepared = nodes.map((n) => ({
          id: n.id,
          name: n.name,
          props: n.props ?? {},
          labels: (n.labels ?? ['Entity']).map((l) => sanitizeLabel(l)),
        }));
        await tx.run(
          `UNWIND $rows AS row
           CALL apoc.merge.node(row.labels, {id: row.id}, {name: row.name}, row.props) YIELD node
           RETURN count(node)`,
          { rows: prepared }
        );
      }
      if (relationships.length) {
        await tx.run(
          `UNWIND $rows AS row
           MATCH (a:Entity {id: row.sourceId}), (b:Entity {id: row.targetId})
           MERGE (a)-[r:RELATIONSHIP {type: row.type}]->(b)
           SET r += coalesce(row.props, {})
           RETURN count(r)` ,
          { rows: relationships }
        );
      }
    });
  } finally {
    await session.close();
  }
}


