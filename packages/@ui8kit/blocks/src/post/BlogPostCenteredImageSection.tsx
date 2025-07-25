import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Image,
  Icon,
  Box
} from "@ui8kit/core";
import { ChevronLeft, Link, Linkedin, X, Facebook } from "lucide-react";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface BlogPostCenteredImageSectionProps {
  content: {
    category: string;
    readTime: string;
    title: string;
    authorName: string;
    publishedDate: string;
    imageAlt: string;
  };
}

export const BlogPostCenteredImageSection = forwardRef<HTMLElement, BlogPostCenteredImageSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="2xl" padding="responsive">
          <Stack gap="lg">
            <Box display="flex" ai="center" gap="xs" c="muted-foreground" fw="semibold">
              <Icon component="span" size="md" lucideIcon={ChevronLeft} />
              <Text size="sm">All Posts</Text>
            </Box>
            <Box display="flex" gap="md" ai="center">
              <Text size="sm" fw="bold">
                {content.category}
              </Text>
              <Text size="sm" c="muted-foreground">
                {content.readTime}
              </Text>
            </Box>
            <Title order={1} size="4xl" fw="bold">
              {content.title}
            </Title>
          </Stack>

          <Image src={IMAGE_URL} alt={content.imageAlt} w="full" radius="md" mt="2xl" />

          <Box display="flex" jc="space-between" ai="end" mt="xl">
            <Stack gap="xs" ta="left">
              <Text size="sm" c="muted-foreground">
                Written by
              </Text>
              <Text size="md" fw="semibold">
                {content.authorName}
              </Text>
              <Text size="sm" c="muted-foreground">
                Published on
              </Text>
              <Text size="sm" fw="semibold">
                {content.publishedDate}
              </Text>
            </Stack>
            <Box display="flex" gap="md">
              <Icon component="a" lucideIcon={Link} href="#" target="_blank" rel="noopener noreferrer" />
              <Icon component="a" lucideIcon={Linkedin} href="#" target="_blank" rel="noopener noreferrer" />
              <Icon component="a" lucideIcon={X} href="#" target="_blank" rel="noopener noreferrer" />
              <Icon component="a" lucideIcon={Facebook} href="#" target="_blank" rel="noopener noreferrer" />
            </Box>
          </Box>
        </Container>
      </Block>
    );
  }
);

BlogPostCenteredImageSection.displayName = "BlogPostCenteredImageSection";

export const blogPostCenteredImageSectionTemplate = {
  id: "blogPostCenteredImageSection",
  name: "Blog Post Centered Image Section",
  description: "Centered blog post section with a large image and meta information.",
  component: BlogPostCenteredImageSection,
  defaultContent: {
    category: "Category",
    readTime: "5 min read",
    title: "Blog title heading will go here",
    authorName: "Full Name",
    publishedDate: "22 January 2021",
    imageAlt: "Blog Post Image",
  }
}; 