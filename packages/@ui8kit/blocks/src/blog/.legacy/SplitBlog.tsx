import { forwardRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Clock, User } from "lucide-react";
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

// Blog post interface (reuse from GridBlog)
interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  image?: {
    src: string;
    alt: string;
  };
  category: string;
  categoryId?: string;
}

// Split Blog data interface
export interface SplitBlogData {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  viewAllText?: string;
  posts: BlogPost[];
  featuredPost?: BlogPost;
}

interface SplitBlogProps {
  content: SplitBlogData;
  variant?: "news" | "slider" | "featured" | "newsletter" | "timeline";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}


const sideArticlesContentHooks = {
  // News variant - side articles for media section
  news: createContentHook({
    content: (content: SplitBlogData) => {
      const sideArticles = content.posts.slice(1, 4);
      return (
        <Stack gap="md" className="w-full h-full">
          <Title order={3} size="lg" fw="semibold">
            Related Articles
          </Title>
          
          <Stack gap="md" className="flex-1">
            {sideArticles.map((article) => (
              <Card key={article.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-md transition-shadow">
                <Group gap="md" align="start">
                  {article.image && (
                    <Image
                      src={article.image.src}
                      alt={article.image.alt}
                      width="24px"
                      height="24px"
                      fit="cover"
                      rounded="full"
                      className="w-10 h-10"
                    />
                  )}
                  
                  <Stack gap="xs" className="flex-1 min-w-0">
                    <Title order={4} size="sm" fw="semibold" className="line-clamp-2">
                      {article.title}
                    </Title>
                    
                    <Group gap="md" align="center" className="text-xs">
                      <Text size="xs" c="secondary-foreground">
                        {article.author.name}
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        •
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        {article.readTime}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>
      );
    }
  })
};

// Custom content hooks for different blog split variants
const splitBlogContentHooks = {
  // News variant - main article only (side articles moved to media section)
  news: createContentHook({
    content: (content: SplitBlogData) => {
      const mainPost = content.posts[0];

      return (
        <Stack gap="xl" align="start">
          <Stack gap="lg" align="start">
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge || "News"}
            </Badge>

            <Title order={1} size="3xl" fw="bold">
              {content.title}
            </Title>

            {content.subtitle && (
              <Text c="secondary-foreground" className="max-w-[42rem]">
                {content.subtitle}
              </Text>
            )}
          </Stack>

          {/* Main Article */}
          {mainPost && (
            <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="w-full">
              <Stack gap="md" align="start">
                {mainPost.image && (
                  <Image
                    src={mainPost.image.src}
                    alt={mainPost.image.alt}
                    width="100%"
                    height="200px"
                    fit="cover"
                    rounded={theme?.themeRounded.default}
                  />
                )}

                <Stack gap="md">
                  <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                    {mainPost.category}
                  </Badge>
                  
                  <Title order={2} size="xl" fw="bold">
                    {mainPost.title}
                  </Title>
                  
                  <Text size="md" c="secondary-foreground">
                    {mainPost.description}
                  </Text>
                </Stack>

                <Group gap="md" align="center" className="w-full">
                  <Group gap="sm" align="center">
                    <Icon lucideIcon={User} />
                    <Text c="secondary-foreground">
                      {mainPost.author.name}
                    </Text>
                  </Group>
                  
                  <Group gap="sm" align="center">
                    <Icon lucideIcon={Calendar} />
                    <Text c="secondary-foreground">
                      {mainPost.date}
                    </Text>
                  </Group>
                  
                  <Group gap="sm" align="center">
                    <Icon lucideIcon={Clock} />
                    <Text c="secondary-foreground">
                      {mainPost.readTime}
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Card>
          )}
        </Stack>
      );
    }
  }),

  // Slider variant - content with navigation
  slider: createContentHook({
    content: (content: SplitBlogData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.tagline && (
            <Text c="secondary-foreground" fw="medium">
              {content.tagline}
            </Text>
          )}

          <Title order={1} size="3xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {content.viewAllText && (
          <Button rounded={theme?.themeRounded.default} variant="outline" size={theme?.themeButtonSize.default} rightSection={
            <Icon lucideIcon={ArrowRight} />
          }>
            {content.viewAllText}
          </Button>
        )}

        {/* Navigation Controls */}
        <Group gap="md" align="center">
          <Button rounded={theme?.themeRounded.default} variant="outline" size={theme?.themeButtonSize.default} className="p-2">
            <Icon lucideIcon={ChevronLeft} />
          </Button>
          <Button rounded={theme?.themeRounded.default} variant="outline" size={theme?.themeButtonSize.default} className="p-2">
            <Icon lucideIcon={ChevronRight} />
          </Button>
        </Group>
      </Stack>
    )
  }),

  // Featured variant - highlight one main post
  featured: createContentHook({
    content: (content: SplitBlogData) => {
      const featuredPost = content.featuredPost || content.posts[0];

      return (
        <Stack gap="xl" align="start">
          <Stack gap="md" align="start">
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge || "Featured"}
            </Badge>

            <Title order={1} size="4xl" fw="bold">
              {content.title}
            </Title>

            <Text c="secondary-foreground">
              {content.description}
            </Text>
          </Stack>

          {/* Featured Post Details */}
          {featuredPost && (
            <Stack gap="lg" className="w-full">
              <Stack gap="md">
                <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {featuredPost.category}
                </Badge>
                
                <Title order={2} size="2xl" fw="bold">
                  {featuredPost.title}
                </Title>
                
                <Text c="secondary-foreground">
                  {featuredPost.description}
                </Text>
              </Stack>

              <Group gap="lg" align="center">
                <Group gap="md" align="center">
                  {featuredPost.author.avatar && (
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      width="24px"
                      height="24px"
                      fit="cover"
                      rounded="full"
                      className="w-10 h-10"
                    />
                  )}
                  <Stack gap="none">
                    <Text size="sm" fw="medium">
                      {featuredPost.author.name}
                    </Text>
                    <Group gap="xs" align="center">
                      <Text size="xs" c="secondary-foreground">
                        {featuredPost.date}
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        •
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        {featuredPost.readTime}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
              </Group>

              <Button rounded={theme?.themeRounded.default} size={theme?.themeButtonSize.default} variant="default" rightSection={
                <Icon c="primary-foreground" lucideIcon={ArrowRight} />
              }>
                Read Full Article
              </Button>
            </Stack>
          )}
        </Stack>
      );
    }
  }),

  // Newsletter variant - subscription focused
  newsletter: createContentHook({
    content: (content: SplitBlogData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge || "Newsletter"}
          </Badge>

          <Title order={1} size="3xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Latest Posts Preview */}
        <Stack gap="md" className="w-full">
          <Title order={3} size="lg" fw="semibold">
            Latest Posts
          </Title>
          
          <Stack gap="md">
            {content.posts.slice(0, 3).map((post) => (
              <Group key={post.id} gap="md" align="center" className="p-2 rounded hover:bg-muted/50 transition-colors">
                <Box className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <Stack gap="none" className="flex-1 min-w-0">
                  <Text size="sm" fw="medium" className="line-clamp-1">
                    {post.title}
                  </Text>
                  <Text size="xs" c="secondary-foreground">
                    {post.date} • {post.readTime}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Stack>

        <Button rounded={theme?.themeRounded.default} size={theme?.themeButtonSize.default} variant="default" className="w-full" rightSection={
          <Icon c="primary-foreground" lucideIcon={ArrowRight} />
        }>
          Subscribe to Newsletter
        </Button>
      </Stack>
    )
  }),

  // Timeline variant - chronological posts
  timeline: createContentHook({
    content: (content: SplitBlogData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.badge || "Timeline"}
          </Badge>

          <Title order={1} size="3xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Timeline Posts */}
        <Stack gap="lg" className="w-full">
          {content.posts.slice(0, 4).map((post, index) => (
            <Group key={post.id} gap="md" align="start" className="relative">
              {/* Timeline Line */}
              {index < content.posts.length - 1 && (
                <Box className="absolute left-4 top-8 w-px h-full bg-border" />
              )}
              
              {/* Timeline Dot */}
              <Box className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                <Text size="xs" c="primary-foreground" fw="bold">
                  {index + 1}
                </Text>
              </Box>

              {/* Post Content */}
              <Stack gap="md" className="flex-1 pb-4">
                <Stack gap="xs">
                  <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                    {post.category}
                  </Badge>
                  
                  <Title order={4} size="md" fw="semibold">
                    {post.title}
                  </Title>
                  
                  <Text c="secondary-foreground" className="line-clamp-2">
                    {post.description}
                  </Text>
                </Stack>

                <Group gap="md" align="center" className="text-xs">
                  <Text size="xs" c="secondary-foreground">
                    {post.author.name}
                  </Text>
                  <Text size="xs" c="secondary-foreground">
                    •
                  </Text>
                  <Text size="xs" c="secondary-foreground">
                    {post.date}
                  </Text>
                </Group>
              </Stack>
            </Group>
          ))}
        </Stack>

        {content.viewAllText && (
          <Button rounded={theme?.themeRounded.default} variant="outline" size={theme?.themeButtonSize.default} rightSection={
            <Icon lucideIcon={ArrowRight} />
          }>
            {content.viewAllText}
          </Button>
        )}
      </Stack>
    )
  })
};

export const SplitBlog = forwardRef<HTMLElement, SplitBlogProps>(
  ({ 
    content, 
    variant = "news",
    leftMedia = false,
    useContainer = true,
    py = "lg",
    gap = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Create media section based on variant and content
    const createMediaSection = () => {

      // Default: show first post image or gradient
      const firstPost = {
        image: {
          src: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "JavaScript frameworks comparison"
        }
      };

      if (variant === "news" && content.posts.length > 1) {
        // Show side articles for news variant
        const sideContentHooks = sideArticlesContentHooks.news as any;
        return (
          <Block className="h-full" data-class="news-side-articles">
            <Image
              src={firstPost.image.src}
              alt={firstPost.image.alt}
              width="100%"
              height="auto"
              rounded={theme?.themeRounded.default}
              fit="cover"
            />
            {/* Side Articles */}
            <Stack py="lg">
            {sideContentHooks?.content(content)}
            </Stack>
          </Block>
        );
      }

      if (variant === "slider" && content.posts.length > 0) {
        // Show multiple posts in a grid for slider
        return (
          <Grid cols="1-2" gap="md">
            {content.posts.slice(0, 4).map((post) => (
              <Card key={post.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-md transition-shadow">
                <Stack gap="md" align="start">
                  {post.image && (
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      width="100%"
                      height="120px"
                      fit="cover"
                      rounded={theme?.themeRounded.default}
                    />
                  )}

                  <Stack gap="xs" className="flex-1">
                    <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                      {post.category}
                    </Badge>
                    
                    <Title order={4} size="sm" fw="semibold" className="line-clamp-2">
                      {post.title}
                    </Title>
                    
                    <Group gap="xs" align="center" className="text-xs">
                      <Text size="xs" c="secondary-foreground">
                        {post.author.name}
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        •
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        {post.readTime}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        );
      }

      if (firstPost?.image) {
        return (
          <Block>
            <Image
              src={firstPost.image.src}
              alt={firstPost.image.alt}
              width="100%"
              height="auto"
              rounded={theme?.themeRounded.default}
              fit="cover"
            />
          </Block>
        );
      }

      // Default gradient background
      return (
        <Block 
          className={`h-full bg-gradient-to-br from-primary/5 to-secondary/10 relative overflow-hidden rounded-${theme?.themeRounded.default}`}
          data-class="blog-gradient-background"
          rounded={theme?.themeRounded.default}
        >
          <Box className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = splitBlogContentHooks[variant] || splitBlogContentHooks.news;

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

SplitBlog.displayName = "SplitBlog";

// Export template configurations
export const splitBlogTemplates = {
  news: {
    id: "splitBlogNews",
    name: "Blog News Split",
    description: "Split layout with main article and related posts",
    component: SplitBlog,
    defaultProps: { variant: "news" as const }
  },
  
  slider: {
    id: "splitBlogSlider",
    name: "Blog Slider Split",
    description: "Split layout with post grid and navigation",
    component: SplitBlog,
    defaultProps: { variant: "slider" as const }
  },

  featured: {
    id: "splitBlogFeatured",
    name: "Featured Blog Split",
    description: "Split layout highlighting one main post",
    component: SplitBlog,
    defaultProps: { variant: "featured" as const }
  },

  newsletter: {
    id: "splitBlogNewsletter",
    name: "Newsletter Blog Split",
    description: "Split layout focused on newsletter subscription",
    component: SplitBlog,
    defaultProps: { variant: "newsletter" as const }
  },

  timeline: {
    id: "splitBlogTimeline",
    name: "Timeline Blog Split",
    description: "Split layout with chronological post timeline",
    component: SplitBlog,
    defaultProps: { variant: "timeline" as const }
  }
};