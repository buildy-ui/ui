import { CenteredPost, type CenteredPostData } from "./CenteredPost";

// Sample post data
const samplePostData: CenteredPostData = {
  title: "The Future of Web Development: Trends to Watch in 2024",
  subtitle: "Exploring the latest innovations and technologies that will shape how we build web applications in the coming year.",
  excerpt: "From AI-powered development tools to advanced CSS features, discover the key trends that every developer should know about.",
  author: {
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    bio: "Sarah is a passionate web developer with over 8 years of experience building modern web applications. She specializes in React and TypeScript."
  },
  meta: {
    category: "Technology",
    readTime: "8 min read",
    publishedDate: "March 15, 2024",
    views: "2.5K",
    likes: "184",
    comments: "23"
  },
  image: {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    alt: "Modern web development workspace with multiple monitors showing code"
  },
  tags: ["Web Development", "JavaScript", "React", "TypeScript", "Frontend"],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Technology", href: "/blog/technology" }
  ]
};

// ===== CENTERED POST EXAMPLES =====

// 1. Classic Post Header
export const CenteredPostClassicExample = () => {
  const content: CenteredPostData = {...samplePostData}
  return (
    <CenteredPost
      content={content}
      variant="classic"
    />
  );
};

// 2. Minimal Post Header
export const CenteredPostMinimalExample = () => {
  const content: CenteredPostData = {
    ...samplePostData,
    title: "Minimalist Design Principles for Modern Interfaces",
    subtitle: undefined, // No subtitle for minimal variant
    excerpt: undefined
  };

  return (
    <CenteredPost
      content={content}
      variant="minimal"
    />
  );
};

// 3. Magazine Post Header
export const CenteredPostMagazineExample = () => {
  const content: CenteredPostData = {
    ...samplePostData,
    title: "The Art of Digital Storytelling",
    excerpt: "How modern brands are using interactive media and immersive experiences to connect with their audiences in meaningful ways.",
    author: {
      name: "David Chen",
      role: "Creative Director & UX Designer"
    },
    meta: {
      ...samplePostData.meta,
      category: "Design"
    }
  };

  return (
    <CenteredPost
      content={content}
      variant="magazine"
    />
  );
};

// 4. Featured Post Header
export const CenteredPostFeaturedExample = () => {
  const content: CenteredPostData = {
    ...samplePostData,
    title: "Building Scalable Applications with Microservices",
    subtitle: "A comprehensive guide to architecting distributed systems that can handle millions of users while maintaining performance and reliability.",
    image: {
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Server infrastructure and cloud computing visualization"
    },
    meta: {
      ...samplePostData.meta,
      category: "Architecture",
      views: "12.8K",
      likes: "892",
      comments: "156"
    }
  };

  return (
    <CenteredPost
      content={content}
      variant="featured"
      className="bg-gradient-to-b from-muted/30 to-background"
    />
  );
};

// 5. Editorial Post Header
export const CenteredPostEditorialExample = () => {
  const content: CenteredPostData = {
    ...samplePostData,
    title: "The Philosophy of Code: Writing Software as Literature",
    subtitle: "Exploring the intersection between programming and creative writing, and how we can craft code that tells a story.",
    author: {
      name: "Dr. Emily Rodriguez",
      role: "Computer Science Professor & Author"
    },
    meta: {
      ...samplePostData.meta,
      category: "Philosophy",
      readTime: "12 min read"
    },
    image: {
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      alt: "Vintage typewriter with programming books in background"
    }
  };

  return (
    <CenteredPost
      content={content}
      variant="editorial"
    />
  );
};

// Export all examples
// classic, minimal, magazine, featured, editorial
export const centeredPostExamples = {
  classic: CenteredPostClassicExample,
  minimal: CenteredPostMinimalExample,
  magazine: CenteredPostMagazineExample,
  featured: CenteredPostFeaturedExample,
  editorial: CenteredPostEditorialExample
};