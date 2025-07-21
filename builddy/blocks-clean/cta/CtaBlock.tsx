import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface CtaBlockProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    secondaryButtonText?: string;
  };
}

export default function CtaBlock({ content }: CtaBlockProps) {

  return (
    <section className="px-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute rounded-full" />
        <div className="absolute rounded-full" />
        <div className="absolute rounded-full" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Limited Time Offer</span>
        </div>
        
        <h2 className="text-3xl font-bold leading-tight">
          {content.title}
        </h2>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 h-auto bg-accent-foreground text-accent rounded-lg shadow-xl">
            
            {content.buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {content.secondaryButtonText &&
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 h-auto hover:text-accent-foreground rounded-lg">
            
              {content.secondaryButtonText}
            </Button>
          }
        </div>
        
        <div className="text-sm">
          No credit card required • Cancel anytime • 30-day money back guarantee
        </div>
      </div>
    </section>);

}

export const ctaTemplate = {
  id: "ctaCtaBlock",
  name: "Call to Action",
  description: "Drive conversions with compelling CTAs",
  component: CtaBlock,
  defaultContent: {
    title: "Ready to Get Started?",
    subtitle: "Join thousands of satisfied customers",
    buttonText: "Start Free Trial",
    secondaryButtonText: "Learn More"
  }
};