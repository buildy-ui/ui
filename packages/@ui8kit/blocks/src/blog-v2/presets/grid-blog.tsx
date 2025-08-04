import { forwardRef, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Stack, Icon } from "@ui8kit/core";
import { BlogSection } from "../components/blog-section";
import { BlogContent } from "../components/blog-content";
import { BlogGrid } from "../components/blog-grid";
import { BlogFilters } from "../components/blog-filters";
import { BlogBadge } from "../ui/blog-badge";
import { BlogTitle } from "../ui/blog-title";
import { BlogDescription } from "../ui/blog-description";
import { BlogActions } from "../ui/blog-actions";
import { BlogButton } from "../ui/blog-button";
import { BlogCard } from "../ui/blog-card";
import { blogContent } from "../content";
import type { BlogData } from "../types";

interface GridBlogProps {
  content?: Partial<BlogData>;
  variant?: "cards" | "filtered" | "compact" | "featured";
  cols?: "1" | "2" | "3" | "4" | "1-2" | "1-2-3" | "1-2-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const GridBlog = forwardRef<HTMLElement, GridBlogProps>(
  ({ 
    content = {}, 
    variant = "cards",
    cols = "1-2-3",
    gap = "lg",
    useContainer = true,
    py = "xl",
    ...props 
  }, ref) => {
    // Get default content based on variant
    const defaultContent = useMemo(() => {
      switch (variant) {
        case "filtered":
          return blogContent.filtered;
        default:
          return blogContent.cards;
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

    // State for filtered variant
    const [activeCategory, setActiveCategory] = useState("all");
    
    // Filter posts based on active category
    const filteredPosts = useMemo(() => {
      if (variant !== "filtered" || activeCategory === "all") {
        return mergedContent.posts;
      }
      return mergedContent.posts.filter(post => post.categoryId === activeCategory);
    }, [mergedContent.posts, activeCategory, variant]);

    // Determine grid columns based on variant
    const gridCols = useMemo(() => {
      switch (variant) {
        case "compact":
          return "1";
        case "featured":
          return "1-2-4";
        default:
          return cols;
      }
    }, [variant, cols]);

    // Determine card variant
    const cardVariant = useMemo(() => {
      switch (variant) {
        case "compact":
          return "compact";
        case "featured":
          return "featured";
        default:
          return "default";
      }
    }, [variant]);

    return (
      <BlogSection 
        ref={ref} 
        layout="grid" 
        useContainer={useContainer}
        py={py}
        {...props}
      >
        <Stack gap="2xl" w="full">
          {/* Header Content */}
          <BlogContent align="center">
            {mergedContent.badge && (
              <BlogBadge>{mergedContent.badge}</BlogBadge>
            )}
            
            <BlogTitle>{mergedContent.title}</BlogTitle>
            
            <BlogDescription>{mergedContent.description}</BlogDescription>

            {/* Filters for filtered variant */}
            {variant === "filtered" && mergedContent.categories && (
              <BlogFilters 
                categories={mergedContent.categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            )}
          </BlogContent>

          {/* Blog Grid */}
          <BlogGrid cols={gridCols} gap={gap}>
            {filteredPosts.map((post, index) => {
              // For featured variant, make first post featured
              const postVariant = variant === "featured" && index === 0 ? "featured" : cardVariant;
              return (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  variant={postVariant}
                />
              );
            })}
          </BlogGrid>

          {/* Actions */}
          {mergedContent.buttonText && (
            <BlogActions>
              <BlogButton 
                variant="outline"
                rightSection={<Icon lucideIcon={ArrowRight} />}
              >
                {mergedContent.buttonText}
              </BlogButton>
            </BlogActions>
          )}
        </Stack>
      </BlogSection>
    );
  }
);

GridBlog.displayName = "GridBlog";