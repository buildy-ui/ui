import { cn } from "@ui8kit/core";
import { BookOpen, Github } from "lucide-react";
import { Badge, type BadgeProps, Button, type ButtonProps } from "@ui8kit/core";

export type HeroButtonProps = ButtonProps & {
  id: string;
  text: string;
  icon?: React.ReactNode;
  href?: string;
  external?: boolean;
};

type Content = {
  badge?: BadgeProps & {
    text: string;
  };
  title: string;
  description: string;
  buttons?: HeroButtonProps[];
  images: {
    grid: {
      className: string;
      items: Array<{
        id: string;
        src: string;
        className: string;
      }>;
    };
  };
};

const content: Content = {
  badge: {
    text: "We're building",
    variant: "outline",
    className: "text-sm font-medium"
  },
  title: "Build with shadcn ui components",
  description: "Beautifully designed components built with Radix UI and Tailwind CSS. Open source and free to use in your applications.",
  buttons: [
  {
    id: "button1",
    text: "Documentation",
    variant: "default",
    size: "lg",
    className: "items-center gap-2",
    icon: <BookOpen />
  },
  {
    id: "button2",
    text: "GitHub",
    variant: "outline",
    size: "lg",
    className: "items-center gap-2",
    icon: <Github />
  }],

  images: {
    grid: {
      className: "grid grid-cols-2 gap-8",
      items: [
      {
        id: "image1",
        src: "https://placehold.co/600x400",
        className: "bg-muted rounded-md aspect-square"
      },
      {
        id: "image2",
        src: "https://placehold.co/600x400",
        className: "bg-muted rounded-md row-span-2"
      },
      {
        id: "image3",
        src: "https://placehold.co/320x320",
        className: "bg-muted rounded-md aspect-square"
      }]

    }
  }
} as const;

const HeroButton = ({ href, external, text, icon, ...buttonProps }: HeroButtonProps) => {
  if (!href) {
    return (
      <Button {...buttonProps}>
        {text} {icon}
      </Button>);

  }

  if (external) {
    return (
      <Button
        asChild
        {...buttonProps}>
        
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer">
          
          {text} {icon}
        </a>
      </Button>);

  }

  return (
    <Button
      asChild
      {...buttonProps}>
      
      {text} {icon}
    </Button>);

};

type HeroSplitWithGalleryProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const HeroSplitWithGallery = ({
  className,
  ...sectionProps
}: HeroSplitWithGalleryProps) => {
  const {
    badge,
    title,
    description,
    buttons,
    images
  } = {
    ...content,
    ...sectionProps
  };

  return (
    <section
      className={cn(
        "w-full py-16 lg:py-32",
        className
      )}
      {...sectionProps}>
      
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="flex gap-4 flex-col">
            {badge &&
            <div className="flex">
                <Badge variant={badge.variant} className={badge.className}>
                  {badge.text}
                </Badge>
              </div>
            }
            <div className="flex gap-4 flex-col">
              <h2 className="max-w-2xl text-3xl font-bold">
                {title}
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl">
                {description}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {buttons?.map((button) =>
              <HeroButton
                key={button.id}
                {...button} />

              )}
            </div>
          </div>
          <div className={cn(
            "grid grid-cols-2 gap-8",
            images.grid.className
          )}>
            {images.grid.items?.map((image) =>
            <div
              key={image.id}
              className={cn(
                "relative overflow-hidden",
                image.className
              )}>
              
                <img
                src={image.src}
                alt={image.id}
                className={cn(
                  "w-full h-full object-cover",
                  image.className
                )} />
              
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};