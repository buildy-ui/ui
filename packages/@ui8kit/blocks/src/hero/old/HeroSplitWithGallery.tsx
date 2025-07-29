import { forwardRef } from "react";
import { BookOpen, Code } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Group,
  Grid,
  Title,
  Text,
  Button,
  Badge,
  Image,
  Icon
} from "@ui8kit/core";

interface HeroSplitWithGalleryProps {
  content: {
    badge: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    images: Array<{
      id: string;
      src: string;
      alt: string;
    }>;
  };
  leftImage?: true;
}

export const HeroSplitWithGallery = forwardRef<HTMLElement, HeroSplitWithGalleryProps>(
  ({ content, leftImage }, ref) => {
    const galleryElement = (
      <Grid cols={2} gap="md">
        {content.images.map((image, index) =>
          <Grid.Col key={image.id} rowSpan={index === 0 ? 2 : 1}>
          <Image
            src={image.src}
            alt={image.alt}
            width="100%"
            height="100%"
            fit="cover"
            radius="md"
            className="w-full h-full"
          />
        </Grid.Col>
      )}
    </Grid>
    );
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" >
          <Grid
            className="grid grid-cols-1 md:grid-cols-2 items-center gap-8"
          >
            {leftImage && galleryElement}
            {/* Content */}
            <Stack gap="lg" align="start">
              <Badge variant="outline">
                {content.badge}
              </Badge>
              
              <Title
                order={1}
                size="3xl"
                fw="bold"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
              >
                {content.description}
              </Text>
              
              <Group gap="md" align="center" direction="col" responsive="md">
                <Button
                  size="lg"
                  variant="default"
                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={BookOpen}
                    />
                  }
                >
                  {content.primaryButtonText}
                </Button>
                
                <Button
                  variant="outline" 
                  size="lg"
                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={Code}
                    />
                  }
                >
                  {content.secondaryButtonText}
                </Button>
              </Group>
            </Stack>
            {leftImage !== true && galleryElement}
          </Grid>
        </Container>
      </Block>
    );
  }
);

HeroSplitWithGallery.displayName = "HeroSplitWithGallery";

export const heroSplitWithGalleryTemplate = {
  id: "heroSplitWithGallery",
  name: "Hero Split With Gallery",
  description: "Split layout hero section with content and image gallery",
  component: HeroSplitWithGallery,
  defaultContent: {
    badge: "We're building",
    title: "Build with shadcn ui components",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS. Open source and free to use in your applications.",
    primaryButtonText: "Documentation",
    secondaryButtonText: "GitHub",
    images: [
      {
        id: "image1",
        src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Gallery Image 1"
      },
      {
        id: "image2", 
        src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Gallery Image 2"
      },
      {
        id: "image3",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Gallery Image 3"
      }
    ]
  }
}; 