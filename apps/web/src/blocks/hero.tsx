/*import { allComponents } from "../blocks";
export const blocks = allComponents;
const HeroCenteredSection = blocks.HeroCenteredSection;*/

import { HeroCenteredSection } from "@twblocks/blocks/hero/HeroCenteredSection";
import { HeroSplitWithMedia } from "@twblocks/blocks/hero/HeroSplitWithMedia";
import { HeroCenteredWithTopButton } from "@twblocks/blocks/hero/HeroCenteredWithTopButton";
import { HeroSplitWithGallery } from "@twblocks/blocks/hero/HeroSplitWithGallery";

function HeroBlocks() {
  return (
    <div>
      <HeroCenteredSection />
      <HeroSplitWithMedia />
      <HeroCenteredWithTopButton />
      <HeroSplitWithGallery />
    </div>
  );
}

export default HeroBlocks;