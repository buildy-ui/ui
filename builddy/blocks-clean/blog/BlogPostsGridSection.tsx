import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPostsGridSectionProps {
  content: {
    tagline: string;
    title: string;
    description: string;
    button: {
      name: string;
      variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    };
    posts: Array<{
      title: string;
      summary: string;
      label: string;
      author: string;
      published: string;
      href: string;
      image: string;
    }>;
  };
}

export default function BlogPostsGridSection({ content }: BlogPostsGridSectionProps) {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8 flex flex-col text-center text-foreground">
        <header className="max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-xs font-medium text-muted-foreground">
            {content.tagline}
          </p>
          <h2 className="text-3xl font-bold">
            {content.title}
          </h2>
          <p className="text-muted-foreground">
            {content.description}
          </p>
          <Button variant={content.button.variant} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {content.button.name} <ArrowRight className="w-4 h-4" />
          </Button>
        </header>
        <div className="grid gap-6">
          {content.posts.map((post, index) =>
          <a href={post.href} className="flex flex-col rounded-lg border border-border bg-card"
          key={index}>
              <img
              src={post.image}
              alt={post.title}
              width={560}
              height={315}
              className="object-cover w-full h-auto"
              style={{ aspectRatio: '16/9' }} />
            
              <div className="flex flex-col gap-4 p-6 text-foreground">
                <h3 className="text-lg font-semibold">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {post.summary}
                </p>
                <p className="flex items-center text-sm font-medium text-primary">
                  Read more <ArrowRight className="ml-2 w-4 h-4" />
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>);

}

export const blogPostsGridSectionTemplate = {
  id: "blogPostsGridSection",
  name: "Blog Posts Grid Section",
  description: "Display blog posts in a grid layout",
  component: BlogPostsGridSection,
  defaultContent: {
    tagline: "Explore Insights",
    title: "Latest Blog Posts",
    description: "Stay updated with the latest trends, tips, and best practices in UI/UX design. Explore how Buildy/UI empowers developers and businesses alike.",
    button: {
      name: "All Posts",
      variant: "link"
    },
    posts: [
    {
      title: "The Power of Atomic Design in Modern UI/UX",
      summary: "Discover how atomic design principles can help you create consistent and scalable user interfaces for any application.",
      label: "Design Systems",
      author: "Jane Doe",
      published: "1 Jan 2025",
      href: "#",
      image: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=315&q=80"
    },
    {
      title: "Why Tailwind CSS is a Game Changer for Developers",
      summary: "Learn how utility-first CSS frameworks like Tailwind CSS streamline development without compromising on design.",
      label: "CSS Frameworks",
      author: "John Smith",
      published: "15 Jan 2025",
      href: "#",
      image: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=315&q=80"
    },
    {
      title: "Building Accessible Components with shadcn/ui",
      summary: "Explore the accessibility-first approach of shadcn/ui and how it ensures inclusivity for all users.",
      label: "Accessibility",
      author: "Alex Johnson",
      published: "22 Jan 2025",
      href: "#",
      image: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=315&q=80"
    }]

  }
};