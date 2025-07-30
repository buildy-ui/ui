import { GridBlog, type GridBlogData } from "./GridBlog";

// Sample blog posts data
const samplePosts = [
  {
    id: "1",
    title: "Getting Started with React 18 and Concurrent Features",
    description: "Learn how to leverage React 18's new concurrent features to build faster, more responsive applications with better user experience.",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c5f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 15, 2024",
    readTime: "8 min read",
    image: {
      src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "React development"
    },
    category: "React",
    categoryId: "react"
  },
  {
    id: "2",
    title: "Building Scalable APIs with Node.js and TypeScript",
    description: "A comprehensive guide to creating robust, type-safe APIs that can handle enterprise-level traffic and complexity.",
    author: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 12, 2024",
    readTime: "12 min read",
    image: {
      src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Node.js development"
    },
    category: "Backend",
    categoryId: "backend"
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox: When to Use Each Layout Method",
    description: "Understanding the differences between CSS Grid and Flexbox, and knowing when to use each for optimal web layouts.",
    author: {
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 10, 2024",
    readTime: "6 min read",
    image: {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "CSS layout design"
    },
    category: "CSS",
    categoryId: "css"
  },
  {
    id: "4",
    title: "Database Design Patterns for Modern Applications",
    description: "Explore essential database design patterns that will help you build efficient, maintainable data layers for your applications.",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 8, 2024",
    readTime: "10 min read",
    image: {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Database design"
    },
    category: "Database",
    categoryId: "database"
  },
  {
    id: "5",
    title: "Advanced Git Workflows for Team Collaboration",
    description: "Master advanced Git techniques and workflows that will streamline your team's development process and reduce conflicts.",
    author: {
      name: "Lisa Johnson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 5, 2024",
    readTime: "7 min read",
    image: {
      src: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Git workflow"
    },
    category: "DevOps",
    categoryId: "devops"
  },
  {
    id: "6",
    title: "Mobile-First Design Principles and Best Practices",
    description: "Learn how to design and develop applications with a mobile-first approach for better user experience across all devices.",
    author: {
      name: "Alex Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    date: "Mar 3, 2024",
    readTime: "9 min read",
    image: {
      src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Mobile design"
    },
    category: "Design",
    categoryId: "design"
  }
];

const sampleCategories = [
  { id: "react", name: "React" },
  { id: "backend", name: "Backend" },
  { id: "css", name: "CSS" },
  { id: "database", name: "Database" },
  { id: "devops", name: "DevOps" },
  { id: "design", name: "Design" }
];

// ===== GRID BLOG EXAMPLES =====

// 1. Blog cards grid
export const GridBlogCardsExample = () => {
  const content: GridBlogData = {
    badge: "Latest Posts",
    title: "Discover our latest insights",
    description: "Stay up-to-date with the latest trends, tutorials, and best practices in web development and design.",
    posts: samplePosts
  };

  return (
    <GridBlog
      content={content}
      variant="cards"
      cols="1-2-3"
      gap="xl"
      py="xl"
    />
  );
};

// 2. Posts grid with action button
export const GridBlogPostsGridExample = () => {
  const content: GridBlogData = {
    badge: "Blog",
    title: "Expert insights and tutorials",
    description: "Learn from industry experts and level up your development skills with our comprehensive guides and tutorials.",
    buttonText: "View All Posts",
    posts: samplePosts
  };

  return (
    <GridBlog
      content={content}
      variant="postsGrid"
      cols="1-2-3"
      gap="lg"
      py="lg"
    />
  );
};

// 3. Filtered blog grid
export const GridBlogFilteredExample = () => {
  const content: GridBlogData = {
    badge: "Topics",
    title: "Browse by category",
    description: "Find articles that match your interests. Filter by technology, framework, or topic to discover relevant content.",
    categories: sampleCategories,
    posts: samplePosts
  };

  return (
    <GridBlog
      content={content}
      variant="filtered"
      cols="1-2-3"
      gap="lg"
      py="xl"
      showFilters={true}
    />
  );
};

// 4. Compact blog list
export const GridBlogCompactExample = () => {
  const content: GridBlogData = {
    badge: "Recent",
    title: "Latest updates",
    description: "Quick access to our most recent articles and updates. Perfect for staying current with the latest developments.",
    posts: samplePosts.slice(0, 4)
  };

  return (
    <GridBlog
      content={content}
      variant="compact"
      cols="1"
      gap="sm"
      py="lg"
      useContainer={true}
    />
  );
};

// 5. Featured blog grid
export const GridBlogFeaturedExample = () => {
  const content: GridBlogData = {
    badge: "Featured",
    title: "Editor's picks and trending articles",
    description: "Our most popular and impactful articles, carefully selected by our editorial team for maximum value.",
    posts: samplePosts
  };

  return (
    <GridBlog
      content={content}
      variant="featured"
      cols="1-2-3"
      gap="md"
      py="xl"
      className="bg-gradient-to-b from-muted/30 to-background"
    />
  );
};

// Export all examples
export const gridBlogExamples = {
  cards: GridBlogCardsExample,
  postsGrid: GridBlogPostsGridExample,
  filtered: GridBlogFilteredExample,
  compact: GridBlogCompactExample,
  featured: GridBlogFeaturedExample
};