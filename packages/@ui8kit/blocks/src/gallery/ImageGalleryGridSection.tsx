import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Image,
  Grid,
} from "@ui8kit/core";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface ImageGalleryGridSectionProps {
  content: {
    mainTitle: string;
    mainDescription: string;
    images: {
      src: string;
      alt: string;
    }[];
  };
}

export const ImageGalleryGridSection = forwardRef<HTMLElement, ImageGalleryGridSectionProps>(
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
          <Grid cols="cols3" gap="xl" mt="2xl">
            {content.images.map((image, index) => (
              <Image key={index} src={IMAGE_URL} alt={image.alt} w="full" h="lg" radius="md" />
            ))}
          </Grid>
        </Container>
      </Block>
    );
  }
);

ImageGalleryGridSection.displayName = "ImageGalleryGridSection";

export const imageGalleryGridSectionTemplate = {
  id: "imageGalleryGridSection",
  name: "Image Gallery Grid Section",
  description: "Image gallery section with a grid layout.",
  component: ImageGalleryGridSection,
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