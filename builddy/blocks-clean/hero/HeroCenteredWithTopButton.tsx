import { ArrowUpRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroCenteredWithTopButtonProps {
  content: {
    topButtonText: string;
    title: string;
    description: string;
    mainButtonText: string;
  };
}

export default function HeroCenteredWithTopButton({ content }: HeroCenteredWithTopButtonProps) {
  return (
    <section className="w-full bg-accent">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <Button variant="outline" size="sm" className="text-sm">
            {content.topButtonText} <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">
            {content.title}
          </h1>
          
          <p className="text-muted-foreground">
            {content.description}
          </p>
          
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {content.mainButtonText} <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>);

}

export const heroCenteredWithTopButtonTemplate = {
  id: "heroCenteredWithTopButton",
  name: "Hero Centered With Top Button",
  description: "Centered hero section with a top button",
  component: HeroCenteredWithTopButton,
  defaultContent: {
    topButtonText: "New Feature",
    title: "Discover the Power of BuildY",
    description: "Our platform is designed to enhance your productivity and streamline your workflows.",
    mainButtonText: "Start Building"
  }
};