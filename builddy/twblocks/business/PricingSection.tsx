import { ArrowRight, CircleCheck } from "lucide-react";
import { Button, type ButtonProps } from "@ui8kit/core";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from
"@ui8kit/core";

type Content = {
  title: string;
  description: string;
  plans: {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string[];
    buttonText: string;
    buttonVariant: ButtonProps['variant'];
  }[];
};

const content: Content = {
  title: "Pricing",
  description: "Choose the perfect plan for your needs, whether you're an individual or a team.",
  plans: [
  {
    id: "free",
    name: "Free",
    description: "Ideal for personal use and exploring the basics of our design system.",
    price: "$0",
    features: [
    "Access to all free components",
    "Basic support",
    "Community access"],

    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Perfect for professionals looking for advanced features.",
    price: "$249",
    features: [
    "Everything in Free",
    "Premium component library",
    "Priority support",
    "Early access to new features"],

    buttonText: "Get Premium",
    buttonVariant: "default"
  },
  {
    id: "team",
    name: "Team",
    description: "Tailored for teams seeking collaborative tools.",
    price: "$459",
    features: [
    "Everything in Premium",
    "Team collaboration tools",
    "Dedicated support",
    "Custom component requests"],

    buttonText: "Get Team Plan",
    buttonVariant: "default"
  }]

} as const;

type PricingSectionProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const PricingSection = (props: PricingSectionProps) => {
  const { title, description, plans } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-16 lg:py-32 bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto flex flex-col items-center gap-6 text-center">
          <header className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {description}
            </p>
          </header>
        <div className="flex flex-col items-stretch gap-6 md:flex-row">
          {plans?.map((plan) =>
            <Card key={plan.id} className="flex flex-col justify-between text-left">
              <CardHeader>
                <CardTitle>
                  <p>{plan.name}</p>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <span className="text-4xl font-bold">{plan.price}</span>
              </CardHeader>
              <CardContent>
                <hr className="my-4" />
                <ul className="">
                  {plan.features.map((feature, index) =>
                  <li key={index} className="flex items-center gap-2">
                      <CircleCheck className="w-4 h-4" />
                      <span>{feature}</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="">
                <Button className="w-full" variant={plan.buttonVariant}>
                  {plan.buttonText}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
            )}
          </div>
        </div>
      </div>
    </section>);

};