import { useEffect, useMemo, useState } from "react";
import { Box, Card, Stack, Title, Text, Button } from "@ui8kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@ui8kit/form";
import { listCollections as apiListCollections, getPointsFirstN, pickDisplayFields, deleteCollection as apiDeleteCollection } from "@/services/qdrant";

type CollData = { name: string; rows: any[]; error?: string };

export function QDrantList() {
  const [collections, setCollections] = useState<CollData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    setError(null);
    setCollections(null);
    try {
      const names = await apiListCollections();
      const results: CollData[] = [];
      for (const name of names) {
        try {
          const points = await getPointsFirstN(name, 200);
          const rows = points.map(pickDisplayFields);
          results.push({ name, rows });
        } catch (e: any) {
          results.push({ name, rows: [], error: e?.message || String(e) });
        }
      }
      setCollections(results);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadAll();
    })();
    return () => { cancelled = true };
  }, []);

  async function onDeleteCollection(name: string) {
    const confirmMsg = `Delete collection "${name}"? This removes all points and cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await apiDeleteCollection(name);
      await loadAll();
    } catch (e: any) {
      alert(e?.message || String(e));
    }
  }

  const hasData = useMemo(() => (collections?.some(c => c.rows.length) ?? false), [collections]);

  return (
    <Box w="full">
      <Stack gap="lg" align="start">
        <Title size="2xl" c="secondary-foreground" mt="lg">Qdrant Collections</Title>
        {error && (
          <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Text c="destructive">{error}</Text>
            <Text size="sm" c="muted">Ensure VITE_QDRANT_URL and VITE_QDRANT_KEY are set.</Text>
          </Card>
        )}
        {!collections && !error && (
          <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Text c="muted">Loading collections…</Text>
          </Card>
        )}
        {collections && collections.length === 0 && (
          <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Text c="muted">No collections found.</Text>
          </Card>
        )}
        {collections && collections.map((col) => (
          <Card key={col.name} p="md" rounded="md" shadow="lg" bg="card" w="full">
            <Stack gap="md">
              <Box className="flex items-center justify-between gap-3">
                <Title size="lg">{col.name}</Title>
                <Button size="sm" variant="destructive" onClick={() => onDeleteCollection(col.name)}>Delete collection</Button>
              </Box>
              {col.error ? (
                <Text c="destructive">{col.error}</Text>
              ) : col.rows.length === 0 ? (
                <Text c="muted">No points in this collection.</Text>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {col.rows.map((row, idx) => (
                      <TableRow key={`${row.id}-${idx}`}>
                        <TableCell><Text size="xs" c="muted">{String(row.id ?? "—")}</Text></TableCell>
                        <TableCell><Text size="xs" c="muted">{String(row.category ?? "—")}</Text></TableCell>
                        <TableCell><Text size="xs" c="muted">{Array.isArray(row.tags) ? row.tags.join(", ") : String(row.tags ?? "—")}</Text></TableCell>
                        <TableCell><Text size="xs" c="muted">{String(row.description ?? "—")}</Text></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Stack>
          </Card>
        ))}
        {collections && hasData && (
          <Text size="xs" c="muted">Showing up to 200 points per collection.</Text>
        )}
      </Stack>
    </Box>
  );
}


