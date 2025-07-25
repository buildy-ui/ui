import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Image,
  Grid,
  Box,
} from "@ui8kit/core";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface ImageGalleryMasonrySectionProps {
  content: {
    mainTitle: string;
    mainDescription: string;
    images: {
      src: string;
      alt: string;
    }[];
  };
}

export const ImageGalleryMasonrySection = forwardRef<HTMLElement, ImageGalleryMasonrySectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive" ta="center">
          <Stack gap="lg" align="center">
            <Title order={1} size="3xl" fw="bold" ta="center">
              {content.mainTitle}
            </Title>
            <Text size="lg" c="muted-foreground" ta="center">
              {content.mainDescription}
            </Text>
          </Stack>
          <Grid cols={{ initial: 1, md: 2 }} gap="xl" mt="2xl" ai="start">
            <Box>
              <Image src={IMAGE_URL} alt={content.images[0]?.alt || "Gallery Image 1"} w="full" h="lg" radius="md" />
            </Box>
            <Grid cols="cols2" gap="xl">
              {content.images.slice(1, 5).map((image, index) => (
                <Image key={index} src={IMAGE_URL} alt={image.alt} w="full" h="md" radius="md" />
              ))}
            </Grid>
          </Grid>
        </Container>
      </Block>
    );
  }
);

ImageGalleryMasonrySection.displayName = "ImageGalleryMasonrySection";

export const imageGalleryMasonrySectionTemplate = {
  id: "imageGalleryMasonrySection",
  name: "Image Gallery Masonry Section",
  description: "Image gallery section with a masonry-like layout.",
  component: ImageGalleryMasonrySection,
  defaultContent: {
    mainTitle: "Image Gallery",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: [
      { src: IMAGE_URL, alt: "Gallery Image 1" },
      { src: IMAGE_URL, alt: "Gallery Image 2" },
      { src: IMAGE_URL, alt: "Gallery Image 3" },
      { src: IMAGE_URL, alt: "Gallery Image 4" },
      { src: IMAGE_URL, alt: "Gallery Image 5" },
      { src: IMAGE_URL, alt: "Gallery Image 6" },
    ]
  }
}; 