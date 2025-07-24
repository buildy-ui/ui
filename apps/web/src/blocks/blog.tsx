import { BlogCardsSection, blogCardsSectionTemplate } from "@ui8kit/blocks/blog/BlogCardsSection";
import { BlogPostsGridSection, blogPostsGridSectionTemplate } from "@ui8kit/blocks/blog/BlogPostsGridSection";
import { BlogSliderSection, blogSliderSectionTemplate } from "@ui8kit/blocks/blog/BlogSliderSection";
import { BlogGridFiltered, blogGridFilteredTemplate } from "@ui8kit/blocks/blog/BlogGridFiltered";

function BlogBlocks() {
  return (
    <div>
      <BlogCardsSection content={blogCardsSectionTemplate.defaultContent} />
      <BlogPostsGridSection content={blogPostsGridSectionTemplate.defaultContent} />
      <BlogSliderSection content={blogSliderSectionTemplate.defaultContent} />
      <BlogGridFiltered content={blogGridFilteredTemplate.defaultContent} />
    </div>
  );
}

export default BlogBlocks;