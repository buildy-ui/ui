import { TestimonialsGridSection, testimonialsGridSectionTemplate } from "@ui8kit/blocks/testimonial/TestimonialsGridSection";
import { TestimonialsSingleRowSection, testimonialsSingleRowSectionTemplate } from "@ui8kit/blocks/testimonial/TestimonialsSingleRowSection";

export const Testimonials = () => {
  return (
    <>
      <TestimonialsGridSection content={testimonialsGridSectionTemplate.defaultContent} />
      <TestimonialsSingleRowSection content={testimonialsSingleRowSectionTemplate.defaultContent} />
    </>
  );
};