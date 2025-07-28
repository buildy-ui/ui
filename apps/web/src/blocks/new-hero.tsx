import {
  HeroSplitExample,
  GallerySplitExample,
  FeaturesSplitExample,
  FeaturesSplitExample2,
  StackedLayoutExample,
  FullGridExample,
  PresetHooksExample
 } from "@ui8kit/blocks/factory";

function NewHeroBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
        <HeroSplitExample />
        <GallerySplitExample />
        <FeaturesSplitExample2 />
        <FeaturesSplitExample />
        <StackedLayoutExample />
        <FullGridExample />
        <PresetHooksExample />
    </div>
  );
}

export default NewHeroBlocks;