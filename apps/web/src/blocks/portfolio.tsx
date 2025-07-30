import { gridPortfolioExamples } from "@ui8kit/blocks/portfolio/GridPortfolio.examples";
import { splitPortfolioExamples } from "@ui8kit/blocks/portfolio/SplitPortfolio.examples";
import { Divider } from "./ui/divider";

// New Factory-based Portfolio Examples
export const GridPortfolioCardsExample = gridPortfolioExamples.cards;
export const GridPortfolioMasonryExample = gridPortfolioExamples.masonry;
export const GridPortfolioMinimalExample = gridPortfolioExamples.minimal;
export const GridPortfolioDetailedExample = gridPortfolioExamples.detailed;
export const GridPortfolioShowcaseExample = gridPortfolioExamples.showcase;

export const SplitPortfolioShowcaseExample = splitPortfolioExamples.showcase;
export const SplitPortfolioAboutExample = splitPortfolioExamples.about;
export const SplitPortfolioSkillsExample = splitPortfolioExamples.skills;
export const SplitPortfolioTestimonialExample = splitPortfolioExamples.testimonial;
export const SplitPortfolioProcessExample = splitPortfolioExamples.process;

function PortfolioBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Grid Portfolio Examples */}
      <Divider text="1. GridPortfolioCardsExample" />
      <GridPortfolioCardsExample />
      <Divider text="2. GridPortfolioMasonryExample" />
      <GridPortfolioMasonryExample />
      <Divider text="3. GridPortfolioMinimalExample" />
      <GridPortfolioMinimalExample />
      <Divider text="4. GridPortfolioDetailedExample" />
      <GridPortfolioDetailedExample />
      <Divider text="5. GridPortfolioShowcaseExample" />
      <GridPortfolioShowcaseExample />
      
      {/* Split Portfolio Examples */}
      <Divider text="6. SplitPortfolioShowcaseExample" />
      <SplitPortfolioShowcaseExample />
      <Divider text="7. SplitPortfolioAboutExample" />
      <SplitPortfolioAboutExample />
      <Divider text="8. SplitPortfolioSkillsExample" />
      <SplitPortfolioSkillsExample />
      <Divider text="9. SplitPortfolioTestimonialExample" />
      <SplitPortfolioTestimonialExample />
      <Divider text="10. SplitPortfolioProcessExample" />
      <SplitPortfolioProcessExample />
    </div>
  );
}

export default PortfolioBlocks;