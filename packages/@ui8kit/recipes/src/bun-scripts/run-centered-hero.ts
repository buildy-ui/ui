// bun run packages/@ui8kit/recipes/src/bun-scripts/run-centered-hero.ts
import path from 'node:path';
import { generateFromRecipe } from './generate';
import { centeredHeroRecipe } from '../recipes/centered-hero';

const outTsx = path.resolve('packages/@ui8kit/recipes/src/blocks/CenteredHero.tsx');
const outCssDir = path.resolve('packages/@ui8kit/recipes/src/assets/css/semantic');

generateFromRecipe(centeredHeroRecipe, { outputTsx: outTsx, outputCssDir: outCssDir });
console.log('Generated CenteredHero.tsx and semantic CSS');


