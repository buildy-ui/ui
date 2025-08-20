import { createElement } from "react";
import type { ReactNode } from "react";
import { SplitFeatures } from "./SplitFeatures";
import { GridFeatures } from "./GridFeatures";
import { createBlocksRegistry } from "../registry";
import { ArrowRight, Rocket } from "lucide-react";

// Shared features types
export type FeaturesTypeId = "features.splitfeatures" | "features.gridfeatures";

export type FeaturesVariant = string;

export interface FeaturesBlockNode {
  id?: string;
  type: FeaturesTypeId;
  variant?: FeaturesVariant;
  props?: Record<string, any>;
  slots?: Record<string, FeaturesBlockNode[] | FeaturesBlockNode | undefined>;
}

export interface FeaturesBlockPreset {
  id: string;
  type: FeaturesTypeId;
  variant?: FeaturesVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface FeaturesBlockDefinition {
  type: FeaturesTypeId;
  name: string;
  variants: FeaturesVariant[];
  render: (node: FeaturesBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: FeaturesBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register features definitions via helpers below.

// ===== Presets (kept close to features code) =====

const splitFeaturesPresets: FeaturesBlockPreset[] = [
  {
    id: "preset:features.splitfeatures:media:funding",
    type: "features.splitfeatures",
    name: "Media Features",
    variant: "media",
    props: { content: { badge: "Features", title: "Everything you need to build modern applications", description: "Our platform provides all the tools and features you need to create, deploy, and scale your applications with confidence.", image: { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Modern application development" }, features: [{ id: "1", title: "Lightning Fast Performance", description: "Optimized for speed with advanced caching and CDN integration" }, { id: "2", title: "Enterprise Security", description: "Bank-level security with end-to-end encryption and compliance" }, { id: "3", title: "Scalable Infrastructure", description: "Auto-scaling infrastructure that grows with your business needs" }, { id: "4", title: "24/7 Expert Support", description: "Round-the-clock support from our team of technical experts" }], primaryButtonText: "Get Started", secondaryButtonText: "View Demo", primaryButtonIcon: Rocket, secondaryButtonIcon: ArrowRight }, useContainer: true },
    version: 1
  }
];

const gridFeaturesPresets: FeaturesBlockPreset[] = [
  {
    id: "preset:features.gridfeatures:threeColumns:launch",
    type: "features.gridfeatures",
    name: "Grid Features",
    variant: "threeColumns",
    props: { content: { badge: "Features", title: "Everything you need to succeed", description: "Our comprehensive platform provides all the essential tools and features to help you build, deploy, and scale your applications with confidence.", items: [{ id: "1", title: "Easy Integration", description: "Connect with your existing tools and workflows seamlessly. Our API-first approach ensures compatibility with your current tech stack." }, { id: "2", title: "Real-time Collaboration", description: "Work together with your team in real-time. Share projects, leave comments, and track changes with our collaborative features." }, { id: "3", title: "Advanced Security", description: "Enterprise-grade security with end-to-end encryption, SSO integration, and compliance with industry standards." }, { id: "4", title: "Scalable Infrastructure", description: "Auto-scaling infrastructure that grows with your business. Handle traffic spikes without missing a beat." }, { id: "5", title: "24/7 Support", description: "Get help when you need it with our round-the-clock support team and comprehensive documentation." }, { id: "6", title: "Analytics & Insights", description: "Make data-driven decisions with detailed analytics and reporting tools that provide actionable insights." }] }, cols: "1-2-3" },
    version: 1
  }
];

// ===== Definitions =====

const splitFeaturesDef: FeaturesBlockDefinition = {
  type: "features.splitfeatures",
  name: "Split Features",
  variants: ["media", "leftMedia", "features", "analytics", "security", "performance"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    const slots = renderedSlots && renderedSlots.media ? { media: renderedSlots.media } : undefined;
    return createElement(SplitFeatures as any, {
      variant: (variant as any) || "media",
      ...props,
      slots: slots as any
    });
  },
  presets: splitFeaturesPresets
};

const gridFeaturesDef: FeaturesBlockDefinition = {
  type: "features.gridfeatures",
  name: "Grid Features",
  variants: ["threeColumns", "threeColumnsIcons", "gridMediaCards", "careerPositions", "careerStats"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(GridFeatures as any, {
      variant: (variant as any) || "threeColumns",
      ...props
    });
  },
  presets: gridFeaturesPresets
};

export const registerFeaturesBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(splitFeaturesDef as any);
  registry.register(gridFeaturesDef as any);
  return registry;
};

export const createFeaturesRegistry = () => {
  const r = createBlocksRegistry();
  return registerFeaturesBlocks(r);
};


