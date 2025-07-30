// Import block collections
// import HeroBlocks from "./blocks/hero";
// import NewHeroBlocks from "./blocks/new-hero";
// import BlogBlocks from "./blocks/blog";
// import BusinessBlocks from "./blocks/business";
// import CTABlocks from "./blocks/cta";
// import FAQBlocks from "./blocks/faq";
// import PortfolioBlocks from "./blocks/portfolio";
// import PostBlocks from "./blocks/post";
// import GalleryBlocks from "./blocks/gallery";
// import FeaturesBlocks from "./blocks/features";
// import TeamBlocks from "./blocks/team";
import TestimonialBlocks from "./blocks/testimonial";
// import FooterBlocks from "./blocks/footer"; // Uncommented

// Core UI Examples
// import CoreUI from "./CoreUI";

function Blocks() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">UI8Kit Blocks</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Factory-based core ui component architecture showcase
          </p>
        </div>

        <div className="w-full divide-y divide-border">
          <TestimonialBlocks />
          {/* <FooterBlocks /> */}
        </div>
      </div>
    </div>
  );
}

export default Blocks;