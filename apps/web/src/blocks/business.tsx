import { BusinessCardsGallery, businessCardsGalleryTemplate } from "@ui8kit/blocks/business/BusinessCardsGallery";
import { BusinessSolutionsGrid, businessSolutionsGridTemplate } from "@ui8kit/blocks/business/BusinessSolutionsGrid";
import { CareerSection, careerSectionTemplate } from "@ui8kit/blocks/business/CareerSection";
import { PricingSection, pricingSectionTemplate } from "@ui8kit/blocks/business/PricingSection";
import { PricingYearSection, pricingYearSectionTemplate } from "@ui8kit/blocks/business/PricingYearSection";

function BusinessBlocks() {
  return (
    <div>
      <BusinessCardsGallery content={businessCardsGalleryTemplate.defaultContent} />
      
      {/* Fully customized BusinessSolutionsGrid with gradient brand styling */}
      <BusinessSolutionsGrid 
        content={businessSolutionsGridTemplate.defaultContent}
        // Block-level customization
        blockProps={{
          py: "xl",
          bg: "transparent"
        }}
        blockClassName="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"
        
        // Container customization
        containerProps={{
          size: "lg",
          padding: "lg"
        }}
        
        // Badge customization
        badgeProps={{
          radius: "full",
          size: "sm",
          variant: "secondary"
        }}
        badgeClassName="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-0"
        
        // Title customization
        titleProps={{
          size: "3xl",
          fw: "bold",
          order: 1
        }}
        titleClassName="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
        
        // Description customization
        descriptionProps={{
          size: "lg",
          c: "mutedForeground"
        }}
        descriptionClassName="max-w-4xl"
        
        // Grid customization
        gridProps={{
          gap: "lg"
        }}
        
        // Card customization
        cardProps={{
          variant: "outlined",
          padding: "lg",
          radius: "lg"
        }}
        cardClassName="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group"
        
        // Icon customization
        iconBoxProps={{
          size: "xl",
          bg: "transparent",
          rounded: "lg"
        }}
        iconBoxClassName="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
        
        iconProps={{
          size: "lg"
        }}
        iconClassName="text-white"
        
        // Card title customization
        cardTitleProps={{
          size: "xl",
          fw: "bold"
        }}
        cardTitleClassName="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
        
        // Card description customization
        cardDescriptionProps={{
          size: "md",
          c: "mutedForeground"
        }}
        cardDescriptionClassName="leading-relaxed"
      />
      
      <CareerSection content={careerSectionTemplate.defaultContent} />
      <PricingSection content={pricingSectionTemplate.defaultContent} />
      <PricingYearSection content={pricingYearSectionTemplate.defaultContent} />
    </div>
  );
}

export default BusinessBlocks;