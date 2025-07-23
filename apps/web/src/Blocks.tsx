import HeroBlocks from "./blocks/hero";
import BlogBlocks from "./blocks/blog";
// import BusinessBlocks from "./blocks/business";
import FeaturesBlocks from "./blocks/features";
// import CTABlocks from "./blocks/cta";
// import { FooterFourColumns } from "@twblocks/blocks/footer/FooterFourColumns";

function Blocks() {
  return (
    <div>
      <HeroBlocks />
      <BlogBlocks />
      {/*<BusinessBlocks />*/}
      <FeaturesBlocks />
      {/*<CTABlocks />*/}
      {/*<FooterFourColumns />*/}
    </div>
  );
}

export default Blocks;