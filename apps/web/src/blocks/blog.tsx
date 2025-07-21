// import { BlogArticlesColumnsCards } from "@twblocks/blocks/blog/BlogArticlesColumnsCards";
import { BlogCardsSection } from "@twblocks/blocks/blog/BlogCardsSection";
import { BlogPostsGridSection } from "@twblocks/blocks/blog/BlogPostsGridSection";
import { DesignSystemWebinars } from "@twblocks/blocks/blog/DesignSystemWebinars";

function BlogBlocks() {
  return (
    <div>
      {/*<BlogArticlesColumnsCards />*/}
      <BlogCardsSection />
      <BlogPostsGridSection />
      <DesignSystemWebinars />
    </div>
  );
}

export default BlogBlocks;