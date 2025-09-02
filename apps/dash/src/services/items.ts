import { makeSchemaTransport } from "@ui8kit/form";
import * as qdrant from "@/schema/item-schema-qdrant";

const schema = makeSchemaTransport(qdrant as any);
const toDomain = schema.toDomain;

export type Item = ReturnType<typeof toDomain> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "ui8kit-brain-items-v1";

export async function loadItems(): Promise<Item[]> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Item[];
    } catch {
      // ignore parse error and fall through to empty
    }
  }
  return [];
}

export async function saveItems(items: Item[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function createItem(input: any): Promise<Item> {
  const items = await loadItems();
  const now = Date.now();
  const item: Item = {
    ...(input as any),
    id: (input as any).id || `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  } as Item;
  items.unshift(item);
  await saveItems(items);
  return item;
}

export async function updateItem(id: string, changes: Partial<any>): Promise<Item | undefined> {
  const items = await loadItems();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated: Item = {
    ...items[idx],
    ...changes,
    id: items[idx].id,
    updatedAt: Date.now(),
  } as Item;
  items[idx] = updated;
  await saveItems(items);
  return updated;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await loadItems();
  const next = items.filter((p) => p.id !== id);
  const changed = next.length !== items.length;
  if (changed) await saveItems(next);
  return changed;
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const items = await loadItems();
  return items.find((p) => p.id === id);
}

// --- Import / Export helpers for Qdrant schema ---
// no longer used helpers (kept here intentionally empty to avoid dead code warnings)

export async function importItemsFromArray(records: any[]): Promise<number> {
  if (!Array.isArray(records)) return 0;
  const now = Date.now();
  const items: Item[] = records.map((r) => {
    const id = r?.id ?? `${now}-${Math.random().toString(36).slice(2, 8)}`;
    const base: any = JSON.parse(JSON.stringify(r || {}));
    base.id = id;
    base.createdAt = r?.createdAt ?? now;
    base.updatedAt = now;
    return base as Item;
  });
  await saveItems(items);
  return items.length;
}

export async function exportItemsToArray(): Promise<any[]> {
  const items = await loadItems();
  return JSON.parse(JSON.stringify(items));
}



