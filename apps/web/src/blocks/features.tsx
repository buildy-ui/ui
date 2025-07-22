import { FeaturesGridMediaCards } from "@twblocks/blocks/features/FeaturesGridMediaCards";
import { FeaturesSplitLeftMedia } from "@twblocks/blocks/features/FeaturesSplitLeftMedia";
import { FeaturesSplitMedia } from "@twblocks/blocks/features/FeaturesSplitMedia";
import { FeaturesThreeColumns } from "@twblocks/blocks/features/FeaturesThreeColumns";
// import { FeaturesThreeColumnsIcons } from "@twblocks/blocks/features/FeaturesThreeColumnsIcons";

function FeaturesBlocks() {
  return (
    <div>
      <FeaturesGridMediaCards />
      <FeaturesSplitLeftMedia />
      <FeaturesSplitMedia />
      <FeaturesThreeColumns />
      {/*<FeaturesThreeColumnsIcons />*/}
    </div>
  );
}

export default FeaturesBlocks;