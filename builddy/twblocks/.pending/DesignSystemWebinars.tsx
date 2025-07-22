import { ArrowRight } from "lucide-react";

type Content = {
  title: string;
  webinars: {
    id: string;
    title: string;
    summary: string;
    label: string;
    author: string;
    published: string;
    href: string;
    image: string;
  }[];
};

const content: Content = {
  title: "Discover Our Design System",
  webinars: [
    {
      id: "webinar-1",
      title: "Introduction to Buildy/UI: A Modern Design System",
      summary:
        "Learn how Buildy/UI empowers developers and designers to create efficient, accessible, and beautiful interfaces effortlessly.",
      label: "UI/UX Insights",
      author: "Alex Dev",
      published: "10 Feb 2024",
      href: "#",
      image: "https://placehold.co/1280x740?text=UI/UX+Insights",
    },
    {
      id: "webinar-2",
      title: "Advanced Prototyping with Buildy/UI",
      summary:
        "Explore advanced techniques for rapid prototyping and collaboration using our modular component library.",
      label: "Prototyping Techniques",
      author: "Jordan Smith",
      published: "15 Feb 2024",
      href: "#",
      image: "https://placehold.co/1280x740?text=Prototyping+Techniques",
    },
  ],
} as const;

type DesignSystemWebinarsProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const DesignSystemWebinars = (props: DesignSystemWebinarsProps) => {
  const { title, webinars } = {
    ...content,
    ...props
  };

  return (
  <section className="w-full py-16 lg:py-32">
    <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-12">
      {/* Section header */}
      <header className="text-center py-8 lg:py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {title}
        </h2>
      </header>
      {/* Webinars grid */}
      <div className="grid gap-8 sm:grid-cols-12 lg:gap-10">
        {webinars?.map((webinar) => (
          <a
            key={webinar.id}
            href={webinar.href}
            className="group grid gap-y-4 sm:grid-cols-10 sm:gap-y-0 sm:gap-x-6 lg:gap-x-8 sm:col-span-12"
          >
            {/* Webinar content vertically centered */}
            <div className="sm:col-span-5 flex flex-col gap-4 justify-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground flex gap-4">
                <span>{webinar.label}</span>
                <span>{webinar.author}</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                {webinar.title}
              </h3>
              <p className="text-sm text-muted-foreground">{webinar.summary}</p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>Read more</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            {/* Webinar image */}
            <div className="sm:col-span-5">
              <div className="aspect-video overflow-hidden rounded-lg border border-border">
                <img
                  src={webinar.image}
                  alt={webinar.title}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </div>
          </a>
        ))}
        </div>
      </div>
    </section>
  );
};