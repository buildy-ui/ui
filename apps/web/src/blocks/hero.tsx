import { splitHeroExamples } from "@ui8kit/blocks/hero/SplitHero.examples";
import { centeredHeroExamples } from "@ui8kit/blocks/hero/CenteredHero.examples";

export const SplitHeroMediaExample = splitHeroExamples.media;
export const SplitHeroLeftMediaExample = splitHeroExamples.leftMedia;
export const SplitHeroGalleryExample = splitHeroExamples.gallery;
export const SplitHeroWithTopButtonExample = splitHeroExamples.withTopButton;
export const SplitHeroSecurityExample = splitHeroExamples.security;

export const CenteredHeroSimpleExample = centeredHeroExamples.simple;
export const CenteredHeroWithTopButtonExample = centeredHeroExamples.withTopButton;
export const CenteredHeroWithImageExample = centeredHeroExamples.withImage;
export const CenteredHeroWithStatsExample = centeredHeroExamples.withStats;
export const CenteredHeroMissionExample = centeredHeroExamples.mission;


function HeroBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      <SplitHeroMediaExample />
      <SplitHeroLeftMediaExample />
      <SplitHeroGalleryExample />
      <SplitHeroWithTopButtonExample />
      <SplitHeroSecurityExample />
      <CenteredHeroSimpleExample />
      <CenteredHeroWithTopButtonExample />
      <CenteredHeroWithImageExample />
      <CenteredHeroWithStatsExample />
      <CenteredHeroMissionExample />
    </div>
  );
}

export default HeroBlocks;