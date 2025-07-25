import { ImageGalleryGridSection, imageGalleryGridSectionTemplate } from "@ui8kit/blocks/gallery/ImageGalleryGridSection";
import { ImageGalleryMasonrySection, imageGalleryMasonrySectionTemplate } from "@ui8kit/blocks/gallery/ImageGalleryMasonrySection";

export const Gallery = () => {
  return (
    <>
      <ImageGalleryGridSection content={imageGalleryGridSectionTemplate.defaultContent} />
      <ImageGalleryMasonrySection content={imageGalleryMasonrySectionTemplate.defaultContent} />
    </>
  );
};