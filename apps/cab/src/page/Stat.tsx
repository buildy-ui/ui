import { Box, Grid, Button, Card, Icon, Stack, Text, Title, Group } from "@ui8kit/core";
import { Home as HomeIcon, BarChart as BarChartIcon } from 'lucide-react';
import { useAppTheme } from '@/hooks/use-theme';
import { Sparkline } from '@/components/charts/Sparkline';
import { BarMini } from '@/components/charts/BarMini';

const content = {
  title: "Statistics",
  description: "This is the statistics description",
  cardTitle: "Card Title",
  cardDescription: "Card Description",
  buttonText: "Call to action",
  cards: [
    {
      title: "Card Title 1",
      description: "Card Description 1",
      chartData: [12,11,12,9,10,8,8,9,11,13],
      buttonText: "Call to action 1",
    },
    {
      title: "Card Title 2",
      description: "Card Description 2",
      barData: [3,5,2,8,6,9,7],
      buttonText: "Call to action 2",
    },
    {
      title: "Card Title",
      description: "Card Description 3",
      chartData: [5,8,6,9,12,10,14,9,11,13],
      buttonText: "Call to action 3",
    },
  ]
}

export function Stat() {
  const { rounded, buttonSize } = useAppTheme();
  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="2xl" c="secondary-foreground" mt="lg" data-class="stat-title">{content.title}</Title>
        <Text c="muted">{content.description}</Text>
        <Grid cols="1-2-3" gap="lg" w="full">
          {content.cards.map((card, index) => (
            <Card p="md" rounded={rounded?.default} shadow="none" bg="card" w="full" key={index}>
              <Stack gap="sm" align="start">
                <Text size="lg" fw="bold" c="primary">{card.title}</Text>
                <Text size="sm" c="muted">{card.description}</Text>
                <Group gap="md" align="center" w="full" justify="center">
                  {card.chartData && <Sparkline data={card.chartData} width={240} height={75} className="text-primary" showFill />}
                  {card.barData && <BarMini data={card.barData} width={240} height={75} className="text-secondary" />}
                </Group>
                <Button variant="ghost" size={buttonSize.default} rounded={rounded?.default}>
                  <Icon component="span" lucideIcon={BarChartIcon} />
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
            <Button variant="secondary" size={buttonSize.default} rounded={rounded?.default}>
              <Icon component="span" lucideIcon={HomeIcon} />
              <Text size="sm" c="muted">{content.buttonText}</Text>
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
