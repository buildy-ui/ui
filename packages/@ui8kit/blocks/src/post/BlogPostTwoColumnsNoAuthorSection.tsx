import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Image,
  Icon,
  Box,
  Grid,
} from "@ui8kit/core";
import { Link, Linkedin, X, Facebook, ChevronRight, User } from "lucide-react";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface BlogPostTwoColumnsNoAuthorSectionProps {
  content: {
    blogCategory: string;
    category: string;
    title: string;
    authorName: string;
    publishedDate: string;
    readTime: string;
    imageAlt: string;
  };
}

export const BlogPostTwoColumnsNoAuthorSection = forwardRef<HTMLElement, BlogPostTwoColumnsNoAuthorSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive">
          <Grid cols="cols2" gap="2xl" ai="start">
            {/* Left Column */}
            <Stack gap="md">
              <Box display="flex" ai="center" gap="xs" c="muted-foreground">
                <Text size="sm">{content.blogCategory}</Text>
                <Icon component="span" size="sm" lucideIcon={ChevronRight} />
                <Text size="sm" fw="semibold">
                  {content.category}
                </Text>
              </Box>
              <Title order={1} size="4xl" fw="bold">
                {content.title}
              </Title>
              <Box display="flex" gap="md" ai="center">
                <Box
                  w="lg"
                  h="lg"
                  display="flex"
                  ai="center"
                  jc="center"
                  bg="muted"
                  radius="full"
                  c="muted-foreground"
                >
                  <Icon component="span" size="md" lucideIcon={User} />
                </Box>
                <Text size="md" fw="medium">
                  {content.authorName}
                </Text>
                <Box
                  w="sm"
                  h="sm"
                  bg="muted-foreground"
                  radius="full"
                  display="inline-block"
                />
                <Text size="md" c="muted-foreground">
                  {content.publishedDate}
                </Text>
                <Box
                  w="sm"
                  h="sm"
                  bg="muted-foreground"
                  radius="full"
                  display="inline-block"
                />
                <Text size="md" c="muted-foreground">
                  {content.readTime}
                </Text>
              </Box>
              <Stack gap="sm" mt="lg">
                <Text size="sm" fw="semibold">
                  Share this post
                </Text>
                <Box display="flex" gap="md">
                  <Icon component="a" lucideIcon={Link} href="#" target="_blank" rel="noopener noreferrer" />
                  <Icon component="a" lucideIcon={Linkedin} href="#" target="_blank" rel="noopener noreferrer" />
                  <Icon component="a" lucideIcon={X} href="#" target="_blank" rel="noopener noreferrer" />
                  <Icon component="a" lucideIcon={Facebook} href="#" target="_blank" rel="noopener noreferrer" />
                </Box>
              </Stack>
            </Stack>

            {/* Right Column - Image */}
            <Box>
              <Image src={IMAGE_URL} alt={content.imageAlt} w="full" radius="md" />
            </Box>
          </Grid>
        </Container>
      </Block>
    );
  }
);

BlogPostTwoColumnsNoAuthorSection.displayName = "BlogPostTwoColumnsNoAuthorSection";

export const blogPostTwoColumnsNoAuthorSectionTemplate = {
  id: "blogPostTwoColumnsNoAuthorSection",
  name: "Blog Post Two Columns No Author Section",
  description: "Two-column blog post section with title and meta on left, image on right, no explicit author section.",
  component: BlogPostTwoColumnsNoAuthorSection,
  defaultContent: {
    blogCategory: "Blog",
    category: "Category",
    title: "Blog title heading will go here",
    authorName: "Full name",
    publishedDate: "11 Jan 2022",
    readTime: "5 min read",
    imageAlt: "Blog Post Image",
  }
}; 