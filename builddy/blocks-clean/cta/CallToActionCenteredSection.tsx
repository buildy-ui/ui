import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CallToActionCenteredSectionProps {
  content: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
}

export default function CallToActionCenteredSection({ content }: CallToActionCenteredSectionProps) {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center rounded-lg bg-accent p-8">
          <div className="">
            <h2 className="text-2xl font-semibold text-foreground">
              {content.title}
            </h2>
            <p className="text-muted-foreground">
              {content.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="w-full">
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

export const callToActionCenteredSectionTemplate = {
  id: "ctaCallToActionCenteredSection",
  name: "Call To Action Centered Section",
  description: "Centered call to action section with buttons",
  component: CallToActionCenteredSection,
  defaultContent: {
    title: "Unlock Your Business Potential",
    description: "Discover innovative solutions that drive growth, efficiency, and transformative success for your organization.",
    primaryButtonText: "Explore Solutions",
    secondaryButtonText: "Start Your Journey"
  }
};