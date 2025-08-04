import { forwardRef } from "react";
import {
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  Star
} from "lucide-react";
import {
  Block,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Card,
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

// CTA interfaces (reuse from CenteredCTA)
interface CTAButton {
  id: string;
  text: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  lucideIcon?: any;
  href?: string;
}

interface CTAFeature {
  id: string;
  title: string;
  description?: string;
  lucideIcon?: any;
}

// Split CTA data interface
export interface SplitCTAData {
  badge?: string;
  title: string;
  description: string;
  buttons: CTAButton[];
  image?: {
    src: string;
    alt: string;
  };
  features?: CTAFeature[];
  stats?: {
    users: string;
    rating: string;
    downloads: string;
  };
  devices?: {
    desktop: string;
    mobile: string;
    tablet: string;
  };
  backgroundImage?: string;
  gradient?: string;
}

interface SplitCTAProps {
  content: SplitCTAData;
  variant?: "withImage" | "withBackground" | "withStats" | "withDevices" | "withFeatures";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different split CTA variants
const splitCTAContentHooks = {
  // CTA with image
  withImage: createContentHook({
    content: (content: SplitCTAData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        <Group gap="md" align="center" className="flex-wrap">
          {content.buttons.map((button) => (
            <Button rounded={theme?.themeRounded.default}
              key={button.id}
              size="lg"
              variant={button.variant || "default"}
              leftSection={button.lucideIcon ? (
                <Icon lucideIcon={button.lucideIcon} />
              ) : undefined}
            >
              {button.text}
            </Button>
          ))}
        </Group>

        {/* Additional Features */}
        {content.features && (
          <Stack gap="md" className="w-full">
            {content.features.slice(0, 3).map((feature) => (
              <Group key={feature.id} gap="md" align="start">
                <Icon
                  component="span"
                  size="sm"
                  lucideIcon={feature.lucideIcon || CheckCircle}
                  c="primary"
                  className="mt-1 flex-shrink-0"
                />
                <Stack gap="xs">
                  <Text size="sm" fw="semibold">
                    {feature.title}
                  </Text>
                  {feature.description && (
                    <Text size="xs" c="secondary-foreground">
                      {feature.description}
                    </Text>
                  )}
                </Stack>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    )
  }),

  // CTA with background
  withBackground: createContentHook({
    content: (content: SplitCTAData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="bg-white/20 text-white border-white/30">
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold" c="primary-foreground">
            {content.title}
          </Title>

          <Text size="xl" c="primary-foreground" className="opacity-90">
            {content.description}
          </Text>
        </Stack>

        <Group gap="md" align="center" className="flex-wrap">
          {content.buttons.map((button) => (
            <Button
              key={button.id}
              rounded={theme?.themeRounded.default}
              size={theme?.themeButtonSize.default}
              variant={button.variant || "default"}
              leftSection={button.lucideIcon ? (
                <Icon c="primary-foreground" lucideIcon={button.lucideIcon} />
              ) : undefined}
              className={button.variant === "outline" ? "border-white text-white hover:bg-white hover:text-black" : ""}
            >
              {button.text}
            </Button>
          ))}
        </Group>

        {/* Trust Indicators */}
        {content.stats && (
          <Grid cols="3" gap="md" className="w-full">
            <Stack gap="xs" align="center" ta="center">
              <Text size="2xl" fw="bold" c="primary-foreground">
                {content.stats.users}
              </Text>
              <Text size="xs" c="primary-foreground" className="opacity-80">
                Users
              </Text>
            </Stack>
            
            <Stack gap="xs" align="center" ta="center">
              <Group gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary-foreground">
                  {content.stats.rating}
                </Text>
                <Icon lucideIcon={Star} c="primary-foreground" className="fill-current" />
              </Group>
              <Text size="xs" c="primary-foreground" className="opacity-80">
                Rating
              </Text>
            </Stack>
            
            <Stack gap="xs" align="center" ta="center">
              <Text size="2xl" fw="bold" c="primary-foreground">
                {content.stats.downloads}
              </Text>
              <Text size="xs" c="primary-foreground" className="opacity-80">
                Downloads
              </Text>
            </Stack>
          </Grid>
        )}
      </Stack>
    )
  }),

  // CTA with stats
  withStats: createContentHook({
    content: (content: SplitCTAData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Stats Cards */}
        {content.stats && (
          <Grid cols="1-3" gap="md" className="w-full">
            <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
              <Stack gap="xs" align="center" ta="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.users}
                </Text>
                <Text c="secondary-foreground">
                  Active Users
                </Text>
              </Stack>
            </Card>
            
            <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
              <Stack gap="xs" align="center" ta="center">
                <Group gap="xs" align="center">
                  <Text size="3xl" fw="bold" c="primary">
                    {content.stats.rating}
                  </Text>
                  <Icon lucideIcon={Star} c="primary" className="fill-current" />
                </Group>
                <Text c="secondary-foreground">
                  User Rating
                </Text>
              </Stack>
            </Card>
            
            <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
              <Stack gap="xs" align="center" ta="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.downloads}
                </Text>
                <Text c="secondary-foreground">
                  Total Downloads
                </Text>
              </Stack>
            </Card>
          </Grid>
        )}

        <Group gap="md" align="center" className="flex-wrap">
          {content.buttons.map((button) => (
            <Button
              key={button.id}
              rounded={theme?.themeRounded.default}
              size={theme?.themeButtonSize.default}
              variant={button.variant || "default"}
              leftSection={button.lucideIcon ? (
                <Icon c="primary-foreground" lucideIcon={button.lucideIcon} />
              ) : undefined}
            >
              {button.text}
            </Button>
          ))}
        </Group>
      </Stack>
    )
  }),

  // CTA with devices
  withDevices: createContentHook({
    content: (content: SplitCTAData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Device Stats */}
        {content.devices && (
          <Grid cols="3" gap="md" className="w-full">
            <Group gap="md" align="center">
              <Icon size="lg" lucideIcon={Monitor} c="primary" />
              <Stack gap="none">
                <Text size="lg" fw="bold">
                  {content.devices.desktop}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  Desktop Users
                </Text>
              </Stack>
            </Group>
            
            <Group gap="md" align="center">
              <Icon size="lg" lucideIcon={Smartphone} c="primary" />
              <Stack gap="none">
                <Text size="lg" fw="bold">
                  {content.devices.mobile}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  Mobile Users
                </Text>
              </Stack>
            </Group>
            
            <Group gap="md" align="center">
              <Icon size="lg" lucideIcon={Tablet} c="primary" />
              <Stack gap="none">
                <Text size="lg" fw="bold">
                  {content.devices.tablet}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  Tablet Users
                </Text>
              </Stack>
            </Group>
          </Grid>
        )}

        <Group gap="md" align="center" className="flex-wrap">
          {content.buttons.map((button) => (
            <Button
              key={button.id}
              rounded={theme?.themeRounded.default}
              size={theme?.themeButtonSize.default}
              variant={button.variant || "default"}
              leftSection={button.lucideIcon ? (
                <Icon c="primary-foreground" lucideIcon={button.lucideIcon} />
              ) : undefined}
            >
              {button.text}
            </Button>
          ))}
        </Group>

        <Text c="secondary-foreground">
          Available on all devices • Free download • No signup required
        </Text>
      </Stack>
    )
  }),

  // CTA with features
  withFeatures: createContentHook({
    content: (content: SplitCTAData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Features List */}
        {content.features && (
          <Stack gap="lg" className="w-full">
            {content.features.map((feature) => (
              <Group key={feature.id} gap="md" align="start">
                {feature.lucideIcon && (
                  <Box 
                    p="sm" 
                    bg="primary" 
                    rounded={theme?.themeRounded.default} 
                    className="flex-shrink-0"
                    data-class="feature-icon"
                  >
                    <Icon
                      lucideIcon={feature.lucideIcon}
                      c="primary-foreground"
                    />
                  </Box>
                )}
                
                <Stack gap="xs">
                  <Title order={3} size="lg" fw="semibold">
                    {feature.title}
                  </Title>
                  {feature.description && (
                    <Text size="md" c="secondary-foreground">
                      {feature.description}
                    </Text>
                  )}
                </Stack>
              </Group>
            ))}
          </Stack>
        )}

        <Group gap="md" align="center" className="flex-wrap">
          {content.buttons.map((button) => (
            <Button
              key={button.id}
              rounded={theme?.themeRounded.default}
              size={theme?.themeButtonSize.default}
              variant={button.variant || "default"}
              leftSection={button.lucideIcon ? (
                <Icon c="primary-foreground" lucideIcon={button.lucideIcon} />
              ) : undefined}
            >
              {button.text}
            </Button>
          ))}
        </Group>
      </Stack>
    )
  })
};

export const SplitCTA = forwardRef<HTMLElement, SplitCTAProps>(
  ({ 
    content, 
    variant = "withImage",
    leftMedia = false,
    useContainer = true,
    py = "lg",
    gap = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Create media section based on variant and content
    const createMediaSection = () => {
      if (variant === "withBackground") {
        // For background variant, create a gradient background
        const backgroundClass = content.backgroundImage 
          ? `bg-[url('${content.backgroundImage}')] bg-cover bg-center` 
          : content.gradient || "bg-gradient-to-br from-primary to-secondary";
        
        return (
          <Block 
            className={`h-full ${backgroundClass} relative overflow-hidden rounded-${theme?.themeRounded.default}`}
            data-class="cta-background"
          >
            <Box className="absolute inset-0 bg-black/30" />
            <Box className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
          </Block>
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
              rounded={theme?.themeRounded.default}
              fit="cover"
            />
          </Block>
        );
      }

      // Default gradient based on variant
      const gradientMap = {
        withImage: "from-primary/5 to-secondary/10",
        withBackground: "from-primary to-secondary",
        withStats: "from-primary/5 to-secondary/10",
        withDevices: "from-primary/5 to-secondary/10",
        withFeatures: "from-primary/5 to-secondary/10"
      };

      return (
        <Block 
          className={`h-full bg-gradient-to-br ${gradientMap[variant]} relative overflow-hidden rounded-${theme?.themeRounded.default}`}
          data-class="cta-gradient-background"
        >
          <Box className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          
          {/* Decorative Elements */}
          <Box className="absolute top-10 right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
          <Box className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = splitCTAContentHooks[variant] || splitCTAContentHooks.withImage;

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

SplitCTA.displayName = "SplitCTA";

// Export template configurations
export const splitCTATemplates = {
  withImage: {
    id: "splitCTAWithImage",
    name: "Split CTA with Image",
    description: "Split layout CTA with image and content",
    component: SplitCTA,
    defaultProps: { variant: "withImage" as const }
  },
  
  withBackground: {
    id: "splitCTAWithBackground",
    name: "Split CTA with Background",
    description: "Split layout CTA with background image or gradient",
    component: SplitCTA,
    defaultProps: { variant: "withBackground" as const }
  },

  withStats: {
    id: "splitCTAWithStats",
    name: "Split CTA with Statistics",
    description: "Split layout CTA showcasing key statistics",
    component: SplitCTA,
    defaultProps: { variant: "withStats" as const }
  },

  withDevices: {
    id: "splitCTAWithDevices",
    name: "Split CTA with Device Stats",
    description: "Split layout CTA highlighting multi-device support",
    component: SplitCTA,
    defaultProps: { variant: "withDevices" as const }
  },

  withFeatures: {
    id: "splitCTAWithFeatures",
    name: "Split CTA with Features",
    description: "Split layout CTA highlighting key features",
    component: SplitCTA,
    defaultProps: { variant: "withFeatures" as const }
  }
};