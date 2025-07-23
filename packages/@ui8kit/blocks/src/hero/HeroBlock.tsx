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
// TODO: Импортировать HeroContainer и ContentWrapper из backlog когда настроится система импортов

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
        position="relative"
        display="flex"
        h="screen"
        align="center"
        justify="center"
        overflow="hidden"
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
          position="relative"
          display="flex"
          h="full"
          align="center"
          z="10"
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
                  svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />"
                  svgSize="16"
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
                  svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z' />"
                  svgSize="16"
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