import { HeroBlock } from "@ui8kit/blocks/hero/HeroBlock";
//import { HeroSplitWithMedia } from "@ui8kit/blocks/hero/HeroSplitWithMedia";
//import { HeroCenteredWithTopButton } from "@ui8kit/blocks/hero/HeroCenteredWithTopButton";
//import { HeroSplitWithGallery } from "@ui8kit/blocks/hero/HeroSplitWithGallery";

const heroBlockContent = {
  title: "Hero Block",
  subtitle: "This is a subtitle",
  buttonText: "Click me",
  learnMoreText: "Learn more",
  backgroundImage: "https://via.placeholder.com/150"
}

function HeroBlocks() {
  return (
    <div>
      <HeroBlock content={heroBlockContent} />
      {/*<HeroSplitWithMedia />
      <HeroCenteredWithTopButton />
      <HeroSplitWithGallery />*/}
    </div>
  );
}

export default HeroBlocks;