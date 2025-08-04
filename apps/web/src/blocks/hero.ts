// Import built-in template objects and examples from @ui8kit/blocks library
import { 
  splitHeroTemplates, 
  centeredHeroTemplates,
  splitHeroExamples,
  centeredHeroExamples 
} from "@ui8kit/blocks";

// Create template objects using Examples components but Templates metadata
export const allHeroTemplates = [
  ...Object.keys(splitHeroTemplates).map(key => ({
    ...splitHeroTemplates[key as keyof typeof splitHeroTemplates],
    component: splitHeroExamples[key as keyof typeof splitHeroExamples]
  })),
  ...Object.keys(centeredHeroTemplates).map(key => ({
    ...centeredHeroTemplates[key as keyof typeof centeredHeroTemplates], 
    component: centeredHeroExamples[key as keyof typeof centeredHeroExamples]
  }))
];


