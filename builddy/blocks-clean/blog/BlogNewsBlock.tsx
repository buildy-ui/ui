import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface Article {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

interface BlogNewsBlockProps {
  content: {
    title: string;
    subtitle: string;
    articles: Article[];
  };
}

export default function BlogNewsBlock({ content }: BlogNewsBlockProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            News & Updates
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">
            {content.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>
        
        <div className="grid gap-8">
          {content.articles.map((article: Article, index: number) =>
          <Card
            key={index}
            className="border border-border bg-card rounded-lg p-0">
            
              <div className="">
                <img
                src={article.image}
                alt={article.title}
                width={400}
                height={300}
                className="w-full h-auto object-cover transition-transform" />
              
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(article.date)}</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-primary font-medium">
                  Read more
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>);

}

export const blogNewsBlockTemplate = {
  id: "blogNewsBlock",
  name: "News & Updates",
  description: "Latest news and blog posts",
  component: BlogNewsBlock,
  defaultContent: {
    title: "Latest News",
    subtitle: "Stay updated with our latest announcements",
    articles: [
    {
      title: "New Features Released",
      excerpt: "We've added amazing new capabilities to help you build better.",
      date: "2025-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80"
    },
    {
      title: "Performance Updates",
      excerpt: "Experience faster loading times and smoother interactions.",
      date: "2025-01-10",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80"
    }]

  }
};