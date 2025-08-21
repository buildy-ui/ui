"use client";
import {
  BlockTreeRenderer,
  createHeroRegistry,
  createFeaturesRegistry,
  CenteredHeroPreset,
  GridFeaturesPreset
} from "@ui8kit/blocks";

export const TestBlocksPage = () => {

  const featuresRegistry = createFeaturesRegistry();
  const heroRegistry = createHeroRegistry();

  return (
    <>
      <BlockTreeRenderer registry={heroRegistry as any} tree={CenteredHeroPreset} />
      <BlockTreeRenderer registry={featuresRegistry as any} tree={GridFeaturesPreset} />
    </>
  );
};