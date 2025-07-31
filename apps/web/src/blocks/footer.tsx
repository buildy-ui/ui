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
import { Divider } from "./ui/divider";

export default function FooterBlocks() {
  return (
    <>
      {/* Split Footer Examples (5 variants) */}
      <Divider text="1. SplitFooterBrandExample" />
      <SplitFooterBrandExample />
      <Divider text="2. SplitFooterNewsletterExample" />
      <SplitFooterNewsletterExample />
      <Divider text="3. SplitFooterContactExample" />
      <SplitFooterContactExample />
      <Divider text="4. SplitFooterSocialExample" />
      <SplitFooterSocialExample />
      <Divider text="5. SplitFooterMinimalExample" />
      <SplitFooterMinimalExample />
      
      {/* Grid Footer Examples (5 variants) */}
      <Divider text="6. GridFooterColumnsExample" />
      <GridFooterColumnsExample />
      <Divider text="7. GridFooterMegaExample" />
      <GridFooterMegaExample />
      <Divider text="8. GridFooterCompactExample" />
      <GridFooterCompactExample />
      <Divider text="9. GridFooterNewsletterExample" />
      <GridFooterNewsletterExample />
      <Divider text="10. GridFooterSitemapExample" />
      <GridFooterSitemapExample />
    </>
  );
}