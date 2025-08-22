import { ComponentAnalyzer } from './utils/componentAnalyzer';

async function main() {
  const analyzer = new ComponentAnalyzer();
  
  // Get all component files
  const files = await analyzer.getComponentFiles('./src/blocks/**/*.tsx');
  
  // Analyze each component
  const components = await Promise.all(
    files.map(file => analyzer.analyzeComponent(file))
  );

  // Example output for HeroCenteredSection
  const heroComponent = components.find(c => c.name === 'HeroCenteredSection');
  console.log('Dependencies:', heroComponent?.dependencies);
  console.log('Content:', heroComponent?.content);
}

main(); 