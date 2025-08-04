import { forwardRef, useMemo } from "react";
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
} from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme; // modernUITheme | skyOSTheme

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}

// Hero data interface (internal)
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

interface SplitHeroProps {
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
    content: (mergedContent: HeroData) => (
      <Stack gap="xl" align="start">
        {mergedContent.badge && (
          <Badge variant="secondary" rounded={theme?.themeRounded.badge} size={theme?.themeButtonSize.badge}>
            {mergedContent.badge}
          </Badge>
        )}

        <Title order={1} size="4xl" fw="bold" className="tracking-tight">
          {mergedContent.title}
        </Title>

        <Text c="secondary-foreground" className="max-w-[42rem]">
          {mergedContent.description}
        </Text>

        {(mergedContent.primaryButtonText || mergedContent.secondaryButtonText) && (
          <Group gap="md" align="center">
            {mergedContent.primaryButtonText && (
              <Button
                variant="default"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={mergedContent.primaryButtonIcon ? (
                  <Icon
                    c="primary-foreground"
                    lucideIcon={mergedContent.primaryButtonIcon || Info}
                  />
                ) : undefined}
              >
                {mergedContent.primaryButtonText}
              </Button>
            )}

            {mergedContent.secondaryButtonText && (
              <Button
                variant="outline"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={mergedContent.secondaryButtonIcon ? (
                  <Icon
                    lucideIcon={mergedContent.secondaryButtonIcon || Rocket}
                  />
                ) : undefined}
              >
                {mergedContent.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    )
  }),

  // Hero with gallery
  gallery: createContentHook({
    content: (mergedContent: HeroData) => (
      <Stack gap="xl" align="start">
        {mergedContent.badge && (
          <Badge variant="secondary" rounded={theme?.themeRounded.badge} size={theme?.themeButtonSize.badge}>
            {mergedContent.badge}
          </Badge>
        )}

        <Title order={1} size="4xl" fw="bold" className="tracking-tight">
          {mergedContent.title}
        </Title>

        <Text c="secondary-foreground" className="max-w-[42rem]">
          {mergedContent.description}
        </Text>

        {(mergedContent.primaryButtonText || mergedContent.secondaryButtonText) && (
          <Group gap="md" align="center">
            {mergedContent.primaryButtonText && (
              <Button
                variant="default"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={
                  <Icon
                    c="primary-foreground"
                    lucideIcon={BookOpen}
                  />
                }
              >
                {mergedContent.primaryButtonText}
              </Button>
            )}

            {mergedContent.secondaryButtonText && (
              <Button
                variant="outline"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={
                  <Icon
                    lucideIcon={Code}
                  />
                }
              >
                {mergedContent.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    )
  }),

  // Hero with top button
  withTopButton: createContentHook({
    beforeContent: (mergedContent: HeroData) => (
      mergedContent.topButton ? (
        <Button variant="outline" rounded={theme?.themeRounded.default}>
          <Icon
            lucideIcon={ExternalLink}
          />
          {mergedContent.topButton.text}
        </Button>
      ) : null
    ),
    content: (mergedContent: HeroData) => (
      <Stack gap="xl" align="center" ta="center">
        {mergedContent.badge && (
          <Badge variant="secondary" rounded={theme?.themeRounded.badge} size={theme?.themeButtonSize.badge}>
            {mergedContent.badge}
          </Badge>
        )}

        <Title order={1} size="4xl" fw="bold" ta="center" className="tracking-tight">
          {mergedContent.title}
        </Title>

        <Text c="secondary-foreground" ta="center" className="max-w-[42rem]">
          {mergedContent.description}
        </Text>

        {(mergedContent.primaryButtonText || mergedContent.secondaryButtonText) && (
          <Group gap="md" align="center">
            {mergedContent.primaryButtonText && (
              <Button
                variant="default"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={
                  <Icon
                    c="primary-foreground"
                    lucideIcon={Info}
                  />
                }
              >
                {mergedContent.primaryButtonText}
              </Button>
            )}

            {mergedContent.secondaryButtonText && (
              <Button
                variant="outline"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={
                  <Icon
                    lucideIcon={Rocket}
                  />
                }
              >
                {mergedContent.secondaryButtonText}
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
    py = "lg",
    gap = "xl",
    className,
    ...props
  }, ref) => {

    // Simple content logic: если content пустой - показать defaults, иначе показать content
    const mergedContent = useMemo(() => {
      // Если content содержит данные - используем их как есть
      if (content && Object.keys(content).length > 0) {
        return {
          ...content,
          title: content.title || "Untitled",
          description: content.description || "No description provided"
        };
      }
      
      // Если content пустой - показать lorem ipsum defaults
      // По template ID определяем какие defaults использовать
      // TODO: Получать templateId из props или context
      // Пока используем простое маппинг по variant + leftMedia
      if (variant === "gallery") return splitHeroDefaults.gallery;
      if (variant === "withTopButton") return splitHeroDefaults.withTopButton;
      // security в variant нет, он обрабатывается как media
      if (variant === "media" && leftMedia) return splitHeroDefaults.leftMedia;
      if (variant === "media" && !leftMedia) return splitHeroDefaults.media;
      
      // Fallback
      return splitHeroDefaults.media;
    }, [content, variant, leftMedia]);

    // Create media section based on variant
    const createMediaSection = () => {
      if (variant === "gallery" && (mergedContent as any).images && Array.isArray((mergedContent as any).images)) {
        return (
          <Grid cols="1-2" gap="md">
            {(mergedContent as any).images.map((image: any, index: number) => (
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
                  className="h-full w-full"
                  rounded={theme?.themeRounded.default}
                />
              </Block>
            ))}
          </Grid>
        );
      }

      if ((mergedContent as any).image && typeof (mergedContent as any).image === 'object') {
        return (
          <Block>
            <Image
              src={(mergedContent as any).image.src}
              alt={(mergedContent as any).image.alt}
              width="100%"
              height="auto"
              fit="cover"
              rounded={theme?.themeRounded.default}
            />
          </Block>
        );
      }

      // Default gradient background
      return (
        <Block
          className={`h-full bg-gradient-to-br from-primary/5 to-secondary/10 relative overflow-hidden rounded-${theme?.themeRounded.default}`}
          data-class="hero-gradient-background"
          rounded={theme?.themeRounded.default}
        >
          <Box className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = heroContentHooks[variant as keyof typeof heroContentHooks] || heroContentHooks.media;

    return (
      <SplitBlock
        ref={ref}
        mediaSection={createMediaSection()}
        content={mergedContent}
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
// Default content extracted from examples
const splitHeroDefaults = {
  media: {
    badge: "New Release",
    title: "Build the future with modern technology",
    description: "Transform your ideas into reality with our cutting-edge platform. Experience unparalleled performance, security, and scalability that grows with your business.",
    image: {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Modern technology dashboard"
    },
    primaryButtonText: "Get Started Free",
    secondaryButtonText: "View Demo"
  },
  leftMedia: {
    badge: "Developer Tools",
    title: "Code faster, deploy smarter, scale better",
    description: "Our comprehensive developer platform provides everything you need to build, test, and deploy applications with confidence. Join thousands of developers who trust our tools.",
    image: {
      src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Developer coding environment"
    },
    primaryButtonText: "Start Building",
    secondaryButtonText: "Documentation"
  },
  gallery: {
    badge: "Portfolio",
    title: "Showcase your work beautifully",
    description: "Create stunning portfolios and galleries that captivate your audience. Our platform makes it easy to present your work in the best possible light.",
    images: [
      {
        id: "1",
        src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 1"
      },
      {
        id: "2", 
        src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 2"
      },
      {
        id: "3",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 3"
      }
    ],
    primaryButtonText: "Explore Gallery",
    secondaryButtonText: "Learn More"
  },
  withTopButton: {
    topButton: {
      text: "🎉 Announcing our Series A funding",
      href: "#"
    },
    badge: "Funding News",
    title: "We raised $50M to accelerate innovation",
    description: "With this new funding, we're doubling down on our mission to democratize technology and make powerful tools accessible to everyone.",
    images: [
      {
        id: "1",
        src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 1"
      },
      {
        id: "2", 
        src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 2"
      }
    ],
    primaryButtonText: "Read Announcement",
    secondaryButtonText: "Join Journey"
  },
  security: {
    badge: "Enterprise Security",
    title: "Protect your business with enterprise-grade security",
    description: "Our comprehensive security suite provides advanced threat protection, compliance management, and peace of mind for businesses of all sizes.",
    image: {
      src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Security dashboard interface"
    },
    primaryButtonText: "Start Audit",
    secondaryButtonText: "View Features"
  }
};

// Content schema for domain support
const splitHeroSchema = {
  type: "object",
  required: ["title", "description"],
  properties: {
    badge: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    image: {
      type: "object",
      properties: {
        src: { type: "string" },
        alt: { type: "string" }
      }
    },
    images: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          src: { type: "string" },
          alt: { type: "string" }
        }
      }
    },
    primaryButtonText: { type: "string" },
    secondaryButtonText: { type: "string" },
    topButton: {
      type: "object",
      properties: {
        text: { type: "string" },
        href: { type: "string" }
      }
    }
  }
};

export const splitHeroTemplates = {
  media: {
    id: "splitHeroMedia",
    name: "Split Hero with Media",
    description: "Split layout hero with image and content",
    component: SplitHero,
    defaultProps: { variant: "media" as const },
    defaults: splitHeroDefaults.media,
    schema: splitHeroSchema
  },

  leftMedia: {
    id: "splitHeroLeftMedia",
    name: "Split Hero with Left Media",
    description: "Split layout hero with left image",
    component: SplitHero,
    defaultProps: { variant: "media" as const, leftMedia: true },
    defaults: splitHeroDefaults.leftMedia,
    schema: splitHeroSchema
  },

  gallery: {
    id: "splitHeroGallery",
    name: "Split Hero with Gallery",
    description: "Split layout hero with image gallery",
    component: SplitHero,
    defaultProps: { variant: "gallery" as const },
    defaults: splitHeroDefaults.gallery,
    schema: splitHeroSchema
  },

  withTopButton: {
    id: "splitHeroWithTopButton",
    name: "Split Hero with Top Button",
    description: "Split layout hero with top announcement button",
    component: SplitHero,
    defaultProps: { variant: "withTopButton" as const, useContainer: false },
    defaults: splitHeroDefaults.withTopButton,
    schema: splitHeroSchema
  },

  security: {
    id: "splitHeroSecurity",
    name: "Split Hero Security",
    description: "Split layout hero focused on security features",
    component: SplitHero,
    defaultProps: { variant: "security" as const },
    defaults: splitHeroDefaults.security,
    schema: splitHeroSchema
  }
};