import { forwardRef } from "react";
import { Card, Stack, Group, Title, Text, Image, Box } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import { BlogAuthor } from "./blog-author";
import { BlogMeta } from "./blog-meta";
import { BlogCategory } from "./blog-category";
import type { BlogCardProps } from "../types";

const theme = skyOSTheme;

export const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(
  ({ post, variant = "default", ...props }, ref) => {
    if (variant === "compact") {
      return (
        <Card
          ref={ref}
          p="md"
          rounded={theme.rounded.default}
          shadow="sm"
          bg="card"
          style={{ transition: "box-shadow 0.2s" }}
          {...props}
        >
          <Group gap="md" align="start">
            {post.image && (
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width="80px"
                height="80px"
                fit="cover"
                rounded={theme.rounded.default}
                style={{ flexShrink: 0 }}
              />
            )}
            <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
              <BlogCategory variant="outline">{post.category}</BlogCategory>
              <Title order={4} size="sm" fw="medium" style={{ lineHeight: 1.3 }}>
                {post.title}
              </Title>
              <BlogMeta date={post.date} readTime={post.readTime} />
            </Stack>
          </Group>
        </Card>
      );
    }

    if (variant === "featured") {
      return (
        <Card
          ref={ref}
          p="xl"
          rounded={theme.rounded.default}
          shadow="lg"
          bg="card"
          style={{ transition: "box-shadow 0.2s" }}
          {...props}
        >
          <Stack gap="lg" align="start">
            {post.image && (
              <Box style={{ position: "relative", overflow: "hidden", borderRadius: theme.rounded.default }}>
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  width="100%"
                  height="300px"
                  fit="cover"
                  rounded={theme.rounded.default}
                />
                <Box
                  p="xs"
                  bg="primary"
                  rounded={theme.rounded.default}
                  style={{ position: "absolute", top: "12px", left: "12px" }}
                >
                  <Text size="xs" c="primary-foreground" fw="medium">
                    {post.category}
                  </Text>
                </Box>
              </Box>
            )}
            
            <Stack gap="md" w="full">
              <Title order={2} size="xl" fw="bold">
                {post.title}
              </Title>
              
              <Text c="secondary-foreground" style={{ lineHeight: 1.6 }}>
                {post.description}
              </Text>
              
              <Group justify="space-between" align="center">
                <BlogAuthor name={post.author.name} avatar={post.author.avatar} />
                <BlogMeta date={post.date} readTime={post.readTime} />
              </Group>
            </Stack>
          </Stack>
        </Card>
      );
    }

    // Default variant
    return (
      <Card
        ref={ref}
        p="lg"
        rounded={theme.rounded.default}
        shadow="sm"
        bg="card"
        style={{ transition: "box-shadow 0.2s" }}
        {...props}
      >
        <Stack gap="md" align="start">
          {post.image && (
            <Box style={{ position: "relative", overflow: "hidden", borderRadius: theme.rounded.default }}>
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width="100%"
                height="200px"
                fit="cover"
                rounded={theme.rounded.default}
              />
              
              <Box
                p="xs"
                bg="primary"
                rounded={theme.rounded.default}
                style={{ position: "absolute", top: "12px", left: "12px" }}
              >
                <Text size="xs" c="primary-foreground" fw="medium">
                  {post.category}
                </Text>
              </Box>
            </Box>
          )}
          
          <Stack gap="sm" w="full">
            <Title order={3} size="lg" fw="semibold">
              {post.title}
            </Title>
            
            <Text c="secondary-foreground" size="sm" style={{ lineHeight: 1.5 }}>
              {post.description}
            </Text>
            
            <Group justify="space-between" align="center">
              <BlogAuthor name={post.author.name} avatar={post.author.avatar} />
              <BlogMeta date={post.date} readTime={post.readTime} />
            </Group>
          </Stack>
        </Stack>
      </Card>
    );
  }
);

BlogCard.displayName = "BlogCard";