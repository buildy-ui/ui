import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CallToActionSectionProps {
  content: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
}

export default function CallToActionSection({ content }: CallToActionSectionProps) {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid w-full rounded-lg bg-accent p-8">
          <div className="">
            <h2 className="text-2xl font-semibold text-foreground">
              {content.title}
            </h2>
            <p className="text-muted-foreground">
              {content.description}
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" className="w-full border-border text-foreground">
              {content.primaryButtonText} <ArrowRight />
            </Button>
            <Button variant="default" className="w-full bg-primary text-primary-foreground">
              {content.secondaryButtonText} <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>);

}

export const callToActionSectionTemplate = {
  id: "ctaCallToActionSection",
  name: "Call To Action Section",
  description: "Call to action section with buttons",
  component: CallToActionSection,
  defaultContent: {
    title: "Transform Your Business Today",
    description: "Unlock powerful solutions that drive growth, efficiency, and innovation for your organization.",
    primaryButtonText: "Explore Solutions",
    secondaryButtonText: "Start Your Journey"
  }
};