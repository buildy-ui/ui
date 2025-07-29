import { forwardRef } from "react";
import { Info, Rocket, BookOpen, Code, ExternalLink } from "lucide-react";
import {
  Block,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Image,
  Icon,
  Box
} from "@ui8kit/core";
import { 
  SplitBlock, 
  createContentHook, 
  defaultContentHooks, 
  advancedContentHooks,
  type ContentHooks 
} from "@ui8kit/core";

// Hero data interface
export interface HeroData {
  badge?: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  images?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
  topButton?: {
    text: string;
    href?: string;
  };
}

export interface SplitHeroProps {
  content: HeroData;
  variant?: "media" | "gallery" | "simple" | "withTopButton";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different hero variants
const heroContentHooks = {
  // Simple hero with media
  media: createContentHook({
    content: (content: HeroData) => (
      <Stack gap="xl" align="start">
        {content.badge && (
          <Badge variant="secondary" size="default" rounded="md">
            {content.badge}
          </Badge>
        )}

        <Title order={1} size="4xl" fw="bold" className="tracking-tight">
          {content.title}
        </Title>

        <Text size="xl" c="secondary-foreground" className="max-w-[42rem]">
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
              <Button
                size="lg"
                variant="default"
                leftSection={content.primaryButtonIcon ? (
                  <Icon
                    component="span"
                    size="md"
                    lucideIcon={content.primaryButtonIcon || Info}
                  />
                ) : undefined}
              >
                {content.primaryButtonText}
              </Button>
            )}

            {content.secondaryButtonText && (
              <Button
                variant="outline"
                size="lg"
                leftSection={content.secondaryButtonIcon ? (
                  <Icon
                    component="span"
                    size="md"
                    lucideIcon={content.secondaryButtonIcon || Rocket}
                  />
                ) : undefined}
              >
                {content.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    )
  }),

  // Hero with gallery
  gallery: createContentHook({
    content: (content: HeroData) => (
      <Stack gap="xl" align="start">
        {content.badge && (
          <Badge variant="secondary" size="default" rounded="md">
            {content.badge}
          </Badge>
        )}

        <Title order={1} size="4xl" fw="bold" className="tracking-tight">
          {content.title}
        </Title>

        <Text size="xl" c="secondary-foreground" className="max-w-[42rem]">
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
              <Button
                size="lg"
                variant="default"
                leftSection={
                  <Icon
                    component="span"
                    size="md"
                    lucideIcon={BookOpen}
                  />
                }
              >
                {content.primaryButtonText}
              </Button>
            )}

            {content.secondaryButtonText && (
              <Button
                variant="outline"
                size="lg"
                leftSection={
                  <Icon
                    component="span"
                    size="md"
                    lucideIcon={Code}
                  />
                }
              >
                {content.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    )
  }),

  // Hero with top button
  withTopButton: createContentHook({
    beforeContent: (content: HeroData) => (
      content.topButton ? (
        <Button variant="outline" size="sm" rounded="full">
          <Icon
            component="span"
            size="xs"
            lucideIcon={ExternalLink}
          />
          {content.topButton.text}
        </Button>
      ) : null
    ),
    content: (content: HeroData) => (
      <Stack gap="xl" align="center" ta="center">
        {content.badge && (
          <Badge variant="secondary" size="default" rounded="md">
            {content.badge}
          </Badge>
        )}

        <Title order={1} size="4xl" fw="bold" ta="center" className="tracking-tight">
          {content.title}
        </Title>

        <Text size="xl" c="secondary-foreground" ta="center" className="max-w-[42rem]">
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
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
            )}

            {content.secondaryButtonText && (
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
            )}
          </Group>
        )}
      </Stack>
    )
  })
};

export const SplitHero = forwardRef<HTMLElement, SplitHeroProps>(
  ({ 
    content, 
    variant = "media",
    leftMedia = false,
    useContainer = true,
    py = "2xl",
    gap = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Create media section based on variant
    const createMediaSection = () => {
      if (variant === "gallery" && content.images) {
        return (
          <Grid cols="1-2" gap="md">
            {content.images.map((image, index) => (
              <Block 
                key={image.id} 
                className={index === 0 ? "row-span-2" : ""}
                data-class="gallery-item"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width="100%"
                  height="100%"
                  fit="cover"
                  rounded="md"
                  className="w-full h-full"
                />
              </Block>
            ))}
          </Grid>
        );
      }

      if (content.image) {
        return (
          <Block>
            <Image
              src={content.image.src}
              alt={content.image.alt}
              width="100%"
              height="auto"
              rounded="lg"
              fit="cover"
            />
          </Block>
        );
      }

      // Default gradient background
      return (
        <Block 
          className="h-full bg-gradient-to-br from-primary/5 to-secondary/10 relative overflow-hidden"
          data-class="hero-gradient-background"
        >
          <Box className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = heroContentHooks[variant] || heroContentHooks.media;

    return (
      <SplitBlock
        ref={ref}
        mediaSection={createMediaSection()}
        content={content}
        contentHooks={contentHooks}
        leftMedia={leftMedia}
        splitSection={!useContainer}
        py={py}
        gap={gap}
        className={className}
        {...props}
      />
    );
  }
);

SplitHero.displayName = "SplitHero";

// Export template configurations
export const splitHeroTemplates = {
  media: {
    id: "splitHeroMedia",
    name: "Split Hero with Media",
    description: "Split layout hero with image and content",
    component: SplitHero,
    defaultProps: { variant: "media" as const }
  },
  
  leftMedia: {
    id: "splitHeroLeftMedia", 
    name: "Split Hero with Left Media",
    description: "Split layout hero with left image",
    component: SplitHero,
    defaultProps: { variant: "media" as const, leftMedia: true }
  },

  gallery: {
    id: "splitHeroGallery",
    name: "Split Hero with Gallery",
    description: "Split layout hero with image gallery",
    component: SplitHero,
    defaultProps: { variant: "gallery" as const }
  },

  withTopButton: {
    id: "splitHeroWithTopButton",
    name: "Split Hero with Top Button",
    description: "Split layout hero with top announcement button",
    component: SplitHero,
    defaultProps: { variant: "withTopButton" as const, useContainer: false }
  }
};