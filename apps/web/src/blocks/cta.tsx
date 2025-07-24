import { CallToActionCenteredSection, callToActionCenteredSectionTemplate } from "@ui8kit/blocks/cta/CallToActionCenteredSection";
import { CallToActionSection, callToActionSectionTemplate } from "@ui8kit/blocks/cta/CallToActionSection";
import { CallToActionCenteredWithLogos, callToActionCenteredWithLogosTemplate } from "@ui8kit/blocks/cta/CallToActionCenteredWithLogos";
import { CallToActionCenteredWithBackground, callToActionCenteredWithBackgroundTemplate } from "@ui8kit/blocks/cta/CallToActionCenteredWithBackground";
import { CallToActionWithBackground, callToActionWithBackgroundTemplate } from "@ui8kit/blocks/cta/CallToActionWithBackground";
import { CallToActionSplitWithImage, callToActionSplitWithImageTemplate } from "@ui8kit/blocks/cta/CallToActionSplitWithImage";
import { CallToActionWithBackgroundGradient, callToActionWithBackgroundGradientTemplate } from "@ui8kit/blocks/cta/CallToActionWithBackgroundGradient";
function CTABlocks() {
  return (
    <div>
      <CallToActionCenteredSection content={callToActionCenteredSectionTemplate.defaultContent} />
      <CallToActionSection content={callToActionSectionTemplate.defaultContent} />
      <CallToActionCenteredWithLogos content={callToActionCenteredWithLogosTemplate.defaultContent} />
      <CallToActionCenteredWithBackground content={callToActionCenteredWithBackgroundTemplate.defaultContent} />
      <CallToActionWithBackground content={callToActionWithBackgroundTemplate.defaultContent} />
      <CallToActionSplitWithImage content={callToActionSplitWithImageTemplate.defaultContent} />
      <CallToActionWithBackgroundGradient content={callToActionWithBackgroundGradientTemplate.defaultContent} />
    </div>
  );
}

export default CTABlocks;