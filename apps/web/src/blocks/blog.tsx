import { BlogCardsSection } from "@ui8kit/blocks/blog/BlogCardsSection";
import { BlogPostsGridSection } from "@ui8kit/blocks/blog/BlogPostsGridSection";

const blogCardsContent = {
  badge: "Our Blog",
  title: "Latest Articles",
  description: "Stay up to date with the latest news and insights from our team.",
  posts: [
    {
      id: "post1",
      title: "Getting Started with React",
      description: "Learn the fundamentals of React and build your first application.",
      author: "John Doe",
      date: "Dec 15, 2023",
      readTime: "5 min read",
      image: {
        src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "React Development"
      },
      category: "Development"
    },
    {
      id: "post2",
      title: "Building Modern UIs",
      description: "Explore modern UI patterns and design principles for web applications.",
      author: "Jane Smith",
      date: "Dec 12, 2023",
      readTime: "8 min read",
      image: {
        src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "UI Design"
      },
      category: "Design"
    },
    {
      id: "post3",
      title: "Performance Optimization",
      description: "Tips and techniques to optimize your web application performance.",
      author: "Mike Johnson",
      date: "Dec 10, 2023",
      readTime: "6 min read",
      image: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Performance"
      },
      category: "Performance"
    }
  ]
};

const blogPostsGridContent = {
  badge: "Blog",
  title: "Latest from our blog",
  description: "Discover insights, tutorials, and updates from our team.",
  buttonText: "View all posts",
  posts: [
    {
      id: "post1",
      title: "Building Scalable Applications",
      description: "Learn best practices for building applications that can handle growth and scale effectively.",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      },
      date: "Dec 18, 2023",
      readTime: "7 min read",
      image: {
        src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Scalable Applications"
      },
      category: "Development"
    },
    {
      id: "post2",
      title: "The Future of Web Development",
      description: "Exploring emerging trends and technologies that will shape the future of web development.",
      author: {
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      },
      date: "Dec 16, 2023",
      readTime: "5 min read",
      image: {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Future of Web Development"
      },
      category: "Technology"
    },
    {
      id: "post3",
      title: "Design Systems at Scale",
      description: "How to create and maintain design systems that work across large organizations.",
      author: {
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      },
      date: "Dec 14, 2023",
      readTime: "9 min read",
      image: {
        src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Design Systems"
      },
      category: "Design"
    }
  ]
};

function BlogBlocks() {
  return (
    <div>
      <BlogCardsSection content={blogCardsContent} />
      <BlogPostsGridSection content={blogPostsGridContent} />
    </div>
  );
}

export default BlogBlocks;