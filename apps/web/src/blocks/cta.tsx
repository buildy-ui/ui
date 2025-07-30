import { centeredCTAExamples } from "@ui8kit/blocks/cta/CenteredCTA.examples";
import { splitCTAExamples } from "@ui8kit/blocks/cta/SplitCTA.examples";
import { Divider } from "./ui/divider";

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
      <Divider text="1. CenteredCTASimpleExample" />
      <CenteredCTASimpleExample />
      <Divider text="2. CenteredCTAWithLogosExample" />
      <CenteredCTAWithLogosExample />
      <Divider text="3. CenteredCTAWithBackgroundExample" />
      <CenteredCTAWithBackgroundExample />
      <Divider text="4. CenteredCTAWithFeaturesExample" />
      <CenteredCTAWithFeaturesExample />
      <Divider text="5. CenteredCTAWithStatsExample" />
      <CenteredCTAWithStatsExample />
      
      {/* Split CTA Examples */}
      <Divider text="6. SplitCTAWithImageExample" />
      <SplitCTAWithImageExample />
      <Divider text="7. SplitCTAWithBackgroundExample" />
      <SplitCTAWithBackgroundExample />
      <Divider text="8. SplitCTAWithStatsExample" />
      <SplitCTAWithStatsExample />
      <Divider text="9. SplitCTAWithDevicesExample" />
      <SplitCTAWithDevicesExample />
      <Divider text="10. SplitCTAWithFeaturesExample" />
      <SplitCTAWithFeaturesExample />
    </div>
  );
}

export default CTABlocks;