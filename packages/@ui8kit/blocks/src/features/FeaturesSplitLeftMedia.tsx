import { forwardRef } from "react";
import { Check, ChartLine, Users } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Image,
  Icon,
  Box
} from "@ui8kit/core";

interface FeaturesSplitLeftMediaProps {
  content: {
    badge: string;
    title: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
    features: Array<{
      id: string;
      title: string;
      description: string;
      lucideIcon: any;
    }>;
  };
}

export const FeaturesSplitLeftMedia = forwardRef<HTMLElement, FeaturesSplitLeftMediaProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Grid cols="cols2" gap="xl" align="center">
            {/* Image */}
            <Box>
              <Image
                src={content.image.src}
                alt={content.image.alt}
                width="100%"
                height="auto"
                radius="lg"
              />
            </Box>
            
            {/* Content */}
            <Stack gap="lg" align="start">
              <Badge variant="secondary">
                {content.badge}
              </Badge>
              
              <Title
                order={2}
                size="3xl"
                fw="bold"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
              >
                {content.description}
              </Text>
              
              <Stack gap="md">
                {content.features.map((feature) => (
                  <Stack key={feature.id} gap="sm" direction="row" align="start">
                    <Box size="xl" bg="primary" rounded="lg" flex="center">
                      <Icon
                        lucideIcon={feature.lucideIcon}
                        size="md"
                      />
                    </Box>
                    <Stack gap="xs">
                      <Title order={4} size="md" fw="semibold">
                        {feature.title}
                      </Title>
                      <Text size="sm" c="muted-foreground">
                        {feature.description}
                      </Text>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Container>
      </Block>
    );
  }
);

FeaturesSplitLeftMedia.displayName = "FeaturesSplitLeftMedia";

export const featuresSplitLeftMediaTemplate = {
  id: "featuresSplitLeftMedia",
  name: "Features Split Left Media",
  description: "Features section with split layout and media on left",
  component: FeaturesSplitLeftMedia,
  defaultContent: {
    badge: "Features",
    title: "Advanced capabilities",
    description: "Discover powerful features designed to enhance your workflow and productivity.",
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Advanced Features"
    },
    features: [
      {
        id: "feature1",
        title: "Real-time Analytics",
        description: "Monitor performance with live data and insights.",
        lucideIcon: ChartLine
      },
      {
        id: "feature2",
        title: "Team Collaboration",
        description: "Work together seamlessly with built-in collaboration tools.",
        lucideIcon: Users
      }
    ]
  }
}; 