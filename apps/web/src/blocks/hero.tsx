import { HeroBlock, heroBlockTemplate } from "@ui8kit/blocks/hero/HeroBlock";
import { HeroWithImageSection, heroWithImageSectionTemplate } from "@ui8kit/blocks/hero/HeroWithImageSection";
import { HeroCenteredSection, heroCenteredSectionTemplate } from "@ui8kit/blocks/hero/HeroCenteredSection";
import { HeroCenteredWithTopButton, heroCenteredWithTopButtonTemplate } from "@ui8kit/blocks/hero/HeroCenteredWithTopButton";
import { HeroSplitWithMedia, heroSplitWithMediaTemplate } from "@ui8kit/blocks/hero/HeroSplitWithMedia";
import { HeroSplitWithGallery, heroSplitWithGalleryTemplate } from "@ui8kit/blocks/hero/HeroSplitWithGallery";

function HeroBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      <HeroBlock content={heroBlockTemplate.defaultContent} />
      <HeroWithImageSection content={heroWithImageSectionTemplate.defaultContent} />
      <HeroCenteredSection content={heroCenteredSectionTemplate.defaultContent} />
      <HeroCenteredWithTopButton content={heroCenteredWithTopButtonTemplate.defaultContent} />
      <HeroSplitWithMedia content={heroSplitWithMediaTemplate.defaultContent} />
      <HeroSplitWithMedia content={heroSplitWithMediaTemplate.defaultContent} leftImage />
      <HeroSplitWithGallery content={heroSplitWithGalleryTemplate.defaultContent} />
      <HeroSplitWithGallery content={heroSplitWithGalleryTemplate.defaultContent} leftImage />
    </div>
  );
}

export default HeroBlocks;