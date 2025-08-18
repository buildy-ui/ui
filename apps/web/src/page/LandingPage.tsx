"use client";
import {
  createHeroRegistry,
  BlockTreeRenderer
} from "@ui8kit/blocks";

import { skyOSTheme } from "@ui8kit/theme";
import { Info, Rocket, Shield, Zap } from "lucide-react";

import { validateBlocksTree } from "../utils/schema-validator";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: currentTheme.buttonSize,
  py: "xl" as const
}

export const LandingPage = () => {
  const heroRegistry = createHeroRegistry();
  const heroSplitPreset = heroRegistry.findPreset("preset:hero.split:gallery:funding");
  const heroCenteredPreset = heroRegistry.findPreset("hero.centered:withImage");

  const blocksTree = [
    {
      type: "hero.centered",
      variant: "withTopButton",
      props: {
        content: {
        topButton: {
          text: "✨ New: AI-powered automation is here",
          href: "#"
        },
        badge: "AI Innovation",
        title: "Automate your workflow with intelligent AI",
        description: "Discover how artificial intelligence can streamline your processes, reduce manual work, and help your team focus on what matters most.",
        primaryButtonText: "Try AI Features",
        secondaryButtonText: "Learn More",
        primaryButtonIcon: Info,
        secondaryButtonIcon: Rocket
      },
    },
      useContainer: true,
      py: "xl"
    },
    {
      type: "hero.split",
      variant: heroSplitPreset?.variant,
      props: heroSplitPreset?.props
    },
    {
      type: "hero.centered",
      variant: heroCenteredPreset?.variant,
      props: {
        ...(heroCenteredPreset?.props ?? {}),
        content: heroCenteredContent,
        py: theme.py,
        // etc props
      }
    },
    {
      type: "hero.split",
      variant: "security",
      props: {
        content: {
          badge: "Enterprise Security",
          title: "Protect your business with enterprise-grade security",
          description: "Our comprehensive security suite provides advanced threat protection, compliance management, and peace of mind for businesses of all sizes.",
          image: {
            src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            alt: "Security dashboard interface"
          },
          primaryButtonText: "Start Audit",
          secondaryButtonText: "View Features",
          primaryButtonIcon: Shield,
          secondaryButtonIcon: Zap
        },
        useContainer: true,
        py: "xl"
      }
    }
  ] as any;

  validateBlocksTree(blocksTree);
  
  return (
    <BlockTreeRenderer registry={heroRegistry as any} tree={blocksTree} />
  );
};

const heroCenteredContent = {
  badge: "Badge",
  title: "Title",
  description: "Description",
  primaryButtonText: "Primary Button",
  secondaryButtonText: "Secondary Button"
}