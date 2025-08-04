import { forwardRef } from "react";
import {
  Star,
} from "lucide-react";
import {
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
  LayoutBlock,
  createLayoutContentHook,
} from "@ui8kit/core";

// CTA interfaces
export interface CTAButton { 
  id: string;
  text: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  lucideIcon?: any;
  href?: string;
}

export interface CTABrand {
  id: string;
  name: string;
  lucideIcon?: any;
  image?: {
    src: string;
    alt: string;
  };
}

export interface CTAFeature {
  id: string;
  title: string;
  description?: string;
  lucideIcon?: any;
}

// Centered CTA data interface
export interface CenteredCTAData {
  badge?: string;
  title: string;
  description: string;
  buttons: CTAButton[];
  brands?: CTABrand[];
  features?: CTAFeature[];
  stats?: {
    users: string;
    rating: string;
    downloads: string;
  };
  backgroundImage?: string;
  gradient?: string;
}

export interface CenteredCTAProps {
  content: CenteredCTAData;
  variant?: "simple" | "withLogos" | "withBackground" | "withFeatures" | "withStats";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Custom content hooks for different centered CTA variants
const centeredCTAContentHooks = {
  // Simple centered CTA
  simple: createLayoutContentHook({
    header: (content: CenteredCTAData) => (
      <Card p="2xl" rounded={theme?.themeRounded.default} bg="accent" shadow="lg" className="w-full max-w-4xl mx-auto">
        <Stack gap="xl" align="center" ta="center">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold" ta="center">
            {content.title}
          </Title>

          <Text c="secondary-foreground" ta="center" className="max-w-2xl">
            {content.description}
          </Text>

          <Group gap="md" align="center" justify="center" className="flex-wrap">
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
      </Card>
    )
  }),

  // CTA with logos/brands
  withLogos: createLayoutContentHook({
    header: (content: CenteredCTAData) => (
      <Card p="2xl" rounded={theme?.themeRounded.default} bg="accent" shadow="lg" className="w-full max-w-4xl mx-auto">
        <Stack gap="xl" align="center" ta="center">
          <Title order={1} size="4xl" fw="bold" ta="center">
            {content.title}
          </Title>

          <Text c="secondary-foreground" ta="center" className="max-w-2xl">
            {content.description}
          </Text>

          <Group gap="md" align="center" justify="center" className="flex-wrap">
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

          {/* Brands/Logos */}
          {content.brands && (
            <Stack gap="md" align="center" className="w-full">
              <Text c="secondary-foreground" ta="center">
                Trusted by leading companies
              </Text>
              
              <Grid gap="sm" align="center" justify="center" className="w-full justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                {content.brands.map((brand) => (
                  <Group key={brand.id} gap="md" align="center" justify="center" className="opacity-60 hover:opacity-100 transition-opacity">
                    {brand.lucideIcon && (
                      <Icon
                        component="span"
                        size="lg"
                        lucideIcon={brand.lucideIcon}
                        c="secondary-foreground"
                      />
                    )}
                    {brand.image && (
                      <Image
                        src={brand.image.src}
                        alt={brand.image.alt}
                        width="80px"
                        height="40px"
                        fit="contain"
                      />
                    )}
                    <Text c="secondary-foreground" fw="medium">
                      {brand.name}
                    </Text>
                  </Group>
                ))}
              </Grid>
            </Stack>
          )}
        </Stack>
      </Card>
    )
  }),

  // CTA with background
  withBackground: createLayoutContentHook({
    header: (content: CenteredCTAData) => (
      <Box 
        className={`relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden ${
          content.backgroundImage 
            ? `bg-[url('${content.backgroundImage}')] bg-cover bg-center` 
            : content.gradient || "bg-gradient-to-br from-primary to-secondary"
        }`}
        data-class="cta-background"
      >
        {/* Overlay */}
        <Box className="absolute inset-0 bg-black/50" />
        
        <Box className="relative z-10" p="2xl">
          <Stack gap="xl" align="center" ta="center">
            {content.badge && (
              <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="bg-white/20 text-white border-white/30">
                {content.badge}
              </Badge>
            )}

            <Title order={1} size="4xl" fw="bold" ta="center" c="primary-foreground">
              {content.title}
            </Title>

            <Text size="lg" c="primary-foreground" ta="center" className="max-w-2xl opacity-90">
              {content.description}
            </Text>

            <Group gap="md" align="center" justify="center" className="flex-wrap">
              {content.buttons.map((button) => (
                <Button
                  key={button.id}
                  rounded={theme?.themeRounded.default}
                  size={theme?.themeButtonSize.default}
                  variant="outline"
                  leftSection={button.lucideIcon ? (
                    <Icon lucideIcon={button.lucideIcon} />
                  ) : undefined}
                >
                  {button.text}
                </Button>
              ))}
            </Group>
          </Stack>
        </Box>
      </Box>
    )
  }),

  // CTA with features
  withFeatures: createLayoutContentHook({
    header: (content: CenteredCTAData) => (
      <Card p="2xl" rounded={theme?.themeRounded.default} bg="accent" shadow="lg" className="w-full max-w-5xl mx-auto">
        <Stack gap="xl" align="center" ta="center">
          <Title order={1} size="4xl" fw="bold" ta="center">
            {content.title}
          </Title>

          <Text c="secondary-foreground" ta="center" className="max-w-2xl">
            {content.description}
          </Text>

          {/* Features Grid */}
          {content.features && (
            <Grid cols="1-2-3" gap="lg" className="w-full max-w-3xl">
              {content.features.map((feature) => (
                <Stack key={feature.id} gap="md" align="center" ta="center">
                  {feature.lucideIcon && (
                    <Box 
                      p="sm" 
                      bg="primary" 
                      rounded="full" 
                      className="inline-flex"
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
                  
                  <Stack gap="xs" align="center">
                    <Text size="sm" fw="semibold" ta="center">
                      {feature.title}
                    </Text>
                    {feature.description && (
                      <Text size="xs" c="secondary-foreground" ta="center">
                        {feature.description}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Grid>
          )}

          <Group gap="md" align="center" justify="center" className="flex-wrap">
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
      </Card>
    )
  }),

  // CTA with stats
  withStats: createLayoutContentHook({
    header: (content: CenteredCTAData) => (
      <Card p="2xl" rounded={theme?.themeRounded.default} bg="accent" shadow="lg" className="w-full max-w-4xl mx-auto">
        <Stack gap="xl" align="center" ta="center">
          <Title order={1} size="4xl" fw="bold" ta="center">
            {content.title}
          </Title>

          <Text c="secondary-foreground" ta="center" className="max-w-2xl">
            {content.description}
          </Text>

          {/* Stats */}
          {content.stats && (
            <Grid gap="xl" align="center" justify="center" className="w-full max-w-2xl grid-cols-1 sm:grid-cols-3">
              <Stack gap="xs" align="center" ta="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.users}
                </Text>
                <Text c="secondary-foreground">
                  Active Users
                </Text>
              </Stack>
              
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
              
              <Stack gap="xs" align="center" ta="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.downloads}
                </Text>
                <Text c="secondary-foreground">
                  Downloads
                </Text>
              </Stack>
            </Grid>
          )}

          <Group gap="md" align="center" justify="center" className="flex-wrap">
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
      </Card>
    )
  })
};

export const CenteredCTA = forwardRef<HTMLElement, CenteredCTAProps>(
  ({ 
    content, 
    variant = "simple",
    useContainer = true,
    py = "lg",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = centeredCTAContentHooks[variant] || centeredCTAContentHooks.simple;

    return (
      <LayoutBlock
        ref={ref}
        layout="stack"
        useContainer={useContainer}
        py={py}
        showHeader={true} // We use header hooks for content
        content={content}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

CenteredCTA.displayName = "CenteredCTA";

// Export template configurations
export const centeredCTATemplates = {
  simple: {
    id: "centeredCTASimple",
    name: "Simple Centered CTA",
    description: "Clean centered call-to-action with title, description and buttons",
    component: CenteredCTA,
    defaultProps: { variant: "simple" as const }
  },
  
  withLogos: {
    id: "centeredCTAWithLogos",
    name: "CTA with Brand Logos",
    description: "Centered CTA featuring trusted brand logos",
    component: CenteredCTA,
    defaultProps: { variant: "withLogos" as const }
  },

  withBackground: {
    id: "centeredCTAWithBackground",
    name: "CTA with Background",
    description: "Eye-catching CTA with background image or gradient",
    component: CenteredCTA,
    defaultProps: { variant: "withBackground" as const }
  },

  withFeatures: {
    id: "centeredCTAWithFeatures",
    name: "CTA with Features",
    description: "CTA highlighting key features with icons",
    component: CenteredCTA,
    defaultProps: { variant: "withFeatures" as const }
  },

  withStats: {
    id: "centeredCTAWithStats",
    name: "CTA with Statistics",
    description: "Data-driven CTA showcasing impressive statistics",
    component: CenteredCTA,
    defaultProps: { variant: "withStats" as const }
  }
};