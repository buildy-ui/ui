import { forwardRef } from "react";
import { 
  Star,
  Quote,
  User,
  Award,
  Heart,
  CheckCircle,
  MessageSquare,
  Users,
  ThumbsUp,
  Shield,
  Verified
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

export const currentTheme = skyOSTheme;

export const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  LayoutBlock,
  createLayoutContentHook,
  type LayoutContentHooks
} from "@ui8kit/core";

// Reuse testimonial interfaces from SplitTestimonial
export interface TestimonialItem {
  id: string;
  rating: number;
  quote: string;
  author: string;
  position: string;
  company?: string;
  avatar?: {
    src: string;
    alt: string;
  };
  verified?: boolean;
}

export interface GridTestimonialData {
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
}

export interface GridTestimonialProps {
  content: GridTestimonialData;
  variant?: "grid" | "masonry" | "minimal" | "cards" | "compact" | "slider" | "magazine";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Render stars component (reused from SplitTestimonial)
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

// Custom content hooks for different grid testimonial variants
const gridTestimonialContentHooks = {
  // 1. Classic Grid Layout
  grid: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="lg" align="center" ta="center" className="max-w-3xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            <Icon lucideIcon={MessageSquare} />
            {content.badge}
          </Badge>
        )}
        
        <Title order={1} size="4xl" fw="bold" ta="center">
          {content.title}
        </Title>
        
        {content.description && (
          <Text c="secondary-foreground" ta="center">
            {content.description}
          </Text>
        )}

        {content.stats && (
          <Group gap="xl" align="center">
            {content.stats.averageRating && (
              <Group gap="md" align="center">
                <RenderStars rating={Math.floor(parseFloat(content.stats.averageRating))} size="md" />
                <Text size="lg" fw="semibold">{content.stats.averageRating} out of 5</Text>
              </Group>
            )}
            {content.stats.totalReviews && (
              <Text size="md" c="secondary-foreground">
                Based on {content.stats.totalReviews} reviews
              </Text>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem) => (
      <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="h-full">
        <Stack gap="md" align="start">
          <Group gap="md" align="start" justify="between">
            <RenderStars rating={testimonial.rating} />
            <Icon size="lg" lucideIcon={Quote} c="primary" className="opacity-30" />
          </Group>
          
          <Text size="md" className="leading-relaxed">
            "{testimonial.quote}"
          </Text>
          
          <Group gap="md" align="center" className="mt-auto">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt}
                width="50px"
                height="50px"
                fit="cover"
                rounded="full"
              />
            ) : (
              <Box 
                className="w-[50px] h-[50px] bg-primary/10 rounded-full flex items-center justify-center"
                data-class="avatar-placeholder"
              >
                <Icon lucideIcon={User} c="primary" />
              </Box>
            )}
            
            <Stack gap="xs">
              <Group gap="md" align="center">
                <Text size="sm" fw="semibold">
                  {testimonial.author}
                </Text>
                {testimonial.verified && (
                  <Icon lucideIcon={CheckCircle} c="green-500" />
                )}
              </Group>
              <Text size="xs" c="secondary-foreground">
                {testimonial.position}
                {testimonial.company && ` at ${testimonial.company}`}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>
    )
  }),

  // 2. Masonry Layout with Varying Heights
  masonry: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="lg" align="center" ta="center">
        <Title order={1} size="5xl" fw="bold" ta="center">
          {content.title}
        </Title>
        {content.subtitle && (
          <Text c="secondary-foreground" ta="center" className="max-w-2xl">
            {content.subtitle}
          </Text>
        )}
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem, index: number) => {
      const isLarge = index % 4 === 0;
      
      return (
        <Card 
          p={isLarge ? "xl" : "lg"} 
          rounded={theme?.themeRounded.default} 
          shadow="md" 
          className={`${isLarge ? "row-span-2" : ""} bg-gradient-to-br from-card to-card/80`}
        >
          <Stack gap="md" align="start">
            <Group gap="md" align="center" justify="between">
              <RenderStars rating={testimonial.rating} size={isLarge ? "md" : "sm"} />
              {testimonial.verified && (
                <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  <Icon lucideIcon={Verified} />
                  Verified
                </Badge>
              )}
            </Group>
            
            <Text size={isLarge ? "lg" : "md"} className="leading-relaxed italic">
              "{testimonial.quote}"
            </Text>
            
            <Group gap="md" align="center">
              {testimonial.avatar ? (
                <Image
                  src={testimonial.avatar.src}
                  alt={testimonial.avatar.alt}
                  width={isLarge ? "60px" : "45px"}
                  height={isLarge ? "60px" : "45px"}
                  fit="cover"
                  rounded="full"
                />
              ) : (
                <Box 
                  className={`${isLarge ? "w-[60px] h-[60px]" : "w-[45px] h-[45px]"} bg-primary/10 rounded-full flex items-center justify-center`}
                  data-class="avatar-placeholder"
                >
                  <Icon size={isLarge ? "lg" : "md"} lucideIcon={User} c="primary" />
                </Box>
              )}
              
              <Stack gap="xs">
                <Text size={isLarge ? "md" : "sm"} fw="semibold">
                  {testimonial.author}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  {testimonial.position}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      );
    }
  }),

  // 3. Minimal Clean Layout
  minimal: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="md" align="center" ta="center" className="max-w-2xl mx-auto">
        <Text size="xs" fw="semibold" c="primary" className="uppercase tracking-widest">
          {content.badge || "Testimonials"}
        </Text>
        
        <Title order={1} size="3xl" fw="light" ta="center" className="font-serif">
          {content.title}
        </Title>
        
        {content.subtitle && (
          <Text c="secondary-foreground" ta="center" className="italic">
            {content.subtitle}
          </Text>
        )}
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem) => (
      <Box className="relative p-6 border-l-4 border-primary/20 bg-card/30 rounded-r-md hover:border-primary/50 transition-colors">
        <Stack gap="md" align="start">
          <Text size="md" className="leading-relaxed font-light">
            "{testimonial.quote}"   
          </Text>
          
          <Group gap="md" align="center" justify="between">
            <Stack gap="xs">
              <Text size="sm" fw="medium">
                — {testimonial.author}
              </Text>
              <Text size="xs" c="secondary-foreground" className="font-light">
                {testimonial.position}
              </Text>
            </Stack>
            
            <RenderStars rating={testimonial.rating} size="xs" />
          </Group>
        </Stack>
      </Box>
    )
  }),

  // 4. Detailed Cards with Avatars
  cards: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="lg" align="center" ta="center">
        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="px-lg py-sm">
          <Icon lucideIcon={Users} />
          {content.badge || "Customer Reviews"}
        </Badge>
        
        <Title order={1} size="4xl" fw="bold" ta="center">
          {content.title}
        </Title>
        
        {content.stats && (
          <Group gap="xl" align="center">
            {content.stats.totalReviews && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.totalReviews}
                </Text>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Happy Customers
                </Text>
              </Stack>
            )}
            {content.stats.averageRating && (
              <Stack gap="xs" align="center">
                <Group gap="xs" align="center">
                  <Text size="2xl" fw="bold" c="primary">
                    {content.stats.averageRating}
                  </Text>
                  <Icon size="lg" lucideIcon={Star} className="text-yellow-500 fill-yellow-500" />
                </Group>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Average Rating
                </Text>
              </Stack>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem) => (
      <Card p="xl" rounded={theme?.themeRounded.default} shadow="lg" className="h-full bg-card border hover:shadow-xl transition-shadow">
        <Stack gap="lg" align="start">
          {/* Header with rating and quote icon */}
          <Group gap="md" align="center" justify="between">
            <RenderStars rating={testimonial.rating} size="md" />
            <Icon size="xl" lucideIcon={Quote} c="primary" className="opacity-20" />
          </Group>
          
          {/* Quote */}
          <Text size="lg" className="leading-relaxed font-medium">
            "{testimonial.quote}"
          </Text>
          
          {/* Author section */}
          <Group gap="lg" align="center" className="mt-auto">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt}
                width="70px"
                height="70px"
                fit="cover"
                rounded="full"
                className="border-4 border-primary/10"
              />
            ) : (
              <Box 
                className="w-[70px] h-[70px] bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20"
                data-class="avatar-placeholder"
              >
                <Icon size="xl" lucideIcon={User} c="primary" />
              </Box>
            )}
            
            <Stack gap="md">
              <Group gap="md" align="center">
                <Text size="md" fw="bold">
                  {testimonial.author}
                </Text>
                {testimonial.verified && (
                  <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                    <Icon lucideIcon={Shield} />
                    Verified
                  </Badge>
                )}
              </Group>
              <Text c="secondary-foreground">
                {testimonial.position}
                {testimonial.company && ` at ${testimonial.company}`}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>
    )
  }),

  // 5. Compact Layout
  compact: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="md" align="center" ta="center">
        <Title order={1} size="3xl" fw="bold" ta="center">
          {content.title}
        </Title>
        {content.description && (
          <Text c="secondary-foreground" ta="center" className="max-w-xl">
            {content.description}
          </Text>
        )}
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem) => (
      <Box className="p-4 bg-card rounded-md border hover:bg-card/80 transition-colors">
        <Stack gap="md" align="start">
          <Group gap="md" align="center" justify="between">
            <RenderStars rating={testimonial.rating} size="xs" />
            <Icon lucideIcon={Quote} c="primary" className="opacity-40" />
          </Group>
          
          <Text size="sm" className="leading-relaxed line-clamp-3">
            "{testimonial.quote}"
          </Text>
          
          <Group gap="md" align="center">
            <Text size="xs" fw="semibold">
              {testimonial.author}
            </Text>
            <Text size="xs" c="secondary-foreground">
              •
            </Text>
            <Text size="xs" c="secondary-foreground">
              {testimonial.position}
            </Text>
          </Group>
        </Stack>
      </Box>
    )
  }),

  // 6. Slider Style (Single Row)
  slider: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="lg" align="start">
        <Group gap="md" align="center" justify="between" className="w-full">
          <Stack gap="md">
            <Title order={1} size="3xl" fw="bold">
              {content.title}
            </Title>
            {content.description && (
              <Text size="md" c="secondary-foreground">
                {content.description}
              </Text>
            )}
          </Stack>
          
          <Group gap="md">
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
              <Icon lucideIcon={ThumbsUp} />
              All Reviews
            </Button>
          </Group>
        </Group>
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem) => (
      <Card p="lg"rounded={theme?.themeRounded.default} shadow="sm" className="min-w-[300px] bg-card">
        <Stack gap="md" align="start">
          <RenderStars rating={testimonial.rating} size="sm" />
          
          <Text size="md" className="leading-relaxed line-clamp-4">
            "{testimonial.quote}"
          </Text>
          
          <Group gap="md" align="center">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt}
                width="35px"
                height="35px"
                fit="cover"
                rounded="full"
              />
            ) : (
              <Box 
                className="w-[35px] h-[35px] bg-primary/10 rounded-full flex items-center justify-center"
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
        </Stack>
      </Card>
    )
  }),

  // 7. Magazine Style with Featured Testimonials
  magazine: createLayoutContentHook({
    header: (content: GridTestimonialData) => (
      <Stack gap="xl" align="center" ta="center">
        <Stack gap="md" align="center">
          <Text size="xs" c="primary" className="uppercase tracking-widest font-bold">
            {content.badge || "Featured Reviews"}
          </Text>
          
          <Title order={1} size="6xl" fw="black" ta="center" className="leading-none">
            {content.title}
          </Title>
          
          {content.subtitle && (
            <Text c="secondary-foreground" ta="center" className="font-light max-w-3xl">
              {content.subtitle}
            </Text>
          )}
        </Stack>

        {content.stats && (
          <Group gap="3xl" align="center">
            {content.stats.totalReviews && (
              <Stack gap="xs" align="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.totalReviews}
                </Text>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Reviews
                </Text>
              </Stack>
            )}
            {content.stats.averageRating && (
              <Stack gap="xs" align="center">
                <Group gap="xs" align="center">
                  <Text size="3xl" fw="bold" c="primary">
                    {content.stats.averageRating}
                  </Text>
                  <Icon size="xl" lucideIcon={Star} className="text-yellow-500 fill-yellow-500" />
                </Group>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Average
                </Text>
              </Stack>
            )}
            {content.stats.satisfied && (
              <Stack gap="xs" align="center">
                <Text size="3xl" fw="bold" c="primary">
                  {content.stats.satisfied}
                </Text>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Satisfied
                </Text>
              </Stack>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (testimonial: TestimonialItem, index: number) => {
      const isFeatured = index % 5 === 0;
      
      return (
        <Card 
          p={isFeatured ? "2xl" : "lg"} 
          rounded={theme?.themeRounded.default} 
          shadow={isFeatured ? "xl" : "md"} 
          className={`${isFeatured ? "col-span-2 row-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" : "bg-card"} hover:shadow-lg transition-shadow`}
        >
          <Stack gap={isFeatured ? "lg" : "md"} align="start">
            <Group gap="md" align="center" justify="between">
              <RenderStars rating={testimonial.rating} size={isFeatured ? "md" : "sm"} />
              {isFeatured && (
                <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  <Icon lucideIcon={Award} />
                  Featured
                </Badge>
              )}
            </Group>
            
            <Icon 
              component="div" 
              size={isFeatured ? "2xl" : "xl"} 
              lucideIcon={Quote} 
              c="primary" 
              className="opacity-20" 
            />
            
            <Text size={isFeatured ? "xl" : "md"} className="leading-relaxed font-medium">
              "{testimonial.quote}"
            </Text>
            
            <Group gap="md" align="center" className="mt-auto">
              {testimonial.avatar ? (
                <Image
                  src={testimonial.avatar.src}
                  alt={testimonial.avatar.alt}
                  width={isFeatured ? "60px" : "45px"}
                  height={isFeatured ? "60px" : "45px"}
                  fit="cover"
                  rounded="full"
                />
              ) : (
                <Box 
                  className={`${isFeatured ? "w-[60px] h-[60px]" : "w-[45px] h-[45px]"} bg-primary/10 rounded-full flex items-center justify-center`}
                  data-class="avatar-placeholder"
                >
                  <Icon size={isFeatured ? "lg" : "md"} lucideIcon={User} c="primary" />
                </Box>
              )}
              
              <Stack gap="xs">
                <Text size={isFeatured ? "md" : "sm"} fw="bold">
                  {testimonial.author}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  {testimonial.position}
                  {testimonial.company && ` at ${testimonial.company}`}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      );
    }
  })
};

export const GridTestimonial = forwardRef<HTMLElement, GridTestimonialProps>(
  ({ 
    content, 
    variant = "grid",
    useContainer = true,
    py = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = gridTestimonialContentHooks[variant] || gridTestimonialContentHooks.grid;

    // Determine layout type and grid configuration based on variant
    const getLayoutConfig = () => {
      switch (variant) {
        case "masonry":
          return { layout: "grid" as const, cols: "1-2-3" };
        case "minimal":
          return { layout: "grid" as const, cols: "1-2" };
        case "cards":
          return { layout: "grid" as const, cols: "1-2-3" };  
        case "compact":
          return { layout: "grid" as const, cols: "1-2-3-4" };
        case "slider":
          return { layout: "flex" as const, wrap: "nowrap" };
        case "magazine":
          return { layout: "grid" as const, cols: "1-2-3" };
        default: // grid
          return { layout: "grid" as const, cols: "1-2-3" };
      }
    };

    const layoutConfig = getLayoutConfig();

    return (
      <LayoutBlock
        ref={ref}
        layout={layoutConfig.layout}
        cols={layoutConfig.cols}
        wrap={layoutConfig.wrap}
        useContainer={useContainer}
        py={py}
        showHeader={true}
        content={{ ...content, items: content.testimonials }}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridTestimonial.displayName = "GridTestimonial";

// Export template configurations
export const gridTestimonialTemplates = {
  grid: {
    id: "gridTestimonialGrid",
    name: "Classic Grid Testimonials",
    description: "Traditional grid layout with testimonial cards",
    component: GridTestimonial,
    defaultProps: { variant: "grid" as const }
  },
  
  masonry: {
    id: "gridTestimonialMasonry",
    name: "Masonry Testimonials",
    description: "Pinterest-style masonry layout with varying heights",
    component: GridTestimonial,
    defaultProps: { variant: "masonry" as const }
  },

  minimal: {
    id: "gridTestimonialMinimal",
    name: "Minimal Testimonials",
    description: "Clean, minimal design with subtle styling",
    component: GridTestimonial,
    defaultProps: { variant: "minimal" as const }
  },

  cards: {
    id: "gridTestimonialCards",
    name: "Detailed Card Testimonials",
    description: "Rich card layout with avatars and detailed information",
    component: GridTestimonial,
    defaultProps: { variant: "cards" as const }
  },

  compact: {
    id: "gridTestimonialCompact",
    name: "Compact Testimonials",
    description: "Space-efficient compact testimonial layout",
    component: GridTestimonial,
    defaultProps: { variant: "compact" as const }
  },

  slider: {
    id: "gridTestimonialSlider",
    name: "Slider Testimonials",
    description: "Horizontal slider-style testimonial layout",
    component: GridTestimonial,
    defaultProps: { variant: "slider" as const }
  },

  magazine: {
    id: "gridTestimonialMagazine",
    name: "Magazine Testimonials",
    description: "Editorial magazine-style layout with featured testimonials",
    component: GridTestimonial,
    defaultProps: { variant: "magazine" as const }
  }
};