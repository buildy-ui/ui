import { forwardRef } from "react";
import { 
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Play,
  Download,
  Star
} from "lucide-react";
import {
  Block,
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
import { skyOSTheme } from "@ui8kit/theme";

export const currentTheme = skyOSTheme;

export const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  SplitBlock, 
  createContentHook, 
  defaultContentHooks, 
  advancedContentHooks,
  type ContentHooks 
} from "@ui8kit/core/factory/SplitBlock";

// Post interfaces (reuse from CenteredPost)
export interface PostAuthor {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface PostMeta {
  category: string;
  readTime: string;
  publishedDate: string;
  views?: string;
  likes?: string;
  comments?: string;
}

// Split Post data interface
export interface SplitPostData {
  title: string;
  subtitle?: string;
  excerpt?: string;
  author?: PostAuthor;
  meta: PostMeta;
  image: {
    src: string;
    alt: string;
  };
  tags?: string[];
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  relatedLinks?: {
    title: string;
    href: string;
  }[];
}

export interface SplitPostProps {
  content: SplitPostData;
  variant?: "standard" | "author" | "media" | "sidebar" | "hero";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different split post header variants
const splitPostContentHooks = {
  // Standard split post header
  standard: createContentHook({
    content: (content: SplitPostData) => (
      <Stack gap="xl" align="start">
        {/* Breadcrumbs */}
        {content.breadcrumbs && (
          <Group gap="xs" align="center" c="secondary-foreground">
            <Icon component="span" size="sm" lucideIcon={ArrowLeft} />
            <Text size="sm">Back to Blog</Text>
          </Group>
        )}

        {/* Category & Meta */}
        <Group gap="md" align="center">
          <Badge variant="secondary" size="default" rounded="md">
            {content.meta.category}
          </Badge>
          <Group gap="xs" align="center" c="secondary-foreground">
            <Icon component="span" size="xs" lucideIcon={Clock} />
            <Text size="sm">{content.meta.readTime}</Text>
          </Group>
        </Group>

        {/* Title */}
        <Title order={1} size="4xl" fw="bold" className="leading-tight">
          {content.title}
        </Title>

        {/* Subtitle */}
        {content.subtitle && (
          <Text c="secondary-foreground" className="leading-relaxed">
            {content.subtitle}
          </Text>
        )}

        {/* Author & Date */}
        {content.author && (
          <Group gap="lg" align="center">
            <Group gap="sm" align="center">
              <Icon component="span" size="sm" lucideIcon={User} c="primary" />
              <Stack gap="xs">
                <Text size="md" fw="medium">
                  {content.author.name}
                </Text>
                {content.author.role && (
                  <Text size="xs" c="secondary-foreground">
                    {content.author.role}
                  </Text>
                )}
              </Stack>
            </Group>
            <Group gap="xs" align="center" c="secondary-foreground">
              <Icon component="span" size="xs" lucideIcon={Calendar} />
              <Text size="sm">{content.meta.publishedDate}</Text>
            </Group>
          </Group>
        )}

        {/* Tags */}
        {content.tags && (
          <Group gap="xs" className="flex-wrap">
            {content.tags.map((tag, index) => (
              <Badge key={index} variant="outline" size="sm" rounded="md">
                {tag}
              </Badge>
            ))}
          </Group>
        )}

        {/* Actions */}
        <Group gap="sm">
          <Button rounded={theme?.themeRounded.default} size="md" variant="default">
            <Icon component="span" size="xs" c="primary-foreground" lucideIcon={Share2} />
            Share Article
          </Button>
          <Button rounded={theme?.themeRounded.default} size="md" variant="outline">
            <Icon component="span" size="xs" lucideIcon={Bookmark} />
            Save
          </Button>
        </Group>
      </Stack>
    )
  }),

  // Author-focused split header
  author: createContentHook({
    content: (content: SplitPostData) => (
      <Stack gap="xl" align="start">
        {/* Category */}
        <Badge variant="secondary" size="lg" rounded="md" className="px-lg py-sm">
          {content.meta.category}
        </Badge>

        {/* Title */}
        <Title order={1} size="5xl" fw="bold" className="leading-tight">
          {content.title}
        </Title>

        {/* Excerpt */}
        {content.excerpt && (
          <Text c="secondary-foreground" className="leading-relaxed">
            {content.excerpt}
          </Text>
        )}

        {/* Author Card */}
        {content.author && (
          <Box className="bg-muted p-lg rounded-lg w-full">
            <Stack gap="md">
              <Group gap="md" align="start">
                <Icon component="span" size="xl" lucideIcon={User} c="primary" />
                <Stack gap="sm" className="flex-1">
                  <Group gap="sm" align="center" justify="between">
                    <Stack gap="xs">
                      <Text size="lg" fw="semibold">
                        {content.author.name}
                      </Text>
                      {content.author.role && (
                        <Text size="sm" c="secondary-foreground">
                          {content.author.role}
                        </Text>
                      )}
                    </Stack>
                    <Group gap="xs" align="center" c="secondary-foreground">
                      <Icon component="span" size="xs" lucideIcon={Calendar} />
                      <Text size="sm">{content.meta.publishedDate}</Text>
                    </Group>
                  </Group>
                  
                  {content.author.bio && (
                    <Text size="sm" c="secondary-foreground">
                      {content.author.bio}
                    </Text>
                  )}
                </Stack>
              </Group>
            </Stack>
          </Box>
        )}

        {/* Meta Stats */}
        <Group gap="xl" align="center">
          <Group gap="xs" align="center">
            <Icon component="span" size="sm" lucideIcon={Clock} c="primary" />
            <Text size="sm" fw="medium">{content.meta.readTime}</Text>
          </Group>
          {content.meta.views && (
            <Group gap="xs" align="center">
              <Icon component="span" size="sm" lucideIcon={Eye} c="primary" />
              <Text size="sm" fw="medium">{content.meta.views}</Text>
            </Group>
          )}
          {content.meta.likes && (
            <Group gap="xs" align="center">
              <Icon component="span" size="sm" lucideIcon={Heart} c="primary" />
              <Text size="sm" fw="medium">{content.meta.likes}</Text>
            </Group>
          )}
        </Group>

        <Button rounded={theme?.themeRounded.default} size="lg" className="w-full">
          Continue Reading
        </Button>
      </Stack>
    )
  }),

  // Media-focused split header
  media: createContentHook({
    content: (content: SplitPostData) => (
      <Stack gap="lg" align="start">
        {/* Simple Meta */}
        <Group gap="md" align="center">
          <Text size="sm" fw="semibold" c="primary" className="uppercase tracking-wide">
            {content.meta.category}
          </Text>
          <Text size="sm" c="secondary-foreground">
            {content.meta.readTime}
          </Text>
        </Group>

        {/* Title */}
        <Title order={1} size="4xl" fw="bold" className="leading-tight">
          {content.title}
        </Title>

        {/* Subtitle */}
        {content.subtitle && (
          <Text c="secondary-foreground">
            {content.subtitle}
          </Text>
        )}

        {/* Author Line */}
        {content.author && (
          <Group gap="md" align="center" c="secondary-foreground">
            <Text size="sm">By {content.author.name}</Text>
            <Text size="sm">•</Text>
            <Text size="sm">{content.meta.publishedDate}</Text>
          </Group>
        )}

        {/* Media Actions */}
        <Group gap="sm" className="w-full">
          <Button rounded={theme?.themeRounded.default} size="md" variant="default" className="flex-1">
            <Icon component="span" size="xs" c="primary-foreground" lucideIcon={Play} />
            Read Article
          </Button>
          <Button rounded={theme?.themeRounded.default} size="md" variant="outline">
            <Icon component="span" size="xs" lucideIcon={Share2} />
          </Button>
          <Button rounded={theme?.themeRounded.default} size="md" variant="outline">
            <Icon component="span" size="xs" lucideIcon={Bookmark} />
          </Button>
        </Group>

        {/* Quick Tags */}
        {content.tags && (
          <Group gap="xs" className="flex-wrap">
            {content.tags.slice(0, 3).map((tag, index) => (
              <Text key={index} size="xs" c="secondary-foreground" className="opacity-75">
                #{tag}
              </Text>
            ))}
          </Group>
        )}
      </Stack>
    )
  }),

  // Sidebar-style split header
  sidebar: createContentHook({
    content: (content: SplitPostData) => (
      <Stack gap="lg" align="start">
        {/* Navigation */}
        <Group gap="xs" align="center" c="secondary-foreground">
          <Icon component="span" size="sm" lucideIcon={ArrowLeft} />
          <Text size="sm">All Articles</Text>
        </Group>

        {/* Category Badge */}
        <Badge variant="default" size="default" rounded="md">
          {content.meta.category}
        </Badge>

        {/* Title */}
        <Title order={1} size="3xl" fw="bold" className="leading-tight">
          {content.title}
        </Title>

        {/* Meta Info */}
        <Stack gap="sm" className="w-full">
          {content.author && (
            <Group gap="sm" align="center">
              <Icon component="span" size="sm" lucideIcon={User} c="primary" />
              <Text size="sm" fw="medium">{content.author.name}</Text>
            </Group>
          )}
          
          <Group gap="sm" align="center">
            <Icon component="span" size="sm" lucideIcon={Calendar} c="primary" />
            <Text size="sm">{content.meta.publishedDate}</Text>
          </Group>
          
          <Group gap="sm" align="center">
            <Icon component="span" size="sm" lucideIcon={Clock} c="primary" />
            <Text size="sm">{content.meta.readTime}</Text>
          </Group>

          {content.meta.views && (
            <Group gap="sm" align="center">
              <Icon component="span" size="sm" lucideIcon={Eye} c="primary" />
              <Text size="sm">{content.meta.views} views</Text>
            </Group>
          )}
        </Stack>

        {/* Related Links */}
        {content.relatedLinks && (
          <Stack gap="sm" className="w-full">
            <Text size="sm" fw="semibold" c="secondary-foreground" className="uppercase tracking-wide">
              Related
            </Text>
            {content.relatedLinks.slice(0, 3).map((link, index) => (
              <Group key={index} gap="sm" align="center" className="hover:bg-muted p-sm rounded-md cursor-pointer">
                <Icon component="span" size="xs" lucideIcon={ChevronRight} c="secondary-foreground" />
                <Text size="sm" className="line-clamp-1">
                  {link.title}
                </Text>
              </Group>
            ))}
          </Stack>
        )}

        {/* Action Buttons */}
        <Stack gap="sm" className="w-full">
          <Button rounded={theme?.themeRounded.default} size="md" variant="default" className="w-full">
            Start Reading
          </Button>
          <Group gap="sm">
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline" className="flex-1">
              <Icon component="span" size="xs" c="primary-foreground" lucideIcon={Share2} />
              Share
            </Button>
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline" className="flex-1">
              <Icon component="span" size="xs" lucideIcon={Download} />
              Save
            </Button>
          </Group>
        </Stack>
      </Stack>
    )
  }),

  // Hero-style split header
  hero: createContentHook({
    content: (content: SplitPostData) => (
      <Stack gap="xl" align="start">
        {/* Hero Badge */}
        <Group gap="sm" align="center">
          <Badge variant="default" size="lg" rounded="full" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Icon component="span" size="xs" c="primary-foreground" lucideIcon={Star} />
            Featured Story
          </Badge>
          <Badge variant="secondary" size="default" rounded="md">
            {content.meta.category}
          </Badge>
        </Group>

        {/* Hero Title */}
        <Title order={1} size="5xl" fw="bold" className="leading-tight">
          {content.title}
        </Title>

        {/* Hero Subtitle */}
        {content.subtitle && (
          <Text size="2xl" c="secondary-foreground" className="leading-relaxed font-medium">
            {content.subtitle}
          </Text>
        )}

        {/* Hero Stats */}
        <Group gap="xl" align="center">
          <Group gap="xs" align="center">
            <Icon component="span" size="sm" lucideIcon={Clock} c="primary" />
            <Text size="md" fw="medium">{content.meta.readTime}</Text>
          </Group>
          {content.meta.views && (
            <Group gap="xs" align="center">
              <Icon component="span" size="sm" lucideIcon={Eye} c="primary" />
              <Text size="md" fw="medium">{content.meta.views}</Text>
            </Group>
          )}
          {content.meta.likes && (
            <Group gap="xs" align="center">
              <Icon component="span" size="sm" lucideIcon={Heart} c="primary" />
              <Text size="md" fw="medium">{content.meta.likes}</Text>
            </Group>
          )}
        </Group>

        {/* Author Hero Card */}
        {content.author && (
          <Box className="bg-gradient-to-r from-primary/10 to-secondary/10 p-lg rounded-xl w-full">
            <Group gap="md" align="center">
              <Icon component="span" size="xl" lucideIcon={User} c="primary" />
              <Stack gap="xs" className="flex-1">
                <Text size="lg" fw="semibold">
                  {content.author.name}
                </Text>
                {content.author.role && (
                  <Text size="sm" c="secondary-foreground">
                    {content.author.role}
                  </Text>
                )}
                <Text size="xs" c="secondary-foreground">
                  Published {content.meta.publishedDate}
                </Text>
              </Stack>
            </Group>
          </Box>
        )}

        {/* Hero Actions */}
        <Group gap="md" className="w-full">
          <Button rounded={theme?.themeRounded.default} size="lg" variant="default" className="flex-1">
            <Icon component="span" size="sm" c="primary-foreground" lucideIcon={BookOpen} />
            Read Full Story
          </Button>
          <Button rounded={theme?.themeRounded.default} size="lg" variant="outline">
            <Icon component="span" size="sm" lucideIcon={Share2} />
            Share
          </Button>
        </Group>

        {/* Hero Tags */}
        {content.tags && (
          <Group gap="xs" className="flex-wrap">
            {content.tags.map((tag, index) => (
              <Badge key={index} variant="outline" size="sm" rounded="full">
                {tag}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    )
  })
};

export const SplitPost = forwardRef<HTMLElement, SplitPostProps>(
  ({ 
    content, 
    variant = "standard",
    leftMedia = false,
    useContainer = true,
    py = "xl",
    gap = "md",
    className,
    ...props 
  }, ref) => {
    
    // Create media section - always use the post image
    const createMediaSection = () => {
      return (
        <Block className="h-full relative overflow-hidden">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width="100%"
            height="100%"
            fit="cover"
          />
          
          {/* Overlay for better text readability */}
          <Box className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = splitPostContentHooks[variant] || splitPostContentHooks.standard;

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

SplitPost.displayName = "SplitPost";

// Export template configurations
export const splitPostTemplates = {
  standard: {
    id: "splitPostStandard",
    name: "Standard Split Post",
    description: "Classic split layout with post content and image",
    component: SplitPost,
    defaultProps: { variant: "standard" as const }
  },
  
  author: {
    id: "splitPostAuthor",
    name: "Author-Focused Split Post",
    description: "Split layout highlighting author information",
    component: SplitPost,
    defaultProps: { variant: "author" as const }
  },

  media: {
    id: "splitPostMedia",
    name: "Media-Focused Split Post",
    description: "Split layout optimized for media content",
    component: SplitPost,
    defaultProps: { variant: "media" as const }
  },

  sidebar: {
    id: "splitPostSidebar",
    name: "Sidebar Split Post",
    description: "Split layout with sidebar-style navigation",
    component: SplitPost,
    defaultProps: { variant: "sidebar" as const }
  },

  hero: {
    id: "splitPostHero",
    name: "Hero Split Post",
    description: "Hero-style split layout for featured posts",
    component: SplitPost,
    defaultProps: { variant: "hero" as const }
  }
};