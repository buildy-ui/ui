// import HeroBlocks from "./blocks/hero";
// import NewHeroBlocks from "./blocks/new-hero";
// import BlogBlocks from "./blocks/blog";
// import BusinessBlocks from "./blocks/business";
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
import { splitFeaturesExamples } from "@ui8kit/blocks/features/SplitFeatures.examples";
import { gridFeaturesExamples } from "@ui8kit/blocks/features/GridFeatures.examples";

export const SplitFeaturesMediaExample = splitFeaturesExamples.media;
export const SplitFeaturesLeftMediaExample = splitFeaturesExamples.leftMedia;
export const SplitFeaturesAnalyticsExample = splitFeaturesExamples.analytics;
export const SplitFeaturesSecurityExample = splitFeaturesExamples.security;
export const SplitFeaturesPerformanceExample = splitFeaturesExamples.performance;


export const GridFeaturesThreeColumnsExample = gridFeaturesExamples.threeColumns;
export const GridFeaturesThreeColumnsIconsExample = gridFeaturesExamples.threeColumnsIcons;
export const GridFeaturesMediaCardsExample = gridFeaturesExamples.mediaCards;
export const GridFeaturesCareerPositionsExample = gridFeaturesExamples.careerPositions;
export const GridFeaturesCareerStatsExample = gridFeaturesExamples.careerStats;

function Blocks() {
  return (
    <div>
      <hr className=" border-primary/50 border-4 border-dashed" />
      {/* <HeroBlocks />
      <hr className=" border-primary/50 border-4 border-dashed" /> */}
      {/*<NewHeroBlocks />*/}
      {/*<CoreUI />*/}
      {/*<BlogBlocks />*/}
      {/*<BusinessBlocks />*/}
      <SplitFeaturesMediaExample />
      <SplitFeaturesLeftMediaExample />
      <SplitFeaturesAnalyticsExample />
      <SplitFeaturesSecurityExample />
      <SplitFeaturesPerformanceExample />
      <GridFeaturesThreeColumnsExample />
      <GridFeaturesThreeColumnsIconsExample />
      <GridFeaturesMediaCardsExample />
      <GridFeaturesCareerPositionsExample />
      <GridFeaturesCareerStatsExample />
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