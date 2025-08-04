import { forwardRef, useMemo } from "react";
import { Info, Rocket, ExternalLink, Play, ArrowRight } from "lucide-react";
import {
  Stack,
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
  LayoutBlock,
  createLayoutContentHook,
} from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme; // modernUITheme | skyOSTheme

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}

// Centered Hero data interface (internal)
export interface CenteredHeroData {
  badge?: string;
  title: string;
  description: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
  topButton?: {
    text: string;
    href?: string;
  };
  imageUrl?: string;
  imageAlt?: string;
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

interface CenteredHeroProps {
  content: CenteredHeroData;
  variant?: "simple" | "withTopButton" | "withImage" | "withStats";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Custom content hooks for different centered hero variants
const centeredHeroContentHooks = {
  // Simple centered hero
  simple: createLayoutContentHook({
    header: (content: CenteredHeroData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge}
          </Badge>
        )}

        <Title
          order={1}
          size="5xl"
          fw="bold"
          ta="center"
          className="tracking-tight leading-tight"
        >
          {content.title}
        </Title>

        <Text
          c="secondary-foreground"
          ta="center"
          className="max-w-[42rem]"
        >
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
              <Button
                variant="default"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={content.primaryButtonIcon ? (
                  <Icon
                    c="primary-foreground"
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
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={content.secondaryButtonIcon ? (
                  <Icon
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

  // Centered hero with top button
  withTopButton: createLayoutContentHook({
    beforeHeader: (content: CenteredHeroData) => (
      content.topButton ? (
        <Button variant="outline" size="sm" rounded={theme?.themeRounded.default}>
          <Icon
            lucideIcon={ExternalLink}
          />
          {content.topButton.text}
        </Button>
      ) : null
    ),
    header: (content: CenteredHeroData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge}
          </Badge>
        )}

        <Title
          order={1}
          size="5xl"
          fw="bold"
          ta="center"
          className="tracking-tight leading-tight"
        >
          {content.title}
        </Title>

        <Text
          c="secondary-foreground"
          ta="center"
          className="max-w-[42rem]"
        >
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
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
                {content.primaryButtonText}
              </Button>
            )}

            {content.secondaryButtonText && (
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
                {content.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    )
  }),

  // Centered hero with image
  withImage: createLayoutContentHook({
    header: (content: CenteredHeroData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        <Title
          order={1}
          size="5xl"
          fw="bold"
          ta="center"
          className="tracking-tight leading-tight"
        >
          {content.title}
        </Title>

        <Text
          c="secondary-foreground"
          ta="center"
          className="max-w-[42rem]"
        >
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
              <Button
                variant="default"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
              >
                {content.primaryButtonText}
              </Button>
            )}

            {content.secondaryButtonText && (
              <Button
                variant="outline"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                leftSection={
                  <Icon
                    lucideIcon={Play}
                  />
                }
              >
                {content.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    ),
    afterHeader: (content: CenteredHeroData) => (
      content.imageUrl ? (
        <Box className="w-full max-w-4xl mx-auto">
          <Image
            src={content.imageUrl}
            alt={content.imageAlt || "Hero image"}
            width="100%"
            height="auto"
            rounded={theme?.themeRounded.default}
            className="shadow-2xl"
          />
        </Box>
      ) : null
    )
  }),

  // Centered hero with stats
  withStats: createLayoutContentHook({
    header: (content: CenteredHeroData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge}
          </Badge>
        )}

        <Title
          order={1}
          size="5xl"
          fw="bold"
          ta="center"
          className="tracking-tight leading-tight"
        >
          {content.title}
        </Title>

        <Text
          c="secondary-foreground"
          ta="center"
          className="max-w-[42rem]"
        >
          {content.description}
        </Text>

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
              <Button
                variant="default"
                rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                rightSection={
                  <Icon
                    c="primary-foreground"
                    lucideIcon={ArrowRight}
                  />
                }
              >
                {content.primaryButtonText}
              </Button>
            )}

            {content.secondaryButtonText && (
              <Button variant="outline" rounded={theme?.themeRounded.default} size={theme?.themeButtonSize.default}>
                {content.secondaryButtonText}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    ),
    afterHeader: (content: CenteredHeroData) => (
      content.stats ? (
        <Group gap="xl" align="center" justify="center" className="flex-wrap">
          {content.stats.map((stat) => (
            <Stack key={stat.id} gap="xs" align="center">
              <Text size="3xl" fw="bold" c="primary" className="leading-none">
                {stat.value}
              </Text>
              <Text c="secondary-foreground" ta="center">
                {stat.label}
              </Text>
            </Stack>
          ))}
        </Group>
      ) : null
    )
  })
};

export const CenteredHero = forwardRef<HTMLElement, CenteredHeroProps>(
  ({
    content,
    variant = "simple",
    useContainer = true,
    py = "lg",
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
      return centeredHeroDefaults[variant as keyof typeof centeredHeroDefaults] || centeredHeroDefaults.simple;
    }, [content, variant]);

    // Choose content hooks based on variant
    const contentHooks = centeredHeroContentHooks[variant] || centeredHeroContentHooks.simple;

    return (
      <LayoutBlock
        ref={ref}
        layout="stack"
        useContainer={useContainer}
        py={py}
        showHeader={true} // We use header hooks for content
        content={mergedContent}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

CenteredHero.displayName = "CenteredHero";

// Default content extracted from examples
const centeredHeroDefaults = {
  simple: {
    badge: "Welcome",
    title: "The future of work is here",
    description: "Transform the way your team collaborates with our innovative platform. Built for modern teams who demand flexibility, security, and performance.",
    primaryButtonText: "Get Started Free",
    secondaryButtonText: "Watch Demo"
  },
  withTopButton: {
    topButton: {
      text: "✨ New: AI-powered automation is here",
      href: "#"
    },
    badge: "AI Innovation",
    title: "Automate your workflow with intelligent AI",
    description: "Discover how artificial intelligence can streamline your processes, reduce manual work, and help your team focus on what matters most.",
    primaryButtonText: "Try AI Features",
    secondaryButtonText: "Learn More"
  },
  withImage: {
    title: "Experience the power of visual storytelling",
    description: "Create compelling narratives that resonate with your audience. Our platform provides all the tools you need to craft beautiful, engaging content that drives results.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Visual storytelling dashboard",
    primaryButtonText: "Start Creating",
    secondaryButtonText: "Watch Tutorial"
  },
  withStats: {
    badge: "Trusted Globally",
    title: "Join millions who trust our platform",
    description: "Our growing community of users worldwide relies on our platform to achieve their goals. See why businesses of all sizes choose us as their trusted partner.",
    stats: [
      {
        id: "1",
        value: "2M+",
        label: "Active Users"
      },
      {
        id: "2",
        value: "150+",
        label: "Countries"
      },
      {
        id: "3",
        value: "99.9%",
        label: "Uptime"
      },
      {
        id: "4",
        value: "24/7",
        label: "Support"
      }
    ],
    primaryButtonText: "Join Community",
    secondaryButtonText: "View Testimonials"
  },
  mission: {
    badge: "Our Mission",
    title: "Building technology that brings people together",
    description: "We believe technology should connect us, not divide us. Our mission is to create tools that foster collaboration, understanding, and positive change in the world.",
    stats: [
      {
        id: "1",
        value: "50M+",
        label: "Connections Made"
      },
      {
        id: "2",
        value: "195",
        label: "Countries Reached"
      },
      {
        id: "3",
        value: "1B+",
        label: "Messages Sent"
      }
    ],
    primaryButtonText: "Join Our Mission",
    secondaryButtonText: "Read Our Story"
  }
};

// Content schema for domain support
const centeredHeroSchema = {
  type: "object",
  required: ["title", "description"],
  properties: {
    badge: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    primaryButtonText: { type: "string" },
    secondaryButtonText: { type: "string" },
    topButton: {
      type: "object",
      properties: {
        text: { type: "string" },
        href: { type: "string" }
      }
    },
    imageUrl: { type: "string" },
    imageAlt: { type: "string" },
    stats: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          value: { type: "string" },
          label: { type: "string" }
        }
      }
    }
  }
};

export const centeredHeroTemplates = {
  simple: {
    id: "centeredHeroSimple",
    name: "Simple Centered Hero",
    description: "Centered hero section with badge, title, description and buttons",
    component: CenteredHero,
    defaultProps: { variant: "simple" as const },
    defaults: centeredHeroDefaults.simple,
    schema: centeredHeroSchema
  },

  withTopButton: {
    id: "centeredHeroWithTopButton",
    name: "Centered Hero with Top Button",
    description: "Centered hero with announcement button at the top",
    component: CenteredHero,
    defaultProps: { variant: "withTopButton" as const },
    defaults: centeredHeroDefaults.withTopButton,
    schema: centeredHeroSchema
  },

  withImage: {
    id: "centeredHeroWithImage",
    name: "Centered Hero with Image",
    description: "Centered hero with large image below content",
    component: CenteredHero,
    defaultProps: { variant: "withImage" as const },
    defaults: centeredHeroDefaults.withImage,
    schema: centeredHeroSchema
  },

  withStats: {
    id: "centeredHeroWithStats",
    name: "Centered Hero with Stats",
    description: "Centered hero with statistics display below content",
    component: CenteredHero,
    defaultProps: { variant: "withStats" as const },
    defaults: centeredHeroDefaults.withStats,
    schema: centeredHeroSchema
  },

  mission: {
    id: "centeredHeroMission",
    name: "Centered Hero Mission",
    description: "Centered hero for mission/vision statements",
    component: CenteredHero,
    defaultProps: { variant: "mission" as const },
    defaults: centeredHeroDefaults.mission,
    schema: centeredHeroSchema
  }
};