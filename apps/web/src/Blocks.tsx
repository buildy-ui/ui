// Import block collections
// import HeroBlocks from "./blocks/hero";
// import BlogBlocks from "./blocks/blog";
// import BusinessBlocks from "./blocks/business";
// import CTABlocks from "./blocks/cta";
// import FAQBlocks from "./blocks/faq";
// import PortfolioBlocks from "./blocks/portfolio";
// import PostBlocks from "./blocks/post";
// import FeaturesBlocks from "./blocks/features";
// import GalleryBlocks from "./blocks/gallery";
import TeamBlocks from "./blocks/team";
// import TestimonialBlocks from "./blocks/testimonial";
// import FooterBlocks from "./blocks/footer"; // Uncommented

// Core UI Examples
// import CoreUI from "./CoreUI"; 

function Blocks() {
  return (
    <div className="w-full divide-y divide-border">
      {/* <HeroBlocks /> */}
      {/* <BlogBlocks /> */}
      {/* <CTABlocks /> */}
      {/* <FAQBlocks /> */}
      {/* <PortfolioBlocks /> */}
      {/* <PostBlocks /> */}
      {/* <FeaturesBlocks /> */}
      {/* <GalleryBlocks /> */}
      <TeamBlocks />
      {/* <BusinessBlocks /> */}
      {/* <FooterBlocks /> */}
    </div>
  );
}

export default Blocks;