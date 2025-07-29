import { splitGalleryExamples } from "@ui8kit/blocks/gallery/SplitGallery.examples";
import { gridGalleryExamples } from "@ui8kit/blocks/gallery/GridGallery.examples";

// New Factory-based Gallery Examples

// Split Gallery Examples (2)
export const SplitGalleryShowcaseExample = splitGalleryExamples.showcase;
export const SplitGalleryPortfolioExample = splitGalleryExamples.portfolio;

// Grid Gallery Examples (8)
export const GridGalleryGridExample = gridGalleryExamples.grid;
export const GridGalleryMasonryExample = gridGalleryExamples.masonry;
export const GridGalleryCarouselExample = gridGalleryExamples.carousel;
export const GridGalleryMosaicExample = gridGalleryExamples.mosaic;
export const GridGalleryMinimalExample = gridGalleryExamples.minimal;
export const GridGalleryCardsExample = gridGalleryExamples.cards;
export const GridGalleryPolaroidExample = gridGalleryExamples.polaroid;
export const GridGalleryMagazineExample = gridGalleryExamples.magazine;

function GalleryBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Split Gallery Examples */}
      <SplitGalleryShowcaseExample />
      <SplitGalleryPortfolioExample />
      
      {/* Grid Gallery Examples */}
      <GridGalleryGridExample />
      <GridGalleryMasonryExample />
      <GridGalleryCarouselExample />
      <GridGalleryMosaicExample />
      <GridGalleryMinimalExample />
      <GridGalleryCardsExample />
      <GridGalleryPolaroidExample />
      <GridGalleryMagazineExample />
    </div>
  );
}

export default GalleryBlocks;