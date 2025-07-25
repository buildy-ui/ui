import { FaqAccordion } from "@twblocks/blocks/inbox/FaqAccordion";
import { FaqGrid } from "@twblocks/blocks/inbox/FaqGrid";

export const Faq = () => {
  return (
    <div className="flex flex-col gap-4">
      <FaqAccordion />
      <FaqGrid />
    </div>
  );
};