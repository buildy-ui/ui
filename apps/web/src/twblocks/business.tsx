import { BusinessCardsGallery } from "@twblocks/blocks/business/BusinessCardsGallery";
import { BusinessSolutionsGrid } from "@twblocks/blocks/business/BusinessSolutionsGrid";
import { CareerSection } from "@twblocks/blocks/business/CareerSection";
import { PricingSection } from "@twblocks/blocks/business/PricingSection";
import { PricingYearSection } from "@twblocks/blocks/business/PricingYearSection";

function BusinessBlocks() {
  return (
    <div>
      <BusinessCardsGallery />
      <BusinessSolutionsGrid />
      <CareerSection />
      <PricingSection />
      <PricingYearSection />
      </div>
  );
}

export default BusinessBlocks;