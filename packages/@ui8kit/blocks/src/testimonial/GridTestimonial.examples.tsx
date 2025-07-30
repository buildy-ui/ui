import { GridTestimonial, type GridTestimonialData } from "./GridTestimonial";

// Sample testimonial data (reused from SplitTestimonial)
const sampleTestimonials = [
  {
    id: "testimonial-1",
    rating: 5,
    quote: "This product has completely transformed how our team works. The intuitive design and powerful features make complex tasks feel effortless.",
    author: "Sarah Johnson",
    position: "Product Manager",
    company: "TechStart Inc",
    avatar: {
      src: "https://images.unsplash.com/photo-1494790108755-2616b9e6e4ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      alt: "Sarah Johnson"
    },
    verified: true
  },
  {
    id: "testimonial-2", 
    rating: 5,
    quote: "Outstanding customer service and product quality. The support team went above and beyond to ensure we had everything set up correctly.",
    author: "Michael Chen",
    position: "CTO",
    company: "Digital Solutions Co",
    verified: true
  },
  {
    id: "testimonial-3",
    rating: 4,
    quote: "Great value for money. The features are comprehensive and the learning curve is minimal. Our productivity has increased significantly.",
    author: "Emily Rodriguez",
    position: "Operations Director",
    company: "Growth Partners LLC",
    avatar: {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      alt: "Emily Rodriguez"
    },
    verified: false
  },
  {
    id: "testimonial-4",
    rating: 5,
    quote: "Exceptional quality and attention to detail. The team clearly cares about delivering a superior user experience.",
    author: "David Park",
    position: "Senior Developer",
    company: "CodeCraft Studios",
    verified: true
  },
  {
    id: "testimonial-5",
    rating: 5,
    quote: "Seamless integration and fantastic results. The ROI was evident within the first month of usage.",
    author: "Lisa Thompson",
    position: "Marketing Director",
    company: "Creative Agency Pro",
    avatar: {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      alt: "Lisa Thompson"
    },
    verified: true
  },
  {
    id: "testimonial-6",
    rating: 4,
    quote: "Reliable and efficient solution that has streamlined our entire workflow. Highly recommended for growing businesses.",
    author: "Alex Kumar",
    position: "Business Analyst",
    company: "Data Insights Ltd",
    verified: true
  },
  {
    id: "testimonial-7",
    rating: 5,
    quote: "The best investment we've made this year. Customer support is responsive and the platform is incredibly user-friendly.",
    author: "Maria Santos",
    position: "Project Manager",
    company: "Innovation Hub",
    avatar: {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      alt: "Maria Santos"
    },
    verified: true
  },
  {
    id: "testimonial-8",
    rating: 5,
    quote: "Outstanding performance and reliability. This tool has become indispensable for our daily operations.",
    author: "James Wilson",
    position: "Tech Lead",
    company: "Future Systems",
    verified: false
  }
];

// 1. Classic Grid Example
export const GridTestimonialGridExample = () => {
  const content: GridTestimonialData = {
    title: "What Our Customers Say",
    description: "Join thousands of satisfied customers who have transformed their business with our platform.",
    badge: "Customer Reviews",
    testimonials: sampleTestimonials,
    stats: {
      averageRating: "4.8",
      totalReviews: "2,400+"
    }
  };

  return (
    <GridTestimonial
      content={content}
      variant="grid"
      useContainer={true}
      py="xl"
    />
  );
};

// 2. Masonry Layout Example
export const GridTestimonialMasonryExample = () => {
  const content: GridTestimonialData = {
    title: "Success Stories",
    subtitle: "Real experiences from real customers who've achieved incredible results with our solution.",
    testimonials: sampleTestimonials
  };

  return (
    <GridTestimonial
      content={content}
      variant="masonry"
      useContainer={true}
      py="xl"
    />
  );
};

// 3. Minimal Layout Example
export const GridTestimonialMinimalExample = () => {
  const content: GridTestimonialData = {
    title: "Customer Voices",
    subtitle: "Simple, authentic feedback from the people who matter most.",
    badge: "Testimonials",
    testimonials: sampleTestimonials.slice(0, 4)
  };

  return (
    <GridTestimonial
      content={content}
      variant="minimal"
      useContainer={true}
      py="xl"
    />
  );
};

// 4. Detailed Cards Example
export const GridTestimonialCardsExample = () => {
  const content: GridTestimonialData = {
    title: "Customer Excellence Awards",
    badge: "Verified Reviews",
    testimonials: sampleTestimonials,
    stats: {
      totalReviews: "5,000+",
      averageRating: "4.9"
    }
  };

  return (
    <GridTestimonial
      content={content}
      variant="cards"
      useContainer={true}
      py="xl"
    />
  );
};

// 5. Compact Layout Example
export const GridTestimonialCompactExample = () => {
  const content: GridTestimonialData = {
    title: "Quick Reviews",
    description: "See what customers are saying in a quick, digestible format.",
    testimonials: sampleTestimonials
  };

  return (
    <GridTestimonial
      content={content}
      variant="compact"
      useContainer={true}
      py="lg"
    />
  );
};

// 6. Slider Style Example
export const GridTestimonialSliderExample = () => {
  const content: GridTestimonialData = {
    title: "Customer Feedback Stream",
    description: "Browse through our latest customer reviews and success stories.",
    testimonials: sampleTestimonials
  };

  return (
    <GridTestimonial
      content={content}
      variant="slider"
      useContainer={true}
      py="xl"
    />
  );
};

// 7. Magazine Style Example
export const GridTestimonialMagazineExample = () => {
  const content: GridTestimonialData = {
    title: "Featured Customer Stories",
    subtitle: "In-depth testimonials from industry leaders who trust our platform to drive their success.",
    badge: "Premium Reviews",
    testimonials: sampleTestimonials,
    stats: {
      totalReviews: "10K+",
      averageRating: "4.9", 
      satisfied: "98%"
    }
  };

  return (
    <GridTestimonial
      content={content}
      variant="magazine"
      useContainer={true}
      py="xl"
    />
  );
};

// Export all examples
export const gridTestimonialExamples = {
  grid: GridTestimonialGridExample,
  masonry: GridTestimonialMasonryExample,
  minimal: GridTestimonialMinimalExample,
  cards: GridTestimonialCardsExample,
  compact: GridTestimonialCompactExample,
  slider: GridTestimonialSliderExample,
  magazine: GridTestimonialMagazineExample
};