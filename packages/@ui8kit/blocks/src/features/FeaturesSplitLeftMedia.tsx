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
      iconSvg: string;
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
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 010 0L21.75 9M21.75 9H15M21.75 9v6.75' /></svg>`
      },
      {
        id: "feature2",
        title: "Team Collaboration",
        description: "Work together seamlessly with built-in collaboration tools.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' /></svg>`
      }
    ]
  }
}; 