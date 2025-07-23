import { BusinessCardsGallery } from "@ui8kit/blocks/business/BusinessCardsGallery";
import { BusinessSolutionsGrid } from "@ui8kit/blocks/business/BusinessSolutionsGrid";
import { CareerSection } from "@ui8kit/blocks/business/CareerSection";
import { PricingSection } from "@ui8kit/blocks/business/PricingSection";
import { PricingYearSection } from "@ui8kit/blocks/business/PricingYearSection";

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