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
  const presetInvalid = (r: SampleValidation) => formatSampleValidation(r);

  const validations = [
    { name: 'features.gridfeatures', schema: GridFeaturesPresetSchema, samples: GridFeaturesPreset },
    { name: 'hero.centered', schema: CenteredHeroPresetSchema, samples: CenteredHeroPreset }
    // add more schemas/presets here without duplicating logic
  ];

  const invalidMessages = validations.flatMap(v => {
    const results = validateContentAgainstPreset(v.schema as any, v.samples as any[]);
    return results
      .filter(r => !r.ok)
      .map(r => `[${v.name}] ${presetInvalid(r)}`);
  });

  if (invalidMessages.length) {
    console.error(invalidMessages);
  }
};