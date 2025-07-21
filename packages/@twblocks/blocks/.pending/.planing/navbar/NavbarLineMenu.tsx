import { Menu, BookOpen, Layers, Github } from "lucide-react";
import { Button } from "@ui8kit/core";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription } from
"@/components/ui/sheet";

type Content = {
  brand: {
    name: string;
    icon: React.ReactNode;
  };
  navigation: {
    id: string;
    path: string;
    label: string;
    icon: React.ReactNode;
  }[];
  actions: {
    id: string;
    path: string;
    label: string;
    icon: React.ReactNode;
  }[];
};
import { registerViewScript } from '@/utils/viewScript';

const content: Content = {
  brand: {
    name: "Buildy/UI",
    icon: <Layers className="h-5 w-5" />
  },
  navigation: [
  {
    id: "docs",
    path: "https://ui.hinddy.com/docs",
    label: "Documentation",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: "components",
    path: "https://ui.hinddy.com/components",
    label: "Components",
    icon: <Layers className="h-5 w-5" />
  }],

  actions: [
  {
    id: "github",
    path: "https://github.com/alexy-os/react-shadcn-uiblocks",
    label: "GitHub",
    icon: <Github className="h-5 w-5" />
  }]

} as const;

const Brand = () => {
  const { name } = content.brand;
  return (
    <div className="flex items-center gap-2">
      <Layers className="h-5 w-5" />
      <span className="font-semibold">{name}</span>
    </div>);

};

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="">
          <Menu className="h-5 w-5" />
          <span className="">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="">
        <div className="">
          <Brand />
        </div>
        <SheetTitle className="">Navigation Menu</SheetTitle>
        <SheetDescription className="">
          Main navigation for mobile devices
        </SheetDescription>
        <nav className="flex flex-col space-y-2">
          {content.navigation.map((item) =>
          <Button
            key={item.id}
            variant="ghost"
            className="justify-start w-full"
            asChild>
            
              <a href={item.path}>
                {item.icon}
                {item.label}
              </a>
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>);

};

const HeroSection = () =>
<section className="w-full py-16 lg:py-32">
    <div className="mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col text-center gap-8 items-center">
        <div className="flex flex-col gap-4">
          <h2 className="max-w-2xl text-3xl font-bold">
            Effortless Prototyping
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Streamline your development process with our flexible UI library.
            Experience effortless prototyping and create custom, responsive
            designs quickly and efficiently.
          </p>
        </div>
      </div>
    </div>
  </section>;


type NavbarProps = React.ComponentPropsWithoutRef<"header"> & Partial<Content>;

export const NavbarLineMenu = (props: NavbarProps) => {
  const { navigation, actions } = {
    ...content,
    ...props
  };

  return (
    <>
      <header className="sticky w-full">
        <div className="mx-auto px-4 flex items-center">
          <div className="flex">
            <Brand />
          </div>

          <nav className="hidden items-center space-x-4">
            {navigation.map((item) =>
            <Button key={item.id} variant="ghost" asChild>
                <a href={item.path}>
                  {item.label}
                </a>
              </Button>
            )}
          </nav>

          <div className="flex items-center justify-end space-x-2">
            <MobileNavigation />

            {actions.map((action) =>
            <Button
              key={action.id}
              variant="outline"
              className="hidden"
              asChild>
              
                <a href={action.path}>
                  {action.icon}
                  {action.label}
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>
      <HeroSection />
    </>);

};

// Strict adherence to the current component name
const componentName = "NavbarLineMenu" as const;

// Register the ViewScript for this component
registerViewScript(componentName, () => `
<script>
    let isMenuOpen = false;
    const burgerBtn = document.querySelector('[aria-controls="radix-:Rt:"]');
    const mobileSheet = document.createElement('div');
    mobileSheet.className = 'fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background shadow-xl transform translate-x-full transition-transform duration-300 z-20';
    mobileSheet.innerHTML = \`
        <div class="p-4 space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">Menu</h2>
                <button class="close-sheet p-2">✕</button>
            </div>
            <div class="space-y-2">
                <a href="https://ui.hinddy.com/docs" class="block p-2 hover:bg-accent rounded-md">Documentation</a>
                <a href="https://ui.hinddy.com/components" class="block p-2 hover:bg-accent rounded-md">Components</a>
            </div>
        </div>
    \`;

    function handleMobileMenu() {
        document.body.appendChild(mobileSheet);
        
        burgerBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            mobileSheet.style.transform = isMenuOpen ? 'translateX(0)' : 'translateX(100%)';
        });

        mobileSheet.querySelector('.close-sheet').addEventListener('click', () => {
            isMenuOpen = false;
            mobileSheet.style.transform = 'translateX(100%)';
        });
    }

    handleMobileMenu();
</script>
`);