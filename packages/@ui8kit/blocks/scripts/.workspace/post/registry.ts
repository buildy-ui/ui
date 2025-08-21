import { createElement } from "react";
import type { ReactNode } from "react";
import { CenteredPost } from "./CenteredPost";
import { SplitPost } from "./SplitPost";
import { createBlocksRegistry } from "../registry";
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen, Eye, Heart, Bookmark } from "lucide-react";

// Shared post types
export type PostTypeId = "post.centeredpost" | "post.splitpost";

export type PostVariant = string;

export interface PostBlockNode {
  id?: string;
  type: PostTypeId;
  variant?: PostVariant;
  props?: Record<string, any>;
  slots?: Record<string, PostBlockNode[] | PostBlockNode | undefined>;
}

export interface PostBlockPreset {
  id: string;
  type: PostTypeId;
  variant?: PostVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface PostBlockDefinition {
  type: PostTypeId;
  name: string;
  variants: PostVariant[];
  render: (node: PostBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: PostBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register post definitions via helpers below.

// ===== Presets (kept close to post code) =====

const centeredPostPresets: PostBlockPreset[] = [
  {
    id: "preset:post.centeredpost:default:article-detail",
    type: "post.centeredpost",
    variant: "default",
    name: "Article Detail",
    description: "Centered post layout for detailed article view",
    props: {
      content: {
        title: "The Future of Web Development: Trends to Watch in 2024",
        subtitle: "Exploring the latest technologies and methodologies shaping the web development landscape",
        author: {
          name: "Sarah Mitchell",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          bio: "Senior Developer Advocate with 10+ years of experience in modern web technologies"
        },
        date: "December 15, 2024",
        readTime: "8 min read",
        category: "Technology",
        tags: ["Web Development", "React", "JavaScript", "Future Tech"],
        featuredImage: {
          src: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          alt: "Modern web development workspace"
        },
        excerpt: "As we look ahead to 2024, the web development landscape continues to evolve at an unprecedented pace. From AI-powered development tools to new frameworks and methodologies, developers need to stay ahead of the curve.",
        content: [
          {
            type: "paragraph",
            content: "The web development industry has seen remarkable growth and transformation over the past few years. As we approach 2024, several key trends are emerging that will shape how developers build and deploy web applications."
          },
          {
            type: "heading",
            content: "AI-Powered Development"
          },
          {
            type: "paragraph",
            content: "Artificial Intelligence is no longer just a buzzword in tech. It's actively transforming how developers write code, debug applications, and even design user interfaces. Tools like GitHub Copilot and ChatGPT are becoming essential parts of the development workflow."
          },
          {
            type: "image",
            src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "AI coding assistant",
            caption: "AI-powered coding assistants are revolutionizing development workflows"
          },
          {
            type: "heading",
            content: "WebAssembly and Performance"
          },
          {
            type: "paragraph",
            content: "WebAssembly (WASM) continues to gain traction as developers seek better performance for web applications. This binary instruction format allows code written in languages like C, C++, and Rust to run in the browser at near-native speeds."
          }
        ],
        relatedPosts: [
          {
            id: "1",
            title: "Building Scalable React Applications",
            excerpt: "Best practices for creating maintainable React apps",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            link: "#"
          },
          {
            id: "2",
            title: "TypeScript Best Practices",
            excerpt: "Improve your TypeScript code quality and maintainability",
            image: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            link: "#"
          }
        ]
      },
      useContainer: true
    },
    version: 1
  }
];

const splitPostPresets: PostBlockPreset[] = [
  {
    id: "preset:post.splitpost:sidebar:blog-article",
    type: "post.splitpost",
    variant: "sidebar",
    name: "Blog Article with Sidebar",
    description: "Split post layout with sidebar for additional content",
    props: {
      content: {
        title: "10 Essential Tools Every Developer Should Know in 2024",
        author: {
          name: "Alex Rodriguez",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          bio: "Full-stack developer and technical writer"
        },
        date: "December 10, 2024",
        readTime: "6 min read",
        category: "Development",
        featuredImage: {
          src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "Developer workspace with tools"
        },
        content: [
          {
            type: "paragraph",
            content: "In the ever-evolving landscape of software development, staying updated with the right tools can make a significant difference in productivity and code quality."
          },
          {
            type: "heading",
            content: "Code Editors & IDEs"
          },
          {
            type: "paragraph",
            content: "Visual Studio Code continues to dominate the code editor space, but Cursor and Zed are emerging as compelling alternatives with AI-powered features."
          },
          {
            type: "heading",
            content: "Version Control & Collaboration"
          },
          {
            type: "paragraph",
            content: "Git remains the standard for version control, while GitHub and GitLab provide excellent collaboration platforms with built-in CI/CD capabilities."
          }
        ],
        sidebar: {
          toc: [
            { title: "Code Editors & IDEs", anchor: "editors" },
            { title: "Version Control & Collaboration", anchor: "version-control" },
            { title: "Testing Frameworks", anchor: "testing" },
            { title: "Deployment Tools", anchor: "deployment" }
          ],
          author: {
            name: "Alex Rodriguez",
            bio: "Full-stack developer with 8+ years of experience",
            social: [
              { platform: "twitter", link: "#" },
              { platform: "github", link: "#" },
              { platform: "linkedin", link: "#" }
            ]
          },
          tags: ["Developer Tools", "Productivity", "2024 Trends"],
          relatedPosts: [
            {
              id: "1",
              title: "Best VS Code Extensions",
              excerpt: "Essential extensions for modern development",
              link: "#"
            }
          ]
        }
      },
      useContainer: true,
      leftMedia: true
    },
    version: 1
  }
];

// ===== Definitions =====

const centeredPostDef: PostBlockDefinition = {
  type: "post.centeredpost",
  name: "Centered Post",
  variants: ["default", "minimal", "detailed"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    return createElement(CenteredPost as any, {
      variant: (variant as any) || "default",
      ...props
    });
  },
  presets: centeredPostPresets
};

const splitPostDef: PostBlockDefinition = {
  type: "post.splitpost",
  name: "Split Post",
  variants: ["sidebar", "minimal", "detailed"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(SplitPost as any, {
      variant: (variant as any) || "sidebar",
      ...props
    });
  },
  presets: splitPostPresets
};

export const registerPostBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(centeredPostDef as any);
  registry.register(splitPostDef as any);
  return registry;
};

export const createPostRegistry = () => {
  const r = createBlocksRegistry();
  return registerPostBlocks(r);
};
