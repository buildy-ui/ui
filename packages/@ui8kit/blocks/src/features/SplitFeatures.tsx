import { forwardRef } from "react";
import { Check } from "lucide-react";
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
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  SplitBlock, 
  createContentHook,
} from "@ui8kit/core";

// Features data interface
interface FeaturesData {
  badge: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  features?: Array<{
    id: string;
    title: string;
    description: string;
    lucideIcon?: any;
  }>;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
}

interface SplitFeaturesProps {
  content: FeaturesData;
  variant?: "media" | "leftMedia" | "features" | "analytics" | "career";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different variants
const featuresContentHooks = {
  // Media variant - simple image + content
  media: createContentHook({
    content: (content: FeaturesData) => (
      <Stack gap="lg" align="start" p="md">
        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
          {content.badge}
        </Badge>

        <Title order={2} size="3xl" fw="bold">
          {content.title}
        </Title>

        <Text c="secondary-foreground">
          {content.description}
        </Text>

        {content.features && (
          <Stack gap="md">
            {content.features.map((feature, index) => (
              <Group key={feature.id || index} gap="md" align="start">
                <Icon
                  component="span"
                  size="sm"
                  lucideIcon={Check}
                  c="primary"
                  className="mt-1 flex-shrink-0"
                />
                <Stack gap="xs">
                  <Text fw="semibold">{feature.title}</Text>
                  <Text c="secondary-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        )}

        {(content.primaryButtonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.primaryButtonText && (
              <Button rounded={theme?.themeRounded.default}
                size="lg"
                variant="default"
                leftSection={content.primaryButtonIcon ? (
                  <Icon
                    component="span"
                    size="md"
                    c="primary-foreground" lucideIcon={content.primaryButtonIcon}
                  />
                ) : undefined}
              >
                {content.primaryButtonText}
              </Button>
            )}

            {content.secondaryButtonText && (
              <Button rounded={theme?.themeRounded.default}
                variant="outline"
                size="lg"
                leftSection={content.secondaryButtonIcon ? (
                  <Icon
                    component="span"
                    size="md"
                    lucideIcon={content.secondaryButtonIcon}
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

  // Features variant - with feature icons
  features: createContentHook({
    content: (content: FeaturesData) => (
      <Stack gap="lg" align="start" p="md">
        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
          {content.badge}
        </Badge>

        <Title order={2} size="3xl" fw="bold">
          {content.title}
        </Title>

        <Text c="secondary-foreground">
          {content.description}
        </Text>

        {content.features && (
          <Grid cols="1-2" gap="lg" className="w-full" data-class="features-grid">
            {content.features.map((feature, index) => (
              <Group key={feature.id || index} gap="md" align="start">
                {feature.lucideIcon && (
                  <Box 
                    p="sm" 
                    bg="primary" 
                    rounded={theme?.themeRounded.default} 
                    className="flex-shrink-0"
                    data-class="feature-icon"
                  >
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={feature.lucideIcon}
                      c="primary-foreground"
                    />
                  </Box>
                )}
                <Stack gap="xs">
                  <Title order={4} size="md" fw="semibold">
                    {feature.title}
                  </Title>
                  <Text c="secondary-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Grid>
        )}
      </Stack>
    )
  }),

  // Analytics variant - with stats cards
  analytics: createContentHook({
    content: (content: FeaturesData) => (
      <Stack 
        gap="lg" 
        align="start" 
        className="p-6 sm:p-8 lg:p-12 max-w-lg"
        data-class="analytics-content"
      >
        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
          {content.badge}
        </Badge>

        <Title 
          order={2} 
          size="3xl" 
          fw="bold"
          className="tracking-tight"
        >
          {content.title}
        </Title>

        <Text 
          size="lg" 
          c="secondary-foreground"
          className="max-w-[42rem]"
        >
          {content.description}
        </Text>
        
        {/* Analytics Cards */}
        <Grid cols="1-2" gap="md" className="w-full" data-class="analytics-cards">
          <Box 
            p="lg" 
            bg="card" 
            rounded={theme?.themeRounded.default} 
            border="1px" 
            borderColor="border" 
            className="shadow"
          >
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">84%</Text>
              <Text size="xs" c="secondary-foreground">
                Conversion Rate
              </Text>
            </Stack>
          </Box>
          <Box 
            p="lg" 
            bg="card" 
            rounded={theme?.themeRounded.default} 
            border="1px" 
            borderColor="border" 
            className="shadow"
          >
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">12.5k</Text>
              <Text size="xs" c="secondary-foreground">
                Active Users
              </Text>
            </Stack>
          </Box>
        </Grid>

        {content.features && (
          <Stack gap="md" className="w-full" data-class="features-list">
            {content.features.map((feature, index) => (
              <Group key={feature.id || index} gap="md" align="start">
                <Badge variant="default" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>✓</Badge>
                <Stack gap="xs">
                  <Text fw="semibold">{feature.title}</Text>
                  <Text c="secondary-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    )
  })
};

export const SplitFeatures = forwardRef<HTMLElement, SplitFeaturesProps>(
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
    
    // Create media section
    const mediaSection = content.image ? (
      <Block>
        <Image
          src={content.image.src}
          alt={content.image.alt}
          width="100%"
          height="auto"
          rounded={theme?.themeRounded.default}
          fit="cover"
        />
      </Block>
    ) : (
      <Block 
        className={`h-full bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden rounded-${theme?.themeRounded.default}`}
        data-class="gradient-background"
        rounded={theme?.themeRounded.default}
      >
        <Box className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
      </Block>
    );

    // Choose content hooks based on variant
    const contentHooks = featuresContentHooks[variant as keyof typeof featuresContentHooks] || featuresContentHooks.media;

    return (
      <SplitBlock
        ref={ref}
        mediaSection={mediaSection}
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

SplitFeatures.displayName = "SplitFeatures";

// Export template configurations
export const splitFeaturesTemplates = {
  media: {
    id: "splitFeaturesMedia",
    name: "Split Features with Media",
    description: "Split layout with image and feature list",
    component: SplitFeatures,
    defaultProps: { variant: "media" as const }
  },
  
  leftMedia: {
    id: "splitFeaturesLeftMedia", 
    name: "Split Features with Left Media",
    description: "Split layout with left image and features",
    component: SplitFeatures,
    defaultProps: { variant: "media" as const, leftMedia: true }
  },

  features: {
    id: "splitFeaturesIcons",
    name: "Split Features with Icons", 
    description: "Split layout with feature icons grid",
    component: SplitFeatures,
    defaultProps: { variant: "features" as const }
  },

  analytics: {
    id: "splitFeaturesAnalytics",
    name: "Split Features Analytics",
    description: "Split layout with analytics cards",
    component: SplitFeatures,
    defaultProps: { variant: "analytics" as const, useContainer: false, gap: "none" as const }
  },

  security: {
    id: "splitFeaturesSecurity",
    name: "Split Features Security",
    description: "Split layout with security features",
    component: SplitFeatures,
    defaultProps: { variant: "security" as const }
  },

  performance: {
    id: "splitFeaturesPerformance",
    name: "Split Features Performance",
    description: "Split layout with performance features",
    component: SplitFeatures,
    defaultProps: { variant: "performance" as const }
  }
};