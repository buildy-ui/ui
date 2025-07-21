import { buttonVariants } from "@ui8kit/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Instagram, Linkedin } from "lucide-react";

type Content = {
  title: string;
  promotitle: string;
  description: string;
  teamList: {
    imageUrl: string;
    name: string;
    position: string;
    slogan: string;
    socialNetworks: { name: string; url: string }[];
  }[];
};

const content: Content = {
  title: "Meet Our",
  promotitle: "Team",
  description:
    "The Buildy/UI team is dedicated to delivering exceptional UI components with a focus on modern frontend stacks and seamless developer experience.",
  teamList: [
    {
      imageUrl: "https://avatars.githubusercontent.com/u/124599",
      name: "Sophia Lee",
      position: "UI/UX Designer",
      slogan: "Crafting beautiful and functional designs for seamless user experiences.",
      socialNetworks: [
        { name: "Linkedin", url: "#" },
        { name: "Facebook", url: "#" },
        { name: "Instagram", url: "#" },
      ],
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/124599",
      name: "Daniel Chen",
      position: "Frontend Developer",
      slogan: "Bringing ideas to life with clean and efficient code.",
      socialNetworks: [
        { name: "Linkedin", url: "#" },
        { name: "Facebook", url: "#" },
        { name: "Instagram", url: "#" },
      ],
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/124599",
      name: "Olivia Brown",
      position: "Programmer",
      slogan: "Ensuring performance and scalability in every component.",
      socialNetworks: [
        { name: "Linkedin", url: "#" },
        { name: "Instagram", url: "#" },
      ],
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/124599",
      name: "Ethan Smith",
      position: "Illustrator",
      slogan: "Transforming concepts into captivating visuals and graphics.",
      socialNetworks: [
        { name: "Linkedin", url: "#" },
        { name: "Facebook", url: "#" },
      ],
    },
  ] as Content['teamList'],
} as const;

type PromoTeamSectionProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const PromoTeamSection = (props: PromoTeamSectionProps) => {
  const { title, promotitle, description, teamList } = {
    ...content,
    ...props
  };

  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;
      case "Facebook":
        return <Facebook size="20" />;
      case "Instagram":
        return <Instagram size="20" />;
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-32">
      <header className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {title}{" "}
          <span className="bg-gradient-to-b from-sky-500 to-sky-700 text-transparent bg-clip-text">
          {promotitle}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
        {teamList?.map(({ imageUrl, name, position, slogan, socialNetworks }) => (
          <div
            key={name}
            className="relative p-[1px] bg-gradient-to-br from-sky-600 to-sky-300 dark:to-slate-600 rounded-2xl"
          >
            <Card
              className="bg-secondary h-full relative flex flex-col justify-center items-center rounded-2xl"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={imageUrl}
                  alt={`${name} - ${position}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center text-xl font-semibold">
                  {name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p>{slogan}</p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }) => (
                  <a
                    key={name}
                    href={url}
                    rel="noreferrer noopener"
                    target="_blank"
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    <span className="sr-only">{name} icon</span>
                    {socialIcon(name)}
                  </a>
                ))}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
