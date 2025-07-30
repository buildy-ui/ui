import { 
  Code,
  Palette,
  Camera,
  Monitor,
  Smartphone,
  Globe,
  Award,
  Briefcase,
  User,
  Calendar
} from "lucide-react";
import { GridPortfolio, type GridPortfolioData } from "./GridPortfolio";

// Sample portfolio data
const sampleProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Modern online shopping platform with advanced filtering, payment integration, and real-time inventory management. Built with React, Node.js, and PostgreSQL.",
    image: {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "E-Commerce Platform Screenshot"
    },
    tags: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    category: "Web Development",
    client: "TechCorp Inc",
    year: "2024",
    status: "featured" as const,
    links: {
      live: "https://example.com",
      github: "https://github.com/example",
      case_study: "https://example.com/case-study"
    },
    stats: {
      views: "2.5K",
      likes: "180",
      duration: "3 months"
    },
    lucideIcon: Monitor
  },
  {
    id: "2",
    title: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial analytics dashboard.",
    image: {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Mobile Banking App Design"
    },
    tags: ["React Native", "Firebase", "Biometrics", "Charts"],
    category: "Mobile Development",
    client: "FinanceFlow",
    year: "2024",
    status: "completed" as const,
    links: {
      live: "https://example.com",
      case_study: "https://example.com/case-study"
    },
    stats: {
      views: "1.8K",
      likes: "145",
      duration: "4 months"
    },
    lucideIcon: Smartphone
  },
  {
    id: "3",
    title: "Brand Identity Design",
    description: "Complete brand identity package including logo design, color palette, typography system, and brand guidelines for a sustainable fashion startup.",
    image: {
      src: "https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Brand Identity Design Showcase"
    },
    tags: ["Branding", "Logo Design", "Figma", "Illustrator"],
    category: "Design",
    client: "EcoWear",
    year: "2023",
    status: "completed" as const,
    links: {
      live: "https://example.com"
    },
    stats: {
      views: "3.2K",
      likes: "220",
      duration: "2 months"
    },
    lucideIcon: Palette
  },
  {
    id: "4",
    title: "Photography Portfolio",
    description: "Minimalist photography portfolio website with custom gallery layouts, image optimization, and integrated booking system for client inquiries.",
    image: {
      src: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Photography Portfolio Website"
    },
    tags: ["Next.js", "Sanity CMS", "Cloudinary", "Framer Motion"],
    category: "Web Development",
    client: "Sarah Mitchell Photography",
    year: "2023",
    status: "completed" as const,
    links: {
      live: "https://example.com",
      github: "https://github.com/example"
    },
    stats: {
      views: "1.5K",
      likes: "98",
      duration: "6 weeks"
    },
    lucideIcon: Camera
  },
  {
    id: "5",
    title: "SaaS Dashboard",
    description: "Comprehensive analytics dashboard for SaaS businesses with real-time metrics, user management, and advanced reporting capabilities.",
    image: {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "SaaS Dashboard Interface"
    },
    tags: ["Vue.js", "D3.js", "Python", "Docker", "Redis"],
    category: "Web Development",
    client: "DataInsights Pro",
    year: "2024",
    status: "in-progress" as const,
    links: {
      live: "https://example.com"
    },
    stats: {
      views: "900",
      likes: "67",
      duration: "5 months"
    },
    lucideIcon: Code
  },
  {
    id: "6",
    title: "Restaurant Website",
    description: "Modern restaurant website with online reservation system, menu management, and integration with food delivery platforms.",
    image: {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Restaurant Website Design"
    },
    tags: ["WordPress", "PHP", "MySQL", "OpenTable API"],
    category: "Web Development",
    client: "Bella Vista Restaurant",
    year: "2023",
    status: "completed" as const,
    links: {
      live: "https://example.com"
    },
    stats: {
      views: "1.2K",
      likes: "89",
      duration: "8 weeks"
    },
    lucideIcon: Globe
  }
];

const sampleCategories = [
  { id: "web", name: "Web Development", lucideIcon: Monitor },
  { id: "mobile", name: "Mobile Development", lucideIcon: Smartphone },
  { id: "design", name: "Design", lucideIcon: Palette },
  { id: "photography", name: "Photography", lucideIcon: Camera },
  { id: "branding", name: "Branding", lucideIcon: Award }
];

// ===== GRID PORTFOLIO EXAMPLES =====

// 1. Portfolio Cards Grid
export const GridPortfolioCardsExample = () => {
  const content: GridPortfolioData = {
    badge: "Portfolio",
    title: "Featured Projects",
    description: "A showcase of my recent work across web development, mobile apps, and design projects.",
    projects: sampleProjects
  };

  return (
    <GridPortfolio
      content={content}
      variant="cards"
      cols="1-2-3"
      gap="lg"
      py="xl"
    />
  );
};

// 2. Masonry Portfolio Grid
export const GridPortfolioMasonryExample = () => {
  const content: GridPortfolioData = {
    badge: "Creative Work",
    title: "Visual Portfolio",
    description: "Explore my creative projects with a focus on visual storytelling and innovative design solutions.",
    projects: sampleProjects,
    categories: sampleCategories
  };

  return (
    <GridPortfolio
      content={content}
      variant="masonry"
      cols="1-2-3"
      gap="md"
      py="xl"
      className="bg-gradient-to-b from-muted/30 to-background"
    />
  );
};

// 3. Minimal Portfolio Grid
export const GridPortfolioMinimalExample = () => {
  const content: GridPortfolioData = {
    badge: "Selected Works",
    title: "Clean & Simple",
    description: "A minimalist approach to showcasing quality work with focus on clean design and functionality.",
    projects: sampleProjects.slice(0, 8)
  };

  return (
    <GridPortfolio
      content={content}
      variant="minimal"
      cols="1-2-4"
      gap="lg"
      py="lg"
    />
  );
};

// 4. Detailed Portfolio Grid
export const GridPortfolioDetailedExample = () => {
  const content: GridPortfolioData = {
    badge: "Case Studies",
    title: "Detailed Project Showcase",
    description: "In-depth look at my projects with comprehensive details, client information, and project outcomes.",
    buttonText: "View All Projects",
    projects: sampleProjects,
    categories: sampleCategories,
    showFilters: true
  };

  return (
    <GridPortfolio
      content={content}
      variant="detailed"
      cols="1-2-3"
      gap="xl"
      py="xl"
    />
  );
};

// 5. Showcase Portfolio Grid
export const GridPortfolioShowcaseExample = () => {
  const content: GridPortfolioData = {
    badge: "Premium Work",
    title: "Award-Winning Projects",
    description: "Highlighting exceptional projects that have received recognition and delivered outstanding results for clients.",
    buttonText: "Start Your Project",
    projects: sampleProjects,
    categories: sampleCategories
  };

  return (
    <GridPortfolio
      content={content}
      variant="showcase"
      cols="1-2-4"
      gap="lg"
      py="xl"
      className="bg-gradient-to-r from-primary/5 to-secondary/5"
    />
  );
};

// Export all examples
export const gridPortfolioExamples = {
  cards: GridPortfolioCardsExample,
  masonry: GridPortfolioMasonryExample,
  minimal: GridPortfolioMinimalExample,
  detailed: GridPortfolioDetailedExample,
  showcase: GridPortfolioShowcaseExample
};