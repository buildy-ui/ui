import { Box, Stack, Text, Title } from "@ui8kit/core";
import { useAppTheme } from '@/hooks/use-theme';

const content = {
  title: "Welcome to the dashboard",
  description: "This is the dashboard description"
}

export function Blank() {
  const { rounded } = useAppTheme();
  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="2xl" c="secondary-foreground" mt="lg" data-class="home-title">{content.title}</Title>
        <Text c="muted">{content.description}</Text>
        <Box p="md" rounded={rounded?.default} shadow="none" bg="card" border="1px" aspect="16/9" w="full"></Box>
      </Stack>
    </Box>
  );
}
