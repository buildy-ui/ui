import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge
} from "@ui8kit/core";

interface FeaturesThreeColumnsProps {
  content: {
    badge: string;
    title: string;
    description: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
}

export const FeaturesThreeColumns = forwardRef<HTMLElement, FeaturesThreeColumnsProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl">
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
                <Stack key={feature.id} gap="md" align="start" ta="left">
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
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

FeaturesThreeColumns.displayName = "FeaturesThreeColumns";

export const featuresThreeColumnsTemplate = {
  id: "featuresThreeColumns",
  name: "Features Three Columns",
  description: "Simple three-column features layout",
  component: FeaturesThreeColumns,
  defaultContent: {
    badge: "Features",
    title: "Why choose our platform",
    description: "Discover the key benefits that make our solution the right choice for your business.",
    features: [
      {
        id: "feature1",
        title: "Easy to Use",
        description: "Intuitive interface designed for users of all skill levels."
      },
      {
        id: "feature2",
        title: "Reliable",
        description: "99.9% uptime guarantee with enterprise-grade infrastructure."
      },
      {
        id: "feature3",
        title: "Scalable",
        description: "Grows with your business from startup to enterprise scale."
      }
    ]
  }
}; 