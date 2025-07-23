import { BlogCardsSection, blogCardsSectionTemplate } from "@ui8kit/blocks/blog/BlogCardsSection";
import { BlogPostsGridSection, blogPostsGridSectionTemplate } from "@ui8kit/blocks/blog/BlogPostsGridSection";



function BlogBlocks() {
  return (
    <div>
      <BlogCardsSection content={blogCardsSectionTemplate.defaultContent} />
      <BlogPostsGridSection content={blogPostsGridSectionTemplate.defaultContent} />
    </div>
  );
}

export default BlogBlocks;