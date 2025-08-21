import { createElement } from "react";
import type { ReactNode } from "react";
import { GridGallery } from "./GridGallery";
import { SplitGallery } from "./SplitGallery";
import { createBlocksRegistry } from "../registry";
import { Camera, Image as ImageIcon, Grid3x3, Filter, ZoomIn, Share2, Eye, Heart, Play, Maximize2 } from "lucide-react";

// Shared gallery types
export type GalleryTypeId = "gallery.gridgallery" | "gallery.splitgallery";

export type GalleryVariant = string;

export interface GalleryBlockNode {
  id?: string;
  type: GalleryTypeId;
  variant?: GalleryVariant;
  props?: Record<string, any>;
  slots?: Record<string, GalleryBlockNode[] | GalleryBlockNode | undefined>;
}

export interface GalleryBlockPreset {
  id: string;
  type: GalleryTypeId;
  variant?: GalleryVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface GalleryBlockDefinition {
  type: GalleryTypeId;
  name: string;
  variants: GalleryVariant[];
  render: (node: GalleryBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: GalleryBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register gallery definitions via helpers below.

// ===== Presets (kept close to gallery code) =====

const gridGalleryPresets: GalleryBlockPreset[] = [
  {
    id: "preset:gallery.gridgallery:default:portfolio-showcase",
    type: "gallery.gridgallery",
    variant: "default",
    name: "Portfolio Showcase",
    description: "Standard gallery layout for showcasing work and projects",
    props: {
      content: {
        badge: "Portfolio",
        title: "Our Latest Work",
        description: "Explore our diverse collection of projects and creative solutions that showcase our expertise and innovation.",
        buttonText: "View All Projects",
        categories: [
          { id: "all", name: "All Work", count: 12 },
          { id: "web", name: "Web Design", count: 4 },
          { id: "mobile", name: "Mobile Apps", count: 3 },
          { id: "branding", name: "Branding", count: 5 }
        ],
        items: [
          {
            id: "1",
            title: "E-Commerce Platform",
            description: "Modern shopping experience with seamless checkout",
            image: { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "E-commerce platform screenshot" },
            category: "web",
            tags: ["React", "Node.js", "Stripe"]
          },
          {
            id: "2",
            title: "Fitness Mobile App",
            description: "Track workouts and nutrition with personalized plans",
            image: { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Fitness app interface" },
            category: "mobile",
            tags: ["React Native", "HealthKit", "Firebase"]
          },
          {
            id: "3",
            title: "Restaurant Brand Identity",
            description: "Complete brand overhaul with modern, clean design",
            image: { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Restaurant branding materials" },
            category: "branding",
            tags: ["Logo Design", "Brand Guidelines", "Packaging"]
          },
          {
            id: "4",
            title: "Travel Website",
            description: "Beautiful travel destination showcase with booking integration",
            image: { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Travel website design" },
            category: "web",
            tags: ["Vue.js", "CMS", "Booking API"]
          },
          {
            id: "5",
            title: "Corporate Mobile App",
            description: "Internal communication and productivity tool",
            image: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Corporate app dashboard" },
            category: "mobile",
            tags: ["Flutter", "Corporate", "Dashboard"]
          },
          {
            id: "6",
            title: "Coffee Shop Branding",
            description: "Cozy, inviting brand identity for local café",
            image: { src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Coffee shop branding" },
            category: "branding",
            tags: ["Coffee", "Local Business", "Signage"]
          }
        ]
      },
      useContainer: true,
      cols: "1-2-3"
    },
    version: 1
  }
];

const splitGalleryPresets: GalleryBlockPreset[] = [
  {
    id: "preset:gallery.splitgallery:featured:product-showcase",
    type: "gallery.splitgallery",
    variant: "featured",
    name: "Product Showcase",
    description: "Split gallery layout highlighting featured products or images",
    props: {
      content: {
        badge: "Featured Work",
        title: "Showcase of Excellence",
        description: "Discover our carefully curated selection of standout projects and creative solutions that demonstrate our commitment to quality and innovation.",
        primaryButtonText: "Explore Gallery",
        secondaryButtonText: "Learn More",
        featuredImage: {
          src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          alt: "Featured project showcase"
        },
        galleryItems: [
          {
            id: "1",
            title: "Modern Workspace Design",
            description: "Collaborative office environment design",
            image: { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Modern workspace" },
            category: "Architecture"
          },
          {
            id: "2",
            title: "Product Photography",
            description: "High-quality product shots for e-commerce",
            image: { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Product photography" },
            category: "Photography"
          },
          {
            id: "3",
            title: "Digital Art Collection",
            description: "Contemporary digital artwork series",
            image: { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Digital art" },
            category: "Digital Art"
          },
          {
            id: "4",
            title: "Urban Photography",
            description: "Cityscape and urban environment photography",
            image: { src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Urban photography" },
            category: "Photography"
          }
        ]
      },
      useContainer: true,
      leftMedia: true
    },
    version: 1
  }
];

// ===== Definitions =====

const gridGalleryDef: GalleryBlockDefinition = {
  type: "gallery.gridgallery",
  name: "Grid Gallery",
  variants: ["default", "masonry", "filterable"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    return createElement(GridGallery as any, {
      variant: (variant as any) || "default",
      ...props
    });
  },
  presets: gridGalleryPresets
};

const splitGalleryDef: GalleryBlockDefinition = {
  type: "gallery.splitgallery",
  name: "Split Gallery",
  variants: ["featured", "portfolio", "product"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(SplitGallery as any, {
      variant: (variant as any) || "featured",
      ...props
    });
  },
  presets: splitGalleryPresets
};

export const registerGalleryBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridGalleryDef as any);
  registry.register(splitGalleryDef as any);
  return registry;
};

export const createGalleryRegistry = () => {
  const r = createBlocksRegistry();
  return registerGalleryBlocks(r);
};
