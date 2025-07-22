import { Badge } from "@ui8kit/core";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import responsiveImage from "@/assets/img/strategy.svg";
import intuitiveImage from "@/assets/img/strategy.svg";
import aiImage from "@/assets/img/strategy.svg";

type Content = {
  title: string;
  promotitle: string;
  description: string;
  features: {
    title: string;
    description: string;
    image: string;
  }[];
  featureList: string[];
};

const content: Content = {
  promotitle: "Powerful",
  title: "Features",
  description:
  "Explore the core features of Buildy/UI designed to accelerate your development process and deliver seamless user experiences.",
  features: [
  {
    title: "Responsive Design",
    description:
    "Create interfaces that adapt perfectly to any device with minimal effort.",
    image: responsiveImage
  },
  {
    title: "Intuitive User Interface",
    description:
    "Build clean, accessible, and intuitive interfaces with pre-designed components.",
    image: intuitiveImage
  },
  {
    title: "AI-Powered Insights",
    description:
    "Enhance your workflow with intelligent suggestions and prebuilt patterns.",
    image: aiImage
  }] as
  Content['features'],
  featureList: [
  "Dark/Light Theme",
  "Reviews",
  "Feature Highlights",
  "Pricing",
  "Contact Form",
  "Our Team",
  "Responsive Design",
  "Newsletter",
  "Minimalist Design"]

} as const;

type PromoFeatureListProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const PromoFeatureList = (props: PromoFeatureListProps) => {
  const { promotitle, title, description, features, featureList } = {
    ...content,
    ...props
  };

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-32 space-y-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold">
          <span className="">
          {promotitle}{" "}
          </span>
          {title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-4">
        {featureList?.map((feature) =>
        <Badge key={feature} variant="secondary" className="text-sm">
            {feature}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features?.map(({ title, description, image }) =>
        <div
          key={title}
          className="relative rounded-2xl">
          
          <Card className="flex flex-col bg-secondary h-full rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{description}</p>
            </CardContent>
            <CardFooter className="">
              <img
                src={image}
                alt={title}
                className="mx-auto" />
              
            </CardFooter>
          </Card>
          </div>
        )}
      </div>
    </section>);

};