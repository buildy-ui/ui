import { forwardRef } from "react";
import { Info, Rocket } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Group,
  Grid,
  Title,
  Text,
  Button,
  Badge,
  Image,
  Icon,
  Box
} from "@ui8kit/core";

interface HeroSplitWithMediaProps {
  content: {
    badge: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    image: {
      src: string;
      alt: string;
    };
  };
  leftImage?: true;
}

export const HeroSplitWithMedia = forwardRef<HTMLElement, HeroSplitWithMediaProps>(
  ({ content, leftImage }, ref) => {
    const imageElement = (
      <Box>
        <Image
          src={content.image.src}
          alt={content.image.alt}
          width="100%"
          height="auto"
          rounded="lg"
        />
      </Box>
    );

    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" centered>
          <Grid
            cols={2}
            gap="xl"
            align="center"
          >
            {leftImage === true ? imageElement : null}

            {/* Content */}
            <Stack gap="lg" align="start">
              <Badge variant="secondary">
                {content.badge}
              </Badge>

              <Title
                order={1}
                size="3xl"
                fw="bold"
              >
                {content.title}
              </Title>

              <Text
                size="lg"
                c="secondary-foreground"
              >
                {content.description}
              </Text>

              <Group gap="md" align="center">
                <Button
                  size="lg"
                  variant="default"
                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={Info}
                    />
                  }
                >
                  {content.primaryButtonText}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={Rocket}
                    />
                  }
                >
                  {content.secondaryButtonText}
                </Button>
              </Group>
            </Stack>

            {leftImage !== true ? imageElement : null}
          </Grid>
        </Container>
      </Block>
    );
  }
);

HeroSplitWithMedia.displayName = "HeroSplitWithMedia";

export const heroSplitWithMediaTemplate = {
  id: "heroSplitWithMedia",
  name: "Hero Split With Media",
  description: "Split layout hero section with content and image",
  component: HeroSplitWithMedia,
  defaultContent: {
    badge: "New Feature",
    title: "Build Amazing Products",
    description: "Create stunning applications with our powerful tools and components. Experience the future of development.",
    primaryButtonText: "Get Started",
    secondaryButtonText: "Learn More",
    image: {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      alt: "Hero Image"
    }
  }
}; 