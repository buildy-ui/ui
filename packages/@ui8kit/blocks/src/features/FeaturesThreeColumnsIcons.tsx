import { forwardRef } from "react";
import { ZoomIn, BarChartHorizontal, CircleHelp } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Icon,
  Box
} from "@ui8kit/core";

interface FeaturesThreeColumnsIconsProps {
  content: {
    badge: string;
    title: string;
    description: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
      lucideIcon: any;
    }>;
  };
}

export const FeaturesThreeColumnsIcons = forwardRef<HTMLElement, FeaturesThreeColumnsIconsProps>(
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
                <Stack key={feature.id} gap="md" align="center" ta="center">
                  <Box size="2xl" bg="primary" rounded="lg">
                    <Icon
                      component="div"
                      lucideIcon={feature.lucideIcon}
                      size="xl"
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
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

FeaturesThreeColumnsIcons.displayName = "FeaturesThreeColumnsIcons";

export const featuresThreeColumnsIconsTemplate = {
  id: "featuresThreeColumnsIcons",
  name: "Features Three Columns Icons",
  description: "Three-column features layout with icons",
  component: FeaturesThreeColumnsIcons,
  defaultContent: {
    badge: "Features",
    title: "Built for developers",
    description: "Everything you need to build modern applications with confidence.",
          features: [
        {
          id: "feature1",
          title: "Quality",
          description: "We prioritize excellence and precision in all our offerings to ensure unparalleled user satisfaction.",
          lucideIcon: ZoomIn
        },
        {
          id: "feature2",
          title: "Experience",
          description: "Our seasoned team provides insights and expertise drawn from years of industry know-how.",
          lucideIcon: BarChartHorizontal
        },
        {
          id: "feature3",
          title: "Support",
          description: "Around-the-clock assistance to ensure your needs are met with urgency and attention.",
          lucideIcon: CircleHelp
        }
      ]
  }
}; 