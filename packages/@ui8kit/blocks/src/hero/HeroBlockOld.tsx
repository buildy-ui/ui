import { forwardRef } from "react";
import {
  Box,
  Block,
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Icon,
  BackgroundImage,
  Overlay
} from "@ui8kit/core";

interface HeroBlockProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    learnMoreText: string;
    backgroundImage: string;
  };
}

export const HeroBlock = forwardRef<HTMLElement, HeroBlockProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        data-class="hero-block"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <BackgroundImage
          src={content.backgroundImage}
          size="cover"
          position="absolute-inset"
        />

        {/* Overlay */}
        <Overlay
          color="black"
          opacity={70}
        />

        {/* Content */}
        <Container
          size="lg"
          padding="responsive"
          data-class="hero-content"
          className="relative z-10 h-full flex items-center"
        >
          <Stack gap="lg" ta="center" centered size="4xl">
            <Title
              order={1}
              size="4xl"
              fw="bold"
              c="white"
            >
              {content.title}
            </Title>

            <Text
              size="xl"
              c="secondaryForeground"
              leading="relaxed"
            >
              {content.subtitle}
            </Text>

            <Group
              justify="center"
              gap="md"
              direction="col"
              responsive="sm"
            >
              <Button
                size="lg"
              >
                {content.buttonText}
                <Icon
                  component="span"
                  size="md"
                  spacing="left"
                  display="inline"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' /%3e%3c/svg%3e")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
              >
                <Icon
                  component="span"
                  size="md"
                  spacing="right"
                  display="inline"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z' /%3e%3c/svg%3e")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                {content.learnMoreText}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Block>
    );
  }
);

HeroBlock.displayName = "HeroBlock";

export const heroTemplate = {
  id: "hero",
  name: "Hero Section",
  description: "Eye-catching header with CTA",
  component: HeroBlock,
  defaultContent: {
    title: "Build Something Amazing",
    subtitle: "Create stunning landing pages with our professional page builder",
    buttonText: "Get Started",
    backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=75"
  }
}; 