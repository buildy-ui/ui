import { forwardRef } from "react";
import { 
  Camera,
  Image as ImageIcon,
  Grid3x3,
  Filter,
  ZoomIn,
  Share2,
  Eye,
  Heart,
  MoreHorizontal,
  Play,
  Maximize2
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
  createLayoutContentHook
} from "@ui8kit/core";

// Gallery interfaces (reuse from SplitGallery)
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description: string;
  category?: string;
  likes?: string;
  views?: string;
}

interface GalleryStats {
  totalImages?: string;
  categories?: string;
  views?: string;
}

// Grid Gallery data interface
export interface GridGalleryData {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  images: GalleryImage[];
  stats?: GalleryStats;
  categories?: string[];
}

interface GridGalleryProps {
  content: GridGalleryData;
  variant?: "grid" | "masonry" | "carousel" | "mosaic" | "minimal" | "cards" | "polaroid" | "magazine";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Custom content hooks for different grid gallery variants
const gridGalleryContentHooks = {
  // 1. Classic Grid Layout
  grid: createLayoutContentHook({
    header: (content: GridGalleryData) => (
      <Stack gap="lg" align="center" ta="center" className="max-w-3xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="w-fit gap-1">
            <Icon size="xs" lucideIcon={Camera} />
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
            {content.stats.totalImages && (
              <Group gap="xs" align="center">
                <Icon lucideIcon={ImageIcon} c="primary" />
                <Text size="sm" fw="medium">{content.stats.totalImages} Images</Text>
              </Group>
            )}
            {content.stats.categories && (
              <Group gap="xs" align="center">
                <Icon lucideIcon={Grid3x3} c="primary" />
                <Text size="sm" fw="medium">{content.stats.categories} Categories</Text>
              </Group>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (image: GalleryImage) => (
      <Box
      className="relative overflow-hidden group cursor-pointer"
      rounded={theme?.themeRounded.default}>
        <Image
          src={image.src}
          alt={image.alt}
          width="100%"
          height="300px"
          fit="cover"
          rounded={theme?.themeRounded.default}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        
        <Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
            <Icon lucideIcon={ZoomIn} />
          </Button>
        </Box>
      </Box>
    )
  }),

  // 2. Masonry Layout
  masonry: createLayoutContentHook({
    header: (content: GridGalleryData) => (
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
    
    item: (image: GalleryImage, index: number) => (
      <Box className={`relative overflow-hidden group cursor-pointer ${
        index % 5 === 0 ? "row-span-2" : index % 3 === 0 ? "col-span-2" : ""
      }`}
      rounded={theme?.themeRounded.default}>
        <Image
          src={image.src}
          alt={image.alt}
          width="100%"
          height="100%"
          fit="cover"
          rounded={theme?.themeRounded.default}
          className="transition-all duration-300 group-hover:scale-105"
        />
        
        {image.title && (
          <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <Text size="md" fw="semibold" c="primary-foreground">
              {image.title}
            </Text>
            {image.category && (
              <Text size="xs" c="primary-foreground" className="uppercase tracking-wide">
                {image.category}
              </Text>
            )}
          </Box>
        )}
      </Box>
    )
  }),

  // 3. Carousel-style with featured image
  carousel: createLayoutContentHook({
    header: (content: GridGalleryData) => (
      <Stack gap="xl" align="center" ta="center">
        <Stack gap="md" align="center">
          <Badge variant="default" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="w-fit gap-1">
            <Icon size="xs" c="primary-foreground" lucideIcon={Play} />
            Interactive Gallery
          </Badge>
          
          <Title order={1} size="4xl" fw="bold" ta="center">
            {content.title}
          </Title>
        </Stack>

        {/* Featured Image */}
        {content.images[0] && (
          <Box className="relative overflow-hidden rounded-xl shadow-2xl max-w-4xl" rounded={theme?.themeRounded.default}>
            <Image
              src={content.images[0].src}
              alt={content.images[0].alt}
              width="100%"
              height="400px"
              fit="cover"
            />
            <Box className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <Box className="absolute bottom-0 left-0 right-0 p-6">
              <Group gap="lg" align="center" justify="between">
                <Stack gap="xs">
                  {content.images[0].title && (
                    <Text size="xl" fw="bold" c="primary-foreground">
                      {content.images[0].title}
                    </Text>
                  )}
                  {content.images[0].category && (
                    <Text size="sm" c="primary-foreground">
                      {content.images[0].category}
                    </Text>
                  )}
                </Stack>
                <Group gap="md">
                  <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                    <Icon lucideIcon={Maximize2} />
                  </Button>
                  <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                    <Icon lucideIcon={Share2} />
                  </Button>
                </Group>
              </Group>
            </Box>
          </Box>
        )}
      </Stack>
    ),
    
    item: (image: GalleryImage, index: number) => {
      if (index === 0) return null; // Skip first image as it's featured
      
      return (
        <Box className="relative overflow-hidden group cursor-pointer" rounded={theme?.themeRounded.default}>
          <Image
            src={image.src}
            alt={image.alt}
            width="100%"
            height="200px"
            fit="cover"
            rounded={theme?.themeRounded.default}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          
          <Box className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Box>
      );
    }
  }),

  // 4. Mosaic Layout with different sizes
  mosaic: createLayoutContentHook({
    header: (content: GridGalleryData) => (
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
              <Icon lucideIcon={Filter} />
              Filter
            </Button>
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
              <Icon lucideIcon={Grid3x3} />
              View
            </Button>
          </Group>
        </Group>
      </Stack>
    ),
    
    item: (image: GalleryImage, index: number) => {
      const sizeClass = index % 6 === 0 ? "col-span-2 row-span-2" : 
                      index % 4 === 0 ? "col-span-2" : 
                      index % 3 === 0 ? "row-span-2" : "";
      
      return (
        <Box className={`relative overflow-hidden group cursor-pointer ${sizeClass}`} rounded={theme?.themeRounded.default}>
          <Image
            src={image.src}
            alt={image.alt}
            width="100%"
            height="100%"
            fit="cover"
            rounded={theme?.themeRounded.default}
            className="transition-all duration-300 group-hover:scale-105"
          />
          
          <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Box className="absolute bottom-0 left-0 right-0 p-4">
              <Group gap="md" align="center" justify="between">
                {image.title && (
                  <Text size="sm" fw="medium" c="primary-foreground">
                    {image.title}
                  </Text>
                )}
                <Group gap="xs">
                  {image.likes && (
                    <Group gap="xs" align="center">
                      <Icon lucideIcon={Heart} c="primary-foreground" />
                      <Text size="xs" c="primary-foreground">{image.likes}</Text>
                    </Group>
                  )}
                  <Button rounded={theme?.themeRounded.default} size="xs" variant="ghost" className="text-white hover:bg-white/20">
                    <Icon lucideIcon={MoreHorizontal} />
                  </Button>
                </Group>
              </Group>
            </Box>
          </Box>
        </Box>
      );
    }
  }),

  // 5. Minimal Clean Layout
  minimal: createLayoutContentHook({
    header: (content: GridGalleryData) => (
      <Stack gap="md" align="center" ta="center" className="max-w-2xl mx-auto">
        <Text size="xs" fw="semibold" c="primary" className="uppercase tracking-widest">
          {content.badge || "Gallery"}
        </Text>
        
        <Title order={1} size="3xl" fw="normal" ta="center" className="font-serif">
          {content.title}
        </Title>
        
        {content.subtitle && (
          <Text c="secondary-foreground" ta="center" className="italic">
            {content.subtitle}
          </Text>
        )}
      </Stack>
    ),
    
    item: (image: GalleryImage) => (
      <Box className="relative overflow-hidden group cursor-pointer" rounded={theme?.themeRounded.default}>
        <Image
          src={image.src}
          alt={image.alt}
          width="100%"
          height="250px"
          fit="cover"
          rounded="none"
          className="transition-opacity duration-500 group-hover:opacity-90"
        />
        
        {image.title && (
          <Box className="absolute bottom-0 left-0 right-0 bg-background backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Text size="xs" fw="medium" ta="center" className="uppercase tracking-wide">
              {image.title}
            </Text>
          </Box>
        )}
      </Box>
    )
  }),

  // 6. Card-based Layout
  cards: createLayoutContentHook({
    header: (content: GridGalleryData) => (
      <Stack gap="lg" align="center" ta="center">
        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="w-fit gap-1">
          <Icon size="xs" lucideIcon={ImageIcon} />
          {content.badge || "Photo Collection"}
        </Badge>
        
        <Title order={1} size="4xl" fw="bold" ta="center">
          {content.title}
        </Title>
        
        {content.categories && (
          <Group gap="xs" className="flex-wrap justify-center">
            {content.categories.map((category, index) => (
              <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                {category}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    ),
    
    item: (image: GalleryImage) => (
      <Box className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" rounded={theme?.themeRounded.default}>
        <Image
          src={image.src}
          alt={image.alt}
          width="100%"
          height="200px"
          fit="cover"
        />
        
        <Box className="p-4">
          <Stack gap="md">
            {image.title && (
              <Text size="md" fw="semibold">
                {image.title}
              </Text>
            )}
            
            <Group gap="md" align="center" justify="between">
              {image.category && (
                <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {image.category}
                </Badge>
              )}
              
              <Group gap="md">
                {image.likes && (
                  <Group gap="xs" align="center">
                    <Icon lucideIcon={Heart} c="secondary-foreground" />
                    <Text size="xs" c="secondary-foreground">{image.likes}</Text>
                  </Group>
                )}
                {image.views && (
                  <Group gap="xs" align="center">
                    <Icon lucideIcon={Eye} c="secondary-foreground" />
                    <Text size="xs" c="secondary-foreground">{image.views}</Text>
                  </Group>
                )}
              </Group>
            </Group>
          </Stack>
        </Box>
      </Box>
    )
  }),

  // 7. Polaroid Style
  polaroid: createLayoutContentHook({
    header: (content: GridGalleryData) => (
      <Stack gap="lg" align="center" ta="center">
        <Title order={1} size="4xl" fw="bold" ta="center" className="font-serif">
          {content.title}
        </Title>
        
        {content.description && (
          <Text c="secondary-foreground" ta="center" className="max-w-2xl italic">
            {content.description}
          </Text>
        )}
      </Stack>
    ),
    
    item: (image: GalleryImage, index: number) => {
      const rotation = (index % 4 - 1.5) * 3; // Random rotation between -4.5 and 4.5 degrees
      
      return (
        <Box 
          className="bg-white p-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width="100%"
            height="200px"
            fit="cover"
            rounded="none"
            className="group-hover:scale-105 transition-transform duration-300"
          />
          
          <Box className="p-2 bg-white">
            {image.title && (
              <Text size="sm" fw="medium" ta="center" className="handwriting">
                {image.title}
              </Text>
            )}
          </Box>
        </Box>
      );
    }
  }),

  // 8. Magazine Layout
  magazine: createLayoutContentHook({
    header: (content: GridGalleryData) => (
      <Stack gap="xl" align="center" ta="center">
        <Stack gap="md" align="center">
          <Text size="xs" c="primary" className="uppercase tracking-widest font-bold">
            {content.badge || "Featured"}
          </Text>
          
          <Title order={1} size="5xl" fw="bold" ta="center" className="leading-none">
            {content.title}
          </Title>
          
          {content.subtitle && (
            <Text c="secondary-foreground" ta="center" className="max-w-3xl">
              {content.subtitle}
            </Text>
          )}
        </Stack>

        {content.stats && (
          <Group gap="xl" align="center">
            {content.stats.totalImages && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.totalImages}
                </Text>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Photographs
                </Text>
              </Stack>
            )}
            {content.stats.categories && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.categories}
                </Text>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Collections
                </Text>
              </Stack>
            )}
            {content.stats.views && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.views}
                </Text>
                <Text size="xs" c="secondary-foreground" className="uppercase tracking-wide">
                  Total Views
                </Text>
              </Stack>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (image: GalleryImage, index: number) => {
      const isFeatured = index % 7 === 0;
      
      return (
        <Box className={`relative overflow-hidden group cursor-pointer ${
          isFeatured ? "col-span-2 row-span-2" : ""
        }`}
        rounded={theme?.themeRounded.default}>
          <Image
            src={image.src}
            alt={image.alt}
            width="100%"
            height="100%"
            fit="cover"
            rounded="none"
            className="transition-all duration-500 group-hover:scale-110"
          />
          
          <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Box className="absolute bottom-0 left-0 right-0 p-6">
              <Stack gap="xs">
                {image.category && (
                  <Text size="xs" c="primary-foreground" className="uppercase tracking-widest font-bold">
                    {image.category}
                  </Text>
                )}
                {image.title && (
                  <Text size={isFeatured ? "xl" : "md"} fw="bold" c="primary-foreground">
                    {image.title}
                  </Text>
                )}
                {image.description && isFeatured && (
                  <Text size="sm" c="primary-foreground">
                    {image.description}
                  </Text>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      );
    }
  })
};

export const GridGallery = forwardRef<HTMLElement, GridGalleryProps>(
  ({ 
    content, 
    variant = "grid",
    useContainer = true,
    py = "lg",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = gridGalleryContentHooks[variant] || gridGalleryContentHooks.grid;

    // Determine layout type and grid configuration based on variant
    const getLayoutConfig = () => {
      switch (variant) {
        case "masonry":
          return { layout: "grid" as const, gridCols: "1-2-3" };
        case "carousel":
          return { layout: "grid" as const, gridCols: "1-2-4" };
        case "mosaic":
          return { layout: "grid" as const, gridCols: "2-3-4" };
        case "minimal":
          return { layout: "grid" as const, gridCols: "1-2-3" };
        case "cards":
          return { layout: "grid" as const, gridCols: "1-2-3" };
        case "polaroid":
          return { layout: "flex" as const, flexWrap: true };
        case "magazine":
          return { layout: "grid" as const, gridCols: "1-2-3" };
        default: // grid
          return { layout: "grid" as const, gridCols: "1-2-3" };
      }
    };

    const layoutConfig = getLayoutConfig();

    return (
      <LayoutBlock
        ref={ref}
        layout={layoutConfig.layout}
        gridCols={layoutConfig.gridCols as "1-2-3" | "1-2-4" | "2-3-4" | "1" | "2" | "3" | "4" | "5" | "6" | "1-2" | "1-3" | "1-4" | "1-5" | "1-6" | "2-3" | "2-4" | "2-5" | "2-6" | "3-4" | "3-5" | "3-6" | "4-5" | "4-6" | "5-6" | "1-3-4" | "1-2-3-4" | undefined}
        flexWrap={layoutConfig.flexWrap}
        useContainer={useContainer}
        py={py}
        showHeader={true}
        content={{ ...content, items: content.images as GalleryImage[] }}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridGallery.displayName = "GridGallery";

// Export template configurations
export const gridGalleryTemplates = {
  grid: {
    id: "gridGalleryGrid",
    name: "Classic Grid Gallery",
    description: "Traditional grid layout with hover effects",
    component: GridGallery,
    defaultProps: { variant: "grid" as const }
  },
  
  masonry: {
    id: "gridGalleryMasonry",
    name: "Masonry Gallery",
    description: "Pinterest-style masonry layout with varying heights",
    component: GridGallery,
    defaultProps: { variant: "masonry" as const }
  },

  carousel: {
    id: "gridGalleryCarousel",
    name: "Carousel Gallery",
    description: "Featured image with thumbnail carousel",
    component: GridGallery,
    defaultProps: { variant: "carousel" as const }
  },

  mosaic: {
    id: "gridGalleryMosaic",
    name: "Mosaic Gallery",
    description: "Dynamic mosaic layout with varying sizes",
    component: GridGallery,
    defaultProps: { variant: "mosaic" as const }
  },

  minimal: {
    id: "gridGalleryMinimal",
    name: "Minimal Gallery",
    description: "Clean, minimal design with subtle interactions",
    component: GridGallery,
    defaultProps: { variant: "minimal" as const }
  },

  cards: {
    id: "gridGalleryCards",
    name: "Card Gallery",
    description: "Card-based layout with metadata and stats",
    component: GridGallery,
    defaultProps: { variant: "cards" as const }
  },

  polaroid: {
    id: "gridGalleryPolaroid",
    name: "Polaroid Gallery",
    description: "Vintage polaroid-style photo layout",
    component: GridGallery,
    defaultProps: { variant: "polaroid" as const }
  },

  magazine: {
    id: "gridGalleryMagazine",
    name: "Magazine Gallery",
    description: "Editorial magazine-style layout with featured images",
    component: GridGallery,
    defaultProps: { variant: "magazine" as const }
  }
};