import { BusinessCardsGallery, businessCardsGalleryTemplate } from "@ui8kit/blocks/business/BusinessCardsGallery";
import { BusinessSolutionsGrid, businessSolutionsGridTemplate } from "@ui8kit/blocks/business/BusinessSolutionsGrid";
import { CareerSection, careerSectionTemplate } from "@ui8kit/blocks/business/CareerSection";
import { PricingSection, pricingSectionTemplate } from "@ui8kit/blocks/business/PricingSection";
import { PricingYearSection, pricingYearSectionTemplate } from "@ui8kit/blocks/business/PricingYearSection";

function BusinessBlocks() {
  return (
    <div>
      <BusinessCardsGallery content={businessCardsGalleryTemplate.defaultContent} />
      <BusinessSolutionsGrid content={businessSolutionsGridTemplate.defaultContent} />
      <CareerSection content={careerSectionTemplate.defaultContent} />
      <PricingSection content={pricingSectionTemplate.defaultContent} />
      <PricingYearSection content={pricingYearSectionTemplate.defaultContent} />
      </div>
  );
}

export default BusinessBlocks;