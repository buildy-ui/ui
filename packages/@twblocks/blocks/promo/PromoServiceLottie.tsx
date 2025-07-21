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
    icon: <ChartPie className="w-6 h-6" />
  },
  {
    title: "Project Management",
    description:
    "Simplify project tracking and enhance productivity with intuitive management features.",
    icon: <WalletIcon className="w-6 h-6" />
  },
  {
    title: "Task Automation",
    description:
    "Automate repetitive tasks and save valuable time using Buildy/UI's flexible components.",
    icon: <Magnet className="w-6 h-6" />
  }]
} as const;

type PromoServiceLottieProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

export const PromoServiceLottie = (props: PromoServiceLottieProps) => {
  const { title, brand, serviceList } = {
    ...content,
    ...props
  };

  return (
    <section className="w-full py-8">
      <div className="mx-auto px-4 md:px-6 lg:px-8 grid">
        <div>
          <h2 className="text-3xl font-bold">
            <span className="">
              {title}
            </span>
            {brand}
          </h2>

          <p className="text-muted-foreground">
            Discover how Buildy/UI can transform your design process with tools
            tailored for efficiency and collaboration.
          </p>

          <div className="flex flex-col gap-6">
            {serviceList?.map(({ icon, title, description }) =>
            <Card key={title} className="flex flex-col relative rounded-2xl">
                <div className="bg-secondary rounded-2xl">
                <CardHeader className="flex md:flex-row justify-start items-start gap-4">
                  <div className="p-3 rounded-full">{icon}</div>
                  <div>
                    <CardTitle className="font-bold">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="w-full max-w-md">
          <Lottie animationData={animationData} loop={true} />
        </div>
      </div>
    </section>);

};