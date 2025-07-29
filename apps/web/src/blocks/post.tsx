import { centeredPostExamples } from "@ui8kit/blocks/post/CenteredPost.examples";
import { splitPostExamples } from "@ui8kit/blocks/post/SplitPost.examples";

// New Factory-based Post Examples
export const CenteredPostClassicExample = centeredPostExamples.classic;
export const CenteredPostMinimalExample = centeredPostExamples.minimal;
export const CenteredPostMagazineExample = centeredPostExamples.magazine;
export const CenteredPostFeaturedExample = centeredPostExamples.featured;
export const CenteredPostEditorialExample = centeredPostExamples.editorial;

export const SplitPostStandardExample = splitPostExamples.standard;
export const SplitPostAuthorExample = splitPostExamples.author;
export const SplitPostMediaExample = splitPostExamples.media;
export const SplitPostSidebarExample = splitPostExamples.sidebar;
export const SplitPostHeroExample = splitPostExamples.hero;

function PostBlocks() {
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Centered Post Examples */}
      <CenteredPostClassicExample />
      <CenteredPostMinimalExample />
      <CenteredPostMagazineExample />
      <CenteredPostFeaturedExample />
      <CenteredPostEditorialExample />
      
      {/* Split Post Examples */}
      <SplitPostStandardExample />
      <SplitPostAuthorExample />
      <SplitPostMediaExample />
      <SplitPostSidebarExample />
      <SplitPostHeroExample />
    </div>
  );
}

export default PostBlocks;