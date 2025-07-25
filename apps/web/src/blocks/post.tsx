import { BlogPostCenteredImageSection, blogPostCenteredImageSectionTemplate } from "@ui8kit/blocks/post/BlogPostCenteredImageSection";
import { BlogPostTwoColumnsSection, blogPostTwoColumnsSectionTemplate } from "@ui8kit/blocks/post/BlogPostTwoColumnsSection";
import { BlogPostNoAuthorSection, blogPostNoAuthorSectionTemplate } from "@ui8kit/blocks/post/BlogPostNoAuthorSection";
import { BlogPostTwoColumnsNoAuthorSection, blogPostTwoColumnsNoAuthorSectionTemplate } from "@ui8kit/blocks/post/BlogPostTwoColumnsNoAuthorSection";

export const Post = () => {
  return (
    <>
      <BlogPostCenteredImageSection content={blogPostCenteredImageSectionTemplate.defaultContent} />
      <BlogPostTwoColumnsSection content={blogPostTwoColumnsSectionTemplate.defaultContent} />
      <BlogPostNoAuthorSection content={blogPostNoAuthorSectionTemplate.defaultContent} />
      <BlogPostTwoColumnsNoAuthorSection content={blogPostTwoColumnsNoAuthorSectionTemplate.defaultContent} />
    </>
  );
};