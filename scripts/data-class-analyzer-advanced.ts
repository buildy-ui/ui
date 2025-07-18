// bun scripts/data-class-analyzer-advanced.ts
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
  stemmedClasses: string[];
}

interface SimilarityResult {
  similarity: number;
  levenshteinDistance: number;
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
  levenshteinThreshold: number;
}

const DEFAULT_CONFIG: AnalyzerConfig = {
  inputDir: './packages/@ui8kit/blocks/src',
  componentsGlob: '**/*.tsx',
  outputFile: './data-class-mapping-advanced.json',
  similarityThreshold: 0.6, // 60% similarity
  levenshteinThreshold: 3   // Max distance of 3 edits
};

class PorterStemmer {
  private static vowels = 'aeiou';
  
  // Простая реализация алгоритма Портера для CSS классов
  static stem(word: string): string {
    if (word.length <= 2) return word;
    
    let stem = word.toLowerCase();
    
    // Убираем общие CSS суффиксы
    const cssRules = [
      { pattern: /-(sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl)$/, replacement: '-size' },
      { pattern: /-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96)$/, replacement: '-num' },
      { pattern: /-(primary|secondary|accent|muted|destructive)$/, replacement: '-color' },
      { pattern: /-(top|bottom|left|right|start|end)$/, replacement: '-direction' },
      { pattern: /-(hover|focus|active|disabled|visited)$/, replacement: '-state' },
      { pattern: /-?(x|y)$/, replacement: '-axis' },
      { pattern: /-(full|auto|fit|max|min)$/, replacement: '-size' },
      { pattern: /-(solid|dashed|dotted|double|none)$/, replacement: '-style' }
    ];
    
    for (const rule of cssRules) {
      stem = stem.replace(rule.pattern, rule.replacement);
    }
    
    return stem;
  }
  
  static stemClasses(classes: string[]): string[] {
    return classes.map(cls => this.stem(cls));
  }
}

class LevenshteinDistance {
  static calculate(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  static calculateClassSets(classes1: string[], classes2: string[]): number {
    const str1 = classes1.sort().join(' ');
    const str2 = classes2.sort().join(' ');
    return this.calculate(str1, str2);
  }
}

class DataClassAnalyzerAdvanced {
  private config: AnalyzerConfig;
  private mappings: DataClassMapping[] = [];

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async analyzeAll(): Promise<void> {
    console.log('🔍 Advanced data-class analysis with Porter Stemming & Levenshtein Distance...\n');

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
    this.findExactDuplicates();
    this.findJaccardSimilarities();
    this.findStemmedSimilarities();
    this.findLevenshteinSimilarities();
    this.generateAdvancedRecommendations();
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

          if (hasClassName && hasDataClass) {
            const classNameAttr = self.getAttribute(path.node, 'className');
            const dataClassAttr = self.getAttribute(path.node, 'data-class');
            
            const classNameValue = self.getAttributeValue(classNameAttr);
            const dataClassValue = self.getAttributeValue(dataClassAttr);

            if (classNameValue && dataClassValue) {
              const loc = path.node.loc;
              const lineNumber = loc?.start.line || 0;
              
              const normalizedClasses = self.normalizeClasses(classNameValue);
              const stemmedClasses = PorterStemmer.stemClasses(normalizedClasses);

              self.mappings.push({
                dataClass: dataClassValue,
                className: classNameValue,
                elementName,
                file: filePath,
                line: lineNumber,
                normalizedClasses,
                stemmedClasses
              });
            }
          }
        }
      });
    } catch (err) {
      console.error(`❌ Error analyzing file ${filePath}:`, err);
    }
  }

  // Helper methods (same as original)
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
      .sort();
  }

  private generateMapping(): void {
    const mapping: Record<string, Array<{dataClass: string, stemmed: string[], normalized: string[]}>> = {};
    
    this.mappings.forEach(item => {
      const key = item.className;
      if (!mapping[key]) {
        mapping[key] = [];
      }
      mapping[key].push({
        dataClass: item.dataClass,
        stemmed: item.stemmedClasses,
        normalized: item.normalizedClasses
      });
    });

    const sortedMapping = Object.keys(mapping)
      .sort()
      .reduce((acc, key) => {
        acc[key] = mapping[key].sort((a, b) => a.dataClass.localeCompare(b.dataClass));
        return acc;
      }, {} as Record<string, Array<{dataClass: string, stemmed: string[], normalized: string[]}>>);

    fs.writeFileSync(this.config.outputFile, JSON.stringify(sortedMapping, null, 2));
    console.log(`✅ Generated advanced mapping file: ${this.config.outputFile}`);
    console.log(`📋 Structure: utility-classes → [{dataClass, stemmed, normalized}]`);
  }

  private findExactDuplicates(): void {
    const classNameGroups: Record<string, DataClassMapping[]> = {};

    this.mappings.forEach(mapping => {
      const key = mapping.className;
      if (!classNameGroups[key]) {
        classNameGroups[key] = [];
      }
      classNameGroups[key].push(mapping);
    });

    const duplicates = Object.entries(classNameGroups)
      .filter(([, mappings]) => mappings.length > 1)
      .sort(([,a], [,b]) => b.length - a.length);

    console.log('\n🔄 EXACT DUPLICATES');
    console.log('═'.repeat(60));
    
    if (duplicates.length === 0) {
      console.log('✅ No exact duplicates found!');
    } else {
      duplicates.forEach(([className, mappings], index) => {
        console.log(`\n${index + 1}. "${className}" (${mappings.length} times)`);
        console.log(`   Data-class attributes:`);
        mappings.forEach(item => {
          const relativePath = path.relative(process.cwd(), item.file);
          console.log(`     • ${item.dataClass} (<${item.elementName}> in ${relativePath}:${item.line})`);
        });
      });
      
      console.log(`\n💡 Found ${duplicates.length} exact duplicates`);
    }
  }

  private findJaccardSimilarities(): void {
    console.log('\n🔗 JACCARD SIMILARITY ANALYSIS');
    console.log('═'.repeat(60));
    
    const similarities = this.calculateAllSimilarities((classes1, classes2) => {
      const set1 = new Set(classes1);
      const set2 = new Set(classes2);
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      return intersection.size / union.size;
    });

    this.printSimilarities(similarities, 'Jaccard');
  }

  private findStemmedSimilarities(): void {
    console.log('\n🌿 PORTER STEMMING SIMILARITY ANALYSIS');
    console.log('═'.repeat(60));
    
    const similarities = this.calculateAllSimilarities((classes1, classes2, mapping1, mapping2) => {
      const stemmed1 = mapping1?.stemmedClasses || [];
      const stemmed2 = mapping2?.stemmedClasses || [];
      const set1 = new Set(stemmed1);
      const set2 = new Set(stemmed2);
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      return intersection.size / union.size;
    });

    this.printSimilarities(similarities, 'Stemmed');
  }

  private findLevenshteinSimilarities(): void {
    console.log('\n📏 LEVENSHTEIN DISTANCE ANALYSIS');
    console.log('═'.repeat(60));
    
    const similarities: SimilarityResult[] = [];

    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        if (item1.className === item2.className) continue;

        const distance = LevenshteinDistance.calculateClassSets(
          item1.normalizedClasses, 
          item2.normalizedClasses
        );

        if (distance <= this.config.levenshteinThreshold) {
          const maxLength = Math.max(
            item1.normalizedClasses.join(' ').length,
            item2.normalizedClasses.join(' ').length
          );
          const similarity = 1 - (distance / maxLength);

          const commonClasses = this.getCommonClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique1 = this.getUniqueClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique2 = this.getUniqueClasses(item2.normalizedClasses, item1.normalizedClasses);

          similarities.push({
            similarity,
            levenshteinDistance: distance,
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

    similarities.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);

    if (similarities.length === 0) {
      console.log(`✅ No similar classes found within ${this.config.levenshteinThreshold} edit distance`);
    } else {
      similarities.slice(0, 15).forEach((sim, index) => {
        console.log(`\n${index + 1}. Distance: ${sim.levenshteinDistance} edits, Similarity: ${(sim.similarity * 100).toFixed(1)}%`);
        console.log(`   Common classes: [${sim.commonClasses.join(', ')}]`);
        sim.items.forEach(item => {
          const uniqueStr = item.uniqueClasses.length > 0 ? ` + [${item.uniqueClasses.join(', ')}]` : '';
          console.log(`   • ${item.dataClass}: "${item.className}"${uniqueStr}`);
          console.log(`     (${item.file}:${item.line})`);
        });
      });
      
      console.log(`\n💡 Found ${similarities.length} similar class pairs within ${this.config.levenshteinThreshold} edit distance`);
    }
  }

  private calculateAllSimilarities(
    similarityFn: (classes1: string[], classes2: string[], mapping1?: DataClassMapping, mapping2?: DataClassMapping) => number
  ): SimilarityResult[] {
    const similarities: SimilarityResult[] = [];

    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        if (item1.className === item2.className) continue;

        const similarity = similarityFn(
          item1.normalizedClasses, 
          item2.normalizedClasses,
          item1,
          item2
        );
        
        if (similarity >= this.config.similarityThreshold) {
          const commonClasses = this.getCommonClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique1 = this.getUniqueClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique2 = this.getUniqueClasses(item2.normalizedClasses, item1.normalizedClasses);

          similarities.push({
            similarity,
            levenshteinDistance: 0,
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

    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  private printSimilarities(similarities: SimilarityResult[], type: string): void {
    if (similarities.length === 0) {
      console.log(`✅ No similar classes found above ${(this.config.similarityThreshold * 100).toFixed(0)}% threshold`);
    } else {
      similarities.slice(0, 10).forEach((sim, index) => {
        console.log(`\n${index + 1}. ${type} Similarity: ${(sim.similarity * 100).toFixed(1)}%`);
        console.log(`   Common classes: [${sim.commonClasses.join(', ')}]`);
        sim.items.forEach(item => {
          const uniqueStr = item.uniqueClasses.length > 0 ? ` + [${item.uniqueClasses.join(', ')}]` : '';
          console.log(`   • ${item.dataClass}: "${item.className}"${uniqueStr}`);
          console.log(`     (${item.file}:${item.line})`);
        });
      });
      
      console.log(`\n💡 Found ${similarities.length} ${type.toLowerCase()} similar pairs above ${(this.config.similarityThreshold * 100).toFixed(0)}% threshold`);
    }
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

  private generateAdvancedRecommendations(): void {
    console.log('\n💡 ADVANCED RECOMMENDATIONS');
    console.log('═'.repeat(60));

    // Stemming analysis
    const stemGroups: Record<string, string[]> = {};
    this.mappings.forEach(mapping => {
      mapping.stemmedClasses.forEach(stem => {
        if (!stemGroups[stem]) {
          stemGroups[stem] = [];
        }
        stemGroups[stem].push(mapping.dataClass);
      });
    });

    const frequentStems = Object.entries(stemGroups)
      .filter(([, dataClasses]) => dataClasses.length > 1)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10);

    console.log('\nMost reusable stem patterns:');
    frequentStems.forEach(([stem, dataClasses]) => {
      const uniqueDataClasses = [...new Set(dataClasses)];
      console.log(`  • ${stem}: used in ${uniqueDataClasses.length} different contexts`);
      console.log(`    ${uniqueDataClasses.slice(0, 5).join(', ')}${uniqueDataClasses.length > 5 ? '...' : ''}`);
    });

    // Class frequency analysis
    const classFrequency: Record<string, number> = {};
    this.mappings.forEach(mapping => {
      mapping.normalizedClasses.forEach(cls => {
        classFrequency[cls] = (classFrequency[cls] || 0) + 1;
      });
    });

    const topClasses = Object.entries(classFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15);

    console.log('\nMost frequently used utility classes:');
    topClasses.forEach(([cls, count]) => {
      console.log(`  • ${cls}: ${count} times`);
    });

    console.log('\n📋 Advanced Summary:');
    console.log(`  • Total data-class mappings: ${this.mappings.length}`);
    console.log(`  • Unique data-class names: ${new Set(this.mappings.map(m => m.dataClass)).size}`);
    console.log(`  • Unique className combinations: ${new Set(this.mappings.map(m => m.className)).size}`);
    console.log(`  • Unique stem patterns: ${Object.keys(stemGroups).length}`);
    console.log(`  • Average classes per mapping: ${(this.mappings.reduce((sum, m) => sum + m.normalizedClasses.length, 0) / this.mappings.length).toFixed(1)}`);
  }
}

// Run the analyzer
const analyzer = new DataClassAnalyzerAdvanced();

async function run() {
  try {
    await analyzer.analyzeAll();
  } catch (err) {
    console.error('❌ Error running advanced data-class-analyzer:', err);
    process.exit(1);
  }
}

run(); 