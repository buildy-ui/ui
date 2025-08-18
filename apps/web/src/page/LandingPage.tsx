"use client";
import {
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
  const heroSplitPreset = heroRegistry.findPreset("preset:hero.split:gallery:funding");
  const heroCenteredPreset = heroRegistry.findPreset("preset:hero.centered:simple:launch");

  const blocksTree = [
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
        py: theme.py,
        // etc props
      }
    }
  ] as any;
  
  return (
    <BlockTreeRenderer registry={heroRegistry as any} tree={blocksTree} />
  );
};