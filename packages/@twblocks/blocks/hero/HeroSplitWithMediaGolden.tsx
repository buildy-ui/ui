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
  { id: "button2", text: "View Demo", variant: "outline" }],

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
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full flex flex-col">
            <h2 className="text-4xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="text-lg">
              {description}
            </p>
            <div className="flex gap-4">
              {buttons?.map((button) =>
              <Button key={button.id} variant={button.variant} size="lg" className={button.className}>
                  {button.text}
                </Button>
              )}
            </div>
          </div>
          
          <div className="w-full">
            <div className="rounded-xl">
              <img
                src={image.src}
                alt={image.alt}
                className={`${image.className} w-full h-full object-cover`} />

            </div>
          </div>
        </div>
      </div>
    </section>);

};