import { centeredCTAExamples } from "@ui8kit/blocks/cta/CenteredCTA.examples";
import { splitCTAExamples } from "@ui8kit/blocks/cta/SplitCTA.examples";

// New Factory-based CTA Examples
export const CenteredCTASimpleExample = centeredCTAExamples.simple;
export const CenteredCTAWithLogosExample = centeredCTAExamples.withLogos;
export const CenteredCTAWithBackgroundExample = centeredCTAExamples.withBackground;
export const CenteredCTAWithFeaturesExample = centeredCTAExamples.withFeatures;
export const CenteredCTAWithStatsExample = centeredCTAExamples.withStats;

export const SplitCTAWithImageExample = splitCTAExamples.withImage;
export const SplitCTAWithBackgroundExample = splitCTAExamples.withBackground;
export const SplitCTAWithStatsExample = splitCTAExamples.withStats;
export const SplitCTAWithDevicesExample = splitCTAExamples.withDevices;
export const SplitCTAWithFeaturesExample = splitCTAExamples.withFeatures;

function CTABlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Centered CTA Examples */}
      <CenteredCTASimpleExample />
      <CenteredCTAWithLogosExample />
      <CenteredCTAWithBackgroundExample />
      <CenteredCTAWithFeaturesExample />
      <CenteredCTAWithStatsExample />
      
      {/* Split CTA Examples */}
      <SplitCTAWithImageExample />
      <SplitCTAWithBackgroundExample />
      <SplitCTAWithStatsExample />
      <SplitCTAWithDevicesExample />
      <SplitCTAWithFeaturesExample />
    </div>
  );
}

export default CTABlocks;