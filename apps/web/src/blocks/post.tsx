import { centeredPostExamples } from "@ui8kit/blocks/post/CenteredPost.examples";
import { splitPostExamples } from "@ui8kit/blocks/post/SplitPost.examples";
import { Divider } from "./ui/divider";

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
      <Divider text="1. CenteredPostClassicExample" />
      <CenteredPostClassicExample />
      <Divider text="2. CenteredPostMinimalExample" />
      <CenteredPostMinimalExample />
      <Divider text="3. CenteredPostMagazineExample" />
      <CenteredPostMagazineExample />
      <Divider text="4. CenteredPostFeaturedExample" />
      <CenteredPostFeaturedExample />
      <Divider text="5. CenteredPostEditorialExample" />
      <CenteredPostEditorialExample />
      
      {/* Split Post Examples */}
      <Divider text="6. SplitPostStandardExample" />
      <SplitPostStandardExample />
      <Divider text="7. SplitPostAuthorExample" />
      <SplitPostAuthorExample />
      <Divider text="8. SplitPostMediaExample" />
      <SplitPostMediaExample />
      <Divider text="9. SplitPostSidebarExample" />
      <SplitPostSidebarExample />
      <Divider text="10. SplitPostHeroExample" />
      <SplitPostHeroExample />
    </div>
  );
}

export default PostBlocks;