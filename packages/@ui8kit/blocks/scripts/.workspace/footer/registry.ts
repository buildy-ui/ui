import { createElement } from "react";
import type { ReactNode } from "react";
import { GridFooter } from "./GridFooter";
import { SplitFooter } from "./SplitFooter";
import { createBlocksRegistry } from "../registry";
import { Building2, Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Facebook, Youtube, Github, ArrowRight, Send } from "lucide-react";

// Shared footer types
export type FooterTypeId = "footer.gridfooter" | "footer.splitfooter";

export type FooterVariant = string;

export interface FooterBlockNode {
  id?: string;
  type: FooterTypeId;
  variant?: FooterVariant;
  props?: Record<string, any>;
  slots?: Record<string, FooterBlockNode[] | FooterBlockNode | undefined>;
}

export interface FooterBlockPreset {
  id: string;
  type: FooterTypeId;
  variant?: FooterVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface FooterBlockDefinition {
  type: FooterTypeId;
  name: string;
  variants: FooterVariant[];
  render: (node: FooterBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: FooterBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register footer definitions via helpers below.

// ===== Presets (kept close to footer code) =====

const gridFooterPresets: FooterBlockPreset[] = [
  {
    id: "preset:footer.gridfooter:default:company-footer",
    type: "footer.gridfooter",
    variant: "default",
    name: "Company Footer",
    description: "Standard company footer with links and contact information",
    props: {
      content: {
        companyName: "Your Company",
        tagline: "Building the future, one innovation at a time",
        description: "We are a forward-thinking company dedicated to creating solutions that make a difference in people's lives.",
        links: [
          {
            id: "1",
            title: "Product",
            links: [
              { id: "1-1", text: "Features", href: "/features" },
              { id: "1-2", text: "Pricing", href: "/pricing" },
              { id: "1-3", text: "Integrations", href: "/integrations" },
              { id: "1-4", text: "API Documentation", href: "/docs" }
            ]
          },
          {
            id: "2",
            title: "Company",
            links: [
              { id: "2-1", text: "About Us", href: "/about" },
              { id: "2-2", text: "Careers", href: "/careers" },
              { id: "2-3", text: "Blog", href: "/blog" },
              { id: "2-4", text: "Press Kit", href: "/press" }
            ]
          },
          {
            id: "3",
            title: "Support",
            links: [
              { id: "3-1", text: "Help Center", href: "/help" },
              { id: "3-2", text: "Contact Us", href: "/contact" },
              { id: "3-3", text: "Community", href: "/community" },
              { id: "3-4", text: "Status", href: "/status" }
            ]
          }
        ],
        socialLinks: [
          { id: "twitter", icon: Twitter, href: "https://twitter.com", label: "Twitter" },
          { id: "linkedin", icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
          { id: "github", icon: Github, href: "https://github.com", label: "GitHub" }
        ],
        contactInfo: {
          email: "hello@yourcompany.com",
          phone: "+1 (555) 123-4567",
          address: "123 Business St, Suite 100, City, State 12345"
        },
        copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
        legalLinks: [
          { id: "privacy", text: "Privacy Policy", href: "/privacy" },
          { id: "terms", text: "Terms of Service", href: "/terms" },
          { id: "cookies", text: "Cookie Policy", href: "/cookies" }
        ]
      },
      useContainer: false
    },
    version: 1
  }
];

const splitFooterPresets: FooterBlockPreset[] = [
  {
    id: "preset:footer.splitfooter:newsletter:subscription-footer",
    type: "footer.splitfooter",
    variant: "newsletter",
    name: "Newsletter Footer",
    description: "Footer with newsletter subscription and company information",
    props: {
      content: {
        badge: "Stay Connected",
        title: "Never miss an update",
        description: "Subscribe to our newsletter and be the first to know about new features, updates, and industry insights.",
        newsletterPlaceholder: "Enter your email address",
        buttonText: "Subscribe",
        companyInfo: {
          name: "Your Company",
          description: "Building amazing products that help people work smarter and live better.",
          socialLinks: [
            { id: "twitter", icon: Twitter, href: "https://twitter.com", label: "Twitter" },
            { id: "instagram", icon: Instagram, href: "https://instagram.com", label: "Instagram" },
            { id: "linkedin", icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
            { id: "facebook", icon: Facebook, href: "https://facebook.com", label: "Facebook" },
            { id: "youtube", icon: Youtube, href: "https://youtube.com", label: "YouTube" }
          ]
        },
        quickLinks: [
          {
            id: "1",
            title: "Product",
            links: [
              { id: "1-1", text: "Features", href: "/features" },
              { id: "1-2", text: "Pricing", href: "/pricing" },
              { id: "1-3", text: "Download", href: "/download" }
            ]
          },
          {
            id: "2",
            title: "Resources",
            links: [
              { id: "2-1", text: "Blog", href: "/blog" },
              { id: "2-2", text: "Help Center", href: "/help" },
              { id: "2-3", text: "Community", href: "/community" }
            ]
          },
          {
            id: "3",
            title: "Company",
            links: [
              { id: "3-1", text: "About", href: "/about" },
              { id: "3-2", text: "Careers", href: "/careers" },
              { id: "3-3", text: "Contact", href: "/contact" }
            ]
          }
        ],
        copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
        legalLinks: [
          { id: "privacy", text: "Privacy", href: "/privacy" },
          { id: "terms", text: "Terms", href: "/terms" }
        ]
      },
      useContainer: false
    },
    version: 1
  }
];

// ===== Definitions =====

const gridFooterDef: FooterBlockDefinition = {
  type: "footer.gridfooter",
  name: "Grid Footer",
  variants: ["default", "minimal", "detailed"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    return createElement(GridFooter as any, {
      variant: (variant as any) || "default",
      ...props
    });
  },
  presets: gridFooterPresets
};

const splitFooterDef: FooterBlockDefinition = {
  type: "footer.splitfooter",
  name: "Split Footer",
  variants: ["newsletter", "simple", "detailed"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(SplitFooter as any, {
      variant: (variant as any) || "newsletter",
      ...props
    });
  },
  presets: splitFooterPresets
};

export const registerFooterBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridFooterDef as any);
  registry.register(splitFooterDef as any);
  return registry;
};

export const createFooterRegistry = () => {
  const r = createBlocksRegistry();
  return registerFooterBlocks(r);
};
