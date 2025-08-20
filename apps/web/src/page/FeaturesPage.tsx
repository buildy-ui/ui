"use client";
import {
  createHeroRegistry,
  CenteredHeroPresetSchema,
  CenteredHeroPreset,
  createFeaturesRegistry,
  GridFeaturesPresetSchema,
  GridFeaturesPreset,
  BlockTreeRenderer
} from "@ui8kit/blocks";

import { SampleValidation, validateContentAgainstPreset, formatSampleValidation } from "../utils/schema-validator";

export const FeaturesPage = () => {

  const featuresRegistry = createFeaturesRegistry();
  const heroRegistry = createHeroRegistry();

  validateBlocks();

  return (
    <>
      <BlockTreeRenderer registry={heroRegistry as any} tree={CenteredHeroPreset} />
      <BlockTreeRenderer registry={featuresRegistry as any} tree={GridFeaturesPreset} />
    </>
  );
};

const validateBlocks = () => {

  const results = validateContentAgainstPreset(GridFeaturesPresetSchema as any, GridFeaturesPreset as any[]);
  const results2 = validateContentAgainstPreset(CenteredHeroPresetSchema as any, CenteredHeroPreset as any[]);

  const presetInvalid = (r: SampleValidation) => formatSampleValidation(r);

  switch (results.filter(r => !r.ok).length) {
    case 0:
      break;
    default:
      console.error(results.filter(r => !r.ok).map(r => presetInvalid(r)));
      break;
  }
  switch (results2.filter(r => !r.ok).length) {
    case 0:
      break;
    default:
      console.error(results2.filter(r => !r.ok).map(r => presetInvalid(r)));
      break;
  }
};