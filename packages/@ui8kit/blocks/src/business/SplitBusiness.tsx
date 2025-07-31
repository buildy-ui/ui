import { forwardRef } from "react";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Building, 
  Rocket,
  Star,
  ExternalLink
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
  createContentHook
} from "@ui8kit/core";

// Business interfaces (reuse from GridBusiness)
interface BusinessCard {
  id: string;
  title: string;
  description: string;
  lucideIcon?: any;
}

export interface BusinessMetric {
  id: string;
  value: string;
  label: string;
  change?: string;
  lucideIcon?: any;
}

export interface BusinessFeature {
  id: string;
  title: string;
  description: string;
  lucideIcon?: any;
}

export interface BusinessTestimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  rating?: number;
}

// Split Business data interface
export interface SplitBusinessData {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  buttonText?: string;
  secondaryButtonText?: string;
  image?: {
    src: string;
    alt: string;
  };
  metrics?: BusinessMetric[];
  features?: BusinessFeature[];
  testimonials?: BusinessTestimonial[];
  cards?: BusinessCard[];
  stats?: {
    clients: string;
    projects: string;
    satisfaction: string;
    years: string;
  };
}

export interface SplitBusinessProps {
  content: SplitBusinessData;
  variant?: "solutions" | "metrics" | "testimonial" | "features" | "about";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different business split variants
const splitBusinessContentHooks = {
  // Solutions variant - business solutions with metrics
  solutions: createContentHook({
    content: (content: SplitBusinessData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge || "Solutions"}
          </Badge>

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Key Metrics */}
        {content.metrics && (
          <Grid cols="1-2" gap="md" className="w-full">
            {content.metrics.slice(0, 4).map((metric) => (
              <Card key={metric.id} p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
                <Group gap="md" align="center">
                  {metric.lucideIcon && (
                    <Box 
                      p="sm" 
                      bg="primary" 
                      rounded={theme?.themeRounded.default} 
                      className="inline-flex"
                      data-class="metric-icon"
                    >
                      <Icon
                        lucideIcon={metric.lucideIcon}
                        c="primary-foreground"
                      />
                    </Box>
                  )}
                  
                  <Stack gap="xs">
                    <Group gap="xs" align="baseline">
                      <Text size="2xl" fw="bold" c="primary">
                        {metric.value}
                      </Text>
                      {metric.change && (
                        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                          {metric.change}
                        </Badge>
                      )}
                    </Group>
                    <Text c="secondary-foreground">
                      {metric.label}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Grid>
        )}

        {(content.buttonText || content.secondaryButtonText) && (
          <Group gap="md" align="center">
            {content.buttonText && (
              <Button rounded={theme?.themeRounded.default}
                size={theme?.themeButtonSize.default}
                variant="default"
                rightSection={
                  <Icon c="primary-foreground" lucideIcon={ArrowRight} />
                }
              >
                {content.buttonText}
              </Button>
            )}

            {content.secondaryButtonText && (
              <Button rounded={theme?.themeRounded.default}
                variant="outline"
                size={theme?.themeButtonSize.default}
                rightSection={
                  <Icon lucideIcon={ExternalLink} />
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

  // Metrics variant - focus on business performance
  metrics: createContentHook({
    content: (content: SplitBusinessData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge || "Performance"}
          </Badge>

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          {content.subtitle && (
            <Title order={2} size="xl" fw="medium" c="secondary-foreground">
              {content.subtitle}
            </Title>
          )}

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Stats Grid */}
        {content.stats && (
          <Grid cols="2" gap="lg" className="w-full">
            <Stack gap="xs" align="center" ta="center">
              <Text size="3xl" fw="bold" c="primary">
                {content.stats.clients}
              </Text>
              <Text c="secondary-foreground">
                Satisfied Clients
              </Text>
            </Stack>
            
            <Stack gap="xs" align="center" ta="center">
              <Text size="3xl" fw="bold" c="primary">
                {content.stats.projects}
              </Text>
              <Text c="secondary-foreground">
                Projects Completed
              </Text>
            </Stack>
            
            <Stack gap="xs" align="center" ta="center">
              <Text size="3xl" fw="bold" c="primary">
                {content.stats.satisfaction}
              </Text>
              <Text c="secondary-foreground">
                Satisfaction Rate
              </Text>
            </Stack>
            
            <Stack gap="xs" align="center" ta="center">
              <Text size="3xl" fw="bold" c="primary">
                {content.stats.years}
              </Text>
              <Text c="secondary-foreground">
                Years Experience
              </Text>
            </Stack>
          </Grid>
        )}

        <Button
          variant="default"
          rounded={theme?.themeRounded.default}
          size={theme?.themeButtonSize.default}
          rightSection={
            <Icon lucideIcon={TrendingUp} />
          }
        >
          {content.buttonText || "View Our Results"}
        </Button>
      </Stack>
    )
  }),

  // Testimonial variant - customer feedback
  testimonial: createContentHook({
    content: (content: SplitBusinessData) => {
      const testimonial = content.testimonials?.[0];

      return (
        <Stack gap="xl" align="start">
          <Stack gap="md" align="start">
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge || "Testimonial"}
            </Badge>

            <Title order={1} size="3xl" fw="bold">
              {content.title}
            </Title>

            <Text c="secondary-foreground">
              {content.description}
            </Text>
          </Stack>

          {/* Featured Testimonial */}
          {testimonial && (
            <Card p="xl" rounded={theme?.themeRounded.default} shadow="md" bg="card" className="w-full">
              <Stack gap="lg" align="start">
                {/* Rating */}
                {testimonial.rating && (
                  <Group gap="xs" align="center">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Icon
                        key={i}
                        lucideIcon={Star}
                        c="primary"
                        className="fill-current"
                      />
                    ))}
                  </Group>
                )}

                {/* Quote */}
                <Text size="lg" fw="medium" className="italic">
                  "{testimonial.quote}"
                </Text>

                {/* Author */}
                <Group gap="md" align="center">
                  {testimonial.author.avatar && (
                    <Image
                      src={testimonial.author.avatar}
                      alt={testimonial.author.name}
                      width="48px"
                      height="48px"
                      fit="cover"
                      rounded="full"
                    />
                  )}
                  
                  <Stack gap="xs">
                    <Text size="sm" fw="semibold">
                      {testimonial.author.name}
                    </Text>
                    <Text size="xs" c="secondary-foreground">
                      {testimonial.author.role} at {testimonial.author.company}
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            </Card>
          )}

          <Button
            variant="outline"
            rounded={theme?.themeRounded.default}
            size={theme?.themeButtonSize.default}
            rightSection={
              <Icon lucideIcon={ArrowRight} />
            }
          >
            {content.buttonText || "Read More Reviews"}
          </Button>
        </Stack>
      );
    }
  }),

  // Features variant - business features list
  features: createContentHook({
    content: (content: SplitBusinessData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge || "Features"}
          </Badge>

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
            {content.features.slice(0, 4).map((feature) => (
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
                  <Text size="md" c="secondary-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        )}

        <Group gap="md" align="center">
          <Button
            variant="default"
            rounded={theme?.themeRounded.default}
            size={theme?.themeButtonSize.default}
            rightSection={
              <Icon c="primary-foreground" lucideIcon={Rocket} />
            }
          >
            {content.buttonText || "Get Started"}
          </Button>

          {content.secondaryButtonText && (
            <Button
              variant="ghost"
              rounded={theme?.themeRounded.default}
              size="icon"
              rightSection={
                <Icon lucideIcon={ArrowRight} />
              }
            >
              {content.secondaryButtonText}
            </Button>
          )}
        </Group>
      </Stack>
    )
  }),

  // About variant - company information
  about: createContentHook({
    content: (content: SplitBusinessData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge || "About Us"}
          </Badge>

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          {content.subtitle && (
            <Title order={2} size="xl" fw="medium" c="primary">
              {content.subtitle}
            </Title>
          )}

          <Text c="secondary-foreground" className="leading-relaxed">
            {content.description}
          </Text>
        </Stack>

        {/* Company Values/Cards */}
        {content.cards && (
          <Grid cols="1-2" gap="md" className="w-full">
            {content.cards.slice(0, 4).map((card) => (
              <Card key={card.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="secondary">
                <Group gap="md" align="start">
                  {card.lucideIcon && (
                    <Box>
                      <Icon
                        lucideIcon={card.lucideIcon}
                        c="primary"
                        className="flex-shrink-0 mt-1"
                      />
                    </Box>
                  )}
                  
                  <Stack gap="xs">
                    <Text size="sm" fw="semibold">
                      {card.title}
                    </Text>
                    <Text size="xs" c="secondary-foreground">
                      {card.description}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Grid>
        )}

        <Group gap="md" align="center">
          <Button
            variant="default"
            rounded={theme?.themeRounded.default}
            size={theme?.themeButtonSize.default}
            rightSection={
              <Icon c="primary-foreground" lucideIcon={Users} />
            }
          >
            {content.buttonText || "Join Our Team"}
          </Button>

          {content.secondaryButtonText && (
            <Button
              variant="outline"
              rounded={theme?.themeRounded.default}
              size={theme?.themeButtonSize.default}
              rightSection={
                <Icon lucideIcon={Building} />
              }
            >
              {content.secondaryButtonText}
            </Button>
          )}
        </Group>
      </Stack>
    )
  })
};

export const SplitBusiness = forwardRef<HTMLElement, SplitBusinessProps>(
  ({ 
    content, 
    variant = "solutions",
    leftMedia = false,
    useContainer = true,
    py = "xl",
    gap = "md",
    className,
    ...props 
  }, ref) => {
    
    // Create media section based on variant and content
    const createMediaSection = () => {
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
        solutions: "from-primary/5 to-secondary/10",
        metrics: "from-primary/5 to-secondary/10",
        testimonial: "from-primary/5 to-secondary/10",
        features: "from-primary/5 to-secondary/10",
        about: "from-primary/5 to-secondary/10"
      };

      return (
        <Block 
          className={`h-full bg-gradient-to-br ${gradientMap[variant]} relative overflow-hidden`}
          data-class="business-gradient-background"
        >
          <Box className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          
          {/* Decorative Elements */}
          <Box className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
          <Box className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = splitBusinessContentHooks[variant] || splitBusinessContentHooks.solutions;

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

SplitBusiness.displayName = "SplitBusiness";

// Export template configurations
export const splitBusinessTemplates = {
  solutions: {
    id: "splitBusinessSolutions",
    name: "Business Solutions Split",
    description: "Split layout with business solutions and metrics",
    component: SplitBusiness,
    defaultProps: { variant: "solutions" as const }
  },
  
  metrics: {
    id: "splitBusinessMetrics",
    name: "Business Metrics Split",
    description: "Split layout focused on business performance metrics",
    component: SplitBusiness,
    defaultProps: { variant: "metrics" as const }
  },

  testimonial: {
    id: "splitBusinessTestimonial",
    name: "Business Testimonial Split",
    description: "Split layout featuring customer testimonials",
    component: SplitBusiness,
    defaultProps: { variant: "testimonial" as const }
  },

  features: {
    id: "splitBusinessFeatures",
    name: "Business Features Split",
    description: "Split layout highlighting business features",
    component: SplitBusiness,
    defaultProps: { variant: "features" as const }
  },

  about: {
    id: "splitBusinessAbout",
    name: "About Business Split",
    description: "Split layout for company information and values",
    component: SplitBusiness,
    defaultProps: { variant: "about" as const }
  }
};