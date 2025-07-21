import { Button, type ButtonProps } from "@ui8kit/core";

type Content = {
  title: string;
  description: string;
  buttons?: (ButtonProps & {
    id: string;
    text: string;
    icon?: React.ReactNode;
  })[];
  image: {
    src: string;
    alt: string;
    className: string;
  };
};

const content: Content = {
  title: "Transform Your Workflow",
  description: "Streamline your development process with our powerful tools and components.",
  buttons: [
    { id: "button1", text: "Try Now", variant: "default" },
    { id: "button2", text: "View Demo", variant: "outline" }
  ],
  image: {
    src: "https://placehold.co/400/?text=Hero Image",
    alt: "Hero Image",
    className: "object-cover rounded-lg shadow-lg"
  }
} as const;

type HeroSplitWithMediaProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const HeroSplitWithMediaGolden = (props: HeroSplitWithMediaProps) => {
  const { title, description, buttons, image, className, ...rest } = {
    ...content,
    ...props
  };

  return (
    <section className={`py-16 ${className || ''}`} {...rest}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
          <div className="w-full md:w-5/13 lg:w-8/13 flex flex-col">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {description}
            </p>
            <div className="flex gap-4 mt-auto">
              {buttons?.map((button) =>
                <Button key={button.id} variant={button.variant} size="lg" className={button.className}>
                  {button.text}
                </Button>
              )}
            </div>
          </div>
          
          <div className="w-full">
            <div className="aspect-[1.618/1] overflow-hidden rounded-xl">
              <img 
                src={image.src} 
                alt={image.alt} 
                className={`${image.className} w-full h-full object-cover`} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};