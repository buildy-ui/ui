// Atomic components
export * from "./ui";

// Composite components  
export * from "./components";

// Ready-to-use presets
export * from "./presets";

// Types, content, and schema
export * from "./types";
export * from "./content";
export * from "./schema";

// Templates for integration with existing system
import { GridBlog } from "./presets/grid-blog";
import { SplitBlog } from "./presets/split-blog";
import { blogContent } from "./content";
import { blogSchema } from "./schema";

export const blogTemplates = {
  gridCards: {
    id: "gridBlogCards",
    name: "Blog Cards Grid",
    description: "Grid layout with blog post cards",
    component: GridBlog,
    defaultProps: { variant: "cards" as const },
    defaults: blogContent.cards,
    schema: blogSchema
  },
  
  gridFiltered: {
    id: "gridBlogFiltered",
    name: "Filtered Blog Grid",
    description: "Grid layout with category filters",
    component: GridBlog,
    defaultProps: { variant: "filtered" as const },
    defaults: blogContent.filtered,
    schema: blogSchema
  },

  gridCompact: {
    id: "gridBlogCompact",
    name: "Compact Blog List",
    description: "Compact list layout for blog posts",
    component: GridBlog,
    defaultProps: { variant: "compact" as const, cols: "1" as const },
    defaults: blogContent.cards,
    schema: blogSchema
  },

  gridFeatured: {
    id: "gridBlogFeatured",
    name: "Featured Blog Grid",
    description: "Grid layout with featured post highlight",
    component: GridBlog,
    defaultProps: { variant: "featured" as const, cols: "1-2-4" as const },
    defaults: blogContent.cards,
    schema: blogSchema
  },

  splitNews: {
    id: "splitBlogNews",
    name: "Blog News Split",
    description: "Split layout with main content and related posts",
    component: SplitBlog,
    defaultProps: { variant: "news" as const },
    defaults: blogContent.news,
    schema: blogSchema
  },
  
  splitSlider: {
    id: "splitBlogSlider",
    name: "Blog Slider Split",
    description: "Split layout with post navigation",
    component: SplitBlog,
    defaultProps: { variant: "slider" as const },
    defaults: blogContent.news,
    schema: blogSchema
  },

  splitFeatured: {
    id: "splitBlogFeatured",
    name: "Featured Blog Split",
    description: "Split layout highlighting one main post",
    component: SplitBlog,
    defaultProps: { variant: "featured" as const },
    defaults: blogContent.news,
    schema: blogSchema
  },

  splitNewsletter: {
    id: "splitBlogNewsletter",
    name: "Newsletter Blog Split",
    description: "Split layout focused on newsletter subscription",
    component: SplitBlog,
    defaultProps: { variant: "newsletter" as const },
    defaults: blogContent.newsletter,
    schema: blogSchema
  },

  splitTimeline: {
    id: "splitBlogTimeline",
    name: "Timeline Blog Split",
    description: "Split layout with chronological post timeline",
    component: SplitBlog,
    defaultProps: { variant: "timeline" as const },
    defaults: blogContent.news,
    schema: blogSchema
  }
};