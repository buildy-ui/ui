import { FaqCenteredAccordionSection, faqCenteredAccordionSectionTemplate } from "@ui8kit/blocks/faq/FaqCenteredAccordionSection";
import { FaqSimpleListSection, faqSimpleListSectionTemplate } from "@ui8kit/blocks/faq/FaqSimpleListSection";
import { FaqGridCardsSection, faqGridCardsSectionTemplate } from "@ui8kit/blocks/faq/FaqGridCardsSection";
import { FaqTwoColumnsAccordionSection, faqTwoColumnsAccordionSectionTemplate } from "@ui8kit/blocks/faq/FaqTwoColumnsAccordionSection";

export const Faq = () => {
  return (
    <div className="flex flex-col gap-4">
      <FaqCenteredAccordionSection content={faqCenteredAccordionSectionTemplate.defaultContent} />
      <FaqSimpleListSection content={faqSimpleListSectionTemplate.defaultContent} />
      <FaqGridCardsSection content={faqGridCardsSectionTemplate.defaultContent} />
      <FaqTwoColumnsAccordionSection content={faqTwoColumnsAccordionSectionTemplate.defaultContent} />
    </div>
  );
};