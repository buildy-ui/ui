import type { HeroData } from "./types";

// Default content for different hero variants
export const heroContent = {
  splitMedia: {
    badge: "New Release",
    title: "Build the future with modern technology",
    description: "Transform your ideas into reality with our cutting-edge platform. Experience unparalleled performance, security, and scalability that grows with your business.",
    image: {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Modern technology dashboard"
    },
    primaryButtonText: "Get Started Free",
    secondaryButtonText: "View Demo"
  },

  splitLeftMedia: {
    badge: "Developer Tools", 
    title: "Code faster, deploy smarter, scale better",
    description: "Our comprehensive developer platform provides everything you need to build, test, and deploy applications with confidence. Join thousands of developers who trust our tools.",
    image: {
      src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Developer coding environment"
    },
    primaryButtonText: "Start Building",
    secondaryButtonText: "Documentation"
  },

  splitGallery: {
    badge: "Portfolio",
    title: "Showcase your work beautifully", 
    description: "Create stunning portfolios and galleries that captivate your audience. Our platform makes it easy to present your work in the best possible light.",
    images: [
      {
        id: "1",
        src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 1"
      },
      {
        id: "2",
        src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
        alt: "Portfolio showcase 2"
      }
    ],
    primaryButtonText: "Explore Gallery",
    secondaryButtonText: "Learn More"
  },

  centeredSimple: {
    badge: "Welcome",
    title: "The future of work is here",
    description: "Transform the way your team collaborates with our innovative platform. Built for modern teams who demand flexibility, security, and performance.",
    primaryButtonText: "Get Started Free",
    secondaryButtonText: "Watch Demo"
  },

  centeredWithStats: {
    badge: "Trusted Globally",
    title: "Join millions who trust our platform",
    description: "Our growing community of users worldwide relies on our platform to achieve their goals. See why businesses of all sizes choose us as their trusted partner.",
    stats: [
      { id: "1", value: "2M+", label: "Active Users" },
      { id: "2", value: "150+", label: "Countries" },
      { id: "3", value: "99.9%", label: "Uptime" }
    ],
    primaryButtonText: "Join Community",
    secondaryButtonText: "View Testimonials"
  }
} satisfies Record<string, HeroData>;