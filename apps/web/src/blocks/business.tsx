import { gridBusinessExamples } from "@ui8kit/blocks/business/GridBusiness.examples";
import { splitBusinessExamples } from "@ui8kit/blocks/business/SplitBusiness.examples";

export const GridBusinessCardsGalleryExample = gridBusinessExamples.cardsGallery;
export const GridBusinessSolutionsGridExample = gridBusinessExamples.solutionsGrid;
export const GridBusinessPricingExample = gridBusinessExamples.pricing;
export const GridBusinessPricingYearExample = gridBusinessExamples.pricingYear;
export const GridBusinessCareerExample = gridBusinessExamples.career;

export const SplitBusinessSolutionsExample = splitBusinessExamples.solutions;
export const SplitBusinessMetricsExample = splitBusinessExamples.metrics;
export const SplitBusinessTestimonialExample = splitBusinessExamples.testimonial;
export const SplitBusinessFeaturesExample = splitBusinessExamples.features;
export const SplitBusinessAboutExample = splitBusinessExamples.about;

function BusinessBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      <GridBusinessCardsGalleryExample />
      <GridBusinessSolutionsGridExample />
      <GridBusinessPricingExample />
      <GridBusinessPricingYearExample />
      <GridBusinessCareerExample />
      <SplitBusinessSolutionsExample />
      <SplitBusinessMetricsExample />
      <SplitBusinessTestimonialExample />
      <SplitBusinessFeaturesExample />
      <SplitBusinessAboutExample />
    </div>
  );
}

export default BusinessBlocks;