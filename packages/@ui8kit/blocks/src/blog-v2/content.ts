import type { BlogData } from "./types";

// Default content for different blog variants
export const blogContent = {
  // Grid variants
  cards: {
    badge: "Blog",
    title: "Latest Articles & Insights",
    description: "Stay updated with our latest thoughts, tutorials, and industry insights. Discover new perspectives and practical knowledge to help you grow.",
    buttonText: "View All Posts",
    posts: [
      {
        id: "1",
        title: "Building Scalable React Applications",
        description: "Learn the best practices for building React applications that can scale with your business needs.",
        author: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 15, 2023",
        readTime: "5 min read",
        image: {
          src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "React development"
        },
        category: "Development",
        categoryId: "development"
      },
      {
        id: "2",
        title: "The Future of Web Design",
        description: "Exploring upcoming trends and technologies that will shape the future of web design and user experience.",
        author: {
          name: "Mike Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 12, 2023",
        readTime: "7 min read",
        image: {
          src: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "Web design trends"
        },
        category: "Design",
        categoryId: "design"
      },
      {
        id: "3",
        title: "Optimizing Performance for Modern Apps",
        description: "Essential techniques and tools for optimizing the performance of modern web applications.",
        author: {
          name: "Emma Rodriguez",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 10, 2023",
        readTime: "6 min read",
        image: {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "Performance optimization"
        },
        category: "Performance",
        categoryId: "performance"
      }
    ]
  },

  filtered: {
    badge: "Categories",
    title: "Explore by Topic",
    description: "Browse our articles by category to find exactly what you're looking for. From technical tutorials to design inspiration.",
    categories: [
      { id: "all", name: "All Posts" },
      { id: "development", name: "Development" },
      { id: "design", name: "Design" },
      { id: "performance", name: "Performance" },
      { id: "tutorials", name: "Tutorials" }
    ],
    posts: [
      {
        id: "1",
        title: "Building Scalable React Applications",
        description: "Learn the best practices for building React applications that can scale with your business needs.",
        author: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 15, 2023",
        readTime: "5 min read",
        image: {
          src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "React development"
        },
        category: "Development",
        categoryId: "development"
      },
      {
        id: "2",
        title: "The Future of Web Design",
        description: "Exploring upcoming trends and technologies that will shape the future of web design and user experience.",
        author: {
          name: "Mike Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 12, 2023",
        readTime: "7 min read",
        image: {
          src: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "Web design trends"
        },
        category: "Design",
        categoryId: "design"
      }
    ]
  },

  // Split variants
  news: {
    badge: "Latest News",
    title: "Stay Updated with Industry News",
    description: "Get the latest updates and insights from the world of technology and design.",
    featuredPost: {
      id: "featured",
      title: "Revolutionary Changes in Web Development",
      description: "Discover the groundbreaking technologies and methodologies that are transforming how we build web applications.",
      author: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      },
      date: "Dec 18, 2023",
      readTime: "8 min read",
      image: {
        src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Web development revolution"
      },
      category: "Technology",
      categoryId: "technology"
    },
    posts: [
      {
        id: "1",
        title: "Building Scalable React Applications",
        description: "Learn the best practices for building React applications that can scale with your business needs.",
        author: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 15, 2023",
        readTime: "5 min read",
        image: {
          src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "React development"
        },
        category: "Development",
        categoryId: "development"
      },
      {
        id: "2",
        title: "The Future of Web Design",
        description: "Exploring upcoming trends and technologies that will shape the future of web design and user experience.",
        author: {
          name: "Mike Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 12, 2023",
        readTime: "7 min read",
        image: {
          src: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "Web design trends"
        },
        category: "Design",
        categoryId: "design"
      }
    ]
  },

  newsletter: {
    badge: "Newsletter",
    title: "Subscribe to Our Newsletter",
    description: "Get weekly updates with the latest articles, tutorials, and industry insights delivered directly to your inbox.",
    posts: [
      {
        id: "1",
        title: "Building Scalable React Applications",
        description: "Learn the best practices for building React applications that can scale with your business needs.",
        author: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        date: "Dec 15, 2023",
        readTime: "5 min read",
        category: "Development",
        categoryId: "development"
      }
    ]
  }
} satisfies Record<string, BlogData>;