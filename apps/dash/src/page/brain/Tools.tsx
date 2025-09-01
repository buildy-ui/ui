import { Box, Stack, Text, Title, Card, Button } from "@ui8kit/core";
import { useAppTheme } from '@/hooks/use-theme';
import { importItemsFromArray, exportItemsToArray } from "@/services/items";

const content = {
  title: "The dashboard of AI tools",
  description: "This is the dashboard of tools description"
}

export function Tools() {
  const { rounded } = useAppTheme();
  async function onImportFile(file?: File | null) {
    if (!file) return;
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      const count = await importItemsFromArray(Array.isArray(json) ? json : []);
      alert(`Imported ${count} records`);
    } catch (e) {
      alert("Invalid JSON file");
    }
  }

  async function onExportFile() {
    const data = await exportItemsToArray();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qdrant-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="2xl" c="secondary-foreground" mt="lg" data-class="home-title">{content.title}</Title>
        <Text c="muted">{content.description}</Text>
        <Card p="md" rounded={rounded?.default} shadow="lg" bg="card" w="full">
          <Stack gap="sm">
            <Title size="lg">Import items</Title>
            <Text c="muted">Load Qdrant items from a local JSON file. Only schema-supported fields will be imported; extra fields are preserved for export.</Text>
            <input type="file" accept="application/json" onChange={(e) => onImportFile(e.target.files?.[0] || null)} />
          </Stack>
        </Card>
        <Card p="md" rounded={rounded?.default} shadow="lg" bg="card" w="full">
          <Stack gap="sm">
            <Title size="lg">Export items</Title>
            <Text c="muted">Download current items as JSON. Non-schema fields from the original file remain untouched.</Text>
            <Button variant="default" onClick={onExportFile}>Export JSON</Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
