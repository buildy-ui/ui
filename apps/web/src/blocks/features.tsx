import { FeaturesGridMediaCards, featuresGridMediaCardsTemplate } from "@ui8kit/blocks/features/FeaturesGridMediaCards";
import { FeaturesSplitLeftMedia, featuresSplitLeftMediaTemplate } from "@ui8kit/blocks/features/FeaturesSplitLeftMedia";
import { FeaturesSplitMedia, featuresSplitMediaTemplate } from "@ui8kit/blocks/features/FeaturesSplitMedia";
import { FeaturesThreeColumnsIcons, featuresThreeColumnsIconsTemplate } from "@ui8kit/blocks/features/FeaturesThreeColumnsIcons";
import { FeaturesCareerPositions, featuresCareerPositionsTemplate } from "@ui8kit/blocks/features/FeaturesCareerPositions";
import { FeaturesCareerStats, featuresCareerStatsTemplate } from "@ui8kit/blocks/features/FeaturesCareerStats";

function FeaturesBlocks() {
  return (
    <div>
      <FeaturesGridMediaCards content={featuresGridMediaCardsTemplate.defaultContent} />
      <FeaturesSplitLeftMedia content={featuresSplitLeftMediaTemplate.defaultContent} />
      <FeaturesSplitMedia content={featuresSplitMediaTemplate.defaultContent} />
      <FeaturesThreeColumnsIcons content={featuresThreeColumnsIconsTemplate.defaultContent} />
      <FeaturesCareerPositions content={featuresCareerPositionsTemplate.defaultContent} />
      <FeaturesCareerStats content={featuresCareerStatsTemplate.defaultContent} />
    </div>
  );
}

export default FeaturesBlocks;