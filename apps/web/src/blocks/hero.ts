

/* // Import built-in template objects and examples from @ui8kit/blocks library
import { 
  splitHeroTemplates, 
  centeredHeroTemplates
} from "@ui8kit/blocks";

// Create template objects using Examples components but Templates metadata
export const allHeroTemplates = [
  ...Object.keys(splitHeroTemplates).map(key => ({
    ...splitHeroTemplates[key as keyof typeof splitHeroTemplates],
  })),
  ...Object.keys(centeredHeroTemplates).map(key => ({
    ...centeredHeroTemplates[key as keyof typeof centeredHeroTemplates], 
  }))
];

// Import built-in template objects from @ui8kit/blocks library
import { heroTemplates } from "@ui8kit/blocks";

// Export templates directly - they now contain components, defaults, and schemas
export const allHeroTemplates = [
  ...Object.values(heroTemplates)
];*/