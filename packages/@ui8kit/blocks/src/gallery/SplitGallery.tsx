import { forwardRef } from "react";
import { 
  Camera,
  Image as ImageIcon,
  Grid3x3,
  Play,
  ZoomIn,
  Download,
  Share2,
  Eye
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
  Box,
  Grid
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

// Gallery interfaces
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
}

export interface GalleryStats {
  totalImages?: string;
  categories?: string;
  views?: string;
}

// Split Gallery data interface
export interface SplitGalleryData {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  images: GalleryImage[];
  stats?: GalleryStats;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface SplitGalleryProps {
  content: SplitGalleryData;
  variant?: "showcase" | "portfolio";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different split gallery variants
const splitGalleryContentHooks = {
  // Showcase gallery - focused on presentation
  showcase: createContentHook({
    content: (content: SplitGalleryData) => (
      <Stack gap="xl" align="start">
        {/* Badge */}
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="w-fit gap-1">
            <Icon size="xs" lucideIcon={Camera} className="mr-0.5" />
            {content.badge}
          </Badge>
        )}

        {/* Title */}
        <Title order={1} size="5xl" fw="bold" className="leading-tight">
          {content.title}
        </Title>

        {/* Subtitle */}
        {content.subtitle && (
          <Text c="secondary-foreground" className="leading-relaxed">
            {content.subtitle}
          </Text>
        )}

        {/* Description */}
        {content.description && (
          <Text c="secondary-foreground" className="leading-relaxed">
            {content.description}
          </Text>
        )}

        {/* Stats */}
        {content.stats && (
          <Group gap="xl" align="center">
            {content.stats.totalImages && (
              <Group gap="xs" align="center">
                <Icon size="2xl" lucideIcon={ImageIcon} c="primary" />
                <Stack gap="xs" align="start">
                  <Text size="lg" fw="bold">
                    {content.stats.totalImages}
                  </Text>
                  <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                    Images
                  </Text>
                </Stack>
              </Group>
            )}
            {content.stats.categories && (
              <Group gap="xs" align="center">
                <Icon size="2xl" lucideIcon={Grid3x3} c="primary" />
                <Stack gap="xs" align="start">
                  <Text size="lg" fw="bold">
                    {content.stats.categories}
                  </Text>
                  <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                    Categories
                  </Text>
                </Stack>
              </Group>
            )}
            {content.stats.views && (
              <Group gap="xs" align="center">
                <Icon size="2xl" lucideIcon={Eye} c="primary" />
                <Stack gap="xs" align="start">
                  <Text size="lg" fw="bold">
                    {content.stats.views}
                  </Text>
                  <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                    Views
                  </Text>
                </Stack>
              </Group>
            )}
          </Group>
        )}

        {/* Action Buttons */}
        <Group gap="md" className="w-full">
          {content.primaryButtonText && (
            <Button rounded={theme?.themeRounded.default} size="lg" variant="default" className="flex-1">
              <Icon c="primary-foreground" lucideIcon={ZoomIn} />
              {content.primaryButtonText}
            </Button>
          )}
          {content.secondaryButtonText && (
            <Button rounded={theme?.themeRounded.default} size="lg" variant="outline">
              <Icon lucideIcon={Share2} />
              {content.secondaryButtonText}
            </Button>
          )}
        </Group>

        {/* Quick Actions */}
        <Group gap="md">
          <Button rounded={theme?.themeRounded.default} size="sm" variant="ghost">
            <Icon lucideIcon={Download} />
            Download All
          </Button>
          <Button rounded={theme?.themeRounded.default} size="sm" variant="ghost">
            <Icon lucideIcon={Play} />
            Slideshow
          </Button>
        </Group>
      </Stack>
    )
  }),

  // Portfolio gallery - focused on professional presentation
  portfolio: createContentHook({
    content: (content: SplitGalleryData) => (
      <Stack gap="lg" align="start">
        {/* Portfolio Header */}
        <Stack gap="md" align="start">
          {content.badge && (
            <Text size="sm" fw="semibold" c="primary" className="uppercase tracking-wide">
              {content.badge}
            </Text>
          )}

          <Title order={1} size="4xl" fw="bold" className="leading-tight">
            {content.title}
          </Title>

          {content.description && (
            <Text c="secondary-foreground">
              {content.description}
            </Text>
          )}
        </Stack>

        {/* Portfolio Meta */}
        {content.stats && (
          <Box className="bg-muted p-6 w-full" rounded={theme?.themeRounded.default}>
            <Group gap="lg" align="center" justify="between">
              {content.stats.totalImages && (
                <Stack gap="xs" align="center">
                  <Text size="md" fw="semibold">
                    {content.stats.totalImages}
                  </Text>
                  <Text size="xs" c="secondary-foreground">
                    Projects
                  </Text>
                </Stack>
              )}
              {content.stats.categories && (
                <Stack gap="xs" align="center">
                  <Text size="md" fw="semibold">
                    {content.stats.categories}
                  </Text>
                  <Text size="xs" c="secondary-foreground">
                    Categories
                  </Text>
                </Stack>
              )}
              {content.stats.views && (
                <Stack gap="xs" align="center">
                  <Text size="md" fw="semibold">
                    {content.stats.views}
                  </Text>
                  <Text size="xs" c="secondary-foreground">
                    Total Views
                  </Text>
                </Stack>
              )}
            </Group>
          </Box>
        )}

        {/* Featured Categories */}
        {content.images.length > 0 && (
          <Stack gap="md" className="w-full">
            <Text size="sm" fw="semibold" c="secondary-foreground" className="uppercase tracking-wide">
              Featured Work
            </Text>
            <Group gap="xs" className="flex-wrap">
              {Array.from(new Set(content.images.map(img => img.category).filter(Boolean))).slice(0, 4).map((category, index) => (
                <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {category}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}

        {/* Portfolio Actions */}
        <Stack gap="md" className="w-full">
          {content.primaryButtonText && (
            <Button rounded={theme?.themeRounded.default} size="lg" variant="default" className="w-full">
              <Icon c="primary-foreground" lucideIcon={ImageIcon} />
              {content.primaryButtonText}
            </Button>
          )}
          
          <Group gap="md">
            {content.secondaryButtonText && (
              <Button rounded={theme?.themeRounded.default} size="md" variant="outline" className="flex-1">
                <Icon lucideIcon={Share2} />
                {content.secondaryButtonText}
              </Button>
            )}
            <Button rounded={theme?.themeRounded.default} size="md" variant="outline" className="flex-1">
              <Icon lucideIcon={Download} />
              Export
            </Button>
          </Group>
        </Stack>
      </Stack>
    )
  })
};

export const SplitGallery = forwardRef<HTMLElement, SplitGalleryProps>(
  ({ 
    content, 
    variant = "showcase",
    leftMedia = false,
    useContainer = true,
    py = "lg",
    gap = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Create gallery media section (inspired by SplitHeroGalleryExample)
    const createMediaSection = () => {
      const displayImages = content.images.slice(0, 4); // Show max 4 images in split
      
      return (
        <Grid cols="1-2" gap="md" className="h-full">
          {displayImages.map((image, index) => (
            <Block 
              key={image.id} 
              className={`relative overflow-hidden group cursor-pointer ${
                index === 0 ? "row-span-2" : ""
              }`}
              rounded={theme?.themeRounded.default}
              data-class="gallery-item"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width="100%"
                height="100%"
                fit="cover"
                rounded={theme?.themeRounded.default}
                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Group gap="md">
                  <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                    <Icon lucideIcon={ZoomIn} />
                  </Button>
                  <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                    <Icon lucideIcon={Share2} />
                  </Button>
                </Group>
              </Box>

              {/* Image Title Overlay */}
              {image.title && (
                <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 mb-2">
                  <Text size="sm" fw="medium" c="primary-foreground">
                    {image.title}
                  </Text>
                </Box>
              )}
            </Block>
          ))}
        </Grid>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = splitGalleryContentHooks[variant] || splitGalleryContentHooks.showcase;

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

SplitGallery.displayName = "SplitGallery";

// Export template configurations
export const splitGalleryTemplates = {
  showcase: {
    id: "splitGalleryShowcase",
    name: "Showcase Split Gallery",
    description: "Split layout gallery focused on visual presentation",
    component: SplitGallery,
    defaultProps: { variant: "showcase" as const }
  },
  
  portfolio: {
    id: "splitGalleryPortfolio",
    name: "Portfolio Split Gallery",
    description: "Professional split layout for portfolio galleries",
    component: SplitGallery,
    defaultProps: { variant: "portfolio" as const }
  }
};