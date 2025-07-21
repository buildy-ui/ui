import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Simple CVA extractor - no rules, just extract everything
 */
class SimpleCVAExtractor {
  private extractedClasses: Set<string> = new Set();
  private componentData: Record<string, {
    filePath: string;
    classes: string[];
    baseClasses: string[];
    variantClasses: string[];
  }> = {};

  /**
   * Recursively walk through all components and extract ALL CVA classes
   */
  public extractAllCVAClasses(rootPath: string): {
    allClasses: string[];
    componentData: Record<string, {
      filePath: string;
      classes: string[];
      baseClasses: string[];
      variantClasses: string[];
    }>;
    summary: {
      totalComponents: number;
      totalClasses: number;
      totalFiles: number;
    };
  } {
    console.log(`🔍 Recursively scanning components in: ${rootPath}`);
    
    const files = this.getAllComponentFiles(rootPath);
    console.log(`📁 Found ${files.length} component files`);

    files.forEach(filePath => {
      this.extractFromFile(filePath);
    });

    const allClasses = Array.from(this.extractedClasses).sort();
    
    console.log(`\n📊 Extraction Summary:`);
    console.log(`   • Total files processed: ${files.length}`);
    console.log(`   • Total components with CVA: ${Object.keys(this.componentData).length}`);
    console.log(`   • Total unique classes: ${allClasses.length}`);

    return {
      allClasses,
      componentData: this.componentData,
      summary: {
        totalComponents: Object.keys(this.componentData).length,
        totalClasses: allClasses.length,
        totalFiles: files.length
      }
    };
  }

  /**
   * Recursively get ALL component files
   */
  private getAllComponentFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    try {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively scan all subdirectories
          files.push(...this.getAllComponentFiles(fullPath));
        } else if (stat.isFile()) {
          const ext = extname(item);
          // Include all .ts and .tsx files
          if (ext === '.ts' || ext === '.tsx') {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error reading directory ${dirPath}:`, error);
    }
    
    return files;
  }

  /**
   * Extract ALL classes from a single file
   */
  private extractFromFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const componentName = this.getComponentName(filePath);
      
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      const componentClasses: string[] = [];
      const baseClasses: string[] = [];
      const variantClasses: string[] = [];

      const self = this;

      traverse(ast, {
        CallExpression(path) {
          const callee = path.node.callee;
          
          // Find CVA calls
          if (
            (callee.type === 'Identifier' && callee.name === 'cva') ||
            (callee.type === 'MemberExpression' && 
             callee.property.type === 'Identifier' && 
             callee.property.name === 'cva')
          ) {
            console.log(`  ✅ Found CVA in: ${componentName}`);
            
            // Extract ALL arguments
            path.node.arguments.forEach((arg, index) => {
              if (arg.type === 'StringLiteral') {
                // Base classes (usually first argument)
                const classes = self.extractClassesFromString(arg.value);
                classes.forEach(cls => {
                  self.extractedClasses.add(cls);
                  componentClasses.push(cls);
                  if (index === 0) baseClasses.push(cls);
                });
              } else if (arg.type === 'ObjectExpression') {
                // Variants object (usually second argument)
                self.extractFromObject(arg, componentClasses, variantClasses);
              }
            });
          }
        }
      });

      // Store component data if we found classes
      if (componentClasses.length > 0) {
        this.componentData[componentName] = {
          filePath,
          classes: componentClasses,
          baseClasses,
          variantClasses
        };
      }

    } catch (error) {
      console.warn(`❌ Error processing ${filePath}:`, error);
    }
  }

  /**
   * Recursively extract classes from any object (variants, etc.)
   */
  private extractFromObject(obj: any, componentClasses: string[], variantClasses: string[]): void {
    if (obj.type === 'ObjectExpression') {
      obj.properties.forEach((prop: any) => {
        if (prop.type === 'ObjectProperty' || prop.type === 'Property') {
          if (prop.value.type === 'StringLiteral') {
            // Direct string value
            const classes = this.extractClassesFromString(prop.value.value);
            classes.forEach(cls => {
              this.extractedClasses.add(cls);
              componentClasses.push(cls);
              variantClasses.push(cls);
            });
          } else if (prop.value.type === 'ObjectExpression') {
            // Nested object - recurse
            this.extractFromObject(prop.value, componentClasses, variantClasses);
          } else if (prop.value.type === 'ArrayExpression') {
            // Array of values
            prop.value.elements.forEach((element: any) => {
              if (element && element.type === 'StringLiteral') {
                const classes = this.extractClassesFromString(element.value);
                classes.forEach(cls => {
                  this.extractedClasses.add(cls);
                  componentClasses.push(cls);
                  variantClasses.push(cls);
                });
              }
            });
          }
        }
      });
    }
  }

  /**
   * Extract classes from string - split by spaces, no filtering
   */
  private extractClassesFromString(str: string): string[] {
    if (!str || typeof str !== 'string') return [];
    return str.split(/\s+/).filter(cls => cls.trim().length > 0);
  }

  /**
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  /**
   * Simple filtering - just check if class exists in extracted set
   */
  public filterUsingExtracted(classNames: string): {
    kept: string[];
    removed: string[];
    analysis: {
      total: number;
      keptCount: number;
      removedCount: number;
      inCVA: number;
      notInCVA: number;
    };
  } {
    const classes = classNames.split(/\s+/).filter(cls => cls.trim().length > 0);
    const kept: string[] = [];
    const removed: string[] = [];
    let inCVA = 0;
    let notInCVA = 0;

    classes.forEach(className => {
      if (this.extractedClasses.has(className)) {
        kept.push(className);
        inCVA++;
      } else {
        removed.push(className);
        notInCVA++;
      }
    });

    return {
      kept,
      removed,
      analysis: {
        total: classes.length,
        keptCount: kept.length,
        removedCount: removed.length,
        inCVA,
        notInCVA
      }
    };
  }

  /**
   * Generate simple whitelist array for other tools
   */
  public generateWhitelist(): string[] {
    return Array.from(this.extractedClasses).sort();
  }

  /**
   * Save results
   */
  public saveResults(outputPath: string): void {
    const results = this.extractAllCVAClasses('');
    
    const output = {
      timestamp: new Date().toISOString(),
      method: 'simple-cva-extraction',
      description: 'All classes extracted from CVA definitions without filtering',
      ...results
    };

    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = join(__dirname, '../packages/@ui8kit/core/src');
  const outputPath = join(__dirname, 'simple-cva-classes.json');
  
  console.log('🚀 Starting Simple CVA Extraction...\n');
  
  const extractor = new SimpleCVAExtractor();
  
  try {
    const results = extractor.extractAllCVAClasses(rootPath);
    
    // Save results
    const output = {
      timestamp: new Date().toISOString(),
      method: 'simple-cva-extraction',
      description: 'All classes extracted from CVA definitions without filtering',
      ...results
    };

    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${outputPath}`);
    
    // Test filtering
    console.log('\n🧪 Testing simple filtering...');
    
    const testClasses = 'flex items-center gap-4 bg-primary hover:bg-primary/90 shadow-lg py-16 transition-all';
    console.log(`Input: "${testClasses}"`);
    
    const filterResult = extractor.filterUsingExtracted(testClasses);
    console.log(`Kept (in CVA): ${filterResult.kept.join(' ')}`);
    console.log(`Removed (not in CVA): ${filterResult.removed.join(' ')}`);
    console.log(`Analysis: ${filterResult.analysis.inCVA}/${filterResult.analysis.total} classes found in CVA`);
    
    // Generate whitelist
    const whitelist = extractor.generateWhitelist();
    const whitelistPath = join(__dirname, 'cva-whitelist.json');
    writeFileSync(whitelistPath, JSON.stringify({ 
      classes: whitelist,
      count: whitelist.length,
      timestamp: new Date().toISOString()
    }, null, 2));
    console.log(`📝 Whitelist saved to: ${whitelistPath}`);
    
    console.log('\n✅ Simple extraction completed!');
    console.log('💡 Use this whitelist with tw-merge or similar tools');
    
  } catch (error) {
    console.error('❌ Extraction failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { SimpleCVAExtractor }; 