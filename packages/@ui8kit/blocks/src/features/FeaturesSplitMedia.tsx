import { forwardRef } from "react";
import { Check } from "lucide-react";
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

interface FeaturesSplitMediaProps {
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
    }>;
  };
}

export const FeaturesSplitMedia = forwardRef<HTMLElement, FeaturesSplitMediaProps>(
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
                        lucideIcon={Check}
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
          </Grid>
        </Container>
      </Block>
    );
  }
);

FeaturesSplitMedia.displayName = "FeaturesSplitMedia";

export const featuresSplitMediaTemplate = {
  id: "featuresSplitMedia",
  name: "Features Split Media",
  description: "Features section with split layout and media",
  component: FeaturesSplitMedia,
  defaultContent: {
    badge: "Features",
    title: "Powerful features for modern development",
    description: "Everything you need to build amazing products with confidence and speed.",
    image: {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Features"
    },
    features: [
      {
        id: "feature2",
        title: "Tailwind CSS Styling",
        description: "Utilize Tailwind CSS for effortless customization and rapid development of your UI components."
      },
      {
        id: "feature3",
        title: "Free and Open Source",
        description: "Access these beautifully crafted components absolutely free, perfect for both personal and commercial projects."
      }
    ]
  }
}; 