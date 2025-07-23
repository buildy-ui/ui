import { forwardRef } from "react";
import { Bookmark } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Card,
  Icon,
  Box
} from "@ui8kit/core";

interface BusinessSolutionsGridProps {
  content: {
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      lucideIcon: any;
      colSpan?: number;
    }>;
  };
}

export const BusinessSolutionsGrid = forwardRef<HTMLElement, BusinessSolutionsGridProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="2xl" align="start">
            {/* Header */}
            <Stack gap="md" align="start">
              <Badge radius="full" size="sm">
                {content.badge}
              </Badge>
              
              <Stack gap="sm">
                <Title
                  order={2}
                  size="3xl"
                  fw="bold"
                  w="2xl"
                >
                  {content.title}
                </Title>
                
                <Text
                  size="lg"
                  c="muted-foreground"
                  w="3xl"
                >
                  {content.description}
                </Text>
              </Stack>
            </Stack>
            
            {/* Cards Grid */}
            <Grid cols="cols3" gap="lg">
              {content.cards.map((card) => (
                <Grid.Col
                  key={card.id}
                  span={card.colSpan || 1}
                >
                  <Card 
                    variant="filled" 
                    padding="lg"
                    radius="md"
                  >
                    <Stack gap="lg" justify="between" h="full">
                      <Box>
                        <Icon
                          lucideIcon={card.lucideIcon}
                          size="lg"
                        />
                      </Box>
                      
                      <Stack gap="xs">
                        <Title
                          order={3}
                          size="xl"
                          fw="semibold"
                        >
                          {card.title}
                        </Title>
                        
                        <Text
                          size="md"
                          c="muted-foreground"
                        >
                          {card.description}
                        </Text>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

BusinessSolutionsGrid.displayName = "BusinessSolutionsGrid";

export const businessSolutionsGridTemplate = {
  id: "businessSolutionsGrid",
  name: "Business Solutions Grid",
  description: "Business solutions grid with card layout",
  component: BusinessSolutionsGrid,
  defaultContent: {
    badge: "buildy/ui",
    title: "Streamline Your Business Operations",
    description: "Managing a business shouldn't be complicated. With Buildy/UI, create seamless workflows and improve efficiency effortlessly.",
    cards: [
      {
        id: "card1",
        title: "Shadcn Library Integration",
        description: "Seamlessly blend components for a cohesive and modern design aesthetic.",
        lucideIcon: Bookmark,
        colSpan: 2
      },
      {
        id: "card2",
        title: "Bookmark-Centric Design",
        description: "Deliver intuitive and engaging interfaces that resonate with your target audience.",
        lucideIcon: Bookmark
      },
      {
        id: "card3",
        title: "Strategic Branding",
        description: "Ensure consistency and elevate your brand identity across platforms.",
        lucideIcon: Bookmark
      },
      {
        id: "card4",
        title: "Open Source Excellence",
        description: "Access open source components for personal or commercial projects.",
        lucideIcon: Bookmark,
        colSpan: 2
      }
    ]
  }
}; 