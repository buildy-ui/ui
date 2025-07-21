import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface ExtractedClass {
  className: string;
  component: string;
  filePath: string;
  context: string; // CVA property name or context
}

class CoreTailwindExtractor {
  private extractedClasses: Set<string> = new Set();
  private detailedClasses: ExtractedClass[] = [];
  private coreUtilityPath: string;

  constructor(coreUtilityPath: string) {
    this.coreUtilityPath = coreUtilityPath;
  }

  /**
   * Main method to extract all Tailwind classes from ui8kit/core utility components
   */
  public extractAllClasses(): {
    uniqueClasses: string[];
    detailedMap: ExtractedClass[];
    summary: {
      totalFiles: number;
      totalClasses: number;
      componentBreakdown: Record<string, number>;
    };
  } {
    console.log(`🔍 Scanning ui8kit/core utility components in: ${this.coreUtilityPath}`);
    
    const files = this.getAllTsxFiles(this.coreUtilityPath);
    console.log(`📁 Found ${files.length} TypeScript/TSX files`);

    const componentBreakdown: Record<string, number> = {};

    files.forEach(filePath => {
      const componentName = this.getComponentName(filePath);
      const classCount = this.extractFromFile(filePath);
      componentBreakdown[componentName] = classCount;
      
      console.log(`✅ ${componentName}: ${classCount} classes`);
    });

    const uniqueClasses = Array.from(this.extractedClasses).sort();
    
    console.log(`\n📊 Extraction Summary:`);
    console.log(`   • Total files processed: ${files.length}`);
    console.log(`   • Unique Tailwind classes: ${uniqueClasses.length}`);
    console.log(`   • Total class instances: ${this.detailedClasses.length}`);

    return {
      uniqueClasses,
      detailedMap: this.detailedClasses,
      summary: {
        totalFiles: files.length,
        totalClasses: uniqueClasses.length,
        componentBreakdown
      }
    };
  }

  /**
   * Recursively get all .ts and .tsx files from directory
   */
  private getAllTsxFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        files.push(...this.getAllTsxFiles(fullPath));
      } else if (stat.isFile()) {
        const ext = extname(item);
        // Include .ts and .tsx files only
        if (ext === '.ts' || ext === '.tsx') {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  /**
   * Extract component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  /**
   * Extract Tailwind classes from a single file using AST parsing
   */
  private extractFromFile(filePath: string): number {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const componentName = this.getComponentName(filePath);
      
      // Parse TypeScript/TSX with Babel
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      let classCount = 0;
      const self = this;

      traverse(ast, {
        // Look for CVA calls: cva("base-classes", { variants: ... })
        CallExpression(path) {
          const callee = path.node.callee;
          
          // Check if it's a cva() call
          if (
            (callee.type === 'Identifier' && callee.name === 'cva') ||
            (callee.type === 'MemberExpression' && 
             callee.property.type === 'Identifier' && 
             callee.property.name === 'cva')
          ) {
            // Extract classes from CVA arguments
            const args = path.node.arguments;
            
            // First argument: base classes (string literal)
            if (args[0] && args[0].type === 'StringLiteral') {
              const baseClasses = self.extractClassesFromString(args[0].value);
              baseClasses.forEach(className => {
                self.addExtractedClass({
                  className,
                  component: componentName,
                  filePath,
                  context: 'cva-base'
                });
                classCount++;
              });
            }

            // Second argument: variants object
            if (args[1] && args[1].type === 'ObjectExpression') {
              classCount += self.extractFromCVAVariants(args[1], componentName, filePath);
            }
          }
        },

        // Look for template literals with Tailwind classes
        TemplateLiteral(path) {
          const templateLiteral = path.node;
          
          // Combine quasis (static parts) and check for Tailwind classes
          templateLiteral.quasis.forEach(quasi => {
            if (quasi.value && quasi.value.raw) {
              const classes = self.extractClassesFromString(quasi.value.raw);
              classes.forEach(className => {
                self.addExtractedClass({
                  className,
                  component: componentName,
                  filePath,
                  context: 'template-literal'
                });
                classCount++;
              });
            }
          });
        },

        // Look for string literals that might contain Tailwind classes
        StringLiteral(path) {
          // Avoid processing strings inside imports or non-relevant contexts
          const parent = path.parent;
          if (
            parent?.type === 'ImportDeclaration' ||
            parent?.type === 'ImportSpecifier'
          ) {
            return;
          }

          const classes = self.extractClassesFromString(path.node.value);
          classes.forEach(className => {
            self.addExtractedClass({
              className,
              component: componentName,
              filePath,
              context: 'string-literal'
            });
            classCount++;
          });
        }
      });

      return classCount;
    } catch (error) {
      console.error(`❌ Error processing file ${filePath}:`, error);
      return 0;
    }
  }

  /**
   * Extract classes from CVA variants object
   */
  private extractFromCVAVariants(
    variantsObj: any, 
    componentName: string, 
    filePath: string
  ): number {
    let classCount = 0;

    if (variantsObj.type !== 'ObjectExpression') return 0;

    variantsObj.properties.forEach((prop: any) => {
      if (prop.type === 'ObjectProperty' || prop.type === 'Property') {
        const variantName = this.getPropertyName(prop.key);
        
        if (prop.value.type === 'ObjectExpression') {
          // Variant values object: { size: { sm: "text-sm", lg: "text-lg" } }
          prop.value.properties.forEach((valueProp: any) => {
            if (valueProp.type === 'ObjectProperty' || valueProp.type === 'Property') {
              const valueKey = this.getPropertyName(valueProp.key);
              
              if (valueProp.value.type === 'StringLiteral') {
                const classes = this.extractClassesFromString(valueProp.value.value);
                classes.forEach(className => {
                  this.addExtractedClass({
                    className,
                    component: componentName,
                    filePath,
                    context: `cva-variant-${variantName}-${valueKey}`
                  });
                  classCount++;
                });
              }
            }
          });
        }
      }
    });

    return classCount;
  }

  /**
   * Get property name from AST node (handles both Identifier and StringLiteral keys)
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
   * Extract Tailwind classes from a string using regex
   */
  private extractClassesFromString(str: string): string[] {
    if (!str || typeof str !== 'string') return [];

    // Split by spaces and filter for valid Tailwind classes
    const words = str.split(/\s+/).filter(word => word.trim().length > 0);
    
    const tailwindClasses: string[] = [];
    
    words.forEach(word => {
      // Basic Tailwind class pattern matching
      if (this.isTailwindClass(word)) {
        tailwindClasses.push(word);
      }
    });

    return tailwindClasses;
  }

  /**
   * Check if a string looks like a Tailwind class
   */
  private isTailwindClass(str: string): boolean {
    // Common Tailwind patterns
    const tailwindPatterns = [
      // Responsive prefixes
      /^(sm|md|lg|xl|2xl):/,
      // State prefixes
      /^(hover|focus|active|disabled|group-hover|group-focus):/,
      // Layout
      /^(flex|grid|block|inline|hidden|table)/,
      // Spacing
      /^(m|p|space)(-|$)/,
      // Sizing
      /^(w|h|min-w|min-h|max-w|max-h)(-|$)/,
      // Typography
      /^(text|font|leading|tracking|whitespace)(-|$)/,
      // Colors (very basic check)
      /^(bg|text|border|ring)(-|$)/,
      // Flexbox & Grid
      /^(justify|items|self|place|gap|flex-|grid-)/,
      // Borders
      /^(border|rounded|ring)(-|$)/,
      // Effects
      /^(shadow|opacity|transition|transform|scale|rotate)/,
      // Positioning
      /^(relative|absolute|fixed|sticky|top|bottom|left|right|inset)(-|$)/,
      // Display utilities
      /^(sr-only|not-sr-only|overflow|object|cursor|pointer-events|user-select)/
    ];

    // Check if string matches any Tailwind pattern
    return tailwindPatterns.some(pattern => pattern.test(str)) ||
           // Check for arbitrary values: [value] or utility-[value]
           /\[.+\]/.test(str) ||
           // Check for numeric suffixes: utility-1, utility-12, etc.
           /^[a-z]+-\d+/.test(str);
  }

  /**
   * Add extracted class to collections (with deduplication)
   */
  private addExtractedClass(classInfo: ExtractedClass): void {
    this.extractedClasses.add(classInfo.className);
    this.detailedClasses.push(classInfo);
  }

  /**
   * Save results to JSON file
   */
  public saveResults(outputPath: string): void {
    const results = this.extractAllClasses();
    
    const output = {
      timestamp: new Date().toISOString(),
      ...results
    };

    require('fs').writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const coreUtilityPath = join(__dirname, '../packages/@ui8kit/core/src/utility');
  const outputPath = join(__dirname, 'core-tailwind-classes.json');
  
  console.log('🚀 Starting Tailwind class extraction from ui8kit/core...\n');
  
  const extractor = new CoreTailwindExtractor(coreUtilityPath);
  
  try {
    extractor.saveResults(outputPath);
    
    console.log('\n✅ Extraction completed successfully!');
    console.log(`📄 Check results in: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Extraction failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { CoreTailwindExtractor }; 