import { SplitGallery, type SplitGalleryData } from "./SplitGallery";

// ===== SPLIT GALLERY EXAMPLES =====

// 1. Showcase Split Gallery
export const SplitGalleryShowcaseExample = () => {

// Sample gallery data
const content: SplitGalleryData = {
  title: "Creative Photography Showcase",
  subtitle: "Capturing moments that tell extraordinary stories",
  description: "Explore our curated collection of stunning photographs from around the world, featuring landscapes, portraits, and urban scenes that inspire and captivate.",
  badge: "Featured Collection",
  images: [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Mountain landscape at sunset",
      title: "Golden Hour Mountains",
      category: "Landscape",
      description: "Breathtaking mountain vista during golden hour"
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Urban architecture photography",
      title: "Modern Architecture",
      category: "Architecture",
      description: "Contemporary building design in the city"
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Portrait photography",
      title: "Human Connection",
      category: "Portrait",
      description: "Intimate portrait capturing genuine emotion"
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Nature macro photography",
      title: "Nature's Details",
      category: "Macro",
      description: "Intricate details of the natural world"
    }
  ],
  stats: {
    totalImages: "240+",
    categories: "12",
    views: "50K+"
  },
  primaryButtonText: "View Full Gallery",
  secondaryButtonText: "Share Collection"
};
  return (
    <SplitGallery
      content={content}
      variant="showcase"
      leftMedia={false}
    />
  );
};

// 2. Portfolio Split Gallery
export const SplitGalleryPortfolioExample = () => {
  const content: SplitGalleryData = {
    title: "Professional Photography Portfolio",
    description: "A curated selection of my finest work spanning multiple genres and styles, showcasing technical excellence and creative vision.",
    badge: "Portfolio 2024",
    images: [
      {
        id: "p1",
        src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Wedding photography",
        title: "Eternal Moments",
        category: "Wedding"
      },
      {
        id: "p2",
        src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Fashion photography",
        title: "Style & Grace",
        category: "Fashion"
      },
      {
        id: "p3",
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Landscape photography",
        title: "Natural Beauty",
        category: "Landscape"
      },
      {
        id: "p4",
        src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Corporate photography",
        title: "Professional Edge",
        category: "Corporate"
      }
    ],
    stats: {
      totalImages: "150+",
      categories: "8",
      views: "25K+"
    },
    primaryButtonText: "View Portfolio",
    secondaryButtonText: "Contact Me"
  };

  return (
    <SplitGallery
      content={content}
      variant="portfolio"
      leftMedia={true}
    />
  );
};

// Export all examples
export const splitGalleryExamples = {
  showcase: SplitGalleryShowcaseExample,
  portfolio: SplitGalleryPortfolioExample
};