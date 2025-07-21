import { Volleyball } from "lucide-react";

interface FooterFourColumnsProps {
  content: {
    brand: string;
    description: string;
    copyright: string;
    links: Array<{name: string;href: string;}>;
    menu: Array<{
      title: string;
      links: Array<{name: string;href: string;}>;
    }>;
  };
}

export default function FooterFourColumns({ content }: FooterFourColumnsProps) {
  return (
    <footer className="w-full py-4 bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold text-foreground">
              <Volleyball className="mr-1 h-8 w-8 inline-block" /> {content.brand}
            </div>
            <p className="text-muted-foreground">{content.description}</p>
          </div>
          {content.menu.map((item, sectionIdx) =>
          <div key={sectionIdx}>
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <ul className="text-muted-foreground">
                {item.links.map((link, linkIdx) =>
              <li key={linkIdx} className="font-medium">
                    <a href={link.href}>{link.name}</a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-4 border-t text-sm font-medium text-muted-foreground md:flex-row border-border">
          <p>{content.copyright}</p>
          <ul className="flex gap-4">
            {content.links.map((item, idx) =>
            <li key={idx} className="">
                <a href={item.href}>{item.name}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>);

}

export const footerFourColumnsTemplate = {
  id: "footerFourColumns",
  name: "Footer Four Columns",
  description: "Four-column footer with links and brand info",
  component: FooterFourColumns,
  defaultContent: {
    brand: "BuildY/UI",
    description: "Easily build your website with our UI components",
    copyright: "© 2025 BuildY/UI. All rights reserved.",
    links: [
    { name: 'Terms and Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' }],

    menu: [
    {
      title: 'Product',
      links: [
      { name: 'Overview', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Marketplace', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Integrations', href: '#' },
      { name: 'Pricing', href: '#' }]

    },
    {
      title: 'Company',
      links: [
      { name: 'About', href: '#' },
      { name: 'Team', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy', href: '#' }]

    },
    {
      title: 'Resources',
      links: [
      { name: 'Help', href: '#' },
      { name: 'Sales', href: '#' },
      { name: 'Advertise', href: '#' }]

    },
    {
      title: 'Social',
      links: [
      { name: 'Twitter', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'LinkedIn', href: '#' }]

    }]

  }
};