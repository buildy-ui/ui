import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Robust system v2 that addresses scaling and conflict issues
 */

interface ComponentClassMap {
  [componentName: string]: {
    props: Record<string, string[]>; // prop -> possible classes
    baseClasses: string[];
    variants: Record<string, Record<string, string[]>>;
  };
}

interface ClassificationRule {
  pattern: RegExp;
  category: 'layout' | 'styling' | 'semantic' | 'state';
  importance: 'critical' | 'important' | 'optional';
  componentContext?: string[];
}

/**
 * Robust class extractor using real component introspection
 */
class RobustClassExtractor {
  private componentClassMap: ComponentClassMap = {};
  private classificationRules: ClassificationRule[] = [];
  private runtimeValidatedClasses: Set<string> = new Set();

  constructor() {
    this.initializeClassificationRules();
  }

  /**
   * Initialize semantic classification rules
   */
  private initializeClassificationRules(): void {
    this.classificationRules = [
      // Layout - Critical structural classes
      {
        pattern: /^(flex|grid|block|inline|hidden|table)(-|$)/,
        category: 'layout',
        importance: 'critical'
      },
      {
        pattern: /^(relative|absolute|fixed|sticky)$/,
        category: 'layout', 
        importance: 'critical'
      },
      {
        pattern: /^(w|h|min-w|min-h|max-w|max-h)-(full|screen|auto|fit|min|max|\d+)$/,
        category: 'layout',
        importance: 'critical'
      },
      {
        pattern: /^(items|justify|place|self)-/,
        category: 'layout',
        importance: 'critical'
      },
      {
        pattern: /^(gap|space-[xy])-\d+$/,
        category: 'layout',
        importance: 'important'
      },

      // Semantic design tokens - Important for theming
      {
        pattern: /^(bg|text|border)-(background|foreground|primary|secondary|muted|accent|destructive)(-foreground)?$/,
        category: 'semantic',
        importance: 'important'
      },
      {
        pattern: /^(bg|text)-(transparent|current)$/,
        category: 'semantic',
        importance: 'important'
      },

      // State classes - Important for interactions
      {
        pattern: /^(hover|focus|active|disabled|group-hover|group-focus):/,
        category: 'state',
        importance: 'important',
        componentContext: ['Button', 'Card', 'Link']
      },

      // Styling - Optional decorative classes
      {
        pattern: /^(shadow|drop-shadow|blur|brightness)/,
        category: 'styling',
        importance: 'optional'
      },
      {
        pattern: /^(rounded|border-(?!0|t|b|l|r|x|y|transparent))/,
        category: 'styling',
        importance: 'optional'
      },
      {
        pattern: /^(animate|transition|duration|delay)/,
        category: 'styling',
        importance: 'optional'
      },
      {
        pattern: /^[mp][tblrxy]?-\d+$/,
        category: 'styling',
        importance: 'optional'
      }
    ];
  }

  /**
   * Extract actual component class mappings via runtime introspection
   */
  public async extractComponentMappings(componentPaths: string[]): Promise<ComponentClassMap> {
    for (const componentPath of componentPaths) {
      const mapping = await this.analyzeComponent(componentPath);
      if (mapping) {
        const componentName = this.getComponentName(componentPath);
        this.componentClassMap[componentName] = mapping;
      }
    }

    return this.componentClassMap;
  }

  /**
   * Analyze single component to extract real class mappings
   */
  private async analyzeComponent(filePath: string): Promise<ComponentClassMap[string] | null> {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      const mapping: ComponentClassMap[string] = {
        props: {},
        baseClasses: [],
        variants: {}
      };

      let cvaFound = false;

      traverse(ast, {
        // Extract CVA definitions
        CallExpression(path) {
          const callee = path.node.callee;
          
          if (
            (callee.type === 'Identifier' && callee.name === 'cva') ||
            (callee.type === 'MemberExpression' && 
             callee.property.type === 'Identifier' && 
             callee.property.name === 'cva')
          ) {
            cvaFound = true;
            
            // Base classes (first argument)
            if (path.node.arguments[0] && path.node.arguments[0].type === 'StringLiteral') {
              const baseClasses = self.parseClassString(path.node.arguments[0].value);
              mapping.baseClasses.push(...baseClasses);
            }

            // Variants (second argument)
            if (path.node.arguments[1] && path.node.arguments[1].type === 'ObjectExpression') {
              const variantsObj = path.node.arguments[1];
              
              variantsObj.properties.forEach((prop: any) => {
                if (prop.type === 'ObjectProperty' && prop.key.name === 'variants') {
                  if (prop.value.type === 'ObjectExpression') {
                    self.extractVariants(prop.value, mapping);
                  }
                }
              });
            }
          }
        }
      });

      return cvaFound ? mapping : null;
    } catch (error) {
      console.warn(`Failed to analyze component ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract variants from CVA variants object
   */
  private extractVariants(variantsObj: any, mapping: ComponentClassMap[string]): void {
    variantsObj.properties.forEach((propProperty: any) => {
      if (propProperty.type === 'ObjectProperty') {
        const propName = this.getPropertyName(propProperty.key);
        
        if (propProperty.value.type === 'ObjectExpression') {
          mapping.variants[propName] = {};
          
          propProperty.value.properties.forEach((valueProperty: any) => {
            if (valueProperty.type === 'ObjectProperty') {
              const valueName = this.getPropertyName(valueProperty.key);
              
              if (valueProperty.value.type === 'StringLiteral') {
                const classes = this.parseClassString(valueProperty.value.value);
                mapping.variants[propName][valueName] = classes;
                
                // Also add to props mapping
                if (!mapping.props[propName]) {
                  mapping.props[propName] = [];
                }
                mapping.props[propName].push(...classes);
              }
            }
          });
        }
      }
    });
  }

  /**
   * Parse class string into individual classes
   */
  private parseClassString(classStr: string): string[] {
    return classStr.split(/\s+/).filter(cls => cls.trim().length > 0);
  }

  /**
   * Get property name from AST node
   */
  private getPropertyName(keyNode: any): string {
    if (keyNode.type === 'Identifier') {
      return keyNode.name;
    } else if (keyNode.type === 'StringLiteral') {
      return keyNode.value;
    }
    return 'unknown';
  }

  /**
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  /**
   * Smart class filtering with context awareness
   */
  public filterClassesContextAware(
    classNames: string, 
    context?: {
      componentType?: string;
      parentComponent?: string;
      isInteractive?: boolean;
    }
  ): {
    kept: string[];
    removed: string[];
    warnings: string[];
  } {
    const classes = classNames.split(/\s+/).filter(cls => cls.trim().length > 0);
    const kept: string[] = [];
    const removed: string[] = [];
    const warnings: string[] = [];

    classes.forEach(className => {
      const classification = this.classifyClass(className, context);
      
      if (this.shouldKeepClass(classification, context)) {
        kept.push(className);
      } else {
        removed.push(className);
        
        // Add warning for potentially important removals
        if (classification.importance === 'important') {
          warnings.push(`Removed important ${classification.category} class: ${className}`);
        }
      }
    });

    return { kept, removed, warnings };
  }

  /**
   * Classify individual class with context
   */
  private classifyClass(
    className: string, 
    context?: { componentType?: string; isInteractive?: boolean }
  ): {
    category: 'layout' | 'styling' | 'semantic' | 'state' | 'unknown';
    importance: 'critical' | 'important' | 'optional';
    inComponentMap: boolean;
  } {
    // Check if class is in component mappings (highest priority)
    const inComponentMap = this.isClassInComponentMap(className, context?.componentType);
    
    if (inComponentMap) {
      return {
        category: 'semantic',
        importance: 'critical',
        inComponentMap: true
      };
    }

    // Apply classification rules
    for (const rule of this.classificationRules) {
      if (rule.pattern.test(className)) {
        // Check component context if specified
        if (rule.componentContext && context?.componentType) {
          if (!rule.componentContext.includes(context.componentType)) {
            continue; // Skip this rule for this component type
          }
        }

        return {
          category: rule.category,
          importance: rule.importance,
          inComponentMap: false
        };
      }
    }

    return {
      category: 'unknown',
      importance: 'optional',
      inComponentMap: false
    };
  }

  /**
   * Check if class exists in component mappings
   */
  private isClassInComponentMap(className: string, componentType?: string): boolean {
    if (componentType && this.componentClassMap[componentType]) {
      const component = this.componentClassMap[componentType];
      
      // Check base classes
      if (component.baseClasses.includes(className)) {
        return true;
      }
      
      // Check variant classes
      for (const propClasses of Object.values(component.props)) {
        if (propClasses.includes(className)) {
          return true;
        }
      }
    }

    // Check all components if no specific type
    for (const component of Object.values(this.componentClassMap)) {
      if (component.baseClasses.includes(className)) {
        return true;
      }
      
      for (const propClasses of Object.values(component.props)) {
        if (propClasses.includes(className)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Decision logic for keeping classes
   */
  private shouldKeepClass(
    classification: ReturnType<typeof this.classifyClass>,
    context?: { isInteractive?: boolean }
  ): boolean {
    // Always keep critical classes
    if (classification.importance === 'critical') {
      return true;
    }

    // Always keep classes from component mappings
    if (classification.inComponentMap) {
      return true;
    }

    // Keep important layout and semantic classes
    if (classification.importance === 'important' && 
        (classification.category === 'layout' || classification.category === 'semantic')) {
      return true;
    }

    // Keep state classes for interactive components
    if (classification.category === 'state' && context?.isInteractive) {
      return true;
    }

    // Remove optional styling classes
    if (classification.category === 'styling' && classification.importance === 'optional') {
      return false;
    }

    // Conservative approach for unknown classes
    return true;
  }

  /**
   * Generate component prop suggestions
   */
  public generatePropSuggestions(className: string): string[] {
    const suggestions: string[] = [];
    
    // Check if class matches known component patterns
    for (const [componentName, component] of Object.entries(this.componentClassMap)) {
      for (const [propName, propClasses] of Object.entries(component.props)) {
        if (propClasses.includes(className)) {
          // Find the variant value for this class
          for (const [variantName, variantClasses] of Object.entries(component.variants[propName] || {})) {
            if (variantClasses.includes(className)) {
              suggestions.push(`<${componentName} ${propName}="${variantName}" />`);
            }
          }
        }
      }
    }

    return suggestions;
  }

  /**
   * Export component mappings for documentation
   */
  public exportComponentMappings(outputPath: string): void {
    const documentation = {
      timestamp: new Date().toISOString(),
      components: this.componentClassMap,
      classificationRules: this.classificationRules.map(rule => ({
        pattern: rule.pattern.source,
        category: rule.category,
        importance: rule.importance,
        componentContext: rule.componentContext
      })),
      summary: {
        totalComponents: Object.keys(this.componentClassMap).length,
        totalClasses: Object.values(this.componentClassMap).reduce(
          (total, comp) => total + comp.baseClasses.length + Object.values(comp.props).flat().length,
          0
        )
      }
    };

    writeFileSync(outputPath, JSON.stringify(documentation, null, 2));
    console.log(`📚 Component mappings exported to: ${outputPath}`);
  }
}

// Usage example
async function demonstrateRobustSystem() {
  console.log('🚀 Demonstrating Robust System v2...\n');
  
  const extractor = new RobustClassExtractor();
  
  // Extract real component mappings
  const componentPaths = [
    join(__dirname, '../packages/@ui8kit/core/src/utility/components/Stack/Stack.tsx'),
    join(__dirname, '../packages/@ui8kit/core/src/utility/components/Group/Group.tsx'),
    join(__dirname, '../packages/@ui8kit/core/src/utility/ui/Button/Button.tsx')
  ];
  
  console.log('📊 Extracting real component mappings...');
  const mappings = await extractor.extractComponentMappings(componentPaths);
  
  console.log(`Found ${Object.keys(mappings).length} components with mappings`);
  
  // Test context-aware filtering
  console.log('\n🧪 Testing context-aware filtering...');
  
  const testCases = [
    {
      input: 'flex items-center gap-4 bg-primary hover:bg-primary/90 shadow-lg transition-all p-6',
      context: { componentType: 'Button', isInteractive: true }
    },
    {
      input: 'text-center mx-auto max-w-2xl text-muted-foreground leading-relaxed',
      context: { componentType: 'Stack', isInteractive: false }
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}:`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Context: ${JSON.stringify(testCase.context)}`);
    
    const result = extractor.filterClassesContextAware(testCase.input, testCase.context);
    
    console.log(`Kept: ${result.kept.join(' ')}`);
    console.log(`Removed: ${result.removed.join(' ')}`);
    
    if (result.warnings.length > 0) {
      console.log(`Warnings: ${result.warnings.join(', ')}`);
    }
  });
  
  // Export documentation
  const outputPath = join(__dirname, 'robust-component-mappings.json');
  extractor.exportComponentMappings(outputPath);
  
  console.log('\n✅ Robust system demonstration complete!');
}

// Run if called directly
if (require.main === module) {
  demonstrateRobustSystem();
}

export { RobustClassExtractor }; 