import {
  HeroSplitExample,
  GallerySplitExample,
  FeaturesSplitExample,
  FeaturesSplitExample2,
  StackedLayoutExample,
 } from "@ui8kit/blocks/factory";

function NewHeroBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
        <HeroSplitExample />
        <GallerySplitExample />
        <FeaturesSplitExample2 />
        <FeaturesSplitExample />
        <StackedLayoutExample />
    </div>
  );
}

export default NewHeroBlocks;