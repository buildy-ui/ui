import { splitGalleryExamples } from "@ui8kit/blocks/gallery/SplitGallery.examples";
import { gridGalleryExamples } from "@ui8kit/blocks/gallery/GridGallery.examples";
import { Divider } from "./ui/divider";

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
      <Divider text="1. SplitGalleryShowcaseExample" />
      <SplitGalleryShowcaseExample />
      <Divider text="2. SplitGalleryPortfolioExample" />
      <SplitGalleryPortfolioExample />
      
      {/* Grid Gallery Examples */}
      <Divider text="3. GridGalleryGridExample" />
      <GridGalleryGridExample />
      <Divider text="4. GridGalleryMasonryExample" />
      <GridGalleryMasonryExample />
      <Divider text="5. GridGalleryCarouselExample" />
      <GridGalleryCarouselExample />
      <Divider text="6. GridGalleryMosaicExample" />
      <GridGalleryMosaicExample />
      <Divider text="7. GridGalleryMinimalExample" />
      <GridGalleryMinimalExample />
      <Divider text="8. GridGalleryCardsExample" />
      <GridGalleryCardsExample />
      <Divider text="9. GridGalleryPolaroidExample" />
      <GridGalleryPolaroidExample />
      <Divider text="10. GridGalleryMagazineExample" />
      <GridGalleryMagazineExample />
    </div>
  );
}

export default GalleryBlocks;