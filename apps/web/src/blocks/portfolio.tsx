import { gridPortfolioExamples } from "@ui8kit/blocks/portfolio/GridPortfolio.examples";
import { splitPortfolioExamples } from "@ui8kit/blocks/portfolio/SplitPortfolio.examples";

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
      <GridPortfolioCardsExample />
      <GridPortfolioMasonryExample />
      <GridPortfolioMinimalExample />
      <GridPortfolioDetailedExample />
      <GridPortfolioShowcaseExample />
      
      {/* Split Portfolio Examples */}
      <SplitPortfolioShowcaseExample />
      <SplitPortfolioAboutExample />
      <SplitPortfolioSkillsExample />
      <SplitPortfolioTestimonialExample />
      <SplitPortfolioProcessExample />
    </div>
  );
}

export default PortfolioBlocks;