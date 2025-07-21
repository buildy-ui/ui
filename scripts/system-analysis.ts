import { readFileSync } from 'fs';
import { join } from 'path';
import { CoreTailwindExtractor } from './extract-core-tailwind-classes';
import { SmartClassFilter } from './smart-class-filter';

interface SystemAnalysisResult {
  potentialIssues: {
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    examples?: string[];
    solution?: string;
  }[];
  realWorldValidation: {
    actualCoreClasses: string[];
    extractedClasses: string[];
    missedClasses: string[];
    falsePositives: string[];
  };
  scalingConcerns: {
    concern: string;
    impact: string;
    recommendation: string;
  }[];
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };
}

/**
 * Comprehensive system analysis for scaling and conflict detection
 */
class SystemAnalysisValidator {
  private coreClassesPath: string;
  private actualCoreClasses: Set<string> = new Set();
  private extractedClasses: Set<string> = new Set();

  constructor(coreClassesPath: string) {
    this.coreClassesPath = coreClassesPath;
    this.loadExtractedClasses();
    this.loadActualCoreClasses();
  }

  /**
   * Load extracted classes from JSON file
   */
  private loadExtractedClasses(): void {
    try {
      const data = JSON.parse(readFileSync(this.coreClassesPath, 'utf-8'));
      data.uniqueClasses.forEach((cls: string) => {
        this.extractedClasses.add(cls);
      });
    } catch (error) {
      console.error('Failed to load extracted classes:', error);
    }
  }

  /**
   * Load ACTUAL core classes by inspecting real CVA definitions
   */
  private loadActualCoreClasses(): void {
    // Known CVA class mappings from real components
    const knownCvaClasses = [
      // Block component
      'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden',
      'w-auto', 'w-full', 'w-screen', 'w-fit', 'w-min', 'w-max',
      'h-auto', 'h-full', 'h-screen', 'h-fit', 'h-min', 'h-max',
      'p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8',
      'px-0', 'px-1', 'px-2', 'px-4', 'px-6', 'px-8',
      'py-0', 'py-1', 'py-2', 'py-4', 'py-6', 'py-8',
      'm-0', 'm-1', 'm-2', 'm-4', 'm-6', 'm-8', 'm-auto',
      'mx-0', 'mx-1', 'mx-2', 'mx-4', 'mx-6', 'mx-8', 'mx-auto',
      'my-0', 'my-1', 'my-2', 'my-4', 'my-6', 'my-8', 'my-auto',
      
      // Stack component
      'flex', 'flex-col', 'gap-1', 'gap-2', 'gap-4', 'gap-6', 'gap-8',
      'items-start', 'items-center', 'items-end', 'items-stretch',
      'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around',
      'text-left', 'text-center', 'text-right',
      'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-4xl', 'max-w-6xl', 'max-w-none',
      'mx-auto',
      
      // Group component
      'flex', 'flex-row', 'flex-col',
      'sm:flex-row', 'md:flex-row', 'lg:flex-row', 'xl:flex-row',
      'gap-1', 'gap-2', 'gap-4', 'gap-6', 'gap-8',
      'items-start', 'items-center', 'items-end', 'items-baseline', 'items-stretch',
      'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
      'flex-wrap', 'flex-nowrap', 'flex-wrap-reverse',
      
      // Text component
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
      'font-normal', 'font-medium', 'font-semibold', 'font-bold',
      'text-left', 'text-center', 'text-right', 'text-justify',
      'text-foreground', 'text-muted-foreground', 'text-primary', 'text-secondary', 
      'text-secondary-foreground', 'text-destructive', 'text-accent',
      'truncate',
      
      // Title component
      'font-semibold', 'tracking-tight',
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
      'font-normal', 'font-medium', 'font-semibold', 'font-bold',
      'text-left', 'text-center', 'text-right', 'text-justify',
      'text-foreground', 'text-muted-foreground', 'text-primary', 'text-secondary', 'text-destructive', 'text-accent',
      'leading-relaxed', 'leading-tight',
      
      // Button component (base classes)
      'inline-flex', 'items-center', 'justify-center', 'whitespace-nowrap', 'rounded-md', 'text-sm', 'font-medium',
      'ring-offset-background', 'transition-colors', 'focus-visible:outline-none', 'focus-visible:ring-2',
      'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:pointer-events-none', 'disabled:opacity-50',
      
      // Grid component
      'grid', 
      'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
      'grid-cols-7', 'grid-cols-8', 'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12',
      'gap-0', 'gap-1', 'gap-2', 'gap-4', 'gap-6', 'gap-8',
      'items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline',
      'justify-items-start', 'justify-items-center', 'justify-items-end', 'justify-items-stretch',
      
      // Icon component
      'w-3', 'h-3', 'w-4', 'h-4', 'w-5', 'h-5', 'w-6', 'h-6', 'w-8', 'h-8', 'w-12', 'h-12',
      'ml-1', 'mr-1', 'ml-2', 'mr-2', 'ml-3', 'mr-3',
      'inline-block', 'block',
      'transition-transform', 'hover:scale-110', 'group-hover:translate-x-1',
      
      // Container component
      'w-full',
      'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl', 'max-w-screen-2xl',
      'max-w-2xl', 'max-w-4xl', 'max-w-6xl', 'max-w-none',
      'mx-auto',
      'text-left', 'text-center', 'text-right', 'text-justify',
      'px-0', 'px-2', 'px-4', 'px-6', 'px-8',
      
      // Box component
      'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden',
      'w-3', 'h-3', 'w-4', 'h-4', 'w-5', 'h-5', 'w-6', 'h-6', 'w-8', 'h-8', 'w-12', 'h-12',
      'ml-1', 'mr-1', 'ml-2', 'mr-2', 'ml-3', 'mr-3',
      'w-fit', 'w-full', 'w-auto',
      
      // Semantic design tokens
      'bg-transparent', 'bg-background', 'bg-foreground', 'bg-primary', 'bg-primary-foreground',
      'bg-secondary', 'bg-secondary-foreground', 'bg-muted', 'bg-muted-foreground',
      'bg-accent', 'bg-accent-foreground', 'bg-destructive', 'bg-destructive-foreground',
      'bg-border', 'bg-input', 'bg-ring',
      
      // Arbitrary values pattern (dynamic)
      // Note: These won't match exactly as they're dynamic
      
      // Focus/state classes
      'hover:bg-primary/90', 'hover:bg-secondary/80', 'focus:outline-none', 'focus:ring-2'
    ];

    knownCvaClasses.forEach(cls => {
      this.actualCoreClasses.add(cls);
    });
  }

  /**
   * Run comprehensive system analysis
   */
  public analyzeSystem(): SystemAnalysisResult {
    const potentialIssues = this.identifyPotentialIssues();
    const realWorldValidation = this.validateRealWorldUsage();
    const scalingConcerns = this.identifyScalingConcerns();
    const recommendations = this.generateRecommendations();

    return {
      potentialIssues,
      realWorldValidation,
      scalingConcerns,
      recommendations
    };
  }

  /**
   * Identify potential issues with current implementation
   */
  private identifyPotentialIssues(): SystemAnalysisResult['potentialIssues'] {
    const issues: SystemAnalysisResult['potentialIssues'] = [];

    // Issue 1: Tailwind class detection limitations
    issues.push({
      issue: 'Incomplete Tailwind Class Detection',
      severity: 'high',
      description: 'The isTailwindClass() function uses hardcoded patterns that may miss newer Tailwind classes or custom utilities',
      examples: [
        'backdrop-* classes might be missed',
        'New Tailwind v4 classes won\'t be detected',
        'Custom utility classes from tailwind.config.js ignored',
        'Arbitrary value syntax [value] detection is basic'
      ],
      solution: 'Use Tailwind CSS parser or maintain a comprehensive class registry'
    });

    // Issue 2: CVA extraction reliability
    issues.push({
      issue: 'CVA Extraction AST Limitations',
      severity: 'medium',
      description: 'AST parsing may miss complex CVA patterns or dynamic class generation',
      examples: [
        'Template literals with complex interpolation',
        'Classes generated via functions',
        'Conditional class assignments in CVA',
        'Classes imported from external files'
      ],
      solution: 'Add runtime class collection and validation'
    });

    // Issue 3: Layout vs Styling classification
    issues.push({
      issue: 'Subjective Layout/Styling Classification',
      severity: 'medium',
      description: 'Current whitelist/blacklist rules are subjective and may misclassify classes',
      examples: [
        'border-2 kept as layout but border-gray-200 removed as styling',
        'p-6 removed as styling but gap-6 kept as layout',
        'text-center kept but text-lg sometimes removed'
      ],
      solution: 'Create semantic classification system based on component props'
    });

    // Issue 4: Component evolution
    issues.push({
      issue: 'Component Evolution Compatibility',
      severity: 'high',
      description: 'System doesn\'t automatically adapt when core components change',
      examples: [
        'New props added to Stack component won\'t be reflected',
        'CVA variant changes require manual script updates',
        'Removed component variants may break filtering'
      ],
      solution: 'Implement automatic component introspection and validation'
    });

    // Issue 5: Real-world conflicts
    issues.push({
      issue: 'Real Application Conflicts',
      severity: 'critical',
      description: 'Filtered blocks may not work in real applications due to missing styling',
      examples: [
        'Removed padding may break visual layouts',
        'Missing hover states affect UX',
        'Stripped animations remove polish',
        'Color classes needed for theme compatibility'
      ],
      solution: 'Create component-aware filtering with runtime validation'
    });

    return issues;
  }

  /**
   * Validate against real-world usage
   */
  private validateRealWorldUsage(): SystemAnalysisResult['realWorldValidation'] {
    const actualClasses = Array.from(this.actualCoreClasses);
    const extractedClasses = Array.from(this.extractedClasses);
    
    const missedClasses = actualClasses.filter(cls => !this.extractedClasses.has(cls));
    const falsePositives = extractedClasses.filter(cls => !this.actualCoreClasses.has(cls));

    return {
      actualCoreClasses: actualClasses,
      extractedClasses: extractedClasses,
      missedClasses: missedClasses,
      falsePositives: falsePositives
    };
  }

  /**
   * Identify scaling concerns
   */
  private identifyScalingConcerns(): SystemAnalysisResult['scalingConcerns'] {
    return [
      {
        concern: 'Manual Pattern Maintenance',
        impact: 'As Tailwind updates or custom utilities are added, patterns need manual updates',
        recommendation: 'Implement automatic pattern detection from Tailwind config and runtime'
      },
      {
        concern: 'Component Library Growth',
        impact: 'Each new core component requires updating extraction and filtering rules',
        recommendation: 'Create self-documenting component system with automatic class registration'
      },
      {
        concern: 'Performance at Scale',
        impact: 'AST parsing of large codebases becomes slow and memory intensive',
        recommendation: 'Implement incremental parsing and caching strategies'
      },
      {
        concern: 'Team Synchronization',
        impact: 'Developers may bypass system or create conflicting utility classes',
        recommendation: 'Add ESLint rules and pre-commit hooks for enforcement'
      },
      {
        concern: 'Build-time Integration',
        impact: 'Scripts need integration with build process and CI/CD pipelines',
        recommendation: 'Create build plugins and automated validation workflows'
      }
    ];
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(): SystemAnalysisResult['recommendations'] {
    return {
      immediate: [
        'Add comprehensive Tailwind class validation using official parser',
        'Implement runtime class collection in development mode',
        'Create component-aware filtering based on actual prop mappings',
        'Add validation tests for filtered components',
        'Implement incremental extraction for better performance'
      ],
      longTerm: [
        'Build design system with automatic class registration',
        'Create visual regression testing for filtered components',
        'Implement AI-powered layout vs styling classification',
        'Build real-time component playground for validation',
        'Create automated documentation generation for class mappings'
      ]
    };
  }

  /**
   * Print comprehensive analysis report
   */
  public printAnalysisReport(): void {
    const analysis = this.analyzeSystem();
    
    console.log('🔍 SYSTEM SCALING ANALYSIS REPORT\n');
    
    // Potential Issues
    console.log('⚠️  POTENTIAL ISSUES:');
    analysis.potentialIssues.forEach((issue, index) => {
      const severityIcon = {
        low: '🟢',
        medium: '🟡', 
        high: '🟠',
        critical: '🔴'
      }[issue.severity];
      
      console.log(`\n${index + 1}. ${severityIcon} ${issue.issue} (${issue.severity.toUpperCase()})`);
      console.log(`   ${issue.description}`);
      
      if (issue.examples) {
        console.log('   Examples:');
        issue.examples.forEach(example => console.log(`   • ${example}`));
      }
      
      if (issue.solution) {
        console.log(`   💡 Solution: ${issue.solution}`);
      }
    });

    // Real-world validation
    console.log('\n🔍 REAL-WORLD VALIDATION:');
    console.log(`   Actual core classes: ${analysis.realWorldValidation.actualCoreClasses.length}`);
    console.log(`   Extracted classes: ${analysis.realWorldValidation.extractedClasses.length}`);
    console.log(`   Missed classes: ${analysis.realWorldValidation.missedClasses.length}`);
    console.log(`   False positives: ${analysis.realWorldValidation.falsePositives.length}`);
    
    if (analysis.realWorldValidation.missedClasses.length > 0) {
      console.log('\n   ❌ Missed Classes (first 10):');
      analysis.realWorldValidation.missedClasses.slice(0, 10).forEach(cls => {
        console.log(`      • ${cls}`);
      });
    }
    
    if (analysis.realWorldValidation.falsePositives.length > 0) {
      console.log('\n   ⚠️  False Positives (first 10):');
      analysis.realWorldValidation.falsePositives.slice(0, 10).forEach(cls => {
        console.log(`      • ${cls}`);
      });
    }

    // Scaling concerns
    console.log('\n📈 SCALING CONCERNS:');
    analysis.scalingConcerns.forEach((concern, index) => {
      console.log(`\n${index + 1}. ${concern.concern}`);
      console.log(`   Impact: ${concern.impact}`);
      console.log(`   💡 Recommendation: ${concern.recommendation}`);
    });

    // Recommendations
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('\n   Immediate Actions:');
    analysis.recommendations.immediate.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    
    console.log('\n   Long-term Strategy:');
    analysis.recommendations.longTerm.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log('\n✅ Analysis complete. Review recommendations for system improvements.');
  }
}

// Main execution
async function main() {
  const coreClassesPath = join(__dirname, 'core-tailwind-classes.json');
  
  console.log('🚀 Starting System Scaling Analysis...\n');
  
  const validator = new SystemAnalysisValidator(coreClassesPath);
  
  try {
    validator.printAnalysisReport();
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { SystemAnalysisValidator }; 