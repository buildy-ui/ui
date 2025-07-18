// bun scripts/data-class-analyzer.ts
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

interface DataClassMapping {
  dataClass: string;
  className: string;
  elementName: string;
  file: string;
  line: number;
  normalizedClasses: string[];
}

interface DuplicateGroup {
  className: string;
  normalizedClasses: string[];
  count: number;
  dataClasses: Array<{
    dataClass: string;
    elementName: string;
    file: string;
    line: number;
  }>;
}

interface SimilarityGroup {
  similarity: number;
  commonClasses: string[];
  items: Array<{
    dataClass: string;
    className: string;
    uniqueClasses: string[];
    file: string;
    line: number;
  }>;
}

interface AnalyzerConfig {
  inputDir: string;
  componentsGlob: string;
  outputFile: string;
  similarityThreshold: number;
}

const DEFAULT_CONFIG: AnalyzerConfig = {
  inputDir: './packages/@ui8kit/blocks/src',
  componentsGlob: '**/*.tsx',
  outputFile: './data-class-mapping.json',
  similarityThreshold: 0.7 // 70% similarity
};

class DataClassAnalyzer {
  private config: AnalyzerConfig;
  private mappings: DataClassMapping[] = [];

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async analyzeAll(): Promise<void> {
    console.log('🔍 Analyzing data-class mappings...\n');

    const pattern = `${this.config.inputDir.replace(/\\/g, '/')}/${this.config.componentsGlob}`;
    const componentFiles = await glob(pattern);

    console.log(`📁 Found ${componentFiles.length} component files\n`);

    this.mappings = [];

    for (const file of componentFiles) {
      await this.analyzeFile(file);
    }

    console.log(`📊 Total mappings found: ${this.mappings.length}\n`);

    // Sort mappings by className for better organization
    this.mappings.sort((a, b) => a.className.localeCompare(b.className));

    // Generate analyses
    this.generateMapping();
    this.findDuplicates();
    this.findSimilarities();
    this.generateRecommendations();
  }

  private async analyzeFile(filePath: string): Promise<void> {
    try {
      const componentContent = fs.readFileSync(filePath, 'utf-8');
      const ast = parse(componentContent, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      const self = this;
      traverse(ast, {
        JSXOpeningElement(path) {
          const elementName = self.getElementName(path.node);
          const hasClassName = self.hasAttribute(path.node, 'className');
          const hasDataClass = self.hasAttribute(path.node, 'data-class');

          // Only process elements that have both className and data-class
          if (hasClassName && hasDataClass) {
            const classNameAttr = self.getAttribute(path.node, 'className');
            const dataClassAttr = self.getAttribute(path.node, 'data-class');
            
            const classNameValue = self.getAttributeValue(classNameAttr);
            const dataClassValue = self.getAttributeValue(dataClassAttr);

            if (classNameValue && dataClassValue) {
              const loc = path.node.loc;
              const lineNumber = loc?.start.line || 0;
              
              const normalizedClasses = self.normalizeClasses(classNameValue);

              self.mappings.push({
                dataClass: dataClassValue,
                className: classNameValue,
                elementName,
                file: filePath,
                line: lineNumber,
                normalizedClasses
              });
            }
          }
        }
      });
    } catch (err) {
      console.error(`❌ Error analyzing file ${filePath}:`, err);
    }
  }

  private getElementName(node: t.JSXOpeningElement): string {
    if (t.isJSXIdentifier(node.name)) {
      return node.name.name;
    } else if (t.isJSXMemberExpression(node.name)) {
      return `${this.getElementName({ name: node.name.object } as any)}.${node.name.property.name}`;
    }
    return 'Unknown';
  }

  private hasAttribute(node: t.JSXOpeningElement, attributeName: string): boolean {
    return node.attributes.some(attr => 
      t.isJSXAttribute(attr) && 
      t.isJSXIdentifier(attr.name) && 
      attr.name.name === attributeName
    );
  }

  private getAttribute(node: t.JSXOpeningElement, attributeName: string): t.JSXAttribute | null {
    const attr = node.attributes.find(attr => 
      t.isJSXAttribute(attr) && 
      t.isJSXIdentifier(attr.name) && 
      attr.name.name === attributeName
    );
    return attr as t.JSXAttribute || null;
  }

  private getAttributeValue(attr: t.JSXAttribute | null): string {
    if (!attr) return '';

    if (t.isStringLiteral(attr.value)) {
      return attr.value.value;
    } else if (t.isJSXExpressionContainer(attr.value)) {
      const expr = attr.value.expression;
      if (t.isStringLiteral(expr)) {
        return expr.value;
      } else if (t.isCallExpression(expr)) {
        return this.extractStaticClassesFromCall(expr);
      } else if (t.isTemplateLiteral(expr)) {
        return this.extractStaticClassesFromTemplate(expr);
      }
    }
    return '';
  }

  private extractStaticClassesFromCall(expr: t.CallExpression): string {
    const classes: string[] = [];
    expr.arguments.forEach(arg => {
      if (t.isStringLiteral(arg)) {
        classes.push(arg.value);
      }
    });
    return classes.join(' ');
  }

  private extractStaticClassesFromTemplate(expr: t.TemplateLiteral): string {
    const classes: string[] = [];
    expr.quasis.forEach(quasi => {
      if (quasi.value.raw.trim()) {
        classes.push(quasi.value.raw.trim());
      }
    });
    return classes.join(' ');
  }

  private normalizeClasses(className: string): string[] {
    return className
      .split(/\s+/)
      .filter(cls => cls.length > 0)
      .sort(); // Sort for consistent comparison
  }

  private generateMapping(): void {
    const mapping: Record<string, string> = {};
    
    this.mappings.forEach(item => {
      mapping[item.dataClass] = item.className;
    });

    // Sort by keys
    const sortedMapping = Object.keys(mapping)
      .sort()
      .reduce((acc, key) => {
        acc[key] = mapping[key];
        return acc;
      }, {} as Record<string, string>);

    fs.writeFileSync(this.config.outputFile, JSON.stringify(sortedMapping, null, 2));
    console.log(`✅ Generated mapping file: ${this.config.outputFile}`);
  }

  private findDuplicates(): void {
    const classNameGroups: Record<string, DataClassMapping[]> = {};

    // Group by className
    this.mappings.forEach(mapping => {
      const key = mapping.className;
      if (!classNameGroups[key]) {
        classNameGroups[key] = [];
      }
      classNameGroups[key].push(mapping);
    });

    // Find duplicates
    const duplicates: DuplicateGroup[] = [];
    Object.entries(classNameGroups).forEach(([className, mappings]) => {
      if (mappings.length > 1) {
        duplicates.push({
          className,
          normalizedClasses: mappings[0].normalizedClasses,
          count: mappings.length,
          dataClasses: mappings.map(m => ({
            dataClass: m.dataClass,
            elementName: m.elementName,
            file: path.relative(process.cwd(), m.file),
            line: m.line
          }))
        });
      }
    });

    // Sort by count (most duplicates first)
    duplicates.sort((a, b) => b.count - a.count);

    console.log('\n🔄 EXACT DUPLICATES');
    console.log('═'.repeat(50));
    
    if (duplicates.length === 0) {
      console.log('✅ No exact duplicates found!');
    } else {
      duplicates.forEach((duplicate, index) => {
        console.log(`\n${index + 1}. "${duplicate.className}" (${duplicate.count} times)`);
        console.log(`   Classes: [${duplicate.normalizedClasses.join(', ')}]`);
        console.log('   Used in:');
        duplicate.dataClasses.forEach(item => {
          console.log(`     • ${item.dataClass} (<${item.elementName}> in ${item.file}:${item.line})`);
        });
      });
      
      console.log(`\n💡 Found ${duplicates.length} exact duplicates that could be consolidated`);
    }
  }

  private findSimilarities(): void {
    const similarities: SimilarityGroup[] = [];

    // Compare each mapping with every other mapping
    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        // Skip if they're exactly the same
        if (item1.className === item2.className) continue;

        const similarity = this.calculateSimilarity(item1.normalizedClasses, item2.normalizedClasses);
        
        if (similarity >= this.config.similarityThreshold) {
          const commonClasses = this.getCommonClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique1 = this.getUniqueClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique2 = this.getUniqueClasses(item2.normalizedClasses, item1.normalizedClasses);

          similarities.push({
            similarity,
            commonClasses,
            items: [
              {
                dataClass: item1.dataClass,
                className: item1.className,
                uniqueClasses: unique1,
                file: path.relative(process.cwd(), item1.file),
                line: item1.line
              },
              {
                dataClass: item2.dataClass,
                className: item2.className,
                uniqueClasses: unique2,
                file: path.relative(process.cwd(), item2.file),
                line: item2.line
              }
            ]
          });
        }
      }
    }

    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);

    console.log('\n🔗 SIMILAR CLASSES');
    console.log('═'.repeat(50));
    
    if (similarities.length === 0) {
      console.log(`✅ No similar classes found above ${(this.config.similarityThreshold * 100).toFixed(0)}% threshold`);
    } else {
      similarities.slice(0, 10).forEach((sim, index) => { // Show top 10
        console.log(`\n${index + 1}. Similarity: ${(sim.similarity * 100).toFixed(1)}%`);
        console.log(`   Common classes: [${sim.commonClasses.join(', ')}]`);
        console.log('   Items:');
        sim.items.forEach(item => {
          const uniqueStr = item.uniqueClasses.length > 0 ? ` + [${item.uniqueClasses.join(', ')}]` : '';
          console.log(`     • ${item.dataClass}: "${item.className}"${uniqueStr}`);
          console.log(`       (${item.file}:${item.line})`);
        });
      });
      
      if (similarities.length > 10) {
        console.log(`\n... and ${similarities.length - 10} more similar groups`);
      }
    }
  }

  private calculateSimilarity(classes1: string[], classes2: string[]): number {
    const set1 = new Set(classes1);
    const set2 = new Set(classes2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private getCommonClasses(classes1: string[], classes2: string[]): string[] {
    const set1 = new Set(classes1);
    const set2 = new Set(classes2);
    
    return [...set1].filter(x => set2.has(x)).sort();
  }

  private getUniqueClasses(classes1: string[], classes2: string[]): string[] {
    const set1 = new Set(classes1);
    const set2 = new Set(classes2);
    
    return [...set1].filter(x => !set2.has(x)).sort();
  }

  private generateRecommendations(): void {
    console.log('\n💡 RECOMMENDATIONS');
    console.log('═'.repeat(50));

    // Count data-class prefixes
    const prefixCounts: Record<string, number> = {};
    this.mappings.forEach(mapping => {
      const prefix = mapping.dataClass.split('-')[0];
      prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
    });

    const sortedPrefixes = Object.entries(prefixCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    console.log('\nMost common data-class prefixes:');
    sortedPrefixes.forEach(([prefix, count]) => {
      console.log(`  • ${prefix}-*: ${count} occurrences`);
    });

    // Suggest base classes
    const frequentClasses: Record<string, number> = {};
    this.mappings.forEach(mapping => {
      mapping.normalizedClasses.forEach(cls => {
        frequentClasses[cls] = (frequentClasses[cls] || 0) + 1;
      });
    });

    const topClasses = Object.entries(frequentClasses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    console.log('\nMost frequently used utility classes:');
    topClasses.forEach(([cls, count]) => {
      console.log(`  • ${cls}: ${count} times`);
    });

    console.log('\n📋 Summary:');
    console.log(`  • Total data-class mappings: ${this.mappings.length}`);
    console.log(`  • Unique data-class names: ${new Set(this.mappings.map(m => m.dataClass)).size}`);
    console.log(`  • Unique className combinations: ${new Set(this.mappings.map(m => m.className)).size}`);
    console.log(`  • Average classes per mapping: ${(this.mappings.reduce((sum, m) => sum + m.normalizedClasses.length, 0) / this.mappings.length).toFixed(1)}`);
  }
}

// Run the analyzer
const analyzer = new DataClassAnalyzer();

async function run() {
  try {
    await analyzer.analyzeAll();
  } catch (err) {
    console.error('❌ Error running data-class-analyzer:', err);
    process.exit(1);
  }
}

run();