import { forwardRef } from "react";
import { ArrowRight, Play } from "lucide-react";
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
        h="screen"
        w="full"
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
          opacity={50}
        />

        {/* Content */}
        <Box
          position="relative"
          h="full"
          display="flex"
          align="center"
          justify="center"
          z="10"
        >
          <Container
            size="lg"
            padding="responsive"
          >
          <Stack gap="xl" ta="center" align="center" w="4xl">
            <Title
              order={1}
              size="4xl"
              fw="bold"
              c="white"
              ta="center"
            >
              {content.title}
            </Title>

            <Text
              size="xl"
              c="white"
              ta="center"
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
                variant="default"
              >
                {content.buttonText}
                <Icon
                  component="span"
                  size="sm"
                  spacing="left"
                  lucideIcon={ArrowRight}
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
              >
                <Icon
                  component="span"
                  size="sm"
                  spacing="right"
                  lucideIcon={Play}
                />
                Watch Demo
              </Button>
            </Group>
          </Stack>
          </Container>
        </Box>
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