import { forwardRef } from "react";
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
      iconSvg: string;
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
                    <Box size="xl" bg="primary" rounded="lg">
                      <Icon
                        component="div"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(feature.iconSvg)}")`,
                          backgroundSize: '16px 16px',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center'
                        }}
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
        id: "feature1",
        title: "Fast Development",
        description: "Build faster with our optimized components and tools.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' /></svg>`
      },
      {
        id: "feature2",
        title: "Secure",
        description: "Enterprise-grade security built into every component.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>`
      },
      {
        id: "feature3",
        title: "Scalable",
        description: "Grows with your business from startup to enterprise.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 010 0L21.75 9M21.75 9H15M21.75 9v6.75' /></svg>`
      }
    ]
  }
}; 