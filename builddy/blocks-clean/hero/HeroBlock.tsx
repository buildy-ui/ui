import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroBlockProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundImage: string;
  };
}

export default function HeroBlock({ content }: HeroBlockProps) {

  return (
    <section className="relative flex items-center justify-center bg-background">
      {/* Background Image - priority loading for LCP */}
      <img
        src={content.backgroundImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover object-center"
        width={1920}
        height={1080}
        loading="eager"
        decoding="sync"
        fetchPriority="high" />
      
      <div className="absolute inset-0" />
      
      {/* Content */}
      <div className="relative text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold leading-tight">
          {content.title}
        </h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xl">
            
            {content.buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 h-auto rounded-lg">
            
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>);

}

export const heroTemplate = {
  id: "hero",
  name: "Hero Section",
  description: "Eye-catching header with CTA",
  component: HeroBlock,
  defaultContent: {
    title: "Build Something Amazing",
    subtitle: "Create stunning landing pages with our professional page builder",
    buttonText: "Get Started",
    backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=75"
  }
};