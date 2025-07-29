import { splitBlogExamples } from "@ui8kit/blocks/blog/SplitBlog.examples";
import { gridBlogExamples } from "@ui8kit/blocks/blog/GridBlog.examples";

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
      <SplitBlogNewsExample />
      <SplitBlogSliderExample />
      <SplitBlogFeaturedExample />
      <SplitBlogNewsletterExample />
      <SplitBlogTimelineExample />
      <GridBlogCardsExample />
      <GridBlogPostsGridExample />
      <GridBlogFilteredExample />
      <GridBlogCompactExample />
      <GridBlogFeaturedExample />
    </div>
  );
}

export default BlogBlocks;