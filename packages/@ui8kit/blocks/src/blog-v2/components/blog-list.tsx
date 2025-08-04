import { forwardRef } from "react";
import { Stack, Group, Box } from "@ui8kit/core";
import { BlogCard } from "../ui/blog-card";
import type { BlogListProps } from "../types";

export const BlogList = forwardRef<HTMLDivElement, BlogListProps>(
  ({ posts, variant = "default", ...props }, ref) => {
    if (variant === "timeline") {
      return (
        <Stack ref={ref} gap="md" {...props}>
          {posts.map((post) => (
            <Group key={post.id} gap="md" align="start">
              <Box
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "var(--mantine-color-primary-filled)",
                  borderRadius: "50%",
                  flexShrink: 0,
                  marginTop: "8px"
                }}
              />
              <Box style={{ flex: 1, minWidth: 0 }}>
                <BlogCard post={post} variant="compact" />
              </Box>
            </Group>
          ))}
        </Stack>
      );
    }

    const cardVariant = variant === "compact" ? "compact" : "default";

    return (
      <Stack ref={ref} gap="md" {...props}>
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} variant={cardVariant} />
        ))}
      </Stack>
    );
  }
);

BlogList.displayName = "BlogList";