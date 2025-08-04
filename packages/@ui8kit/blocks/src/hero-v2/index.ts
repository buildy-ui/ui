// Atomic components
export * from "./ui";

// Composite components  
export * from "./components";

// Ready-to-use presets
export * from "./presets";

// Types, content, and schema
export * from "./types";
export * from "./content";
export * from "./schema";

// Templates for integration with existing system
import { SplitHero } from "./presets/split-hero";
import { CenteredHero } from "./presets/centered-hero";
import { heroContent } from "./content";
import { heroSchema } from "./schema";

export const heroTemplates = {
  splitMedia: {
    id: "splitHeroMedia",
    name: "Split Hero with Media",
    description: "Split layout hero with media content",
    component: SplitHero,
    defaultProps: { variant: "media" as const },
    defaults: heroContent.splitMedia,
    schema: heroSchema
  },
  
  splitLeftMedia: {
    id: "splitHeroLeftMedia", 
    name: "Split Hero Left Media",
    description: "Split layout hero with left media",
    component: SplitHero,
    defaultProps: { variant: "leftMedia" as const },
    defaults: heroContent.splitLeftMedia,
    schema: heroSchema
  },
  
  splitGallery: {
    id: "splitHeroGallery",
    name: "Split Hero Gallery",
    description: "Split layout hero with image gallery",
    component: SplitHero,
    defaultProps: { variant: "gallery" as const },
    defaults: heroContent.splitGallery,
    schema: heroSchema
  },
  
  centeredSimple: {
    id: "centeredHeroSimple",
    name: "Centered Hero Simple",
    description: "Simple centered hero layout",
    component: CenteredHero,
    defaultProps: { variant: "simple" as const },
    defaults: heroContent.centeredSimple,
    schema: heroSchema
  },
  
  centeredWithStats: {
    id: "centeredHeroWithStats",
    name: "Centered Hero with Stats",
    description: "Centered hero with statistics display", 
    component: CenteredHero,
    defaultProps: { variant: "withStats" as const },
    defaults: heroContent.centeredWithStats,
    schema: heroSchema
  }
};