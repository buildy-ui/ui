# Blog Components v2 - Refactored Architecture

This is the refactored version of blog components following the new modular architecture pattern.

## 🏗️ Architecture

### Atomic UI Components (`ui/`)
- `BlogBadge` - Badge for categories or labels
- `BlogTitle` - Semantic titles with proper heading levels
- `BlogDescription` - Description text with consistent styling
- `BlogButton` - Action buttons with variants
- `BlogActions` - Container for action buttons
- `BlogCategory` - Category badges with variants
- `BlogAuthor` - Author information with avatar
- `BlogMeta` - Post metadata (date, read time)
- `BlogCard` - Post cards with multiple variants

### Composite Components (`components/`)
- `BlogSection` - Main section wrapper with container support
- `BlogContent` - Content wrapper with alignment options
- `BlogGrid` - Responsive grid for blog posts
- `BlogFilters` - Category filter buttons
- `BlogList` - List layouts for posts

### Ready-to-use Presets (`presets/`)
- `GridBlog` - Grid-based blog layouts
- `SplitBlog` - Split-layout blog sections

## 🚀 Usage Examples

### Using Ready-made Presets

```tsx
import { GridBlog, SplitBlog } from "@ui8kit/blocks/blog-v2";

// Grid layout with cards
<GridBlog variant="cards" />

// Grid with category filters
<GridBlog variant="filtered" />

// Split layout for news
<SplitBlog variant="news" />

// Newsletter subscription layout
<SplitBlog variant="newsletter" />
```

### Using Individual Components

```tsx
import { 
  BlogSection, 
  BlogContent, 
  BlogGrid,
  BlogTitle, 
  BlogDescription,
  BlogCard 
} from "@ui8kit/blocks/blog-v2";

<BlogSection>
  <BlogContent align="center">
    <BlogTitle>Latest Articles</BlogTitle>
    <BlogDescription>
      Stay updated with our latest insights and tutorials
    </BlogDescription>
  </BlogContent>
  
  <BlogGrid cols="1-2-3" gap="lg">
    {posts.map(post => (
      <BlogCard key={post.id} post={post} variant="default" />
    ))}
  </BlogGrid>
</BlogSection>
```

### Custom Content

```tsx
<GridBlog 
  variant="cards"
  content={{
    title: "Custom Blog Title",
    description: "Custom description text",
    posts: [
      {
        id: "1",
        title: "Custom Post",
        description: "Post description",
        author: { name: "Author Name" },
        date: "Dec 20, 2023",
        readTime: "5 min read",
        category: "Development"
      }
    ]
  }}
/>
```

## 🎨 Variants

### GridBlog Variants
- `cards` - Standard blog cards in grid
- `filtered` - Grid with category filters
- `compact` - Compact list layout
- `featured` - Grid with featured post highlight

### SplitBlog Variants
- `news` - News-style with main content and related posts
- `slider` - With navigation controls
- `featured` - Highlighting one main post
- `newsletter` - Newsletter subscription focused
- `timeline` - Chronological timeline layout

## 🔧 Props

All components follow the clean architecture:
- ❌ **NO `className` props** - Use only built-in component props
- ✅ **Semantic variants** - Meaningful variant names
- ✅ **Flexible content** - Support for custom content
- ✅ **Responsive design** - Built-in responsive behavior

## 📊 Migration from Old Components

### Before (Monolithic)
```tsx
import { GridBlog } from "@ui8kit/blocks/blog";

<GridBlog 
  content={data} 
  variant="cards"
  className="custom-class" // ❌ Not allowed
/>
```

### After (Modular)
```tsx
import { GridBlog } from "@ui8kit/blocks/blog-v2";

<GridBlog 
  content={data} 
  variant="cards"
  // ✅ Only built-in props, no className
/>
```

## 🎯 Benefits

1. **Modularity** - Use individual components as needed
2. **Reusability** - Components work across different contexts
3. **Consistency** - Unified design system compliance
4. **Performance** - Smaller bundle sizes when using individual components
5. **Maintainability** - Clear separation of concerns
6. **Type Safety** - Full TypeScript support with proper interfaces