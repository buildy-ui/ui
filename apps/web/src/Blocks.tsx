// import HeroBlocks from "./blocks/hero";
// import NewHeroBlocks from "./blocks/new-hero";
// import BlogBlocks from "./blocks/blog";
import BusinessBlocks from "./blocks/business";
// import FeaturesBlocks from "./blocks/features";
// import CTABlocks from "./blocks/cta";
// import { FooterFourColumns, footerFourColumnsTemplate } from "@ui8kit/blocks/footer/FooterFourColumns";
// import { Faq } from "./blocks/faq";
// import { Testimonials } from "./blocks/testimonial";
// import { Team } from "./blocks/team";
// import { Post } from "./blocks/post";
// import { Portfolio } from "./blocks/portfolio";
// import { Gallery } from "./blocks/gallery";
// import CoreUI from "./CoreUI";

function Blocks() {
  return (
    <div>
      <hr className=" border-primary/50 border-4 border-dashed" />
      {/*<HeroBlocks />*/}
      {/*<NewHeroBlocks />*/}
      {/*<CoreUI />*/}
      {/*<BlogBlocks />*/}
      <BusinessBlocks />
      {/*<CTABlocks />*/}
      {/*<Testimonials />*/}
      {/*<Team />*/}
      {/*<Post />*/}
      {/*<Portfolio />*/}
      {/*<Gallery />*/}
      {/* <Faq /> */}
      {/*<hr className=" border-primary/50 border-4 border-dashed" />
      <FooterFourColumns content={footerFourColumnsTemplate.defaultContent} />*/}
    </div>
  );
}

export default Blocks;