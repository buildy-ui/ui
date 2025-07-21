/*import { allComponents } from "../blocks";
export const blocks = allComponents;
const HeroCenteredSection = blocks.HeroCenteredSection;*/

import { HeroCenteredSection } from "@twblocks/blocks/hero/HeroCenteredSection";
import { HeroSplitWithMedia } from "@twblocks/blocks/hero/HeroSplitWithMedia";

function Blocks() {
  return (
    <div>
      <HeroCenteredSection />
      <HeroSplitWithMedia />
    </div>
  );
}

export default Blocks;