// import HeroBlocks from "./blocks/hero";
// import BlogBlocks from "./blocks/blog";
// import BusinessBlocks from "./blocks/business";
// import FeaturesBlocks from "./blocks/features";
// import CTABlocks from "./blocks/cta";
import { FooterFourColumns, footerFourColumnsTemplate } from "@ui8kit/blocks/footer/FooterFourColumns";
import { Faq } from "./twblocks/faq";

function Blocks() {
  return (
    <div>
      {/*<HeroBlocks />*/}
      {/*<BlogBlocks />*/}
      {/*<BusinessBlocks />*/}
      {/*<FeaturesBlocks />*/}
      {/*<CTABlocks />*/}
      <Faq />
      <FooterFourColumns content={footerFourColumnsTemplate.defaultContent} />
    </div>
  );
}

export default Blocks;