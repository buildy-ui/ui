import { CallToActionCenteredSection, callToActionCenteredSectionTemplate } from "@ui8kit/blocks/cta/CallToActionCenteredSection";
import { CallToActionSection, callToActionSectionTemplate } from "@ui8kit/blocks/cta/CallToActionSection";

function CTABlocks() {
  return (
    <div>
      <CallToActionCenteredSection content={callToActionCenteredSectionTemplate.defaultContent} />
      <CallToActionSection content={callToActionSectionTemplate.defaultContent} />
    </div>
  );
}

export default CTABlocks;