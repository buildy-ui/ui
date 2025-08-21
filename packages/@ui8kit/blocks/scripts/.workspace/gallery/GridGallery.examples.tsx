import { GridGallery, type GridGalleryData } from "./GridGallery";

// Sample gallery images
const createSampleImages = (count: number = 12) => {
  const imageUrls = [
    "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  const categories = ["Landscape", "Portrait", "Architecture", "Nature", "Urban", "Abstract"];
  const titles = [
    "Golden Hour", "City Lights", "Natural Beauty", "Modern Lines", "Wild Nature", "Human Stories",
    "Sunset Dreams", "Urban Jungle", "Mountain Peak", "Ocean Waves", "Forest Path", "Sky High"
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `img-${index + 1}`,
    src: imageUrls[index % imageUrls.length],
    alt: `Gallery image ${index + 1}`,
    title: titles[index % titles.length],
    category: categories[index % categories.length],
    description: `Beautiful ${categories[index % categories.length].toLowerCase()} photography`,
    likes: `${Math.floor(Math.random() * 500) + 50}`,
    views: `${Math.floor(Math.random() * 2000) + 200}`
  }));
};

// Base gallery data
const baseGalleryData: GridGalleryData = {
  title: "Photography Gallery",
  description: "A collection of stunning photographs from around the world",
  images: createSampleImages(12),
  stats: {
    totalImages: "240+",
    categories: "6",
    views: "50K+"
  },
  categories: ["Landscape", "Portrait", "Architecture", "Nature", "Urban", "Abstract"]
};

// ===== GRID GALLERY EXAMPLES =====

// 1. Classic Grid Layout
export const GridGalleryGridExample = () => {
  const gridData: GridGalleryData = {
    ...baseGalleryData,
    title: "Classic Photo Grid",
    badge: "Featured Collection"
  };

  return (
    <GridGallery
      content={gridData}
      variant="grid"
    />
  );
};

// 2. Masonry Layout
export const GridGalleryMasonryExample = () => {
  const masonryData: GridGalleryData = {
    ...baseGalleryData,
    title: "Masonry Gallery",
    subtitle: "Pinterest-style layout with dynamic heights"
  };

  return (
    <GridGallery
      content={masonryData}
      variant="masonry"
    />
  );
};

// 3. Carousel-style with featured image
export const GridGalleryCarouselExample = () => {
  const carouselData: GridGalleryData = {
    ...baseGalleryData,
    title: "Interactive Gallery Carousel",
    images: createSampleImages(9) // Featured + 8 thumbnails
  };

  return (
    <GridGallery
      content={carouselData}
      variant="carousel"
    />
  );
};

// 4. Mosaic Layout with different sizes
export const GridGalleryMosaicExample = () => {
  const mosaicData: GridGalleryData = {
    ...baseGalleryData,
    title: "Dynamic Mosaic Layout",
    description: "Varied sizes create an engaging visual experience"
  };

  return (
    <GridGallery
      content={mosaicData}
      variant="mosaic"
    />
  );
};

// 5. Minimal Clean Layout
export const GridGalleryMinimalExample = () => {
  const minimalData: GridGalleryData = {
    ...baseGalleryData,
    title: "Minimal Gallery",
    subtitle: "Clean design focused on the imagery",
    badge: "Curated"
  };

  return (
    <GridGallery
      content={minimalData}
      variant="minimal"
    />
  );
};

// 6. Card-based Layout
export const GridGalleryCardsExample = () => {
  const cardsData: GridGalleryData = {
    ...baseGalleryData,
    title: "Photo Cards Collection",
    badge: "Community Favorites"
  };

  return (
    <GridGallery
      content={cardsData}
      variant="cards"
    />
  );
};

// 7. Polaroid Style
export const GridGalleryPolaroidExample = () => {
  const polaroidData: GridGalleryData = {
    ...baseGalleryData,
    title: "Vintage Polaroid Collection",
    description: "Nostalgic photo memories with a vintage twist",
    images: createSampleImages(8) // Fewer images for polaroid effect
  };

  return (
    <GridGallery
      content={polaroidData}
      variant="polaroid"
      className="bg-gradient-to-b from-primary/50 to-primary/10"
    />
  );
};

// 8. Magazine Layout
export const GridGalleryMagazineExample = () => {
  const magazineData: GridGalleryData = {
    ...baseGalleryData,
    title: "Editorial Showcase",
    subtitle: "Professional photography with magazine-style presentation",
    badge: "Featured"
  };

  return (
    <GridGallery
      content={magazineData}
      variant="magazine"
    />
  );
};

// Export all examples
export const gridGalleryExamples = {
  grid: GridGalleryGridExample,
  masonry: GridGalleryMasonryExample,
  carousel: GridGalleryCarouselExample,
  mosaic: GridGalleryMosaicExample,
  minimal: GridGalleryMinimalExample,
  cards: GridGalleryCardsExample,
  polaroid: GridGalleryPolaroidExample,
  magazine: GridGalleryMagazineExample
};