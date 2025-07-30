import { SplitFooter, type SplitFooterData } from "./SplitFooter";

// Sample footer data
const sampleFooterData: SplitFooterData = {
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
        { name: "API Reference", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
        { name: "Contact", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Community", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Examples", href: "#" },
        { name: "Templates", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" }
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
    youtube: "https://youtube.com/@buildyui"
  },
  newsletter: {
    title: "Stay in the Loop",
    description: "Get the latest updates, tutorials, and exclusive content delivered straight to your inbox.",
    placeholder: "Enter your email address",
    buttonText: "Subscribe Now"
  },
  features: {
    title: "Why Choose BuildY UI",
    items: [
      "100+ Premium Components",
      "TypeScript Support",
      "Accessibility First",
      "Dark Mode Ready",
      "Mobile Responsive",
      "Customizable Themes"
    ]
  }
};

// 1. Brand Footer Example
export const SplitFooterBrandExample = () => {
  return (
    <SplitFooter
      content={sampleFooterData}
      variant="brand"
      mediaPosition="right"
      useContainer={true}
      py="xl"
    />
  );
};

// 2. Newsletter Footer Example
export const SplitFooterNewsletterExample = () => {
  return (
    <SplitFooter
      content={sampleFooterData}
      variant="newsletter"
      mediaPosition="left"
      useContainer={true}
      py="xl"
    />
  );
};

// 3. Contact Footer Example
export const SplitFooterContactExample = () => {
  return (
    <SplitFooter
      content={sampleFooterData}
      variant="contact"
      mediaPosition="right"
      useContainer={true}
      py="xl"
    />
  );
};

// 4. Social Footer Example
export const SplitFooterSocialExample = () => {
  return (
    <SplitFooter
      content={sampleFooterData}
      variant="social"
      mediaPosition="left"
      useContainer={true}
      py="xl"
    />
  );
};

// 5. Minimal Footer Example
export const SplitFooterMinimalExample = () => {
  return (
    <SplitFooter
      content={sampleFooterData}
      variant="minimal"
      mediaPosition="right"
      useContainer={true}
      py="lg"
    />
  );
};

// Export all examples
export const splitFooterExamples = {
  brand: SplitFooterBrandExample,
  newsletter: SplitFooterNewsletterExample,
  contact: SplitFooterContactExample,
  social: SplitFooterSocialExample,
  minimal: SplitFooterMinimalExample
};