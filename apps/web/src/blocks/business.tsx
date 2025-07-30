import { gridBusinessExamples } from "@ui8kit/blocks/business/GridBusiness.examples";
import { splitBusinessExamples } from "@ui8kit/blocks/business/SplitBusiness.examples";
import { Divider } from "./ui/divider";

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
      <Divider text="1. GridBusinessCardsGalleryExample" />
      <GridBusinessCardsGalleryExample />
      <Divider text="2. GridBusinessSolutionsGridExample" />
      <GridBusinessSolutionsGridExample />
      <Divider text="3. GridBusinessPricingExample" />
      <GridBusinessPricingExample />
      <Divider text="4. GridBusinessPricingYearExample" />
      <GridBusinessPricingYearExample />
      <Divider text="5. GridBusinessCareerExample" />
      <GridBusinessCareerExample />
      <Divider text="6. SplitBusinessSolutionsExample" />
      <SplitBusinessSolutionsExample />
      <Divider text="7. SplitBusinessMetricsExample" />
      <SplitBusinessMetricsExample />
      <Divider text="8. SplitBusinessTestimonialExample" />
      <SplitBusinessTestimonialExample />
      <Divider text="9. SplitBusinessFeaturesExample" />
      <SplitBusinessFeaturesExample />
      <Divider text="10. SplitBusinessAboutExample" />
      <SplitBusinessAboutExample />
    </div>
  );
}

export default BusinessBlocks;