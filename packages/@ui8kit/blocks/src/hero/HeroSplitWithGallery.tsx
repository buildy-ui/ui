import { forwardRef } from "react";
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
  Icon,
  Box
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
}

export const HeroSplitWithGallery = forwardRef<HTMLElement, HeroSplitWithGalleryProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Grid
            cols="cols2"
            gap="xl"
            align="center"
          >
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
                      svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />"
                      svgSize="16"
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
                      svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5' />"
                      svgSize="16"
                    />
                  }
                >
                  {content.secondaryButtonText}
                </Button>
              </Group>
            </Stack>
            
            {/* Image Gallery */}
            <Grid cols={2} gap="lg">
              {content.images.map((image, index) => (
                <Grid.Col 
                  key={image.id}
                  rowSpan={index === 1 ? 2 : 1}
                >
                  <Box 
                    position="relative"
                    bg="muted"
                    rounded="md"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width="100%"
                      height="100%"
                      fit="cover"
                      aspect={index === 1 ? "auto" : "square"}
                      radius="md"
                    />
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
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
        src: "https://images.unsplash.com/photo-1618477202872-89cec7957b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80",
        alt: "Gallery Image 3"
      }
    ]
  }
}; 