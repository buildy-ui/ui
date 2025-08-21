"use client";
import {
  createBusinessRegistry,
  createBlogRegistry,
  createCTARegistry,
  createFAQRegistry,
  createHeroRegistry,
  createFeaturesRegistry,
  createPortfolioRegistry,
  createTeamRegistry,
  createTestimonialRegistry,
  /*SplitBusinessPresetSchema,
  GridBusinessPresetSchema,
  GridBlogPresetSchema,
  CenteredCTAPresetSchema,
  SplitCTAPresetSchema,
  CenteredHeroPresetSchema,
  SplitHeroPresetSchema,*/
  GridFeaturesPresetSchema,
  SplitFeaturesPresetSchema,
  GridPortfolioPreset,
  SplitPortfolioPreset,
  SplitBusinessPreset,
  GridBusinessPreset,
  GridBlogPreset,
  CenteredCTAPreset,
  SplitCTAPreset,
  GridFAQPreset,
  SplitFAQPreset,
  GridTeamPreset,
  SplitTeamPreset,
  CenteredHeroPreset,
  SplitHeroPreset,
  GridFeaturesPreset,
  SplitFeaturesPreset,
  GridTestimonialPreset,
  SplitTestimonialPreset,
  BlockTreeRenderer
} from "@ui8kit/blocks";

import { SampleValidation, validateContentAgainstPreset, formatSampleValidation } from "../utils/schema-validator";

export const FeaturesPage = () => {

  const treeRegistry = [
    { name: "Hero Blocks", registry: createHeroRegistry() },
    { name: "Features Blocks", registry: createFeaturesRegistry() },
    { name: "Business Blocks", registry: createBusinessRegistry() },
    { name: "Portfolio Blocks", registry: createPortfolioRegistry() },
    { name: "Blog Blocks", registry: createBlogRegistry() },
    { name: "CTA Blocks", registry: createCTARegistry() },
    { name: "FAQ Blocks", registry: createFAQRegistry() },
    { name: "Team Blocks", registry: createTeamRegistry() },
    { name: "Testimonial Blocks", registry: createTestimonialRegistry() }
  ]

  const treeBlocks = [
    ...GridFeaturesPreset,
    ...SplitFeaturesPreset,
    ...GridBusinessPreset,
    ...SplitBusinessPreset,
    ...GridPortfolioPreset,
    ...SplitPortfolioPreset,
    ...CenteredCTAPreset,
    ...SplitCTAPreset,
    ...GridBlogPreset,
    ...CenteredHeroPreset,
    ...SplitHeroPreset,
    ...GridFAQPreset,
    ...SplitFAQPreset,
    ...GridTeamPreset,
    ...SplitTeamPreset,
    ...GridTestimonialPreset,
    ...SplitTestimonialPreset
  ];

  validateBlocks();

  const treeRenderers = treeRegistry.map((type, index) => {

    console.info(index+1+". "+type.name)
    return (
      <div key={index} title={type.name} >
        <h2 className="text-2xl font-bold text-center bg-primary/15 text-primary p-4 border-y border-2 border-primary">{type.name}</h2>
        <BlockTreeRenderer registry={type.registry as any} tree={treeBlocks}/>
      </div>
    )
  });

  return (
    treeRenderers
  );
};

const validateBlocks = () => {
  const presetInvalid = (r: SampleValidation) => formatSampleValidation(r);

  const validations = [
    { schema: GridFeaturesPresetSchema, samples: GridFeaturesPreset },
    { schema: SplitFeaturesPresetSchema, samples: SplitFeaturesPreset }
    // add more schemas/presets here without duplicating logic
  ];

  const invalidMessages = validations.flatMap(v => {
    const results = validateContentAgainstPreset(v.schema as any, v.samples as any[]);
    return results
      .filter(r => !r.ok)
      .map(r => presetInvalid(r));
  });

  if (invalidMessages.length) {
    console.error(invalidMessages);
  }
};