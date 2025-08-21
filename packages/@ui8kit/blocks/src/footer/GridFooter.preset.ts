// Sample footer data (reused from SplitFooter)
const sampleFooterData = {
  brand: "BuildY UI",
  tagline: "Building beautiful interfaces with ease",
  description: "A comprehensive UI component library designed to help developers create stunning, accessible, and performant web applications.",
  copyright: "© 2024 BuildY UI. All rights reserved.",
  sections: [
    {
      title: "Product",
      links: [
        { name: "Overview", href: "#" },
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Changelog", href: "#" },
        { name: "Roadmap", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Partners", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Community", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Examples", href: "#" },
        { name: "Templates", href: "#" },
        { name: "Design System", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Accessibility", href: "#" }
      ]
    },
    {
      title: "Developers",
      links: [
        { name: "GitHub", href: "#" },
        { name: "NPM Package", href: "#" },
        { name: "Contributing", href: "#" },
        { name: "Issues", href: "#" },
        { name: "Discussions", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Desk", href: "#" },
        { name: "Status Page", href: "#" },
        { name: "Bug Reports", href: "#" },
        { name: "Feature Requests", href: "#" }
      ]
    }
  ],
  contact: {
    email: "hello@buildyui.com",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Street, Tech Valley, CA 94000",
    website: "https://buildyui.com"
  },
  social: {
    twitter: "https://twitter.com/buildyui",
    instagram: "https://instagram.com/buildyui",
    linkedin: "https://linkedin.com/company/buildyui",
    github: "https://github.com/buildyui",
    youtube: "https://youtube.com/@buildyui",
    facebook: "https://facebook.com/buildyui"
  },
  newsletter: {
    title: "Developer Newsletter",
    description: "Weekly updates on new components, features, and best practices.",
    placeholder: "Enter your email address",
    buttonText: "Subscribe"
  },
  features: {
    title: "Key Features",
    items: [
      "100+ Components",
      "TypeScript Ready",
      "Fully Accessible",
      "Dark Mode Support"
    ]
  }
};

export const GridFooterPreset = [
{
				type: "footer.grid",
				variant: "columns",
				props: { content: sampleFooterData, useContainer: true, py: "xl" }
			},
{
				type: "footer.grid",
				variant: "mega",
				props: { content: sampleFooterData, useContainer: true, py: "xl" }
			},
{
				type: "footer.grid",
				variant: "compact",
				props: { content: { ...sampleFooterData, sections: sampleFooterData.sections.slice(0, 4) }, useContainer: true, py: "lg" }
			},
{
				type: "footer.grid",
				variant: "newsletter",
				props: { content: sampleFooterData, useContainer: true, py: "xl" }
			},
{
				type: "footer.grid",
				variant: "sitemap",
				props: { content: sampleFooterData, useContainer: true, py: "xl" }
			}
];
