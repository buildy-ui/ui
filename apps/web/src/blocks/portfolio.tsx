import { PortfolioGridSection, portfolioGridSectionTemplate } from "@ui8kit/blocks/portfolio/PortfolioGridSection";
import { PortfolioTwoColumnsSection, portfolioTwoColumnsSectionTemplate } from "@ui8kit/blocks/portfolio/PortfolioTwoColumnsSection";
import { PortfolioWithButtonsSection, portfolioWithButtonsSectionTemplate } from "@ui8kit/blocks/portfolio/PortfolioWithButtonsSection";
import { PortfolioDetailsSection, portfolioDetailsSectionTemplate } from "@ui8kit/blocks/portfolio/PortfolioDetailsSection";
import { PortfolioHorizontalSection, portfolioHorizontalSectionTemplate } from "@ui8kit/blocks/portfolio/PortfolioHorizontalSection";

export const Portfolio = () => {
  return (
    <>
      <PortfolioGridSection content={portfolioGridSectionTemplate.defaultContent} />
      <PortfolioTwoColumnsSection content={portfolioTwoColumnsSectionTemplate.defaultContent} />
      <PortfolioWithButtonsSection content={portfolioWithButtonsSectionTemplate.defaultContent} />
      <PortfolioDetailsSection content={portfolioDetailsSectionTemplate.defaultContent} />
      <PortfolioHorizontalSection content={portfolioHorizontalSectionTemplate.defaultContent} />
    </>
  );
};