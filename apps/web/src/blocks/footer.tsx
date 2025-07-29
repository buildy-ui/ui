import {
  // Split Footer Examples
  SplitFooterBrandExample,
  SplitFooterNewsletterExample,
  SplitFooterContactExample,
  SplitFooterSocialExample,
  SplitFooterMinimalExample,
  
  // Grid Footer Examples
  GridFooterColumnsExample,
  GridFooterMegaExample,
  GridFooterCompactExample,
  GridFooterNewsletterExample,
  GridFooterSitemapExample
} from "@ui8kit/blocks/footer";

export default function FooterBlocks() {
  return (
    <>
      {/* Split Footer Examples (5 variants) */}
      <SplitFooterBrandExample />
      <SplitFooterNewsletterExample />
      <SplitFooterContactExample />
      <SplitFooterSocialExample />
      <SplitFooterMinimalExample />
      
      {/* Grid Footer Examples (5 variants) */}
      <GridFooterColumnsExample />
      <GridFooterMegaExample />
      <GridFooterCompactExample />
      <GridFooterNewsletterExample />
      <GridFooterSitemapExample />
    </>
  );
}