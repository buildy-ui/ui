# @ui8kit/blocks

A collection of 50+ React blocks for building modern UI components with TypeScript support.

## Installation

```bash
npm install @ui8kit/blocks
# or
yarn add @ui8kit/blocks
# or
bun add @ui8kit/blocks
```

## Usage

Import specific blocks and their examples:

```tsx
// Import blog components
import { GridBlog } from "@ui8kit/blocks/blog/GridBlog";
import { gridBlogExamples } from "@ui8kit/blocks/blog/GridBlog.examples";

// Import team components
import { GridTeam } from "@ui8kit/blocks/team/GridTeam";
import { SplitTeam } from "@ui8kit/blocks/team/SplitTeam";

// Import testimonial components
import { GridTestimonial } from "@ui8kit/blocks/testimonial/GridTestimonial";
```

## Available Blocks

- **Blog**: GridBlog, SplitBlog
- **Business**: GridBusiness, SplitBusiness  
- **CTA**: CenteredCTA, SplitCTA
- **FAQ**: GridFAQ, SplitFAQ
- **Features**: GridFeatures, SplitFeatures
- **Footer**: GridFooter, SplitFooter
- **Gallery**: GridGallery, SplitGallery
- **Hero**: CenteredHero, SplitHero
- **Portfolio**: GridPortfolio, SplitPortfolio
- **Post**: CenteredPost, SplitPost
- **Team**: GridTeam, SplitTeam
- **Testimonial**: GridTestimonial, SplitTestimonial

## Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0", 
  "lucide-react": "^0.525.0"
}
```

## License

MIT