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

const Divider = ( { text }: { text: string } ) => {
  return (
    <div className="relative flex py-5 items-center">
      <div className="flex-grow border-t border-border"></div>
      <span className="flex-shrink mx-4 text-muted-foreground text-sm">{text}</span>
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
};

function HeroBlocks() {
    {/* Debugging: divide-y divide-border divide-amber-500 */}
  return (
    <div className="flex flex-col">
      <Divider text="1. SplitHeroMediaExample" />
      <SplitHeroMediaExample />
      <Divider text="2. SplitHeroLeftMediaExample" />
      <SplitHeroLeftMediaExample />
      <Divider text="3. SplitHeroGalleryExample" />
      <SplitHeroGalleryExample />
      <Divider text="4. SplitHeroWithTopButtonExample" />
      <SplitHeroWithTopButtonExample />
      <Divider text="5. SplitHeroSecurityExample" />
      <SplitHeroSecurityExample />
      <Divider text="6. CenteredHeroSimpleExample" />
      <CenteredHeroSimpleExample />
      <Divider text="7. CenteredHeroWithTopButtonExample" />
      <CenteredHeroWithTopButtonExample />
      <Divider text="8. CenteredHeroWithImageExample" />
      <CenteredHeroWithImageExample />
      <Divider text="9. CenteredHeroWithStatsExample" />
      <CenteredHeroWithStatsExample />
      <Divider text="10. CenteredHeroMissionExample" />
      <CenteredHeroMissionExample />
    </div>
  );
}

export default HeroBlocks;