import { forwardRef } from "react";
import { 
  ArrowRight,
  Briefcase,
  MapPin,
  Clock
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
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
  LayoutBlock,
  createLayoutContentHook,
  type LayoutType
} from "@ui8kit/core";

// Features data interface
export interface GridFeaturesData {
  badge: string;
  title: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };
    lucideIcon?: any;
    stats?: {
      value: string;
      label: string;
    };
    location?: string;
    department?: string;
    [key: string]: any;
  }>;
}

interface GridFeaturesProps {
  content: GridFeaturesData;
  variant?: "threeColumns" | "threeColumnsIcons" | "gridMediaCards" | "careerPositions" | "careerStats";
  layout?: LayoutType;
  cols?: "1" | "2" | "3" | "4" | "5" | "6" | "1-2" | "1-3" | "1-4" | "1-5" | "1-6" | "2-3" | "2-4" | "2-5" | "2-6" | "3-4" | "3-5" | "3-6" | "4-5" | "4-6" | "5-6" | "1-2-3" | "1-2-4" | "1-3-4" | "2-3-4" | "1-2-3-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Custom content hooks for different variants
const gridFeaturesContentHooks = {
  // Three columns simple
  threeColumns: createLayoutContentHook({
    item: (item: any, index: number) => (
      <Stack key={item.id || index} gap="md" align="start">
        <Stack gap="xs">
          <Title order={3} size="lg" fw="semibold">
            {item.title}
          </Title>
          
          <Text c="secondary-foreground">
            {item.description}
          </Text>
        </Stack>
      </Stack>
    )
  }),

  // Three columns with icons
  threeColumnsIcons: createLayoutContentHook({
    item: (item: any, index: number) => (
      <Stack key={item.id || index} gap="md" align="start">
        {item.lucideIcon && (
          <Box 
            p="sm" 
            bg="primary" 
            rounded={theme?.themeRounded.default}
            className="inline-flex"
            data-class="feature-icon"
          >
            <Icon
              component="span"
              size="md"
              lucideIcon={item.lucideIcon}
              c="primary-foreground"
            />
          </Box>
        )}

        <Stack gap="xs">
          <Title order={3} size="lg" fw="semibold">
            {item.title}
          </Title>
          
          <Text c="secondary-foreground">
            {item.description}
          </Text>
        </Stack>
      </Stack>
    )
  }),

  // Grid with media cards
  gridMediaCards: createLayoutContentHook({
    item: (item: any, index: number) => (
      <Card key={item.id || index} p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
        <Stack gap="md" align="start">
          {item.image && (
            <Box className="relative overflow-hidden rounded-md">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width="100%"
                height="200px"
                fit="cover"
                rounded={theme?.themeRounded.default}
              />
              
              {item.lucideIcon && (
                <Box 
                  className="absolute top-3 right-3"
                  p="xs" 
                  bg="primary" 
                  rounded={theme?.themeRounded.default}
                  data-class="overlay-icon"
                >
                  <Icon
                    component="span"
                    size="sm"
                    lucideIcon={item.lucideIcon}
                    c="primary-foreground"
                  />
                </Box>
              )}
            </Box>
          )}

          <Stack gap="xs">
            <Title order={3} size="lg" fw="semibold">
              {item.title}
            </Title>
            
            <Text c="secondary-foreground">
              {item.description}
            </Text>
          </Stack>

          <Group gap="xs" align="center" className="mt-auto">
            <Text size="xs" fw="medium" c="primary">
              Learn more
            </Text>
            <Icon
              component="span"
              size="xs"
              lucideIcon={ArrowRight}
              c="primary"
            />
          </Group>
        </Stack>
      </Card>
    )
  }),

  // Career positions
  careerPositions: createLayoutContentHook({
    item: (item: any, index: number) => (
      <Card key={item.id || index} p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-md transition-shadow">
        <Stack gap="md" align="start">
          <Group gap="md" align="start" justify="between" className="w-full">
            <Stack gap="xs" className="flex-1">
              <Title order={3} size="lg" fw="semibold">
                {item.title}
              </Title>
              
              <Text c="secondary-foreground">
                {item.description}
              </Text>
            </Stack>

            {item.lucideIcon && (
              <Box 
                p="sm" 
                bg="secondary" 
                rounded={theme?.themeRounded.default} 
                className="flex-shrink-0"
                data-class="position-icon"
              >
                <Icon
                  component="span"
                  size="md"
                  lucideIcon={item.lucideIcon}
                  c="secondary-foreground"
                />
              </Box>
            )}
          </Group>

          <Group gap="lg" align="center" className="w-full">
            {item.department && (
              <Group gap="xs" align="center">
                <Icon
                  component="span"
                  size="xs"
                  lucideIcon={Briefcase}
                  c="secondary-foreground"
                />
                <Text size="xs" c="secondary-foreground">
                  {item.department}
                </Text>
              </Group>
            )}

            {item.location && (
              <Group gap="xs" align="center">
                <Icon
                  component="span"
                  size="xs"
                  lucideIcon={MapPin}
                  c="secondary-foreground"
                />
                <Text size="xs" c="secondary-foreground">
                  {item.location}
                </Text>
              </Group>
            )}

            <Group gap="xs" align="center" className="ml-auto">
              <Icon
                component="span"
                size="xs"
                lucideIcon={Clock}
                c="secondary-foreground"
              />
              <Text size="xs" c="secondary-foreground">
                Full-time
              </Text>
            </Group>
          </Group>

          <Button rounded={theme?.themeRounded.default} 
            variant="outline" 
            size="sm" 
            className="w-full"
            rightSection={
              <Icon
                component="span"
                size="xs"
                lucideIcon={ArrowRight}
              />
            }
          >
            Apply Now
          </Button>
        </Stack>
      </Card>
    )
  }),

  // Career stats
  careerStats: createLayoutContentHook({
    item: (item: any, index: number) => (
      <Card key={item.id || index} p="xl" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="text-center">
        <Stack gap="lg" align="center">
          {item.lucideIcon && (
            <Box 
              p="lg" 
              bg="primary" 
              rounded="full" 
              className="inline-flex"
              data-class="stats-icon"
            >
              <Icon
                component="span"
                size="xl"
                lucideIcon={item.lucideIcon}
                c="primary-foreground"
              />
            </Box>
          )}

          <Stack gap="xs" align="center">
            {item.stats && (
              <Text size="4xl" fw="bold" c="primary" className="leading-none">
                {item.stats.value}
              </Text>
            )}
            
            <Title order={3} size="lg" fw="semibold" ta="center">
              {item.title}
            </Title>
            
            <Text c="secondary-foreground" ta="center">
              {item.description}
            </Text>
          </Stack>
        </Stack>
      </Card>
    )
  })
};

export const GridFeatures = forwardRef<HTMLElement, GridFeaturesProps>(
  ({ 
    content, 
    variant = "threeColumns",
    layout = "grid",
    cols = "1-2-3",
    py = "lg",
    gap = "xl",
    useContainer = true,
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks and layout settings based on variant
    const getVariantConfig = () => {
      switch (variant) {
        case "threeColumns":
          return {
            contentHooks: gridFeaturesContentHooks.threeColumns,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
        
        case "threeColumnsIcons":
          return {
            contentHooks: gridFeaturesContentHooks.threeColumnsIcons,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
        
        case "gridMediaCards":
          return {
            contentHooks: gridFeaturesContentHooks.gridMediaCards,
            cols: "1-2-3" as const,
            gap: "xl" as const
          };
        
        case "careerPositions":
          return {
            contentHooks: gridFeaturesContentHooks.careerPositions,
            cols: "1-2" as const,
            gap: "lg" as const
          };
        
        case "careerStats":
          return {
            contentHooks: gridFeaturesContentHooks.careerStats,
            cols: "1-2-4" as const,
            gap: "lg" as const
          };
        
        default:
          return {
            contentHooks: gridFeaturesContentHooks.threeColumns,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
      }
    };

    const config = getVariantConfig();

    return (
      <LayoutBlock
        ref={ref}
        layout={layout}
        useContainer={useContainer}
        py={py}
        cols={config.cols}
        gap={config.gap}
        content={content}
        contentHooks={config.contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridFeatures.displayName = "GridFeatures";

// Export template configurations
export const gridFeaturesTemplates = {
  threeColumns: {
    id: "gridFeaturesThreeColumns",
    name: "Three Columns Features",
    description: "Simple three column layout with features",
    component: GridFeatures,
    defaultProps: { variant: "threeColumns" as const }
  },
  
  threeColumnsIcons: {
    id: "gridFeaturesThreeColumnsIcons",
    name: "Three Columns with Icons",
    description: "Three column layout with feature icons",
    component: GridFeatures,
    defaultProps: { variant: "threeColumnsIcons" as const }
  },

  gridMediaCards: {
    id: "gridFeaturesMediaCards",
    name: "Grid Media Cards",
    description: "Grid layout with media cards",
    component: GridFeatures,
    defaultProps: { variant: "gridMediaCards" as const }
  },

  careerPositions: {
    id: "gridFeaturesCareerPositions",
    name: "Career Positions Grid",
    description: "Grid layout for job positions",
    component: GridFeatures,
    defaultProps: { variant: "careerPositions" as const, cols: "1-2" as const }
  },

  careerStats: {
    id: "gridFeaturesCareerStats",
    name: "Career Stats Grid",
    description: "Grid layout with statistics cards",
    component: GridFeatures,
    defaultProps: { variant: "careerStats" as const, cols: "1-2-4" as const }
  }
};