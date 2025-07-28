import { BookOpen, Code, Rocket, Info } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Image,
  Icon
} from "@ui8kit/core";
import { SplitBlock, createContentHook, defaultContentHooks, advancedContentHooks, type ContentHooks } from "@ui8kit/core";

// ===== EXAMPLES =====

// 1. Basic usage as HeroSplitWithMedia (using Container hook)
export const HeroSplitExample = () => {
  const mediaSection = (
    <Block>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Hero Image"
        width="100%"
        height="auto"
        rounded="lg"
      />
    </Block>
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
      splitSection={false}
      py="xl"
      gap="lg"
    />
  );
};

// 2. Gallery as HeroSplitWithGallery (using Container hook)
export const GallerySplitExample = () => {
  const gallerySection = (
    <Grid cols="1-2" gap="md">
      <Block>
        <Image
          src="https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 1"
          width="100%"
          height="100%"
          fit="cover"
          rounded="md"
          className="h-full"
        />
      </Block>
      <Stack gap="md">
        <Image
          src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 2"
          width="100%"
          height="100%"
          fit="cover"
          rounded="md"
        />
        <Image
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Gallery Image 3"
          width="100%"
          height="100%"
          fit="cover"
          rounded="md"
        />
      </Stack>
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
      gap="lg"
    />
  );
};

// 3. Full-height Features with stretched image and centered content
export const FeaturesSplitExample = () => {
  const imageSection = (
    <Block 
      className="h-full bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden"
      data-class="features-image-section"
    >
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        alt="Features"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        data-class="features-background-image"
      />
    </Block>
  );

  // Custom content hook for full-height centered layout
  const fullHeightContentHook = createContentHook({
    content: (content: any) => (
      <Stack 
        gap="lg" 
        align="start" 
        className="flex flex-col items-start text-left gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 max-w-lg"
        data-class="features-content-stack"
      >
        <Badge variant="secondary" size="default" rounded="md">
          {content.badge}
        </Badge>
        <Title 
          order={2} 
          size="3xl" 
          fw="bold"
          className="font-bold tracking-tight text-3xl sm:text-4xl md:text-6xl"
          data-class="features-title"
        >
          {content.title}
        </Title>
        <Text 
          size="lg" 
          c="secondary-foreground"
          className="text-lg text-muted-foreground sm:text-xl max-w-[42rem]"
          data-class="features-description"
        >
          {content.description}
        </Text>
        
        {/* Analytics Cards */}
        <Grid cols="1-2" gap="md" className="w-full" data-class="analytics-cards">
          <Block 
            p="lg" 
            bg="card" 
            rounded="xl" 
            border="1px" 
            borderColor="border" 
            className="shadow"
            data-class="analytics-card"
          >
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">84%</Text>
              <Text size="xs" c="secondary-foreground">
                Conversion Rate: this is a test
              </Text>
            </Stack>
          </Block>
          <Block 
            p="lg" 
            bg="card" 
            rounded="xl" 
            border="1px" 
            borderColor="border" 
            className="shadow"
            data-class="analytics-card"
          >
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">12.5k</Text>
              <Text size="xs" c="secondary-foreground">
                Active Users: this is a test
              </Text>
            </Stack>
          </Block>
        </Grid>

        {/* Feature List */}
        {content.features && (
          <Stack gap="md" className="w-full" data-class="features-list">
            {content.features.map((feature: any, index: number) => (
              <Group key={index} gap="sm" align="start">
                <Badge variant="default" size="sm" rounded="md">✓</Badge>
                <Stack gap="xs">
                  <Text fw="semibold">{feature.title}</Text>
                  <Text size="sm" c="secondary-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
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
      splitSection={true}
      leftMedia={true}
      py="none"
      gap="none"
      className="min-h-[calc(100vh-64px)] overflow-hidden"
    />
  );
};

// 4. Full-height Features with stretched image and centered content
export const FeaturesSplitExample2 = () => {
  const imageSection = (
    <Block 
      className="h-full bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden"
      data-class="features-image-section"
    >
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        alt="Features"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        data-class="features-background-image"
      />
    </Block>
  );

  // Custom content hook for full-height centered layout
  const fullHeightContentHook = createContentHook({
    content: (content: any) => (
      <Stack 
        gap="lg" 
        align="start" 
        className="flex flex-col items-start text-left gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 max-w-lg"
        data-class="features-content-stack"
      >
        <Badge variant="secondary" size="default" rounded="md">
          {content.badge}
        </Badge>
        <Title 
          order={2} 
          size="3xl" 
          fw="bold"
          className="font-bold tracking-tight text-3xl sm:text-4xl md:text-6xl"
          data-class="features-title"
        >
          {content.title}
        </Title>
        <Text 
          size="lg" 
          c="secondary-foreground"
          className="text-lg text-muted-foreground sm:text-xl max-w-[42rem]"
          data-class="features-description"
        >
          {content.description}
        </Text>
        
        {/* Analytics Cards */}
        <Grid cols="1-2" gap="md" className="w-full" data-class="analytics-cards">
          <Block 
            p="lg" 
            bg="card" 
            rounded="xl" 
            border="1px" 
            borderColor="border" 
            className="shadow"
            data-class="analytics-card"
          >
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">84%</Text>
              <Text size="xs" c="secondary-foreground">
                Conversion Rate: this is a test
              </Text>
            </Stack>
          </Block>
          <Block 
            p="lg" 
            bg="card" 
            rounded="xl" 
            border="1px" 
            borderColor="border" 
            className="shadow"
            data-class="analytics-card"
          >
            <Stack gap="xs">
              <Text size="2xl" fw="bold" c="primary">12.5k</Text>
              <Text size="xs" c="secondary-foreground">
                Active Users: this is a test
              </Text>
            </Stack>
          </Block>
        </Grid>

        {/* Feature List */}
        {content.features && (
          <Stack gap="md" className="w-full" data-class="features-list">
            {content.features.map((feature: any, index: number) => (
              <Group key={index} gap="sm" align="start">
                <Badge variant="default" size="sm" rounded="md">✓</Badge>
                <Stack gap="xs">
                  <Text fw="semibold">{feature.title}</Text>
                  <Text size="sm" c="secondary-foreground">
                    {feature.description}
                  </Text>
                </Stack>
              </Group>
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
      splitSection={true}
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
    <Block>
      <Image
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Stacked Image"
        width="100%"
        height="auto"
        rounded="lg"
      />
    </Block>
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
      <Title order={1} size="5xl" fw="bold" ta="center">
        🎨 Full Grid Layout
      </Title>
      <Text size="xl" ta="center" c="secondary-foreground">
        Grid directly after Block without Container
      </Text>
      <Block 
        bg="primary" 
        rounded="xl"
        className="w-[200px] h-[100px] flex items-center justify-center"
        data-class="demo-block"
      >
        <Text c="primary-foreground" fw="bold">No Container!</Text>
      </Block>
    </Stack>
  );

  const customMediaSection = (
    <Stack gap="md" align="center">
      <Title order={3} ta="center">Direct Grid Media</Title>
      <Grid cols="1-2-3" gap="sm">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Block 
            key={i}
            p="lg" 
            bg="secondary" 
            rounded="md" 
            className="flex items-center justify-center"
            data-class="grid-item"
          >
            <Text fw="bold">{i}</Text>
          </Block>
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
    <Block p="xl" bg="muted" rounded="lg">
      <Text ta="center" fw="bold">Media with Background</Text>
    </Block>
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
  features2: FeaturesSplitExample2,
  stacked: StackedLayoutExample,
  fullGrid: FullGridExample,
  presetHooks: PresetHooksExample
}; 