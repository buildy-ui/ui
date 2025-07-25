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
import { ChevronLeft } from "lucide-react";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface BlogPostNoAuthorSectionProps {
  content: {
    category: string;
    readTime: string;
    title: string;
    publishedDate: string;
    imageAlt: string;
  };
}

export const BlogPostNoAuthorSection = forwardRef<HTMLElement, BlogPostNoAuthorSectionProps>(
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

          <Box ta="left" mt="xl">
            <Text size="sm" c="muted-foreground">
              Published on
            </Text>
            <Text size="md" fw="semibold">
              {content.publishedDate}
            </Text>
          </Box>
        </Container>
      </Block>
    );
  }
);

BlogPostNoAuthorSection.displayName = "BlogPostNoAuthorSection";

export const blogPostNoAuthorSectionTemplate = {
  id: "blogPostNoAuthorSection",
  name: "Blog Post No Author Section",
  description: "Blog post section without author information.",
  component: BlogPostNoAuthorSection,
  defaultContent: {
    category: "Category",
    readTime: "5 min read",
    title: "Blog title heading will go here",
    publishedDate: "11 Jan 2022",
    imageAlt: "Blog Post Image",
  }
}; 