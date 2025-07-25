import { Button, type ButtonProps } from "@ui8kit/core";
import { ArrowRight } from "lucide-react";

type Content = {
  title: string;
  description: string;
  buttons: (ButtonProps & {
    id: string;
    text: string;
    icon?: React.ReactNode;
  })[];
};

const content: Content = {
  title: "Unlock Your Business Potential",
  description: "Discover innovative solutions that drive growth, efficiency, and transformative success for your organization.",
  buttons: [
  {
    id: "learn-more",
    text: "Explore Solutions",
    variant: "outline",
    icon: <ArrowRight />
  },
  {
    id: "get-started",
    text: "Start Your Journey",
    variant: "default",
    icon: <ArrowRight />
  }]

} as const;

type CallToActionCenteredSectionProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const CallToActionCenteredSection = (props: CallToActionCenteredSectionProps) => {
  const { title, description, buttons } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-16 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center rounded-lg bg-accent gap-8 py-16 px-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {title}
            </h2>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {buttons.map((button) =>
            <Button
              key={button.id}
              variant={button.variant}
              className="w-full">
              
                {button.text}
                {button.icon}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>);

};