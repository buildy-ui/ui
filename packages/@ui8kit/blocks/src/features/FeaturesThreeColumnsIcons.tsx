import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Badge,
  Icon
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
      iconSvg: string;
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
                  <Icon
                    component="div"
                    className="w-16 h-16 p-4 bg-primary/10 rounded-lg"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(feature.iconSvg)}")`,
                      backgroundSize: '32px 32px',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                  />
                  
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
        title: "Developer-First",
        description: "Built by developers, for developers with best practices in mind.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5' /></svg>`
      },
      {
        id: "feature2",
        title: "Type Safe",
        description: "Full TypeScript support with comprehensive type definitions.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>`
      },
      {
        id: "feature3",
        title: "Modern Stack",
        description: "Built with the latest technologies and frameworks.",
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' /></svg>`
      }
    ]
  }
}; 