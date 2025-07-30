import { splitBlogExamples } from "@ui8kit/blocks/blog/SplitBlog.examples";
import { gridBlogExamples } from "@ui8kit/blocks/blog/GridBlog.examples";
import { Divider } from "./ui/divider";

export const SplitBlogNewsExample = splitBlogExamples.news;
export const SplitBlogSliderExample = splitBlogExamples.slider;
export const SplitBlogFeaturedExample = splitBlogExamples.featured;
export const SplitBlogNewsletterExample = splitBlogExamples.newsletter;
export const SplitBlogTimelineExample = splitBlogExamples.timeline;


export const GridBlogCardsExample = gridBlogExamples.cards;
export const GridBlogPostsGridExample = gridBlogExamples.postsGrid;
export const GridBlogFilteredExample = gridBlogExamples.filtered;
export const GridBlogCompactExample = gridBlogExamples.compact;
export const GridBlogFeaturedExample = gridBlogExamples.featured;

function BlogBlocks() {
  return (
    <div>
      <Divider text="1. SplitBlogNewsExample" />
      <SplitBlogNewsExample />
      <Divider text="2. SplitBlogSliderExample" />
      <SplitBlogSliderExample />
      <Divider text="3. SplitBlogFeaturedExample" />
      <SplitBlogFeaturedExample />
      <Divider text="4. SplitBlogNewsletterExample" />
      <SplitBlogNewsletterExample />
      <Divider text="5. SplitBlogTimelineExample" />
      <SplitBlogTimelineExample />
      <Divider text="6. GridBlogCardsExample" />
      <GridBlogCardsExample />
      <Divider text="7. GridBlogPostsGridExample" />
      <GridBlogPostsGridExample />
      <Divider text="8. GridBlogFilteredExample" />
      <GridBlogFilteredExample />
      <Divider text="9. GridBlogCompactExample" />
      <GridBlogCompactExample />
      <Divider text="10. GridBlogFeaturedExample" />
      <GridBlogFeaturedExample />
    </div>
  );
}

export default BlogBlocks;