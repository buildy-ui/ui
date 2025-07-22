import { Check } from "lucide-react";
import { Badge } from "@ui8kit/core";

type Content = {
  badge: string;
  title: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
};

const content: Content = {
  badge: "Open Source",
  title: "Beautiful Components for Your Next Project",
  description: "Elevate your application with stunning, customizable UI elements built with Radix UI and Tailwind CSS.",
  features: [
  {
    title: "Radix UI Integration",
    description: "Harness the power of Radix UI's robust component library for seamless integration into your project."
  },
  {
    title: "Tailwind CSS Styling",
    description: "Utilize Tailwind CSS for effortless customization and rapid development of your UI components."
  },
  {
    title: "Free and Open Source",
    description: "Access these beautifully crafted components absolutely free, perfect for both personal and commercial projects."
  }]

} as const;

type FeaturesSplitMediaProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const FeaturesSplitMedia = (props: FeaturesSplitMediaProps) => {
  const { badge, title, description, features } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-16 lg:py-32">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
        <div className="flex gap-2 flex-col">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">{badge}</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="max-w-2xl text-3xl font-bold text-left">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl text-left">
                {description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-4">
            {features?.map((feature, index) =>
              <div key={`${feature.title}-${index}`} className="flex flex-row gap-4 items-start">
                <Check className="w-4 h-4 text-primary" />
                <div className="flex flex-col gap-2">
                  <p>{feature.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
              )}
          </div>
        </div>
        <div className="bg-muted rounded-md aspect-square"></div>
        </div>
      </div>
    </section>);

};