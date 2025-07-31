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
import { Divider } from "./ui/divider";

function Blocks() {
  return (
    <div>
      <Divider text="1. SplitFeaturesMediaExample" />
      <SplitFeaturesMediaExample />
      <Divider text="2. SplitFeaturesLeftMediaExample" />
      <SplitFeaturesLeftMediaExample />
      <Divider text="3. SplitFeaturesAnalyticsExample" />
      <SplitFeaturesAnalyticsExample />
      <Divider text="4. SplitFeaturesSecurityExample" />
      <SplitFeaturesSecurityExample />
      <Divider text="5. SplitFeaturesPerformanceExample" />
      <SplitFeaturesPerformanceExample />
      <Divider text="6. GridFeaturesThreeColumnsExample" />
      <GridFeaturesThreeColumnsExample />
      <Divider text="7. GridFeaturesThreeColumnsIconsExample" />
      <GridFeaturesThreeColumnsIconsExample />
      <Divider text="8. GridFeaturesMediaCardsExample" />
      <GridFeaturesMediaCardsExample />
      <Divider text="9. GridFeaturesCareerPositionsExample" />
      <GridFeaturesCareerPositionsExample />
      <Divider text="10. GridFeaturesCareerStatsExample" />
      <GridFeaturesCareerStatsExample />
    </div>
  );
}

export default Blocks;