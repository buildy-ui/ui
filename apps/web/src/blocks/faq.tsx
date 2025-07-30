import { gridFAQExamples } from "@ui8kit/blocks/faq/GridFAQ.examples";
import { splitFAQExamples } from "@ui8kit/blocks/faq/SplitFAQ.examples";
import { Divider } from "./ui/divider";

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
      <Divider text="1. GridFAQCardsExample" />
      <GridFAQCardsExample />
      <Divider text="2. GridFAQAccordionExample" />
      <GridFAQAccordionExample />
      <Divider text="3. GridFAQCategoriesExample" />
      <GridFAQCategoriesExample />
      <Divider text="4. GridFAQCompactExample" />
      <GridFAQCompactExample />
      <Divider text="5. GridFAQSupportExample" />
      <GridFAQSupportExample />
      
      {/* Split FAQ Examples */}
      <Divider text="6. SplitFAQContactExample" />
      <SplitFAQContactExample />
      <Divider text="7. SplitFAQSearchExample" />
      <SplitFAQSearchExample />
      <Divider text="8. SplitFAQCategoriesExample" />
      <SplitFAQCategoriesExample />
      <Divider text="9. SplitFAQSupportExample" />
      <SplitFAQSupportExample />
      <Divider text="10. SplitFAQAccordionExample" />
      <SplitFAQAccordionExample />
    </div>
  );
}

export default FAQBlocks;