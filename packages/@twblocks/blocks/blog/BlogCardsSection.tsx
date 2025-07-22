import { MoveRight } from "lucide-react";
import { Button, type ButtonProps } from "@ui8kit/core";

type Content = {
  title: string;
  button?: (ButtonProps & {
    text?: string;
    icon?: React.ReactNode;
  });
  articles: {
    id: string;
    title: string;
    description: string;
    imageAlt: string;
    image: string;
  }[];
};

const content: Content = {
  title: "Latest articles",
  button: {
    text: "View all articles",
    icon: <MoveRight className="w-4 h-4" />
  },
  articles: [
  {
    id: "1",
    title: "Exploring the Future of Web Design",
    description: "Discover how emerging technologies are reshaping the digital landscape.",
    imageAlt: "Future of Web Design",
    image: "https://placehold.co/600x400?text=Future+of+Web+Design"
  },
  {
    id: "2",
    title: "10 Essential UI Design Trends for 2025",
    description: "Stay ahead of the curve with these cutting-edge design principles.",
    imageAlt: "UI Design Trends",
    image: "https://placehold.co/600x400?text=UI+Design+Trends"
  },
  {
    id: "3",
    title: "Mastering React: Advanced Techniques for Building Scalable Apps",
    description: "Learn how to optimize your React applications for better performance and maintainability.",
    imageAlt: "React Advanced Techniques",
    image: "https://placehold.co/600x400?text=React+Advanced+Techniques"
  }]

} as const;

type BlogCardsSectionProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const BlogCardsSection = (props: BlogCardsSectionProps) => {
  const { title, articles, button } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-16 lg:py-32">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
        <h2 className="text-3xl font-bold">
          {title}
        </h2>
        {button &&
            <Button className="gap-4">
            {button.text} {button.icon}
          </Button>
            }
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles?.map((article) =>
            <article id={article.id} key={article.id} className="flex flex-col gap-4">
            <img
                src={article.image}
                alt={article.imageAlt}
                className="object-cover rounded-md" />
            <h3 className="text-xl tracking-tight">{article.title}</h3>
            <p className="text-muted-foreground text-base">
              {article.description}
            </p>
          </article>
            )}
        </div>
      </div>
      </div>
    </section>);

};