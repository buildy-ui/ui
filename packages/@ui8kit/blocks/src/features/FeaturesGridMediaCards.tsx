import { forwardRef } from "react";
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
  Icon
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
      iconSvg: string;
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
                <Card key={feature.id} className="overflow-hidden">
                  <Block className="aspect-video relative overflow-hidden">
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      className="w-full h-full object-cover"
                    />
                  </Block>
                  
                  <Stack gap="md" className="p-6">
                    <Icon
                      component="div"
                      className="w-12 h-12 p-3 bg-primary/10 rounded-lg"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(feature.iconSvg)}")`,
                        backgroundSize: '24px 24px',
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
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' /></svg>`
      },
      {
        id: "feature2",
        title: "Secure by Default",
        description: "Enterprise-grade security with encryption and compliance built-in from the ground up.",
        image: {
          src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Security"
        },
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>`
      },
      {
        id: "feature3",
        title: "Easy Integration",
        description: "Simple APIs and comprehensive documentation make integration a breeze for any team.",
        image: {
          src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Integration"
        },
        iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' /></svg>`
      }
    ]
  }
}; 