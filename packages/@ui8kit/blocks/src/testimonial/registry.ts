import { createElement } from "react";
import type { ReactNode } from "react";
import { GridTestimonial } from "./GridTestimonial";
import { SplitTestimonial } from "./SplitTestimonial";
import { createBlocksRegistry } from "../registry";
import { Star, Quote, User, Award, CheckCircle, MessageSquare, Users, ThumbsUp, Shield, Verified } from "lucide-react";

// Shared testimonial types
export type TestimonialTypeId = "testimonial.gridtestimonial" | "testimonial.splittestimonial";

export type TestimonialVariant = string;

export interface TestimonialBlockNode {
  id?: string;
  type: TestimonialTypeId;
  variant?: TestimonialVariant;
  props?: Record<string, any>;
  slots?: Record<string, TestimonialBlockNode[] | TestimonialBlockNode | undefined>;
}

export interface TestimonialBlockPreset {
  id: string;
  type: TestimonialTypeId;
  variant?: TestimonialVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface TestimonialBlockDefinition {
  type: TestimonialTypeId;
  name: string;
  variants: TestimonialVariant[];
  render: (node: TestimonialBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: TestimonialBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register testimonial definitions via helpers below.

// ===== Presets (kept close to testimonial code) =====

const gridTestimonialPresets: TestimonialBlockPreset[] = [
  {
    id: "preset:testimonial.gridtestimonial:default:customer-reviews",
    type: "testimonial.gridtestimonial",
    variant: "default",
    name: "Customer Reviews",
    description: "Grid layout showcasing customer testimonials and reviews",
    props: {
      content: {
        badge: "Customer Reviews",
        title: "What Our Customers Say About Us",
        description: "Don't just take our word for it. Here's what real customers have to say about their experience working with our team and using our platform.",
        buttonText: "Read More Reviews",
        testimonials: [
          {
            id: "1",
            quote: "This platform completely transformed how we manage our projects. The intuitive interface and powerful features have increased our team's productivity by 40%.",
            author: {
              name: "Sarah Johnson",
              role: "Product Manager",
              company: "TechCorp Solutions",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            rating: 5,
            verified: true,
            featured: true
          },
          {
            id: "2",
            quote: "Outstanding support team and incredibly robust features. We've tried many solutions, but this one stands out for its reliability and ease of use.",
            author: {
              name: "Michael Chen",
              role: "CTO",
              company: "StartupXYZ",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            rating: 5,
            verified: true,
            featured: false
          },
          {
            id: "3",
            quote: "The analytics and reporting capabilities are exactly what we needed. Made data-driven decisions so much easier for our entire organization.",
            author: {
              name: "Emma Davis",
              role: "Data Analyst",
              company: "Analytics Pro",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            rating: 5,
            verified: true,
            featured: false
          },
          {
            id: "4",
            quote: "Implementation was smooth, and the ROI was immediate. This is exactly the kind of solution that delivers on its promises.",
            author: {
              name: "Alex Rodriguez",
              role: "Operations Director",
              company: "Global Enterprises",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            rating: 5,
            verified: true,
            featured: false
          },
          {
            id: "5",
            quote: "Customer support is exceptional. Every question gets answered quickly, and the team genuinely cares about our success.",
            author: {
              name: "Lisa Wang",
              role: "VP of Customer Success",
              company: "ServiceFirst Ltd.",
              avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            rating: 5,
            verified: true,
            featured: false
          },
          {
            id: "6",
            quote: "We've seen a 60% reduction in administrative work since implementing this solution. Game-changing for our business operations.",
            author: {
              name: "David Kim",
              role: "CEO",
              company: "EfficientBiz Corp",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            rating: 5,
            verified: true,
            featured: false
          }
        ]
      },
      useContainer: true,
      cols: "1-2-3"
    },
    version: 1
  }
];

const splitTestimonialPresets: TestimonialBlockPreset[] = [
  {
    id: "preset:testimonial.splittestimonial:featured:customer-spotlight",
    type: "testimonial.splittestimonial",
    variant: "featured",
    name: "Customer Spotlight",
    description: "Split layout featuring a highlighted customer testimonial",
    props: {
      content: {
        badge: "Customer Spotlight",
        title: "How We Helped TechCorp Solutions Scale",
        description: "Discover how TechCorp Solutions transformed their business operations and achieved remarkable growth with our platform.",
        primaryButtonText: "View Case Study",
        secondaryButtonText: "All Testimonials",
        featuredTestimonial: {
          quote: "Working with this team has been transformative for our business. Their strategic insights and implementation expertise helped us increase revenue by 300% in just 18 months. The platform's capabilities exceeded all our expectations.",
          author: {
            name: "Sarah Johnson",
            role: "Product Manager",
            company: "TechCorp Solutions",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          },
          rating: 5,
          verified: true,
          achievements: [
            "300% revenue increase in 18 months",
            "50% reduction in operational costs",
            "Improved team productivity by 40%",
            "Enhanced customer satisfaction scores"
          ]
        },
        companyInfo: {
          name: "TechCorp Solutions",
          industry: "SaaS Technology",
          size: "150 employees",
          location: "San Francisco, CA",
          partnership: "Since 2022"
        },
        stats: [
          {
            id: "1",
            value: "300%",
            label: "Revenue Growth",
            description: "Achieved in 18 months"
          },
          {
            id: "2",
            value: "40%",
            label: "Productivity Increase",
            description: "Team efficiency improvement"
          },
          {
            id: "3",
            value: "50%",
            label: "Cost Reduction",
            description: "Operational savings"
          }
        ],
        relatedTestimonials: [
          {
            id: "1",
            quote: "The analytics dashboard alone saved us countless hours each week.",
            author: {
              name: "Michael Chen",
              role: "CTO",
              company: "StartupXYZ"
            },
            rating: 5
          },
          {
            id: "2",
            quote: "Implementation was seamless and support was outstanding.",
            author: {
              name: "Emma Davis",
              role: "Data Analyst",
              company: "Analytics Pro"
            },
            rating: 5
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

const gridTestimonialDef: TestimonialBlockDefinition = {
  type: "testimonial.gridtestimonial",
  name: "Grid Testimonial",
  variants: ["default", "detailed", "minimal"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    return createElement(GridTestimonial as any, {
      variant: (variant as any) || "default",
      ...props
    });
  },
  presets: gridTestimonialPresets
};

const splitTestimonialDef: TestimonialBlockDefinition = {
  type: "testimonial.splittestimonial",
  name: "Split Testimonial",
  variants: ["featured", "detailed", "minimal"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(SplitTestimonial as any, {
      variant: (variant as any) || "featured",
      ...props
    });
  },
  presets: splitTestimonialPresets
};

export const registerTestimonialBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridTestimonialDef as any);
  registry.register(splitTestimonialDef as any);
  return registry;
};

export const createTestimonialRegistry = () => {
  const r = createBlocksRegistry();
  return registerTestimonialBlocks(r);
};
