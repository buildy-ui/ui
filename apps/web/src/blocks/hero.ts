// Import built-in template objects from @ui8kit/blocks library
import { heroTemplates } from "@ui8kit/blocks";

// Export templates directly - they now contain components, defaults, and schemas
export const allHeroTemplates = [
  ...Object.values(heroTemplates)
];