"use client";
import {
  createFeaturesRegistry,
  BlockTreeRenderer
} from "@ui8kit/blocks";

import { GridFeaturesPresetSchema } from "../../../../packages/@ui8kit/blocks/src/features/GridFeatures.schema";
import { validateContentAgainstPreset } from "../utils/schema-validator";

import gridFeaturesPreset from "../../../../packages/@ui8kit/blocks/src/features/GridFeatures.preset";

export const FeaturesPage = () => {

  const featuresRegistry = createFeaturesRegistry();
  
  const results = validateContentAgainstPreset(GridFeaturesPresetSchema as any, gridFeaturesPreset as any[]);
  const invalid = results.filter(r => !r.ok);
  console.log(invalid);

  return (
    <BlockTreeRenderer registry={featuresRegistry as any} tree={gridFeaturesPreset} />
  );
};