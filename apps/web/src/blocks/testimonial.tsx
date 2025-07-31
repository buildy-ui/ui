import {
  // Split Testimonial Examples
  SplitTestimonialFeaturedExample,
  SplitTestimonialCarouselExample,
  SplitTestimonialStatsExample,
  
  // Grid Testimonial Examples
  GridTestimonialGridExample,
  GridTestimonialMasonryExample,
  GridTestimonialMinimalExample,
  GridTestimonialCardsExample,
  GridTestimonialCompactExample,
  GridTestimonialSliderExample,
  GridTestimonialMagazineExample
} from "@ui8kit/blocks/testimonial";
import { Divider } from "./ui/divider";

export default function TestimonialBlocks() {
  return (
    <>
      {/* Split Testimonial Examples (3 variants) */}
      <Divider text="1. SplitTestimonialFeaturedExample" />
      <SplitTestimonialFeaturedExample />
      <Divider text="2. SplitTestimonialCarouselExample" />
      <SplitTestimonialCarouselExample />
      <Divider text="3. SplitTestimonialStatsExample" />
      <SplitTestimonialStatsExample />
      
      {/* Grid Testimonial Examples (7 variants) */}
      <Divider text="4. GridTestimonialGridExample" />
      <GridTestimonialGridExample />
      <Divider text="5. GridTestimonialMasonryExample" />
      <GridTestimonialMasonryExample />
      <Divider text="6. GridTestimonialMinimalExample" />
      <GridTestimonialMinimalExample />
      <Divider text="7. GridTestimonialCardsExample" />
      <GridTestimonialCardsExample />
      <Divider text="8. GridTestimonialCompactExample" />
      <GridTestimonialCompactExample />
      <Divider text="9. GridTestimonialSliderExample" />
      <GridTestimonialSliderExample />
      <Divider text="10. GridTestimonialMagazineExample" />
      <GridTestimonialMagazineExample />
    </>
  );
}