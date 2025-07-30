import { SplitPost, type SplitPostData } from "./SplitPost";

// Sample post data
const samplePostData: SplitPostData = {
  title: "Mastering React Performance Optimization",
  subtitle: "Learn advanced techniques to make your React applications lightning fast",
  excerpt: "Discover proven strategies for optimizing React applications, from component memoization to bundle splitting and everything in between.",
  author: {
    name: "Alex Thompson",
    role: "Senior React Developer",
    bio: "Alex has been working with React for over 6 years and has helped optimize performance for applications serving millions of users."
  },
  meta: {
    category: "Development",
    readTime: "10 min read",
    publishedDate: "March 20, 2024",
    views: "4.2K",
    likes: "298",
    comments: "45"
  },
  image: {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    alt: "Developer working on React code optimization"
  },
  tags: ["React", "Performance", "JavaScript", "Optimization", "Frontend"],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" }
  ],
  relatedLinks: [
    { title: "React Hooks Best Practices", href: "/blog/react-hooks" },
    { title: "State Management Patterns", href: "/blog/state-management" },
    { title: "Modern JavaScript Techniques", href: "/blog/modern-js" }
  ]
};

// ===== SPLIT POST EXAMPLES =====

// 1. Standard Split Post
export const SplitPostStandardExample = () => {
  return (
    <SplitPost
      content={samplePostData}
      variant="standard"
      leftMedia={false}
      py="xl"
    />
  );
};

// 2. Author-Focused Split Post
export const SplitPostAuthorExample = () => {
  const authorData: SplitPostData = {
    ...samplePostData,
    title: "Design Systems That Scale: Lessons from Industry Leaders",
    excerpt: "Building design systems that can grow with your organization while maintaining consistency and usability across all touchpoints.",
    author: {
      name: "Maria Garcia",
      role: "Design Systems Lead",
      bio: "Maria has led design system initiatives at three Fortune 500 companies and is passionate about creating scalable, accessible design solutions."
    },
    meta: {
      ...samplePostData.meta,
      category: "Design Systems",
      readTime: "15 min read"
    },
    image: {
      src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Design system components and style guide"
    }
  };

  return (
    <SplitPost
      content={authorData}
      variant="author"
      leftMedia={true}
      py="xl"
    />
  );
};

// 3. Media-Focused Split Post
export const SplitPostMediaExample = () => {
  const mediaData: SplitPostData = {
    ...samplePostData,
    title: "The Visual Guide to CSS Grid Layout",
    subtitle: "Master CSS Grid with interactive examples and real-world use cases",
    meta: {
      ...samplePostData.meta,
      category: "CSS",
      readTime: "6 min read"
    },
    image: {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "CSS Grid layout visualization and code examples"
    },
    tags: ["CSS", "Grid", "Layout", "Frontend", "Tutorial"]
  };

  return (
    <SplitPost
      content={mediaData}
      variant="media"
      leftMedia={false}
      py="lg"
    />
  );
};

// 4. Sidebar Split Post
export const SplitPostSidebarExample = () => {
  const sidebarData: SplitPostData = {
    ...samplePostData,
    title: "Building Accessible Web Applications",
    author: {
      name: "Jennifer Kim",
      role: "Accessibility Engineer"
    },
    meta: {
      ...samplePostData.meta,
      category: "Accessibility",
      readTime: "12 min read"
    },
    image: {
      src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Accessibility testing tools and screen reader"
    },
    relatedLinks: [
      { title: "WCAG Guidelines Explained", href: "/blog/wcag-guidelines" },
      { title: "Screen Reader Testing", href: "/blog/screen-reader-testing" },
      { title: "Color Contrast Best Practices", href: "/blog/color-contrast" },
      { title: "Keyboard Navigation Patterns", href: "/blog/keyboard-navigation" }
    ]
  };

  return (
    <SplitPost
      content={sidebarData}
      variant="sidebar"
      leftMedia={true}
      py="xl"
    />
  );
};

// 5. Hero Split Post
export const SplitPostHeroExample = () => {
  const heroData: SplitPostData = {
    ...samplePostData,
    title: "The Complete Guide to Modern JavaScript",
    subtitle: "Everything you need to know about ES2024 features and beyond",
    author: {
      name: "Michael Chen",
      role: "JavaScript Architect & Technical Writer"
    },
    meta: {
      ...samplePostData.meta,
      category: "JavaScript",
      readTime: "20 min read",
      views: "15.7K",
      likes: "1.2K",
      comments: "89"
    },
    image: {
      src: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Modern JavaScript development environment with code editor"
    },
    tags: ["JavaScript", "ES2024", "Modern JS", "Programming", "Tutorial"]
  };

  return (
    <SplitPost
      content={heroData}
      variant="hero"
      leftMedia={false}
      py="xl"
      className="bg-gradient-to-r from-primary/5 to-secondary/5"
    />
  );
};

// Export all examples
export const splitPostExamples = {
  standard: SplitPostStandardExample,
  author: SplitPostAuthorExample,
  media: SplitPostMediaExample,
  sidebar: SplitPostSidebarExample,
  hero: SplitPostHeroExample
};