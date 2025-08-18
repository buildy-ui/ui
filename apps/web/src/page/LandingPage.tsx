"use client";
import {
  CenteredHero,
  SplitHero,
  CenteredHeroData,
  HeroData,
  splitHeroExamples,
  gridFeaturesExamples,
  centeredCTAExamples,
  gridFooterExamples,
  createDefaultBlocksRegistry,
  BlockTreeRenderer
} from "@ui8kit/blocks";
import { Block } from "@ui8kit/core";

import { skyOSTheme } from "@ui8kit/theme";
import { ExternalLink, Info, Rocket } from "lucide-react";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: currentTheme.buttonSize,
  py: "2xl" as const
}

function CenteredHeroWithTopButtonExample() {
  const content: CenteredHeroData = {
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
  };

  return (
    <CenteredHero
      content={content}
      variant="withTopButton"
      useContainer={true}
      py={theme.py}
    />
  );
};

function SplitHeroWithTopButtonExample() {
  const content: HeroData = {
    topButton: {
      text: "🎉 Announcing our Series A funding",
      href: "#"
    },
    badge: "Funding News",
    title: "We raised $50M to accelerate innovation",
    description: "With this new funding, we're doubling down on our mission to democratize technology and make powerful tools accessible to everyone.",
    images: [
      {
        id: "1",
        src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 1"
      },
      {
        id: "2", 
        src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 2"
      },
      {
        id: "3",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        alt: "Portfolio showcase 3"
      }
    ],
    primaryButtonText: "Read Announcement",
    secondaryButtonText: "Join Journey",
    primaryButtonIcon: ExternalLink,
    secondaryButtonIcon: Rocket
  };

  return (
    <SplitHero
      content={content}
      variant="gallery"
      useContainer={true}
      className="bg-gradient-to-br from-primary/10 to-secondary/10"
    />
  );
};

export const LandingPage = () => {
  const registry = createDefaultBlocksRegistry();
  const heroPreset = registry.findPreset?.("preset:hero.split:gallery:funding");
  const featuresPreset = registry.findPreset?.("preset:features.grid:gridMediaCards:solutions");
  const dndTree = [
    {
      type: "hero.split",
      variant: heroPreset?.variant,
      props: heroPreset?.props
    },
    {
      type: "features.grid",
      variant: featuresPreset?.variant,
      props: featuresPreset?.props
    }
  ] as any;
  return (
    <Block component="main">
      {/* Registry + DnD tree render demo */}
      <Block component="section">
        <BlockTreeRenderer registry={registry as any} tree={dndTree} />
      </Block>
      {/* <CenteredHeroWithTopButtonExample />
      <splitHeroExamples.security />
      <SplitHeroWithTopButtonExample />
      <centeredCTAExamples.simple />
      <gridFeaturesExamples.gridMediaCards />
      <gridFooterExamples.compact /> */}
    </Block>
  );
};