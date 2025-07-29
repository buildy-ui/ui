import { forwardRef } from "react";
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
  defaultLayoutContentHooks,
  type LayoutContentHooks
} from "@ui8kit/core";

// Centered Hero data interface
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

export interface CenteredHeroProps {
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
          <Badge variant="secondary" size="default" rounded="md">
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
          size="xl" 
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

  // Centered hero with top button
  withTopButton: createLayoutContentHook({
    beforeHeader: (content: CenteredHeroData) => (
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
    header: (content: CenteredHeroData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size="default" rounded="md">
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
          size="xl" 
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
          size="xl" 
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
                size="lg"
                variant="default"
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
            rounded="lg"
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
          <Badge variant="secondary" size="default" rounded="md">
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
          size="xl" 
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
                size="lg"
                variant="default"
                rightSection={
                  <Icon
                    component="span"
                    size="md"
                    lucideIcon={ArrowRight}
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
              >
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
              <Text size="sm" c="secondary-foreground" ta="center">
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
    py = "2xl",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = centeredHeroContentHooks[variant] || centeredHeroContentHooks.simple;

    return (
      <LayoutBlock
        ref={ref}
        layout="stack"
        useContainer={useContainer}
        py={py}
        showHeader={false} // We handle header in content hooks
        content={content}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

CenteredHero.displayName = "CenteredHero";

// Export template configurations
export const centeredHeroTemplates = {
  simple: {
    id: "centeredHeroSimple",
    name: "Simple Centered Hero",
    description: "Centered hero section with badge, title, description and buttons",
    component: CenteredHero,
    defaultProps: { variant: "simple" as const }
  },
  
  withTopButton: {
    id: "centeredHeroWithTopButton",
    name: "Centered Hero with Top Button",
    description: "Centered hero with announcement button at the top",
    component: CenteredHero,
    defaultProps: { variant: "withTopButton" as const }
  },

  withImage: {
    id: "centeredHeroWithImage",
    name: "Centered Hero with Image",
    description: "Centered hero with large image below content",
    component: CenteredHero,
    defaultProps: { variant: "withImage" as const }
  },

  withStats: {
    id: "centeredHeroWithStats",
    name: "Centered Hero with Stats",
    description: "Centered hero with statistics display below content",
    component: CenteredHero,
    defaultProps: { variant: "withStats" as const }
  }
};