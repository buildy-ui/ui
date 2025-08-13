import { Box, Card, Stack, Title, Text, Button, Grid, Icon } from "@ui8kit/core";
import { Users } from "lucide-react";

export function Team() {
  const members = [
    { name: "Alice", role: "Designer" },
    { name: "Bob", role: "Engineer" },
    { name: "Charlie", role: "PM" },
  ];

  return (
    <Box w="full" maxW="xl" mx="auto">
      <Stack gap="lg" align="start">
        <Title size="2xl" c="secondary-foreground" mt="lg">Team</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <Grid cols="1-2" gap="md" w="full">
            {members.map((m, i) => (
              <Card key={i} p="md" bg="card" border="1px" rounded="md">
                <Stack gap="sm">
                  <Stack gap="xs" align="center">
                    <Icon component="span" lucideIcon={Users} />
                    <Text fw="bold">{m.name}</Text>
                  </Stack>
                  <Text size="sm" c="muted">{m.role}</Text>
                  <Button variant="secondary">Manage</Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Card>
      </Stack>
    </Box>
  );
}


