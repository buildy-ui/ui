"use client";
import {
  createHeroRegistry,
  BlockTreeRenderer
} from "@ui8kit/blocks";

import { skyOSTheme } from "@ui8kit/theme";
import { Play, Rocket, Shield, Zap } from "lucide-react";

import { CenteredHeroPresetSchema } from "../../../../packages/@ui8kit/blocks/schemas/hero/CenteredHero.preset.schema";
import { validateContentAgainstPreset } from "../utils/schema-validator";

import heroCenteredJsonContent from "../../../../packages/@ui8kit/blocks/content/hero/CenteredHero.content";

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
  const heroCenteredPreset = heroRegistry.findPreset("preset:hero.centered:simple:launch");

  const blocksTree = [
    {
      type: "hero.centered",
      variant: "withTopButton",
      props: {
        content: heroCenteredJsonContent[1].props.content,
        useContainer: true,
        py: "xl"
      },
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
  
  const results = validateContentAgainstPreset(CenteredHeroPresetSchema as any, heroCenteredJsonContent as any[]);
  const invalid = results.filter(r => !r.ok);
  console.log(invalid);

  return (
    <BlockTreeRenderer registry={heroRegistry as any} tree={blocksTree} />
  );
};

const heroCenteredContent = {
  badge: "Welcome",
  title: "The future of work is here",
  description: "Transform the way your team collaborates with our innovative platform. Built for modern teams who demand flexibility, security, and performance.",
  primaryButtonText: "Get Started Free",
  secondaryButtonText: "Watch Demo",
  primaryButtonIcon: Rocket,
  secondaryButtonIcon: Play
}