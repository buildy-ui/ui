import { forwardRef, useMemo } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Stack, Grid, Group, Icon, Box } from "@ui8kit/core";
import { BlogSection } from "../components/blog-section";
import { BlogContent } from "../components/blog-content";
import { BlogList } from "../components/blog-list";
import { BlogBadge } from "../ui/blog-badge";
import { BlogTitle } from "../ui/blog-title";
import { BlogDescription } from "../ui/blog-description";
import { BlogActions } from "../ui/blog-actions";
import { BlogButton } from "../ui/blog-button";
import { BlogCard } from "../ui/blog-card";
import { blogContent } from "../content";
import type { BlogData } from "../types";

interface SplitBlogProps {
  content?: Partial<BlogData>;
  variant?: "news" | "slider" | "featured" | "newsletter" | "timeline";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const SplitBlog = forwardRef<HTMLElement, SplitBlogProps>(
  ({ 
    content = {}, 
    variant = "news",
    leftMedia = false,
    useContainer = true,
    py = "xl",
    ...props 
  }, ref) => {
    // Get default content based on variant
    const defaultContent = useMemo(() => {
      switch (variant) {
        case "newsletter":
          return blogContent.newsletter;
        default:
          return blogContent.news;
      }
    }, [variant]);

    // Merge content: user content over defaults
    const mergedContent = useMemo(() => {
      if (Object.keys(content).length > 0) {
        return {
          ...defaultContent,
          ...content,
          title: content.title || "Untitled",
          description: content.description || "No description provided"
        };
      }
      return defaultContent;
    }, [content, defaultContent]);

    // Create content section
    const createContentSection = () => (
      <BlogContent>
        {mergedContent.badge && (
          <BlogBadge>{mergedContent.badge}</BlogBadge>
        )}
        
        <BlogTitle>{mergedContent.title}</BlogTitle>
        
        <BlogDescription>{mergedContent.description}</BlogDescription>

        {variant === "newsletter" && (
          <BlogActions>
            <BlogButton 
              variant="default"
              rightSection={<Icon lucideIcon={ArrowRight} />}
              style={{ width: "100%" }}
            >
              Subscribe to Newsletter
            </BlogButton>
          </BlogActions>
        )}

        {variant === "news" && mergedContent.viewAllText && (
          <BlogActions>
            <BlogButton 
              variant="outline"
              rightSection={<Icon lucideIcon={ArrowRight} />}
            >
              {mergedContent.viewAllText}
            </BlogButton>
          </BlogActions>
        )}
      </BlogContent>
    );

    // Create media section based on variant
    const createMediaSection = () => {
      switch (variant) {
        case "featured":
          return mergedContent.featuredPost ? (
            <BlogCard post={mergedContent.featuredPost} variant="featured" />
          ) : null;

        case "slider":
          return (
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <BlogTitle order={3} size="lg">Related Articles</BlogTitle>
                <Group gap="xs">
                  <BlogButton variant="outline" size="sm">
                    <Icon lucideIcon={ChevronLeft} />
                  </BlogButton>
                  <BlogButton variant="outline" size="sm">
                    <Icon lucideIcon={ChevronRight} />
                  </BlogButton>
                </Group>
              </Group>
              <BlogList posts={mergedContent.posts.slice(0, 3)} variant="compact" />
            </Stack>
          );

        case "timeline":
          return (
            <Stack gap="md">
              <BlogTitle order={3} size="lg">Timeline</BlogTitle>
              <BlogList posts={mergedContent.posts.slice(0, 4)} variant="timeline" />
            </Stack>
          );

        case "newsletter":
          return (
            <Stack gap="md">
              <BlogTitle order={3} size="lg">Latest Posts</BlogTitle>
              <BlogList posts={mergedContent.posts.slice(0, 3)} variant="compact" />
            </Stack>
          );

        default: // news
          return (
            <Stack gap="md">
              <BlogTitle order={3} size="lg">Related Articles</BlogTitle>
              <BlogList posts={mergedContent.posts.slice(1, 4)} variant="compact" />
            </Stack>
          );
      }
    };

    const contentSection = createContentSection();
    const mediaSection = createMediaSection();

    return (
      <BlogSection 
        ref={ref} 
        layout="split" 
        useContainer={useContainer}
        py={py}
        {...props}
      >
        <Grid cols="1-2" gap="xl" align="start">
          {leftMedia ? (
            <>
              {mediaSection}
              {contentSection}
            </>
          ) : (
            <>
              {contentSection}
              {mediaSection}
            </>
          )}
        </Grid>
      </BlogSection>
    );
  }
);

SplitBlog.displayName = "SplitBlog";