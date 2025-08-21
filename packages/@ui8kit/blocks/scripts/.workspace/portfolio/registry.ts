import { createElement } from "react";
import type { ReactNode } from "react";
import { GridPortfolio } from "./GridPortfolio";
import { SplitPortfolio } from "./SplitPortfolio";
import { createBlocksRegistry } from "../registry";
import { Eye, ExternalLink, Github, Calendar, User, Award } from "lucide-react";

// Shared portfolio types
export type PortfolioTypeId = "portfolio.gridportfolio" | "portfolio.splitportfolio";

export type PortfolioVariant = string;

export interface PortfolioBlockNode {
  id?: string;
  type: PortfolioTypeId;
  variant?: PortfolioVariant;
  props?: Record<string, any>;
  slots?: Record<string, PortfolioBlockNode[] | PortfolioBlockNode | undefined>;
}

export interface PortfolioBlockPreset {
  id: string;
  type: PortfolioTypeId;
  variant?: PortfolioVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface PortfolioBlockDefinition {
  type: PortfolioTypeId;
  name: string;
  variants: PortfolioVariant[];
  render: (node: PortfolioBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: PortfolioBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register portfolio definitions via helpers below.

// ===== Presets (kept close to portfolio code) =====

const gridPortfolioPresets: PortfolioBlockPreset[] = [
  {
    id: "preset:portfolio.gridportfolio:default:work-showcase",
    type: "portfolio.gridportfolio",
    variant: "default",
    name: "Work Showcase",
    description: "Standard portfolio grid showcasing projects and work",
    props: {
      content: {
        badge: "Our Work",
        title: "Featured Projects",
        description: "Explore our diverse portfolio of successful projects that demonstrate our expertise across various industries and technologies.",
        buttonText: "View All Projects",
        categories: [
          { id: "all", name: "All Projects", count: 8 },
          { id: "web", name: "Web Development", count: 3 },
          { id: "mobile", name: "Mobile Apps", count: 2 },
          { id: "design", name: "Design", count: 3 }
        ],
        projects: [
          {
            id: "1",
            title: "E-Commerce Platform Redesign",
            description: "Complete overhaul of a legacy e-commerce platform resulting in 40% increase in conversion rate",
            image: { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "E-commerce platform" },
            category: "web",
            tags: ["React", "Node.js", "Stripe"],
            client: "Fashion Retail Co.",
            date: "2024",
            link: "#",
            github: "https://github.com/example/project1"
          },
          {
            id: "2",
            title: "Fitness Tracking App",
            description: "Cross-platform mobile app for fitness tracking with social features and personalized workout plans",
            image: { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Fitness tracking app" },
            category: "mobile",
            tags: ["React Native", "Firebase", "HealthKit"],
            client: "FitLife Inc.",
            date: "2024",
            link: "#",
            github: "#"
          },
          {
            id: "3",
            title: "Brand Identity System",
            description: "Complete brand identity design including logo, typography, color palette, and brand guidelines",
            image: { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Brand identity materials" },
            category: "design",
            tags: ["Logo Design", "Brand Guidelines", "Typography"],
            client: "Creative Studio",
            date: "2023",
            link: "#",
            github: "#"
          },
          {
            id: "4",
            title: "Real Estate Platform",
            description: "Modern real estate platform with advanced search, virtual tours, and mortgage calculator",
            image: { src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Real estate platform" },
            category: "web",
            tags: ["Vue.js", "Laravel", "Maps API"],
            client: "Property Solutions",
            date: "2023",
            link: "#",
            github: "https://github.com/example/project4"
          },
          {
            id: "5",
            title: "Restaurant Mobile App",
            description: "Native mobile app for restaurant ordering, reservations, and loyalty program",
            image: { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Restaurant mobile app" },
            category: "mobile",
            tags: ["Flutter", "Firebase", "Payment Gateway"],
            client: "Foodie Chain",
            date: "2023",
            link: "#",
            github: "#"
          },
          {
            id: "6",
            title: "Corporate Website Redesign",
            description: "Modern, responsive website with improved user experience and conversion optimization",
            image: { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Corporate website" },
            category: "web",
            tags: ["Next.js", "Tailwind CSS", "SEO"],
            client: "Tech Corp",
            date: "2023",
            link: "#",
            github: "https://github.com/example/project6"
          }
        ]
      },
      useContainer: true,
      cols: "1-2-3"
    },
    version: 1
  }
];

const splitPortfolioPresets: PortfolioBlockPreset[] = [
  {
    id: "preset:portfolio.splitportfolio:featured:project-spotlight",
    type: "portfolio.splitportfolio",
    variant: "featured",
    name: "Project Spotlight",
    description: "Split portfolio layout highlighting a featured project",
    props: {
      content: {
        badge: "Featured Project",
        title: "Revolutionary E-Commerce Solution",
        description: "A groundbreaking e-commerce platform that transformed how users shop online, featuring AI-powered recommendations and seamless checkout experience.",
        primaryButtonText: "View Project",
        secondaryButtonText: "View Portfolio",
        featuredProject: {
          title: "NextGen Shopping Platform",
          description: "Complete e-commerce solution with advanced features including AI product recommendations, one-click checkout, and real-time inventory management.",
          image: { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "E-commerce platform" },
          tags: ["React", "Node.js", "MongoDB", "Stripe"],
          client: "RetailTech Solutions",
          date: "2024",
          link: "#",
          github: "https://github.com/example/nextgen-shopping",
          highlights: [
            "40% increase in conversion rate",
            "60% faster page load times",
            "AI-powered product recommendations",
            "Seamless mobile checkout experience"
          ]
        },
        relatedProjects: [
          {
            id: "1",
            title: "Mobile Commerce App",
            description: "Companion mobile app for seamless shopping experience",
            image: { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Mobile commerce app" },
            tags: ["React Native", "Firebase"]
          },
          {
            id: "2",
            title: "Analytics Dashboard",
            description: "Real-time analytics and insights platform",
            image: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Analytics dashboard" },
            tags: ["Vue.js", "D3.js", "Python"]
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

const gridPortfolioDef: PortfolioBlockDefinition = {
  type: "portfolio.gridportfolio",
  name: "Grid Portfolio",
  variants: ["default", "detailed", "minimal"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    return createElement(GridPortfolio as any, {
      variant: (variant as any) || "default",
      ...props
    });
  },
  presets: gridPortfolioPresets
};

const splitPortfolioDef: PortfolioBlockDefinition = {
  type: "portfolio.splitportfolio",
  name: "Split Portfolio",
  variants: ["featured", "detailed", "minimal"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(SplitPortfolio as any, {
      variant: (variant as any) || "featured",
      ...props
    });
  },
  presets: splitPortfolioPresets
};

export const registerPortfolioBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridPortfolioDef as any);
  registry.register(splitPortfolioDef as any);
  return registry;
};

export const createPortfolioRegistry = () => {
  const r = createBlocksRegistry();
  return registerPortfolioBlocks(r);
};
