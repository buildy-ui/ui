import { Box, Card, Stack, Title, Text, Button, Grid } from "@ui8kit/core";

export function Billing() {
  return (
    <Box w="full" maxW="xl" mx="auto">
      <Stack gap="lg" align="start">
        <Title size="2xl" c="secondary-foreground" mt="lg">Billing</Title>
        <Card p="md" rounded="md" shadow="lg" bg="card" w="full">
          <Stack gap="md">
            <Text c="muted">Manage your subscription and payment methods.</Text>
            <Grid cols="1-2" gap="md" w="full">
              <Card p="md" bg="card" border="1px" rounded="md">
                <Stack gap="sm">
                  <Text fw="bold">Current plan</Text>
                  <Text size="sm" c="muted">Pro — $19/mo</Text>
                  <Button variant="secondary">Change plan</Button>
                </Stack>
              </Card>
              <Card p="md" bg="card" border="1px" rounded="md">
                <Stack gap="sm">
                  <Text fw="bold">Payment method</Text>
                  <Text size="sm" c="muted">Visa **** 4242</Text>
                  <Button variant="secondary">Update card</Button>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}


