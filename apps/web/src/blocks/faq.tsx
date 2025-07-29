import { gridFAQExamples } from "@ui8kit/blocks/faq/GridFAQ.examples";
import { splitFAQExamples } from "@ui8kit/blocks/faq/SplitFAQ.examples";

// New Factory-based FAQ Examples
export const GridFAQCardsExample = gridFAQExamples.cards;
export const GridFAQAccordionExample = gridFAQExamples.accordion;
export const GridFAQCategoriesExample = gridFAQExamples.categories;
export const GridFAQCompactExample = gridFAQExamples.compact;
export const GridFAQSupportExample = gridFAQExamples.support;

export const SplitFAQContactExample = splitFAQExamples.contact;
export const SplitFAQSearchExample = splitFAQExamples.search;
export const SplitFAQCategoriesExample = splitFAQExamples.categories;
export const SplitFAQSupportExample = splitFAQExamples.support;
export const SplitFAQAccordionExample = splitFAQExamples.accordion;

function FAQBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Grid FAQ Examples */}
      <GridFAQCardsExample />
      <GridFAQAccordionExample />
      <GridFAQCategoriesExample />
      <GridFAQCompactExample />
      <GridFAQSupportExample />
      
      {/* Split FAQ Examples */}
      <SplitFAQContactExample />
      <SplitFAQSearchExample />
      <SplitFAQCategoriesExample />
      <SplitFAQSupportExample />
      <SplitFAQAccordionExample />
    </div>
  );
}

export default FAQBlocks;