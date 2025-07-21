import { ChartPie, WalletIcon, Magnet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie/promo.json";

type Content = {
  title: string;
  brand: string;
  serviceList: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
};

const content: Content = {
  title: "Service",
  brand: "Buildy/UI",
    serviceList: [
  {
    title: "Code Collaboration",
    description:
      "Seamlessly collaborate with your team using Buildy/UI's modern tools for sharing and reviewing code.",
    icon: <ChartPie className="w-6 h-6 text-white" />,
  },
  {
    title: "Project Management",
    description:
      "Simplify project tracking and enhance productivity with intuitive management features.",
    icon: <WalletIcon className="w-6 h-6 text-white" />,
  },
  {
    title: "Task Automation",
    description:
      "Automate repetitive tasks and save valuable time using Buildy/UI's flexible components.",
    icon: <Magnet className="w-6 h-6 text-white" />,
  },
]} as const;

type PromoServiceLottieProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const PromoServiceLottie = (props: PromoServiceLottieProps) => {
  const { title, brand, serviceList } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-8 lg:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-[1fr,1fr] gap-12 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-b from-sky-500 to-sky-700 text-transparent bg-clip-text">
              {title}
            </span>
            {brand}
          </h2>

          <p className="md:text-lg text-muted-foreground mt-4 mb-8">
            Discover how Buildy/UI can transform your design process with tools
            tailored for efficiency and collaboration.
          </p>

          <div className="flex flex-col gap-6">
            {serviceList?.map(({ icon, title, description }) => (
              <Card key={title} className="flex flex-col relative p-[1px] bg-gradient-to-br from-sky-600 to-sky-300 dark:to-slate-600 rounded-2xl">
                <div className="bg-secondary rounded-2xl">
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="bg-gradient-to-b from-sky-500 to-sky-700 p-3 rounded-full">{icon}</div>
                  <div>
                    <CardTitle className="font-bold">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md lg:max-w-lg">
          <Lottie animationData={animationData} loop={true} />
        </div>
      </div>
    </section>
  );
};
