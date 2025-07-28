import { BookOpen, Code, Check, Rocket, Info } from "lucide-react";
import {
  Box,
  Image,
  Grid,
  Stack,
  Title,
  Text,
  Badge,
  Icon,
  Container
} from "@ui8kit/core";
import { SplitBlock, createContentHook, defaultContentHooks, advancedContentHooks, type ContentHooks } from "./SplitBlock";

// ===== EXAMPLES =====

// 1. Basic usage as HeroSplitWithMedia (using Container hook)
export const HeroSplitExample = () => {
  const mediaSection = (
    <Box>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Hero Image"
        width="100%"
        height="auto"
        radius="lg"
      />
    </Box>
  );

  const content = {
    badge: "New Feature",
    title: "Build Amazing Products", 
    description: "Create stunning applications with our powerful tools and components.",
    primaryButtonText: "Get Started",
    secondaryButtonText: "Learn More",
    primaryButtonIcon: Info,
    secondaryButtonIcon: Rocket
  };

  return (
    <SplitBlock
      mediaSection={mediaSection}
      content={content}
      contentHooks={advancedContentHooks.heroWithContainer} 
      leftMedia={false}
    />
  );
};

// 2. Gallery as HeroSplitWithGallery (using Container hook)
export const GallerySplitExample = () => {
  const gallerySection = (
    <Grid cols={2} gap="md">
      <Grid.Col rowSpan={2}>
        <Image
          src="https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 1"
          width="100%"
          height="100%"
          fit="full"
          radius="md"
        />
      </Grid.Col>
      <Grid.Col>
        <Image
          src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 2"
          width="100%"
          height="100%"
          fit="cover"
          radius="md"
        />
      </Grid.Col>
      <Grid.Col>
        <Image
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 3"
          width="100%"
          height="100%"
          fit="cover"
          radius="md"
        />
      </Grid.Col>
    </Grid>
  );

  const content = {
    badge: "We're building",
    title: "Build with shadcn ui components",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
    primaryButtonText: "Documentation",
    secondaryButtonText: "GitHub",
    primaryButtonIcon: BookOpen,
    secondaryButtonIcon: Code
  };

  return (
    <SplitBlock
      mediaSection={gallerySection}
      content={content}
      contentHooks={advancedContentHooks.heroWithContainer}
      splitSection={false}
      leftMedia={true}
    />
  );
};

// 3. Full-height Features with stretched image and centered content
export const FeaturesSplitExample = () => {
  const imageSection = (
    <Box className="h-full bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        alt="Features"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
    </Box>
  );

  // Custom content hook for full-height centered layout
  const fullHeightContentHook = createContentHook({
    content: (content) => (
      <Stack gap="lg" align="start" className="flex flex-col items-start text-left gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 max-w-lg">
        <Badge variant="secondary">{content.badge}</Badge>
        <Title order={2} className="font-bold tracking-tight text-3xl sm:text-4xl md:text-6xl">
          {content.title}
        </Title>
        <Text className="text-lg text-muted-foreground sm:text-xl max-w-[42rem]">
          {content.description}
        </Text>
        
        {/* Analytics Cards */}
        <Grid cols={2} gap="md" className="w-full">
          <Box p="lg" bg="card" rounded="xl" border="1px solid" borderColor="border" className="shadow">
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">84%</Text>
              <Text size="xs" c="muted-foreground">
                Conversion Rate: this is a test
              </Text>
            </Stack>
          </Box>
          <Box p="lg" bg="card" rounded="xl" border="1px solid" borderColor="border" className="shadow">
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">12.5k</Text>
              <Text size="xs" c="muted-foreground">
                Active Users: this is a test
              </Text>
            </Stack>
          </Box>
        </Grid>

        {/* Feature List */}
        {content.features && (
          <Stack gap="md" className="w-full">
            {content.features.map((feature: any, index: number) => (
              <Stack key={index} gap="xs" direction="row" align="start">
                <Badge variant="default" size="sm">✓</Badge>
                <Stack gap="2xs">
                  <Text fw="semibold">{feature.title}</Text>
                  <Text size="sm" c="muted-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    )
  });

  const content = {
    badge: "Dashboard",
    title: "Powerful Analytics",
    description: "Get real-time insights into your business performance with our advanced analytics dashboard.",
    features: [
      {
        title: "Real-time Data",
        description: "Monitor your metrics as they happen with live updates."
      },
      {
        title: "Advanced Reporting", 
        description: "Generate comprehensive reports with custom filters and insights."
      }
    ]
  };

  return (
    <SplitBlock
      mediaSection={imageSection}
      content={content}
      contentHooks={fullHeightContentHook}
      splitSection={false}
      leftMedia={false}
      py="xl"
      gap="none"
      className="min-h-[calc(100vh-64px)] overflow-hidden"
    />
  );
};

// ===== EXAMPLES WITH CONTENT HOOKS =====

// Custom hooks with before/after content
const customHooks: ContentHooks = createContentHook({
  beforeContent: (content) => (
    <Text size="sm" c="primary" fw="bold">
      ⭐ Exclusive: {content.category}
    </Text>
  ),
  content: (content) => (
      <Stack gap="lg" align="start">
        <Badge variant="outline" size="lg">
          🚀 {content.badge}
        </Badge>
        <Title order={1} size="4xl" fw="bold">
          {content.title}
        </Title>
        <Text size="xl" c="muted-foreground">
          {content.description}
        </Text>
      </Stack>
  ),
  afterContent: () => (
      <Text size="xs" c="muted-foreground" ta="center">
        💡 Tip: Use content hooks for maximum flexibility
      </Text>
  )
});

export const CustomHooksExample = () => {
  const imageSection = (
    <Box className="h-full bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        alt="Features"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
    </Box>
  );

  // Custom content hook for full-height centered layout
  const fullHeightContentHook = createContentHook({
    content: (content) => (
      <Stack gap="lg" align="start" className="flex flex-col items-start text-left gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 max-w-lg">
        <Badge variant="secondary">{content.badge}</Badge>
        <Title order={2} className="font-bold tracking-tight text-3xl sm:text-4xl md:text-6xl">
          {content.title}
        </Title>
        <Text className="text-lg text-muted-foreground sm:text-xl max-w-[42rem]">
          {content.description}
        </Text>
        
        {/* Analytics Cards */}
        <Grid cols={2} gap="md" className="w-full">
          <Box p="lg" bg="card" rounded="xl" border="1px solid" borderColor="border" className="shadow">
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">84%</Text>
              <Text size="xs" c="muted-foreground">
                Conversion Rate: this is a test
              </Text>
            </Stack>
          </Box>
          <Box p="lg" bg="card" rounded="xl" border="1px solid" borderColor="border" className="shadow">
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">12.5k</Text>
              <Text size="xs" c="muted-foreground">
                Active Users: this is a test
              </Text>
            </Stack>
          </Box>
        </Grid>

        {/* Feature List */}
        {content.features && (
          <Stack gap="md" className="w-full">
            {content.features.map((feature: any, index: number) => (
              <Stack key={index} gap="xs" direction="row" align="start">
                <Badge variant="default" size="sm">✓</Badge>
                <Stack gap="2xs">
                  <Text fw="semibold">{feature.title}</Text>
                  <Text size="sm" c="muted-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    )
  });

  const content = {
    badge: "Dashboard",
    title: "Powerful Analytics",
    description: "Get real-time insights into your business performance with our advanced analytics dashboard.",
    features: [
      {
        title: "Real-time Data",
        description: "Monitor your metrics as they happen with live updates."
      },
      {
        title: "Advanced Reporting", 
        description: "Generate comprehensive reports with custom filters and insights."
      }
    ]
  };

  return (
    <SplitBlock
      mediaSection={imageSection}
      content={content}
      contentHooks={fullHeightContentHook}
      leftMedia={true}
      py="none"
      gap="none"
      className="min-h-[calc(100vh-64px)] overflow-hidden"
    />
  );
};

// ===== EXAMPLES WITHOUT SPLIT LAYOUT =====

export const StackedLayoutExample = () => {
  const content = {
    badge: "Update",
    title: "Vertical layout",
    description: "Use a regular Stack instead of Grid for vertical layout.",
    primaryButtonText: "Try"
  };

  const mediaSection = (
    <Box>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Stacked Image"
        width="100%"
        height="auto"
        radius="lg"
      />
    </Box>
  );

  return (
    <SplitBlock
      mediaSection={mediaSection}
      content={content}
      contentHooks={defaultContentHooks.traditional}
      splitSection={false} // Disable Grid, use Container + Stack
      leftMedia={false}
    />
  );
};

// ===== FULLY CUSTOM CONTENT WITHOUT CONTAINER =====

export const FullGridExample = () => {
  const customContentSection = (
    <Stack gap="xl" align="center">
      <Title order={1} size="5xl" fw="black" ta="center">
        🎨 Full Grid Layout
      </Title>
      <Text size="xl" ta="center" c="muted-foreground">
        Grid directly after Block without Container
      </Text>
      <Box 
        w="200px" 
        h="100px" 
        bg="primary" 
        rounded="xl"
        flex="center"
      >
        <Text c="white" fw="bold">No Container!</Text>
      </Box>
    </Stack>
  );

  const customMediaSection = (
    <Stack gap="md" align="center">
      <Title order={3} ta="center">Direct Grid Media</Title>
      <Grid cols={3} gap="sm">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Box 
            key={i}
            size="lg" 
            bg="secondary" 
            rounded="md" 
            flex="center"
          >
            <Text fw="bold">{i}</Text>
          </Box>
        ))}
      </Grid>
    </Stack>
  );

  return (
    <SplitBlock
      mediaSection={customMediaSection}
      contentSection={customContentSection}
      splitSection={true} // Grid directly after Block
      leftMedia={true}
    />
  );
};

// Using predefined hooks
export const PresetHooksExample = () => {
  const content = {
    badge: "Preset",
    title: "Using predefined hooks"
  };

  const mediaSection = (
    <Box p="xl" bg="muted" rounded="lg">
      <Text ta="center" fw="bold">Media with Background</Text>
    </Box>
  );

  return (
    <SplitBlock
      mediaSection={mediaSection}
      content={content}
      contentHooks={defaultContentHooks.titleOnly}
      splitSection={false}
    />
  );
};

// Export all examples
export const splitBlockExamples = {
  hero: HeroSplitExample,
  gallery: GallerySplitExample,
  features: FeaturesSplitExample,
  customHooks: CustomHooksExample,
  stacked: StackedLayoutExample,
  fullGrid: FullGridExample,
  presetHooks: PresetHooksExample
}; 