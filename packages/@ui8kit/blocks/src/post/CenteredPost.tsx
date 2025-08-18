import { forwardRef } from "react";
import { 
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Eye,
  Heart,
  Bookmark
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
  type VariantSpacingProps
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

// Post interfaces
interface PostAuthor {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

interface PostMeta {
  category: string;
  readTime: string;
  publishedDate: string;
  views?: string;
  likes?: string;
  comments?: string;
}

// Centered Post data interface
export interface CenteredPostData {
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
}

interface CenteredPostProps {
  content: CenteredPostData;
  variant?: "classic" | "minimal" | "magazine" | "featured" | "editorial";
  useContainer?: boolean;
  py?: VariantSpacingProps["py"];
  className?: string;
}

// Custom content hooks for different centered post header variants
const centeredPostContentHooks = {
  // Classic blog post header
  classic: createLayoutContentHook({
    header: (content: CenteredPostData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        {content.breadcrumbs && (
          <Group gap="xs" align="center" c="secondary-foreground">
            <Icon lucideIcon={ArrowLeft} />
            <Text size="sm">All Posts</Text>
          </Group>
        )}

        {/* Category & Meta */}
        <Group gap="md" align="center">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.meta.category}
          </Badge>
          <Group gap="xs" align="center" c="secondary-foreground">
            <Icon lucideIcon={Clock} />
            <Text size="sm">{content.meta.readTime}</Text>
          </Group>
        </Group>

        {/* Title */}
        <Title order={1} size="5xl" fw="bold" ta="center" className="leading-tight">
          {content.title}
        </Title>

        {/* Subtitle */}
        {content.subtitle && (
          <Text c="secondary-foreground" ta="center" className="max-w-3xl">
            {content.subtitle}
          </Text>
        )}

        {/* Author & Date */}
        {content.author && (
          <Group gap="md" align="center">
            <Group gap="md" align="center">
              <Icon lucideIcon={User} c="primary" />
              <Text size="md" fw="medium">
                By {content.author.name}
              </Text>
            </Group>
            <Group gap="xs" align="center" c="secondary-foreground">
              <Icon lucideIcon={Calendar} />
              <Text size="sm">{content.meta.publishedDate}</Text>
            </Group>
          </Group>
        )}

        {/* Featured Image */}
        <Box className="w-full max-w-5xl">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width="100%"
            height="400px"
            fit="cover"
            rounded={theme?.themeRounded.default}
            className="shadow-lg"
          />
        </Box>
      </Stack>
    )
  }),

  // Minimal clean header
  minimal: createLayoutContentHook({
    header: (content: CenteredPostData) => (
      <Stack gap="lg" align="center" ta="center" className="max-w-3xl mx-auto">
        {/* Simple Category */}
        <Text size="sm" fw="semibold" c="primary" className="uppercase tracking-wide">
          {content.meta.category}
        </Text>

        {/* Title */}
        <Title order={1} size="4xl" fw="bold" ta="center" className="leading-tight">
          {content.title}
        </Title>

        {/* Meta Line */}
        <Group gap="md" align="center" c="secondary-foreground">
          {content.author && (
            <Text size="sm">{content.author.name}</Text>
          )}
          <Text size="sm">•</Text>
          <Text size="sm">{content.meta.publishedDate}</Text>
          <Text size="sm">•</Text>
          <Text size="sm">{content.meta.readTime}</Text>
        </Group>

        {/* Clean Image */}
        <Box className="w-full">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width="100%"
            height="300px"
            fit="cover"
            rounded={theme?.themeRounded.default}
          />
        </Box>
      </Stack>
    )
  }),

  // Magazine style header
  magazine: createLayoutContentHook({
    header: (content: CenteredPostData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {/* Magazine Header */}
        <Stack gap="md" align="center">
          <Group gap="md" align="center">
            <Badge variant="default" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="px-lg py-sm">
              {content.meta.category}
            </Badge>
            {content.tags && content.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                {tag}
              </Badge>
            ))}
          </Group>

          <Title order={1} size="5xl" fw="bold" ta="center" className="leading-none">
            {content.title}
          </Title>

          {content.excerpt && (
            <Text c="secondary-foreground" ta="center" className="max-w-2xl font-medium">
              {content.excerpt}
            </Text>
          )}
        </Stack>

        {/* Author Card */}
        {content.author && (
          <Group gap="md" align="center" className="bg-muted p-6 rounded-lg">
            <Icon size="lg" lucideIcon={User} c="primary" />
            <Stack gap="xs" align="center">
              <Text size="md" fw="semibold">
                {content.author.name}
              </Text>
              {content.author.role && (
                <Text c="secondary-foreground">
                  {content.author.role}
                </Text>
              )}
            </Stack>
            <Group gap="md" align="center" c="secondary-foreground">
              <Icon lucideIcon={Calendar} />
              <Text size="sm">{content.meta.publishedDate}</Text>
            </Group>
          </Group>
        )}

        {/* Hero Image */}
        <Box className="w-full">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width="100%"
            height="500px"
            fit="cover"
            rounded={theme?.themeRounded.default}
            className="shadow-xl"
          />
        </Box>
      </Stack>
    )
  }),

  // Featured post header
  featured: createLayoutContentHook({
    header: (content: CenteredPostData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-5xl mx-auto">
        {/* Featured Badge */}
        <Group gap="md" align="center">
          <Badge variant="default" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            ⭐ Featured Article
          </Badge>
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            {content.meta.category}
          </Badge>
        </Group>

        {/* Title */}
        <Title order={1} size="5xl" fw="bold" ta="center" className="leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {content.title}
        </Title>

        {/* Subtitle */}
        {content.subtitle && (
          <Text size="2xl" c="secondary-foreground" ta="center" className="max-w-4xl font-medium">
            {content.subtitle}
          </Text>
        )}

        {/* Stats & Meta */}
        <Group gap="xl" align="center">
          {content.meta.views && (
            <Group gap="xs" align="center">
              <Icon lucideIcon={Eye} c="primary" />
              <Text size="sm" fw="medium">{content.meta.views} views</Text>
            </Group>
          )}
          {content.meta.likes && (
            <Group gap="xs" align="center">
              <Icon lucideIcon={Heart} c="primary" />
              <Text size="sm" fw="medium">{content.meta.likes} likes</Text>
            </Group>
          )}
          <Group gap="xs" align="center">
            <Icon lucideIcon={Clock} c="primary" />
            <Text size="sm" fw="medium">{content.meta.readTime}</Text>
          </Group>
        </Group>

        {/* Author & Actions */}
        <Group gap="lg" align="center" className="bg-card p-6 rounded-xl shadow-md">
          {content.author && (
            <Group gap="md" align="center">
              <Icon lucideIcon={User} c="primary" />
              <Stack gap="xs" align="center">
                <Text size="md" fw="semibold">
                  {content.author.name}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  {content.meta.publishedDate}
                </Text>
              </Stack>
            </Group>
          )}

          <Group gap="md">
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
              <Icon lucideIcon={Share2} />
              Share
            </Button>
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
              <Icon lucideIcon={Bookmark} />
              Save
            </Button>
          </Group>
        </Group>

        {/* Hero Image */}
        <Box className="w-full">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width="100%"
            height="600px"
            fit="cover"
            rounded={theme?.themeRounded.default}
            className="shadow-2xl"
          />
        </Box>
      </Stack>
    )
  }),

  // Editorial style header
  editorial: createLayoutContentHook({
    header: (content: CenteredPostData) => (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <Stack gap="lg" align="center">
          <Group gap="xs" align="center" c="secondary-foreground">
            <Text size="xs" className="uppercase tracking-widest font-semibold">
              {content.meta.category}
            </Text>
            <Text size="xs">—</Text>
            <Text size="xs" className="uppercase tracking-widest">
              {content.meta.publishedDate}
            </Text>
          </Group>

          <Title order={1} size="5xl" fw="normal" ta="center" className="leading-tight font-serif">
            {content.title}
          </Title>

          {content.subtitle && (
            <Text c="secondary-foreground" ta="center" className="max-w-2xl italic">
              {content.subtitle}
            </Text>
          )}
        </Stack>

        {/* Editorial Meta */}
        <Stack gap="md" align="center" className="border-y border-border py-lg">
          {content.author && (
            <Group gap="md" align="center">
              <Text c="secondary-foreground" className="uppercase tracking-wide">
                Written by
              </Text>
              <Text size="sm" fw="semibold" className="font-serif">
                {content.author.name}
              </Text>
              {content.author.role && (
                <Text c="secondary-foreground">
                  — {content.author.role}
                </Text>
              )}
            </Group>
          )}

          <Group gap="lg" align="center" c="secondary-foreground">
            <Group gap="xs" align="center">
              <Icon lucideIcon={BookOpen} />
              <Text size="xs" className="uppercase tracking-wide">
                {content.meta.readTime}
              </Text>
            </Group>
            {content.meta.views && (
              <Group gap="xs" align="center">
                <Icon lucideIcon={Eye} />
                <Text size="xs" className="uppercase tracking-wide">
                  {content.meta.views}
                </Text>
              </Group>
            )}
          </Group>
        </Stack>

        {/* Editorial Image */}
        <Box className="w-full">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width="100%"
            height="450px"
            fit="cover"
            rounded={theme?.themeRounded.default}
            className="shadow-lg"
          />
        </Box>
      </Stack>
    )
  })
};

export const CenteredPost = forwardRef<HTMLElement, CenteredPostProps>(
  ({ 
    content, 
    variant = "classic",
    useContainer = true,
    py = "lg",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = centeredPostContentHooks[variant] || centeredPostContentHooks.classic;

    return (
      <LayoutBlock
        ref={ref}
        layout="stack"
        useContainer={useContainer}
        py={py}
        showHeader={true}
        content={content}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

CenteredPost.displayName = "CenteredPost";

// Export template configurations
export const centeredPostTemplates = {
  classic: {
    id: "centeredPostClassic",
    name: "Classic Post Header",
    description: "Traditional blog post header with author info and meta",
    component: CenteredPost,
    defaultProps: { variant: "classic" as const }
  },
  
  minimal: {
    id: "centeredPostMinimal",
    name: "Minimal Post Header",
    description: "Clean, minimal header focusing on content",
    component: CenteredPost,
    defaultProps: { variant: "minimal" as const }
  },

  magazine: {
    id: "centeredPostMagazine",
    name: "Magazine Post Header",
    description: "Magazine-style header with prominent typography",
    component: CenteredPost,
    defaultProps: { variant: "magazine" as const }
  },

  featured: {
    id: "centeredPostFeatured",
    name: "Featured Post Header",
    description: "Hero-style header for featured articles",
    component: CenteredPost,
    defaultProps: { variant: "featured" as const }
  },

  editorial: {
    id: "centeredPostEditorial",
    name: "Editorial Post Header",
    description: "Sophisticated editorial-style header",
    component: CenteredPost,
    defaultProps: { variant: "editorial" as const }
  }
};