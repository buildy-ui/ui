import type { ZodError, ZodIssue, ZodTypeAny } from 'zod';

export type ContentIssue = {
  path: string;
  message: string;
  code?: string;
  expected?: unknown;
  received?: unknown;
};

export type SampleValidation = {
  ok: boolean;
  index: number;
  type?: string;
  variant?: string;
  issues: ContentIssue[];
};

function startsWithPath(path: (string | number)[], prefix: (string | number)[]) {
  if (path.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (path[i] !== prefix[i]) return false;
  }
  return true;
}

function flattenIssues(error: ZodError): ZodIssue[] {
  const output: ZodIssue[] = [];
  const stack: ZodIssue[] = [...error.issues];
  while (stack.length > 0) {
    const issue = stack.pop();
    if (!issue) continue;
    if ((issue as any).code === 'invalid_union' && Array.isArray((issue as any).unionErrors)) {
      for (const unionErr of (issue as any).unionErrors as ZodError[]) {
        for (const sub of unionErr.issues) stack.push(sub);
      }
      continue;
    }
    output.push(issue);
  }
  return output;
}

export function validateContentAgainstPreset(presetSchema: ZodTypeAny, samples: unknown[]): SampleValidation[] {
  const results: SampleValidation[] = [];
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i] as any;
    const hasContent = typeof sample === 'object' && sample && sample.props && sample.props.content;
    const parsed = presetSchema && (presetSchema as any).safeParse ? (presetSchema as any).safeParse(sample) : { success: true };
    let contentIssues: ContentIssue[] = [];

    if (!parsed.success) {
      const allIssues = flattenIssues((parsed as any).error as ZodError);
      const filtered = allIssues.filter((iss) => startsWithPath(iss.path as (string | number)[], ['props', 'content']));
      const dedup = new Map<string, ContentIssue>();
      for (const iss of filtered) {
        const after = (iss.path as (string | number)[]).slice(2);
        const key = `${after.join('.')}:${iss.message}`;
        if (!dedup.has(key)) {
          dedup.set(key, {
            path: after.length > 0 ? after.join('.') : '<root>',
            message: iss.message,
            code: (iss as any).code,
            expected: (iss as any).expected,
            received: (iss as any).received
          });
        }
      }
      contentIssues = Array.from(dedup.values());
    }

    if (!hasContent) {
      contentIssues.push({ path: '<root>', message: 'props.content is missing' });
    }

    results.push({
      ok: contentIssues.length === 0,
      index: i,
      type: sample?.type,
      variant: sample?.variant,
      issues: contentIssues
    });
  }
  return results;
}

export function extractContentSchemasFromPresetSchema(presetSchema: ZodTypeAny): ZodTypeAny[] {
  const contentSchemas: ZodTypeAny[] = [];
  const addIfContent = (obj: any) => {
    if (!obj || !obj._def) return;
    const def = obj._def;
    if (def.typeName !== 'ZodObject') return;
    const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
    if (!shape) return;
    const propsSchema = shape['props'];
    if (!propsSchema || !propsSchema._def) return;
    const propsDef = propsSchema._def;
    if (propsDef.typeName !== 'ZodObject') return;
    const propsShape = typeof propsDef.shape === 'function' ? propsDef.shape() : propsDef.shape;
    if (!propsShape) return;
    const contentSchema = propsShape['content'];
    if (contentSchema) contentSchemas.push(contentSchema);
  };

  const def = (presetSchema as any)?._def;
  if (!def) return contentSchemas;

  if (def.typeName === 'ZodUnion' && Array.isArray(def.options)) {
    for (const opt of def.options as ZodTypeAny[]) addIfContent(opt);
    return contentSchemas;
  }

  addIfContent(presetSchema);
  return contentSchemas;
}

export function formatSampleValidation(result: SampleValidation) {
  if (result.ok) return `${result.type ?? 'block'} is valid`;
  const missing = result.issues.filter((i) => {
    const msg = String(i.message || '').toLowerCase();
    return msg === 'required' || msg.includes('required') || i.received === undefined;
  }).map((i) => i.path);
  const invalid = result.issues.filter((i) => !missing.includes(i.path))
    .map((i) => `${i.path}: ${i.message}`);
  const missingStr = missing.length ? missing.join(', ') : '—';
  const invalidStr = invalid.length ? invalid.join('; ') : '—';
  return `${result.type ?? 'block'} is invalid. variant: ${result.variant ?? 'unknown'} | missing: ${missingStr} | errors: ${invalidStr}`;
}


