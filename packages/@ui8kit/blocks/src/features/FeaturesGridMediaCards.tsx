import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Card,
  Image,
  Icon,
  Box
} from "@ui8kit/core";

interface FeaturesGridMediaCardsProps {
  content: {
    badge: string;
    title: string;
    description: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
      image: {
        src: string;
        alt: string;
      };
      lucideIcon: any;
    }>;
  };
}

export const FeaturesGridMediaCards = forwardRef<HTMLElement, FeaturesGridMediaCardsProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="3xl" align="center">
            {/* Header */}
            <Stack gap="md" align="center" ta="center" size="2xl">
              <Badge variant="secondary">
                {content.badge}
              </Badge>
              
              <Title
                order={2}
                size="3xl"
                fw="bold"
                ta="center"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
                ta="center"
              >
                {content.description}
              </Text>
            </Stack>
            
            {/* Features Grid */}
            <Grid cols="cols3" gap="lg">
              {content.features.map((feature) => (
                <Card key={feature.id} padding="none" radius="lg">
                  <Box>
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      radius="t_lg"
                      width="100%"
                      height="auto"
                      aspect="video"
                    />
                  </Box>
                  
                  <Card.Content>
                    <Stack gap="md" align="start" ta="left">
                      <Box size="xl" bg="primary" rounded="lg" flex="center">
                      <Icon
                        lucideIcon={feature.lucideIcon}
                        size="md"
                      />
                      </Box>
                      
                      <Title
                        order={3}
                        size="lg"
                        fw="semibold"
                      >
                        {feature.title}
                      </Title>
                      
                      <Text
                        size="sm"
                        c="muted-foreground"
                      >
                        {feature.description}
                      </Text>
                    </Stack>
                  </Card.Content>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

FeaturesGridMediaCards.displayName = "FeaturesGridMediaCards";

export const featuresGridMediaCardsTemplate = {
  id: "featuresGridMediaCards",
  name: "Features Grid Media Cards",
  description: "Features section with grid layout and media cards",
  component: FeaturesGridMediaCards,
  defaultContent: {
    badge: "Features",
    title: "Everything you need to succeed",
    description: "Our comprehensive platform provides all the tools and features you need to build amazing products.",
    features: [
      {
        id: "feature1",
        title: "Lightning Fast",
        description: "Built for speed and performance with optimized code and efficient architecture.",
        image: {
          src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Fast Performance"
        },
        lucideIcon: ArrowRight
      },
      {
        id: "feature2",
        title: "Secure by Default",
        description: "Enterprise-grade security with encryption and compliance built-in from the ground up.",
        image: {
          src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Security"
        },
        lucideIcon: ArrowRight
      },
      {
        id: "feature3",
        title: "Easy Integration",
        description: "Simple APIs and comprehensive documentation make integration a breeze for any team.",
        image: {
          src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Integration"
        },
        lucideIcon: ArrowRight
      }
    ]
  }
}; 