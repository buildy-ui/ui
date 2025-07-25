// import HeroBlocks from "./blocks/hero";
// import BlogBlocks from "./blocks/blog";
// import BusinessBlocks from "./blocks/business";
// import FeaturesBlocks from "./blocks/features";
// import CTABlocks from "./blocks/cta";
import { FooterFourColumns, footerFourColumnsTemplate } from "@ui8kit/blocks/footer/FooterFourColumns";
// import { Faq } from "./blocks/faq";
// import { Testimonials } from "./blocks/testimonial";
import { Team } from "./blocks/team";

function Blocks() {
  return (
    <div>
      {/*<HeroBlocks />*/}
      {/*<BlogBlocks />*/}
      {/*<BusinessBlocks />*/}
      {/*<FeaturesBlocks />*/}
      {/*<CTABlocks />*/}
      {/*<Testimonials />*/}
      <Team />
      {/* <Faq /> */}
      <FooterFourColumns content={footerFourColumnsTemplate.defaultContent} />
    </div>
  );
}

export default Blocks;