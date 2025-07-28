import { BookOpen, Code, Info, Rocket } from "lucide-react";
import { 
  Box, 
  Image, 
  Grid,
  Stack,
  Badge,
  Title,
  Text,
  Icon
} from "@ui8kit/core";
import { SplitBlock, createContentHook } from "./SplitBlock";

// ===== MIGRATION OF EXISTING BLOCKS =====

// Migration example for HeroSplitWithMedia
export const MigratedHeroSplitWithMedia = () => {
  // Instead of creating a separate component, use SplitBlock
  const mediaSection = (
    <Box>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
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
    description: "Create stunning applications with our powerful tools and components. Experience the future of development.",
    primaryButtonText: "Get Started",
    secondaryButtonText: "Learn More",
    primaryButtonIcon: Info,
    secondaryButtonIcon: Rocket
  };

  return (
    <SplitBlock
      mediaSection={mediaSection}
      content={content}
      leftMedia={false}
    />
  );
};

// Migration example for HeroSplitWithGallery
export const MigratedHeroSplitWithGallery = () => {
  const gallerySection = (
    <Grid cols={2} gap="md">
      <Grid.Col rowSpan={2}>
        <Image
          src="https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 1"
          width="100%"
          height="100%"
          fit="cover"
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
    description: "Beautifully designed components built with Radix UI and Tailwind CSS. Open source and free to use in your applications.",
    primaryButtonText: "Documentation",
    secondaryButtonText: "GitHub",
    primaryButtonIcon: BookOpen,
    secondaryButtonIcon: Code
  };

  return (
    <SplitBlock
      mediaSection={gallerySection}
      content={content}
      leftMedia={true}
    />
  );
};

// Migration example for FeaturesSplitMedia with custom content
export const MigratedFeaturesSplitMedia = () => {
  const imageSection = (
    <Box>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Features"
        width="100%"
        height="auto"
        radius="lg"
      />
    </Box>
  );

  // Use a custom content section because features has a specific structure
  const featuresContentSection = (
    <Stack gap="lg" align="start">
      <Badge variant="secondary">Features</Badge>
      
      <Title order={2} size="3xl" fw="bold">
        Powerful features for modern development
      </Title>
      
      <Text size="lg" c="muted-foreground">
        Everything you need to build amazing products with confidence and speed.
      </Text>
      
      <Stack gap="md">
        {[
          {
            title: "Tailwind CSS Styling",
            description: "Utilize Tailwind CSS for effortless customization and rapid development of your UI components."
          },
          {
            title: "Free and Open Source", 
            description: "Access these beautifully crafted components absolutely free, perfect for both personal and commercial projects."
          }
        ].map((feature, index) => (
          <Stack key={index} gap="sm" direction="row" align="start">
            <Box size="xl" bg="primary" rounded="lg" flex="center">
              <Icon lucideIcon={BookOpen} size="md" />
            </Box>
            <Stack gap="xs">
              <Title order={4} size="md" fw="semibold">
                {feature.title}
              </Title>
              <Text size="sm" c="muted-foreground">
                {feature.description}
              </Text>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <SplitBlock
      mediaSection={imageSection}
      contentSection={featuresContentSection}
      leftMedia={false}
    />
  );
};

// ===== ADVANCED EXAMPLES WITH HOOKS =====

// Custom hooks for branding
const brandedContentHooks = createContentHook({
  badge: (content) => (
    <Badge variant="outline" size="lg">
      ✨ {content.badge} ✨
    </Badge>
  ),
  title: (content) => (
    <Title
      order={1}
      size="4xl"
      fw="black"
      c="primary"
    >
      {content.title}
    </Title>
  ),
  beforeContent: () => (
    <Text size="sm" c="primary" fw="bold">
      🚀 EXCLUSIVE FOR YOU
    </Text>
  ),
  afterContent: () => (
    <Text size="xs" c="muted-foreground" ta="center">
      💡 Tip: Use SplitBlock for maximum flexibility
    </Text>
  )
});

export const BrandedSplitExample = () => {
  const content = {
    badge: "Premium",
    title: "Revolutionary platform",
    description: "Open up a new level of development with our innovative tools.",
    primaryButtonText: "Start now",
    secondaryButtonText: "View demo"
  };

  const mediaSection = (
    <Box>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Branded Image"
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
      contentHooks={brandedContentHooks}
      leftMedia={true}
      containerSize="xl"
      py="xl"
    />
  );
};

// Example of combining different approaches
export const HybridSplitExample = () => {
  // Part of the content through the content object
  const content = {
    badge: "Hybrid approach",
    title: "Best of both worlds"
  };

  // Part through custom hooks
  const hybridHooks = createContentHook({
    description: () => (
      <Stack gap="md">
        <Text size="lg" c="muted-foreground">
          Combine standard content with custom elements:
        </Text>
        <Stack gap="sm" direction="row" align="center">
          <Box size="sm" bg="green-500" rounded="full" />
          <Text size="sm">✅ Standard badge and title</Text>
        </Stack>
        <Stack gap="sm" direction="row" align="center">
          <Box size="sm" bg="blue-500" rounded="full" />
          <Text size="sm">🎨 Custom description</Text>
        </Stack>
        <Stack gap="sm" direction="row" align="center">
          <Box size="sm" bg="purple-500" rounded="full" />
          <Text size="sm">⚡ Special actions</Text>
        </Stack>
      </Stack>
    ),
    actions: () => (
      <Stack gap="md" align="start">
        <Text fw="medium" c="primary">Choose your plan:</Text>
        <Grid cols={2} gap="sm">
          <Box p="md" bg="primary" rounded="lg" ta="center">
            <Text c="white" fw="bold">Basic</Text>
          </Box>
          <Box p="md" bg="secondary" rounded="lg" ta="center">
            <Text fw="bold">Premium</Text>
          </Box>
        </Grid>
      </Stack>
    )
  });

  const mediaSection = (
    <Stack gap="md" align="center">
      <Title order={3} ta="center">📊 Statistics</Title>
      <Grid cols={2} gap="md">
        {[
          { label: "Users", value: "10K+" },
          { label: "Projects", value: "500+" },
          { label: "Countries", value: "25+" },
          { label: "Reviews", value: "98%" }
        ].map((stat, index) => (
          <Box key={index} p="lg" bg="muted" rounded="lg" ta="center">
            <Text size="xl" fw="black" c="primary">{stat.value}</Text>
            <Text size="sm" c="muted-foreground">{stat.label}</Text>
          </Box>
        ))}
      </Grid>
    </Stack>
  );

  return (
    <SplitBlock
      mediaSection={mediaSection}
      content={content}
      contentHooks={hybridHooks}
      leftMedia={false}
      gap="lg"
    />
  );
};

export const migrationExamples = {
  heroSplitWithMedia: MigratedHeroSplitWithMedia,
  heroSplitWithGallery: MigratedHeroSplitWithGallery,
  featuresSplitMedia: MigratedFeaturesSplitMedia,
  branded: BrandedSplitExample,
  hybrid: HybridSplitExample
}; 