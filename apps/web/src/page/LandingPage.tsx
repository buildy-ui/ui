"use client";
import {
  createDefaultBlocksRegistry,
  createHeroRegistry,
  BlockTreeRenderer
} from "@ui8kit/blocks";
import { Block } from "@ui8kit/core";

import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: currentTheme.buttonSize,
  py: "2xl" as const
}

export const LandingPage = () => {
  const heroRegistry = createHeroRegistry();
  const newHeroPreset = heroRegistry.findPreset("preset:hero.split:gallery:funding");
  const newHeroPreset2 = heroRegistry.findPreset("preset:hero.centered:simple:launch");

  const registry = createDefaultBlocksRegistry();
  const heroPreset = registry.findPreset?.("preset:hero.split:gallery:funding");

  const newDndTree = [
    {
      type: "hero.split",
      variant: newHeroPreset?.variant,
      props: newHeroPreset?.props
    },
    {
      type: "hero.centered",
      variant: newHeroPreset2?.variant,
      props: newHeroPreset2?.props
    }
  ] as any;

  const dndTree = [
    {
      type: "hero.split",
      variant: heroPreset?.variant,
      props: heroPreset?.props
    }
  ] as any;
  return (
    <Block component="main">
      {/* Registry + DnD tree render demo */}
      <Block component="section">
        <BlockTreeRenderer registry={heroRegistry as any} tree={newDndTree} />
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