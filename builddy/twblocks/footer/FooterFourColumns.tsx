import { Volleyball } from "lucide-react";  

type Content = {
  brand: string;
  description: string;
  copyright: string;
  links: { name: string; href: string }[];
  menu: { title: string; links: { name: string; href: string }[] }[];
};

const content: Content = {
  brand: "BuildY/UI",
  description: "Easily build your website with our UI components",
  copyright: "© 2024 BuildY/UI. All rights reserved.",
  links: [
    { name: 'Terms and Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
  menu: [
    {
      title: 'Product',
      links: [
        { name: 'Overview', href: '#' },
        { name: 'Pricing', href: '#' },
        { name: 'Marketplace', href: '#' },
        { name: 'Features', href: '#' },
        { name: 'Integrations', href: '#' },
        { name: 'Pricing', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Team', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Privacy', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help', href: '#' },
        { name: 'Sales', href: '#' },
        { name: 'Advertise', href: '#' },
      ],
    },
    {
      title: 'Social',
      links: [
        { name: 'Twitter', href: '#' },
        { name: 'Instagram', href: '#' },
        { name: 'LinkedIn', href: '#' },
      ],
    },
  ]
} as const;

type FooterFourColumnsProps = React.ComponentPropsWithoutRef<"footer"> & Partial<Content>;

export const FooterFourColumns = (props: FooterFourColumnsProps) => {
  const { brand, description, copyright, links, menu } = {
    ...content,
    ...props
  };

  return (
  <footer className="w-full py-4 lg:py-8">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="text-2xl font-bold mb-8 lg:mb-4">
              <Volleyball className="mr-1 h-8 w-8 inline-block" /> {brand}
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {menu?.map((item, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 font-bold">{item.title}</h3>
              <ul className="space-y-4 text-muted-foreground">
                {item.links.map((link, linkIdx) => (
                  <li
                    key={`${link.name}-${linkIdx}`}
                    className="font-medium hover:text-primary"
                  >
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
          <p>{copyright}</p>
          <ul className="flex gap-4">
            {links?.map((item, Idx) => (
              <li key={`${item.name}-${Idx}`} className="underline hover:text-primary">
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
    </div>
  </footer>
  );
};