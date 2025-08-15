import { Box, Card, Stack, Title, Text, Button, Grid, Icon } from "@ui8kit/core";
import { Github, Mail, Database } from "lucide-react";

export function Integrations() {
  const items = [
    { name: "GitHub", icon: Github, description: "Sync issues and PRs" },
    { name: "Email", icon: Mail, description: "Send transactional emails" },
    { name: "DB", icon: Database, description: "Connect external databases" },
  ];

  return (
    <Box w="full" maxW="xl" mx="auto">
      <Stack gap="lg" align="start">
        <Title size="2xl" c="secondary-foreground" mt="lg">Integrations</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <Grid cols="1-2" gap="md" w="full">
            {items.map((it, i) => (
              <Card key={i} p="md" bg="card" border="1px" rounded="md">
                <Stack gap="sm">
                  <Stack gap="xs" align="center">
                    <Icon component="span" lucideIcon={it.icon} />
                    <Text fw="bold">{it.name}</Text>
                  </Stack>
                  <Text size="sm" c="muted">{it.description}</Text>
                  <Button variant="secondary">Configure</Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Card>
      </Stack>
    </Box>
  );
}


