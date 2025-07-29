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

export default function TestimonialBlocks() {
  return (
    <>
      {/* Split Testimonial Examples (3 variants) */}
      <SplitTestimonialFeaturedExample />
      <SplitTestimonialCarouselExample />
      <SplitTestimonialStatsExample />
      
      {/* Grid Testimonial Examples (7 variants) */}
      <GridTestimonialGridExample />
      <GridTestimonialMasonryExample />
      <GridTestimonialMinimalExample />
      <GridTestimonialCardsExample />
      <GridTestimonialCompactExample />
      <GridTestimonialSliderExample />
      <GridTestimonialMagazineExample />
    </>
  );
}