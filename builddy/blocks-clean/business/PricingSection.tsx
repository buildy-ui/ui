import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PricingSectionProps {
  content: {
    title: string;
    description: string;
    plans: Array<{
      id: string;
      name: string;
      description: string;
      price: string;
      features: Array<string>;
      buttonText: string;
      buttonVariant: string; // Ensured as string without ButtonProps
    }>;
  };
}

export default function PricingSection({ content }: PricingSectionProps) {
  const { title, description, plans } = content;
  return (
    <section className="w-full bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto flex flex-col items-center gap-6 text-center">
          <header className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {description}
            </p>
          </header>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans?.map((plan) =>
            <Card key={plan.id} className="flex flex-col justify-between text-left bg-card border border-border">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <span className="text-4xl font-bold">{plan.price}</span>
                </CardHeader>
                <CardContent>
                  <Separator className="" />
                  <ul className="">
                    {plan.features.map((feature, index) =>
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CircleCheck className="w-4 h-4" />
                        <span>{feature}</span>
                      </li>
                  )}
                  </ul>
                </CardContent>
                <CardFooter className="">
                  <Button className="w-full" variant={plan.buttonVariant as any}>
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

}

export const pricingSectionTemplate = {
  id: "businessPricingSection",
  name: "Pricing Section",
  description: "A section for displaying pricing plans",
  component: PricingSection,
  defaultContent: {
    title: "Pricing",
    description: "Choose the perfect plan for your needs.",
    plans: [
    {
      id: "free",
      name: "Free",
      description: "Ideal for personal use.",
      price: "$0",
      features: ["Access to all free components", "Basic support"],
      buttonText: "Get Started",
      buttonVariant: "outline"
    },
    {
      id: "premium",
      name: "Premium",
      description: "For professionals.",
      price: "$249",
      features: ["Everything in Free", "Premium support"],
      buttonText: "Get Premium",
      buttonVariant: "default"
    }]

  }
};