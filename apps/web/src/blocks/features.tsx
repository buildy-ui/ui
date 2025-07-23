import { FeaturesGridMediaCards, featuresGridMediaCardsTemplate } from "@ui8kit/blocks/features/FeaturesGridMediaCards";
import { FeaturesSplitLeftMedia, featuresSplitLeftMediaTemplate } from "@ui8kit/blocks/features/FeaturesSplitLeftMedia";
import { FeaturesSplitMedia, featuresSplitMediaTemplate } from "@ui8kit/blocks/features/FeaturesSplitMedia";
import { FeaturesThreeColumnsIcons, featuresThreeColumnsIconsTemplate } from "@ui8kit/blocks/features/FeaturesThreeColumnsIcons";

function FeaturesBlocks() {
  return (
    <div>
      <FeaturesGridMediaCards content={featuresGridMediaCardsTemplate.defaultContent} />
      <FeaturesSplitLeftMedia content={featuresSplitLeftMediaTemplate.defaultContent} />
      <FeaturesSplitMedia content={featuresSplitMediaTemplate.defaultContent} />
      <FeaturesThreeColumnsIcons content={featuresThreeColumnsIconsTemplate.defaultContent} />
    </div>
  );
}

export default FeaturesBlocks;