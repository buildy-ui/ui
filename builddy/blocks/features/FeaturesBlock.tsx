import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesBlockProps {
  content: {
    title: string;
    subtitle: string;
    features: Feature[];
  };
}

export default function FeaturesBlock({ content }: FeaturesBlockProps) {

  return (
    <section className="px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            {content.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features.map((feature: Feature, index: number) =>
          <Card
            key={index}
            className="group border border-border bg-card rounded-lg">
            
              <CardContent className="p-8 text-center">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>);

}

export const featuresBlockTemplate = {
  id: "featuresFeaturesBlock",
  name: "Features Grid",
  description: "Showcase key features",
  component: FeaturesBlock,
  defaultContent: {
    title: "Powerful Features",
    subtitle: "Everything you need to build amazing landing pages",
    features: [
    {
      icon: "🚀",
      title: "Fast Performance",
      description: "Lightning-fast loading times with optimized code"
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description: "Professional templates and customizable themes"
    },
    {
      icon: "📱",
      title: "Mobile Ready",
      description: "Fully responsive design that works on all devices"
    }]

  }
};