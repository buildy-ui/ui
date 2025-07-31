import { forwardRef } from "react";
import { 
  Star,
  Quote,
  User,
  Award,
  Heart,
  CheckCircle,
  MessageSquare,
  Users
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Image,
  Icon,
  Box,
  Card
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

// Testimonial interfaces
interface TestimonialItem {
  id: string;
  rating: number;
  quote: string;
  author: string;
  position: string;
  description: string;
  company?: string;
  avatar?: {
    src: string;
    alt: string;
  };
  verified?: boolean;
}

export interface SplitTestimonialData {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  testimonials: TestimonialItem[];
  stats?: {
    totalReviews?: string;
    averageRating?: string;
    satisfied?: string;
  };
  ctaText?: string;
  ctaLink?: string;
}

interface SplitTestimonialProps {
  content: SplitTestimonialData;
  variant?: "featured" | "carousel" | "stats";
  mediaPosition?: "left" | "right";
  useContainer?: boolean;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Render stars component
const RenderStars = ({ rating, size = "sm" }: { rating: number; size?: "xs" | "sm" | "md" }) => (
  <Group gap="xs" align="center">
    {[...Array(5)].map((_, index) => (
      <Icon
        key={index}
        component="span"
        size={size}
        lucideIcon={Star}
        className={index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
      />
    ))}
  </Group>
);

// Custom content hooks for different split testimonial variants
const splitTestimonialContentHooks = {
  // 1. Featured Testimonial with Single Large Quote
  featured: createContentHook({
    content: (content: SplitTestimonialData) => (
      <Stack gap="xl" align="start">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            <Icon size="sm" lucideIcon={MessageSquare} className="mr-0.5" />
            {content.badge}
          </Badge>
        )}
        
        <Title order={1} size="4xl" fw="bold">
          {content.title}
        </Title>
        
        {content.description && (
          <Text c="secondary-foreground">
            {content.description}
          </Text>
        )}

        {/* Featured Testimonial */}
        {content.testimonials[0] && (
          <Card p="xl" rounded={theme?.themeRounded.default} shadow="md" className="bg-card border flex flex-col gap-4">
            <Stack gap="lg">
              <Icon component="div" size="xl" lucideIcon={Quote} c="primary" className="opacity-20" />
              
              <Text size="sm" fw="medium" className="leading-relaxed italic">
                "{content.testimonials[0].quote}"
              </Text>
              
              <Group gap="md" align="center">
                {content.testimonials[0].avatar ? (
                  <Image
                    src={content.testimonials[0].avatar.src}
                    alt={content.testimonials[0].avatar.alt}
                    width="60px"
                    height="60px"
                    fit="cover"
                    rounded="full"
                    className="h-12 w-12"
                  />
                ) : (
                  <Box 
                    className="w-[60px] h-[60px] bg-primary/10 rounded-full flex items-center justify-center"
                    data-class="avatar-placeholder"
                  >
                    <Icon size="lg" lucideIcon={User} c="primary" />
                  </Box>
                )}
                
                <Stack gap="xs">
                  <Group gap="md" align="center">
                    <Text size="md" fw="semibold">
                      {content.testimonials[0].author}
                    </Text>
                    {content.testimonials[0].verified && (
                      <Icon lucideIcon={CheckCircle} c="primary" />
                    )}
                  </Group>
                  <Text c="secondary-foreground">
                    {content.testimonials[0].position}
                    {content.testimonials[0].company && ` at ${content.testimonials[0].company}`}
                  </Text>
                  <RenderStars rating={content.testimonials[0].rating} size="sm" />
                </Stack>
              </Group>
            </Stack>
          </Card>
        )}

        {content.ctaText && (
          <Button rounded={theme?.themeRounded.default} size="lg" className="mt-md">
            {content.ctaText}
          </Button>
        )}
      </Stack>
    )
  }),

  // 2. Carousel-style with Multiple Testimonials
  carousel: createContentHook({
    content: (content: SplitTestimonialData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          {content.badge && (
            <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              <Icon size="sm" lucideIcon={Users} className="mr-0.5" />
              {content.badge}
            </Badge>
          )}
          
          <Title order={1} size="3xl" fw="bold">
            {content.title}
          </Title>
          
          {content.subtitle && (
            <Text c="secondary-foreground">
              {content.subtitle}
            </Text>
          )}
        </Stack>

        {/* Testimonials Stack */}
        <Stack gap="lg" className="w-full">
          {content.testimonials.slice(0, 3).map((testimonial, _index) => (
            <Card key={testimonial.id} p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border flex flex-col gap-4">
                <Group gap="md" align="start" justify="between">
                  <RenderStars rating={testimonial.rating} />
                  <Icon lucideIcon={Quote} c="primary" className="opacity-50" />
                </Group>
                
                <Text size="sm" className="leading-relaxed">
                  "{testimonial.quote}"
                </Text>
                
                <Group gap="md" align="center">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar.src}
                      alt={testimonial.avatar.alt}
                      width="40px"
                      height="40px"
                      fit="cover"
                      rounded="full"
                      className="h-12 w-12"
                    />
                  ) : (
                    <Box 
                      className="w-[40px] h-[40px] bg-primary/10 rounded-full flex items-center justify-center"
                      data-class="avatar-placeholder"
                    >
                      <Icon lucideIcon={User} c="primary" />
                    </Box>
                  )}
                  
                  <Stack gap="xs">
                    <Text size="sm" fw="medium">
                      {testimonial.author}
                    </Text>
                    <Text size="xs" c="secondary-foreground">
                      {testimonial.position}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>

        {content.testimonials.length > 3 && (
          <Text c="secondary-foreground">
            +{content.testimonials.length - 3} more satisfied customers
          </Text>
        )}
      </Stack>
    )
  }),

  // 3. Stats & Social Proof Focus
  stats: createContentHook({
    content: (content: SplitTestimonialData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>
          
          {content.description && (
            <Text c="secondary-foreground">
              {content.description}
            </Text>
          )}
        </Stack>

        {/* Stats Section */}
        {content.stats && (
          <Group gap="xl" align="center" className="w-full">
            {content.stats.totalReviews && (
              <Stack gap="xs" align="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.totalReviews}
                </Text>
                <Text c="secondary-foreground" className="text-center">
                  Total Reviews
                </Text>
              </Stack>
            )}
            
            {content.stats.averageRating && (
              <Stack gap="xs" align="center">
                <Group gap="xs" align="center">
                  <Text size="3xl" fw="bold" c="primary">
                    {content.stats.averageRating}
                  </Text>
                  <Icon size="lg" lucideIcon={Star} className="text-yellow-500 fill-yellow-500" />
                </Group>
                <Text c="secondary-foreground" className="text-center">
                  Average Rating
                </Text>
              </Stack>
            )}
            
            {content.stats.satisfied && (
              <Stack gap="xs" align="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.satisfied}
                </Text>
                <Text c="secondary-foreground" className="text-center">
                  Satisfied Customers
                </Text>
              </Stack>
            )}
          </Group>
        )}

        {/* Featured Testimonial */}
        {content.testimonials[0] && (
          <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="bg-primary/5 border-primary/20 flex flex-col gap-4">
            <Stack gap="md">
              <Group gap="md" align="center" justify="between">
                <Group gap="md" align="center">
                  <Icon lucideIcon={Award} c="primary" />
                  <Text size="sm" fw="semibold" c="primary">
                    Featured Review
                  </Text>
                </Group>
                <RenderStars rating={content.testimonials[0].rating} />
              </Group>
              
              <Text size="sm" className="leading-relaxed">
                "{content.testimonials[0].quote}"
              </Text>
              
              <Group gap="md" align="center">
                <Text size="sm" fw="medium">
                  — {content.testimonials[0].author}
                </Text>
                <Text c="secondary-foreground">
                  {content.testimonials[0].position}
                </Text>
              </Group>
            </Stack>
          </Card>
        )}

        {content.ctaText && (
          <Group gap="md" align="center">
            <Button rounded={theme?.themeRounded.default} size="lg" variant="default">
              {content.ctaText}
            </Button>
            <Button rounded={theme?.themeRounded.default} size="lg" variant="outline">
              <Icon c="primary-foreground" lucideIcon={Heart} />
              Read All Reviews
            </Button>
          </Group>
        )}
      </Stack>
    )
  })
};

export const SplitTestimonial = forwardRef<HTMLElement, SplitTestimonialProps>(
  ({ 
    content, 
    variant = "featured",
    mediaPosition = "right",
    useContainer = true,
    py = "xl",
    gap = "md",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = splitTestimonialContentHooks[variant] || splitTestimonialContentHooks.featured;

    // Create media section with testimonial-related visuals
    const createMediaSection = (): React.ReactNode => {
      switch (variant) {
        case "featured":
          return (
            <Box className="relative w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default}>
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon size="2xl" lucideIcon={Quote} c="primary" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="primary">
                    Trusted by thousands
                  </Text>
                  <Group gap="lg" align="center">
                    <Group gap="xs" align="center">
                      <RenderStars rating={5} size="md" />
                      <Text size="sm" fw="medium">5.0 rating</Text>
                    </Group>
                  </Group>
                </Stack>
              </Stack>
            </Box>
          );

        case "carousel":
          return (
            <Box className="relative w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default}>
              <Stack gap="lg" align="center" className="relative z-10">
                <Box className="grid grid-cols-2 gap-md max-w-sm">
                  {[Quote, Star, Heart, Users].map((LucideIcon, index) => (
                    <Box 
                      key={index}
                      className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center m-2"
                    >
                      <Icon size="lg" lucideIcon={LucideIcon} c="primary-foreground" />
                    </Box>
                  ))}
                </Box>
                <Text size="md" fw="medium" c="primary-foreground" ta="center">
                  Join thousands of happy customers
                </Text>
              </Stack>
            </Box>
          );

        case "stats":
          return (
            <Box className="relative w-full h-full bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default}>
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="grid grid-cols-3 max-w-md">
                  {[
                    { icon: Star, value: "4.9", label: "Rating" },
                    { icon: Users, value: "10K+", label: "Reviews" },
                    { icon: Award, value: "99%", label: "Satisfied" }
                  ].map((stat, index) => (
                    <Stack key={index} gap="md" align="center" className="mx-2">
                      <Box className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Icon lucideIcon={stat.icon} c="primary-foreground" />
                      </Box>
                      <Text size="lg" fw="bold" c="primary-foreground">
                        {stat.value}
                      </Text>
                      <Text size="xs" c="primary-foreground" ta="center">
                        {stat.label}
                      </Text>
                    </Stack>
                  ))}
                </Box>
              </Stack>
            </Box>
          );

        default:
          return (
            <Box className="relative w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center" rounded={theme?.themeRounded.default}>
              <Icon size="2xl" lucideIcon={Quote} c="primary" className="opacity-20" />
            </Box>
          );
      }
    };

    return (
      <SplitBlock
        ref={ref}
        leftMedia={mediaPosition === "left"}
        mediaSection={createMediaSection()}
        contentHooks={contentHooks}
        content={content}
        splitSection={!useContainer}
        containerSize="lg"
        py={py}
        gap={gap}
        className={className}
        {...props}
      />
    );
  }
);

SplitTestimonial.displayName = "SplitTestimonial";

// Export template configurations
export const splitTestimonialTemplates = {
  featured: {
    id: "splitTestimonialFeatured",
    name: "Featured Testimonial Split",
    description: "Single featured testimonial with large quote and author details",
    component: SplitTestimonial,
    defaultProps: { variant: "featured" as const }
  },
  
  carousel: {
    id: "splitTestimonialCarousel", 
    name: "Testimonial Carousel",
    description: "Multiple stacked testimonials in carousel style",
    component: SplitTestimonial,
    defaultProps: { variant: "carousel" as const }
  },

  stats: {
    id: "splitTestimonialStats",
    name: "Stats & Social Proof",
    description: "Testimonials combined with statistics and social proof",
    component: SplitTestimonial,
    defaultProps: { variant: "stats" as const }
  }
};