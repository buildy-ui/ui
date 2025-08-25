"use client";
import {
  createBusinessRegistry,
  createBlogRegistry,
  createCTARegistry,
  createFAQRegistry,
  createHeroRegistry,
  createFeaturesRegistry,
  createPortfolioRegistry,
  createTeamRegistry,
  createTestimonialRegistry,
  createFooterRegistry,
  createGalleryRegistry,
  createPostRegistry
} from "@ui8kit/blocks";

const treeRegistry = [
  { name: "Hero Blocks", registry: createHeroRegistry() },
  { name: "Features Blocks", registry: createFeaturesRegistry() },
  { name: "Post Blocks", registry: createPostRegistry() },
  { name: "Blog Blocks", registry: createBlogRegistry() },
  { name: "Business Blocks", registry: createBusinessRegistry() },
  { name: "Portfolio Blocks", registry: createPortfolioRegistry() },
  { name: "Gallery Blocks", registry: createGalleryRegistry() },
  { name: "CTA Blocks", registry: createCTARegistry() },
  { name: "FAQ Blocks", registry: createFAQRegistry() },
  { name: "Team Blocks", registry: createTeamRegistry() },
  { name: "Testimonial Blocks", registry: createTestimonialRegistry() },
  { name: "Footer Blocks", registry: createFooterRegistry() }
]

export const treeRenderers = treeRegistry.map((type) => {
  return {
    name: type.name,
    registry: type.registry
  }
}); 


export const allTemplates = [
  ...treeRenderers
];

export const allComponents = allTemplates.reduce((acc, template) => {
  acc[template.name] = template.registry;
  return acc;
}, {} as Record<string, any>);