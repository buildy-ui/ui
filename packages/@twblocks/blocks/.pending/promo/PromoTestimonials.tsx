import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle } from
"@/components/ui/card";

type Content = {
  title: string;
  promotitle: string;
  subtitle: string;
  description: string;
  testimonials: {
    image: string;
    name: string;
    userName: string;
    comment: string;
  }[];
};

const content = {
  title: "Why Developers Love",
  promotitle: "Buildy/UI",
  subtitle: "This - Freedom to Create",
  description:
  "Buildy/UI empowers developers with clean, unopinionated components, perfectly suited for marketing and business projects. No unnecessary styles, shadows, or gradients – just pure components ready to adapt to your vision.",

  testimonials: [
  {
    image: "https://github.com/shadcn.png",
    name: "Sophia Lee",
    userName: "@sophia_uiux",
    comment:
    "With Buildy/UI, I finally have a design system that doesn't dictate my style. The components are clean, consistent, and free from clutter – a perfect foundation for creativity!"
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Daniel Chen",
    userName: "@daniel_frontend",
    comment:
    "Other libraries forced me to strip out shadows and gradients manually. Buildy/UI gave me pure components, making my work faster and cleaner. I can focus on building, not fixing!"
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Olivia Brown",
    userName: "@olivia_dev",
    comment:
    "The components are lightweight and perfectly structured. It's like prototyping but production-ready. Plus, the integration with Radix UI is a game-changer for accessibility!"
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Ethan Smith",
    userName: "@ethan_code",
    comment:
    "Finally, a free library of components tailored for business and marketing. Buildy/UI components saved me hours of development time and delivered consistent results!"
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Liam Carter",
    userName: "@liam_creative",
    comment:
    "Buildy/UI strips away unnecessary fluff. The components are minimal, versatile, and incredibly easy to customize. It's the freedom every designer and developer needs!"
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Emily Johnson",
    userName: "@emily_builder",
    comment:
    "This library is a breath of fresh air. Simple, consistent, and clean components with zero unnecessary styling. Buildy/UI truly feels like a developer's dream toolkit!"
  }]

} as const;

type PromoTestimonialsProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const PromoTestimonials = (props: PromoTestimonialsProps) => {
  const { title, promotitle, subtitle, description, testimonials } = {
    ...content,
    ...props
  };

  return (
    <section className="mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-16">
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          {title}{" "}
          <span className="">
            {promotitle}
          </span>
        </h2>
        <h3 className="text-muted-foreground text-2xl font-bold py-8">
          {subtitle}
        </h3>
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      </header>

      <div className="grid md:grid-cols-2 mx-auto space-y-4">
        {testimonials?.map(
          ({ image, name, userName, comment }) =>
          <div
            key={name}
            className="relative rounded-2xl">
            
              <Card
              className="bg-secondary h-full rounded-2xl">
              
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage
                    alt=""
                    src={image} />
                  
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>{userName}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent>{comment}</CardContent>
              </Card>
            </div>

        )}
      </div>
    </section>);

};