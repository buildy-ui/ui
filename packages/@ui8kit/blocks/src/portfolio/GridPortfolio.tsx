import { forwardRef } from "react";
import { 
  Eye,
  ExternalLink,
  Github,
  Calendar,
  User,
  Award
} from "lucide-react";
import {
  Stack,
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
  createLayoutContentHook
} from "@ui8kit/core";

// Portfolio interfaces
interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  tags: string[];
  category?: string;
  client?: string;
  year?: string;
  status?: "completed" | "in-progress" | "featured";
  links?: {
    live?: string;
    github?: string;
    case_study?: string;
  };
  stats?: {
    views?: string;
    likes?: string;
    duration?: string;
  };
  lucideIcon?: any;
}

interface PortfolioCategory {
  id: string;
  name: string;
  lucideIcon?: any;
  color?: string;
}

// Grid Portfolio data interface
export interface GridPortfolioData {
  badge?: string;
  title: string;
  description: string;
  buttonText?: string;
  categories?: PortfolioCategory[];
  projects: PortfolioProject[];
  showFilters?: boolean;
}

interface GridPortfolioProps {
  content: GridPortfolioData;
  variant?: "cards" | "masonry" | "minimal" | "detailed" | "showcase";
  cols?: "1" | "2" | "3" | "4" | "1-2" | "1-2-3" | "1-2-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Custom content hooks for different grid portfolio variants
const gridPortfolioContentHooks = {
  // Portfolio cards grid
  cards: createLayoutContentHook({
    item: (project: PortfolioProject) => (
      <Card key={project.id} rounded={theme?.themeRounded.default} shadow="md" bg="card" className="overflow-hidden group hover:shadow-lg transition-all duration-300">
        <Box className="relative overflow-hidden">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width="100%"
            height="250px"
            fit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <Box className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Group gap="md">
              {project.links?.live && (
                <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white hover:text-black">
                  <Icon lucideIcon={Eye} />
                  View
                </Button>
              )}
              {project.links?.github && (
                <Button rounded={theme?.themeRounded.default} size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white hover:text-black">
                  <Icon lucideIcon={Github} />
                  Code
                </Button>
              )}
            </Group>
          </Box>

          {/* Status Badge */}
          {project.status === "featured" && (
            <Badge variant="default" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="absolute top-2 right-2">
              Featured
            </Badge>
          )}
        </Box>

        <Stack gap="md" p="md">
          <Group gap="md" align="center" justify="between">
            {project.category && (
              <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                {project.category}
              </Badge>
            )}
            {project.year && (
              <Text size="xs" c="secondary-foreground">
                {project.year}
              </Text>
            )}
          </Group>

          <Stack gap="sm">
            <Title order={3} size="lg" fw="semibold" className="line-clamp-1">
              {project.title}
            </Title>
            
            <Text c="secondary-foreground" className="line-clamp-2">
              {project.description}
            </Text>
          </Stack>

          {/* Tags */}
          {project.tags.length > 0 && (
            <Group gap="xs" className="flex-wrap">
              {project.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Text size="xs" c="secondary-foreground">
                  +{project.tags.length - 3} more
                </Text>
              )}
            </Group>
          )}

          {/* Stats */}
          {project.stats && (
            <Group gap="md" align="center" justify="between" className="pt-sm border-t border-border">
              {project.stats.views && (
                <Group gap="xs" align="center">
                  <Icon lucideIcon={Eye} c="secondary-foreground" />
                  <Text size="xs" c="secondary-foreground">{project.stats.views}</Text>
                </Group>
              )}
              {project.client && (
                <Text size="xs" c="secondary-foreground">
                  {project.client}
                </Text>
              )}
            </Group>
          )}
        </Stack>
      </Card>
    )
  }),

  // Masonry style portfolio
  masonry: createLayoutContentHook({
    item: (project: PortfolioProject, index: number) => {
      const heights = ["300px", "400px", "350px", "450px", "320px"];
      const height = heights[index % heights.length];
      
      return (
        <Card key={project.id} rounded={theme?.themeRounded.default} shadow="md" bg="card" className="overflow-hidden group hover:shadow-xl transition-all duration-300" p="none">
          <Box className="relative overflow-hidden" style={{ height }}>
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width="100%"
              height="100%"
              fit="cover"
              className="group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Gradient Overlay */}
            <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            
            {/* Content Overlay */}
            <Box className="absolute bottom-0 left-0 right-0 text-white" p="lg" data-class="masonry-content">
              <Stack gap="md">
                <Group gap="md" align="center">
                  {project.category && (
                    <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="bg-white/20 text-white border-white/30">
                      {project.category}
                    </Badge>
                  )}
                  {project.lucideIcon && (
                    <Icon lucideIcon={project.lucideIcon} c="primary-foreground" />
                  )}
                </Group>
                
                <Title order={3} size="md" fw="semibold" c="primary-foreground" className="line-clamp-1">
                  {project.title}
                </Title>
                
                <Text size="xs" c="primary-foreground" className="opacity-90 line-clamp-2">
                  {project.description}
                </Text>

                {/* Quick Tags */}
                <Group gap="xs" className="flex-wrap">
                  {project.tags.slice(0, 2).map((tag, tagIndex) => (
                    <Text key={tagIndex} size="xs" c="primary-foreground" className="opacity-75">
                      #{tag}
                    </Text>
                  ))}
                </Group>
              </Stack>
            </Box>
          </Box>
        </Card>
      );
    }
  }),

  // Minimal portfolio
  minimal: createLayoutContentHook({
    item: (project: PortfolioProject) => (
      <Box key={project.id} className="group cursor-pointer">
        <Stack gap="md">
          <Box className="relative overflow-hidden rounded-md">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width="100%"
              height="200px"
              fit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            
            <Box className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </Box>

          <Stack gap="xs">
            <Group gap="md" align="center" justify="between">
              <Title order={4} size="md" fw="semibold" className="line-clamp-1">
                {project.title}
              </Title>
              {project.year && (
                <Text size="xs" c="secondary-foreground">
                  {project.year}
                </Text>
              )}
            </Group>
            
            <Text size="xs" c="secondary-foreground" className="line-clamp-1">
              {project.description}
            </Text>

            {project.tags.length > 0 && (
              <Group gap="xs">
                {project.tags.slice(0, 2).map((tag, index) => (
                  <Text key={index} size="xs" c="secondary-foreground" className="opacity-75">
                    {tag}
                  </Text>
                ))}
              </Group>
            )}
          </Stack>
        </Stack>
      </Box>
    )
  }),

  // Detailed portfolio
  detailed: createLayoutContentHook({
    item: (project: PortfolioProject) => (
      <Card key={project.id} p="lg" rounded={theme?.themeRounded.default} shadow="lg" bg="card" className="h-full hover:shadow-xl transition-shadow duration-300">
        <Stack gap="lg" className="h-full">
          <Box className="relative overflow-hidden rounded-md">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width="100%"
              height="180px"
              fit="cover"
            />
            
            {project.lucideIcon && (
              <Box className="absolute top-2 left-2 p-2 bg-primary rounded-md" data-class="project-icon">
                <Icon
                  component="span"
                  size="sm"
                  lucideIcon={project.lucideIcon}
                  c="primary-foreground"
                />
              </Box>
            )}
          </Box>

          <Stack gap="md" className="flex-1">
            <Group gap="md" align="center" justify="between">
              {project.category && (
                <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {project.category}
                </Badge>
              )}
              {project.status === "featured" && (
                <Badge variant="default" className="w-fit gap-1" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  <Icon size="xs" c="primary-foreground" lucideIcon={Award} />
                  Featured
                </Badge>
              )}
            </Group>

            <Stack gap="md">
              <Title order={3} size="lg" fw="semibold">
                {project.title}
              </Title>
              
              <Text c="secondary-foreground">
                {project.description}
              </Text>
            </Stack>

            {/* Project Details */}
            <Stack gap="md" className="text-xs">
              {project.client && (
                <Group gap="md" align="center">
                  <Icon lucideIcon={User} c="primary" />
                  <Text size="xs" c="secondary-foreground">Client: {project.client}</Text>
                </Group>
              )}
              {project.year && (
                <Group gap="md" align="center">
                  <Icon lucideIcon={Calendar} c="primary" />
                  <Text size="xs" c="secondary-foreground">Year: {project.year}</Text>
                </Group>
              )}
              {project.stats?.duration && (
                <Group gap="md" align="center">
                  <Icon lucideIcon={Calendar} c="primary" />
                  <Text size="xs" c="secondary-foreground">Duration: {project.stats.duration}</Text>
                </Group>
              )}
            </Stack>

            {/* Tags */}
            <Group gap="xs" className="flex-wrap">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {tag}
                </Badge>
              ))}
            </Group>
          </Stack>

          {/* Action Buttons */}
          <Group gap="md">
            {project.links?.live && (
              <Button rounded={theme?.themeRounded.default} size="sm" variant="outline" className="flex-1">
                <Icon lucideIcon={ExternalLink} />
                View Live
              </Button>
            )}
            {project.links?.case_study && (
              <Button rounded={theme?.themeRounded.default} size="sm" variant="ghost" className="flex-1">
                Case Study
              </Button>
            )}
          </Group>
        </Stack>
      </Card>
    )
  }),

  // Showcase portfolio
  showcase: createLayoutContentHook({
    item: (project: PortfolioProject, index: number) => {
      const isFeatured = index === 0;
      
      return (
        <Card 
          key={project.id} 
          rounded={theme?.themeRounded.default} 
          shadow="xl" 
          bg="card" 
          p="none"
          className={`overflow-hidden group hover:shadow-2xl transition-all duration-500 ${
            isFeatured ? "md:col-span-2 md:row-span-2" : ""
          }`}
        >
          <Box className="relative overflow-hidden">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width="100%"
              height={isFeatured ? "400px" : "250px"}
              fit="cover"
              className="group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Gradient Overlay */}
            <Box className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Content Overlay */}
            <Box className="absolute inset-0 flex flex-col justify-end text-white" p="lg" data-class="showcase-content">
              <Stack gap={isFeatured ? "md" : "sm"}>
                <Group gap="md" align="center">
                  {project.category && (
                    <Badge variant="secondary" size={isFeatured ? "default" : "sm"} rounded={theme?.themeRounded.badge} className="bg-white/20 text-white border-white/30">
                      {project.category}
                    </Badge>
                  )}
                  {project.status === "featured" && (
                    <Badge variant="default" size={isFeatured ? "default" : "sm"} rounded={theme?.themeRounded.badge} className="w-fit gap-1">
                      <Icon size="xs" c="primary-foreground" lucideIcon={Award} />
                      Featured
                    </Badge>
                  )}
                </Group>
                
                <Title 
                  order={isFeatured ? 2 : 3} 
                  size={isFeatured ? "2xl" : "lg"} 
                  fw="bold" 
                  c="primary-foreground"
                  className="line-clamp-2"
                >
                  {project.title}
                </Title>
                
                <Text 
                  size={isFeatured ? "md" : "sm"} 
                  c="primary-foreground" 
                  className={`opacity-90 ${isFeatured ? "line-clamp-3" : "line-clamp-2"}`}
                >
                  {project.description}
                </Text>

                {/* Tags */}
                <Group gap="xs" className="flex-wrap">
                  {project.tags.slice(0, isFeatured ? 4 : 3).map((tag, tagIndex) => (
                    <Text key={tagIndex} size="xs" c="primary-foreground" className="opacity-75">
                      #{tag}
                    </Text>
                  ))}
                </Group>

                {/* Action Buttons */}
                <Group gap="md" className="mt-sm">
                  {project.links?.live && (
                    <Button rounded={theme?.themeRounded.default} size={isFeatured ? "md" : "sm"} variant="secondary" className="bg-white/20 text-white hover:bg-white hover:text-black">
                      <Icon lucideIcon={ExternalLink} />
                      View Project
                    </Button>
                  )}
                  {project.links?.case_study && (
                    <Button rounded={theme?.themeRounded.default} size={isFeatured ? "md" : "sm"} variant="ghost" className="text-white hover:bg-white/20">
                      Case Study
                    </Button>
                  )}
                </Group>
              </Stack>
            </Box>
          </Box>
        </Card>
      );
    }
  })
};

export const GridPortfolio = forwardRef<HTMLElement, GridPortfolioProps>(
  ({ 
    content, 
    variant = "cards",
    cols,
    gap,
    useContainer = true,
    py = "lg",
    className,
    ...props 
  }, ref) => {
    
    // Determine layout configuration based on variant
    const getVariantConfig = () => {
      switch (variant) {
        case "cards":
          return {
            contentHooks: gridPortfolioContentHooks.cards,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
        
        case "masonry":
          return {
            contentHooks: gridPortfolioContentHooks.masonry,
            cols: "1-2-3" as const,
            gap: "md" as const
          };
        
        case "minimal":
          return {
            contentHooks: gridPortfolioContentHooks.minimal,
            cols: "1-2-4" as const,
            gap: "lg" as const
          };
        
        case "detailed":
          return {
            contentHooks: gridPortfolioContentHooks.detailed,
            cols: "1-2-3" as const,
            gap: "xl" as const
          };
        
        case "showcase":
          return {
            contentHooks: gridPortfolioContentHooks.showcase,
            cols: "1-2-4" as const,
            gap: "lg" as const
          };
        
        default:
          return {
            contentHooks: gridPortfolioContentHooks.cards,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
      }
    };

    const config = getVariantConfig();

    // Transform projects to items for LayoutBlock
    const layoutContent = {
      ...content,
      items: content.projects
    };

    return (
      <LayoutBlock
        ref={ref}
        layout="grid"
        useContainer={useContainer}
        py={py}
        cols={cols || config.cols}
        gap={gap || config.gap}
        content={layoutContent}
        contentHooks={config.contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridPortfolio.displayName = "GridPortfolio";

// Export template configurations
export const gridPortfolioTemplates = {
  cards: {
    id: "gridPortfolioCards",
    name: "Portfolio Cards Grid",
    description: "Standard grid layout with portfolio cards",
    component: GridPortfolio,
    defaultProps: { variant: "cards" as const, cols: "1-2-3" as const }
  },
  
  masonry: {
    id: "gridPortfolioMasonry",
    name: "Masonry Portfolio Grid",
    description: "Pinterest-style masonry layout with varying heights",
    component: GridPortfolio,
    defaultProps: { variant: "masonry" as const, cols: "1-2-3" as const }
  },

  minimal: {
    id: "gridPortfolioMinimal",
    name: "Minimal Portfolio Grid",
    description: "Clean, minimal layout focusing on visuals",
    component: GridPortfolio,
    defaultProps: { variant: "minimal" as const, cols: "1-2-4" as const }
  },

  detailed: {
    id: "gridPortfolioDetailed",
    name: "Detailed Portfolio Grid",
    description: "Comprehensive layout with project details and metadata",
    component: GridPortfolio,
    defaultProps: { variant: "detailed" as const, cols: "1-2-3" as const }
  },

  showcase: {
    id: "gridPortfolioShowcase",
    name: "Showcase Portfolio Grid",
    description: "Hero-style layout with featured projects and overlays",
    component: GridPortfolio,
    defaultProps: { variant: "showcase" as const, cols: "1-2-4" as const }
  }
};