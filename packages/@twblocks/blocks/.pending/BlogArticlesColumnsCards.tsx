import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@ui8kit/core";

type Content = {
  title: string;
  description: string;
  articles: {
    id: string;
    category: string;
    author: {
      name: string;
      avatar: string;
    };
    headline: string;
    description: string;
    className: string;
  }[];
};

const content: Content = {
  title: "Latest Articles",
  description:
  "Exploring the Future of Web Design Trends.",
  articles: [
  {
    id: "article1",
    category: "News",
    author: {
      name: "John Johnsen",
      avatar: "https://github.com/shadcn.png"
    },
    headline: "Streamline Your Business with Buildy/UI",
    description:
    "Simplify your operations and improve productivity with modern tools designed for SMBs.",
    className: "md:col-span-2"
  },
  {
    id: "article2",
    category: "News",
    author: {
      name: "John Johnsen",
      avatar: "https://github.com/shadcn.png"
    },
    headline: "Enhance Supplier Management",
    description:
    "Discover efficient methods to manage supplier relationships and invoices.",
    className: ""
  },
  {
    id: "article3",
    category: "News",
    author: {
      name: "John Johnsen",
      avatar: "https://github.com/shadcn.png"
    },
    headline: "Boost Your Marketing with Buildy/UI",
    description:
    "Learn how to leverage our design system to create impactful marketing strategies.",
    className: ""
  }]

} as const;

type BlogArticlesColumnsCardsProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const BlogArticlesColumnsCards = (props: BlogArticlesColumnsCardsProps) => {
  const { title, description, articles } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-8 lg:py-16">
    <div className="mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold max-w-xl">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles?.map((article) =>
          <article
            key={article.id}
            className={`flex flex-col gap-4 hover:opacity-75 cursor-pointer ${article.className}`}>
            
            <div className="bg-muted rounded-md"></div>
            <div className="flex flex-row gap-4 items-center">
              <Badge>{article.category}</Badge>
              <p className="flex flex-row gap-2 text-sm items-center">
                <span className="text-muted-foreground">By</span>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={article.author.avatar} />
                  <AvatarFallback>
                    {article.author.name[0] + article.author.name.split(" ")[1][0]}
                  </AvatarFallback>
                </Avatar>
                <span>{article.author.name}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl tracking-tight">
                {article.headline}
              </h3>
              <p className="text-muted-foreground text-base">
                {article.description}
              </p>
            </div>
          </article>
          )}
        </div>
      </div>
    </section>);

};