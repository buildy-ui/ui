import { forwardRef } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
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

interface BusinessCardsGalleryProps {
  content: {
    promo: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      lucideIcon: any;
      colSpan?: number;
      rowSpan?: number;
    }>;
  };
}

export const BusinessCardsGallery = forwardRef<HTMLElement, BusinessCardsGalleryProps>(
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
              <Badge variant="outline" radius="full">
                {content.promo}
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
            <Grid cols="cols3" colsLg={4} gap="lg">
              {content.cards.map((card) => (
                <Grid.Col
                  key={card.id}
                  span={card.colSpan || 1}
                  rowSpan={card.rowSpan || 1}
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

BusinessCardsGallery.displayName = "BusinessCardsGallery";

export const businessCardsGalleryTemplate = {
  id: "businessCardsGallery",
  name: "Business Cards Gallery",
  description: "Business cards gallery with flexible grid layout",
  component: BusinessCardsGallery,
  defaultContent: {
    promo: "BuildY/UI Design",
    title: "Inspiring Innovation in Marketing & Design",
    description: "Craft intuitive and engaging interfaces with Buildy/UI. Streamline workflows and empower your brand with cutting-edge solutions.",
    cards: [
      {
        id: "card1",
        title: "Innovate Your Brand",
        description: "Transform your brand with modern design principles that resonate with your audience.",
        lucideIcon: Bookmark,
        colSpan: 2,
        rowSpan: 2
      },
      {
        id: "card2",
        title: "Bookmark-Centric Design",
        description: "Deliver intuitive experiences that prioritize user needs and usability.",
        lucideIcon: BookmarkCheck
      },
      {
        id: "card3",
        title: "Strategic Branding",
        description: "Ensure consistency and elevate your brand identity across platforms.",
        lucideIcon: BookmarkCheck
      },
      {
        id: "card4",
        title: "Seamless Aesthetics",
        description: "Integrate cohesive, modern design components effortlessly.",
        lucideIcon: Bookmark
      },
      {
        id: "card5",
        title: "Radix UI Foundation",
        description: "Leverage Radix UI for accessible and robust componentry.",
        lucideIcon: BookmarkCheck
      },
      {
        id: "card6",
        title: "Tailwind Utility",
        description: "Achieve rapid prototyping with Tailwind CSS's utility-first approach.",
        lucideIcon: Bookmark
      },
      {
        id: "card7",
        title: "Effortless Prototyping",
        description: "Experience flexible and responsive development with pre-built components.",
        lucideIcon: BookmarkCheck
      },
      {
        id: "card8",
        title: "Open Source Excellence",
        description: "Access open source components for personal or commercial projects.",
        lucideIcon: Bookmark,
        colSpan: 2
      }
    ]
  }
}; 