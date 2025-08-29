import { Box, Grid, Button, Card, Icon, Stack, Text, Title } from "@ui8kit/core";
import { Home as HomeIcon } from 'lucide-react';
import { useAppTheme } from '@/hooks/use-theme';

const content = {
  title: "Welcome to the dashboard",
  description: "This is the dashboard description",
  cardTitle: "Card Title",
  cardDescription: "Card Description",
  buttonText: "Call to action",
  cards: [
    {
      title: "Card Title 1",
      description: "Card Description 1",
      buttonText: "Call to action 1",
    },
    {
      title: "Card Title 2",
      description: "Card Description 2",
      buttonText: "Call to action 2",
    },
    {
      title: "Card Title",
      description: "Card Description 3",
      buttonText: "Call to action 3",
    },
  ]
}

export function Home() {
  const { rounded, buttonSize } = useAppTheme();
  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="2xl" c="secondary-foreground" mt="lg" data-class="home-title">{content.title}</Title>
        <Text c="muted">{content.description}</Text>
        <Grid cols="1-2-3" gap="lg" w="full">
          {content.cards.map((card, index) => (
            <Card p="md" rounded={rounded?.default} shadow="none" bg="card" w="full" key={index}>
              <Stack gap="sm" align="start">
                <Text size="lg" fw="bold" c="primary">{card.title}</Text>
                <Text size="sm" c="muted">{card.description}</Text>
                <Button variant="ghost" size={buttonSize.default} rounded={rounded.button}>
                  <Icon component="span" lucideIcon={HomeIcon} />
                  <Text size="sm" c="muted">{card.buttonText}</Text>
                </Button>
              </Stack>
            </Card>
          ))}
        </Grid>

        <Card p="md" rounded={rounded?.default} shadow="lg" bg="card" w="full">
          <Stack gap="md" align="start">
            <Text size="lg" fw="bold" c="primary">{content.cardTitle}</Text>
            <Text c="muted">{content.cardDescription}</Text>
            <Button variant="secondary" size={buttonSize.default} rounded={rounded.button}>
              <Icon component="span" lucideIcon={HomeIcon} />
              <Text size="sm" c="muted">{content.buttonText}</Text>
            </Button>
          </Stack>
        </Card>

        <Grid cols="1-2-3" gap="lg" w="full">
          <Box p="md" rounded={rounded?.default} shadow="none" bg="card" border="1px" aspect="16/9" w="full"></Box>
          <Box p="md" rounded={rounded?.default} shadow="none" bg="card" border="1px" aspect="16/9" w="full"></Box>
          <Box p="md" rounded={rounded?.default} shadow="none" bg="card" border="1px" aspect="16/9" w="full"></Box>
        </Grid>
        <Box p="md" rounded={rounded?.default} shadow="none" bg="card" border="1px" aspect="16/9" w="full"></Box>
      </Stack>
    </Box>
  );
}
