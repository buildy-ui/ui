// bun scripts/data-class-analyzer-libs.ts
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
const levenshtein = require('levenshtein');
const stemmer = require('porter-stemmer');

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
  jaccardSimilarity: number;
  diceCoefficient: number;
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
  outputFile: './data-class-mapping-libs.json',
  similarityThreshold: 0.6, // 60% similarity
  levenshteinThreshold: 4   // Max distance of 4 edits
};

class DataClassAnalyzerLibs {
  private config: AnalyzerConfig;
  private mappings: DataClassMapping[] = [];

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async analyzeAll(): Promise<void> {
    console.log('🔍 Library-powered data-class analysis with Porter Stemming & Levenshtein Distance...\n');
    console.log('📚 Using: levenshtein@1.0.5 + porter-stemmer@0.9.1\n');

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
    this.findDiceSimilarities();
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
              const stemmedClasses = normalizedClasses.map(cls => stemmer.stemmer(cls));

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

  // Helper methods
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
    const mapping: Record<string, Array<{
      dataClass: string;
      stemmed: string[];
      normalized: string[];
      levenshteinPattern: string;
    }>> = {};
    
    this.mappings.forEach(item => {
      const key = item.className;
      if (!mapping[key]) {
        mapping[key] = [];
      }
      
      // Create a pattern for Levenshtein comparison
      const levenshteinPattern = item.normalizedClasses.join('|');
      
      mapping[key].push({
        dataClass: item.dataClass,
        stemmed: item.stemmedClasses,
        normalized: item.normalizedClasses,
        levenshteinPattern
      });
    });

    const sortedMapping = Object.keys(mapping)
      .sort()
      .reduce((acc, key) => {
        acc[key] = mapping[key].sort((a, b) => a.dataClass.localeCompare(b.dataClass));
        return acc;
      }, {} as Record<string, Array<{dataClass: string, stemmed: string[], normalized: string[], levenshteinPattern: string}>>);

    fs.writeFileSync(this.config.outputFile, JSON.stringify(sortedMapping, null, 2));
    console.log(`✅ Generated Library-powered mapping file: ${this.config.outputFile}`);
    console.log(`📋 Structure: utility-classes → [{dataClass, stemmed, normalized, levenshteinPattern}]`);
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
        console.log(`   💡 Consolidation opportunity: Merge into single reusable class`);
      });
      
      console.log(`\n💡 Found ${duplicates.length} exact duplicates`);
    }
  }

  private findJaccardSimilarities(): void {
    console.log('\n🔗 JACCARD SIMILARITY ANALYSIS');
    console.log('═'.repeat(60));
    
    const similarities: SimilarityResult[] = [];

    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        if (item1.className === item2.className) continue;

        const set1 = new Set(item1.normalizedClasses);
        const set2 = new Set(item2.normalizedClasses);
        
        // Calculate Jaccard similarity
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        const jaccardSimilarity = intersection.size / union.size;
        
        if (jaccardSimilarity >= this.config.similarityThreshold) {
          const commonClasses = this.getCommonClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique1 = this.getUniqueClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique2 = this.getUniqueClasses(item2.normalizedClasses, item1.normalizedClasses);

          similarities.push({
            similarity: jaccardSimilarity,
            levenshteinDistance: 0,
            jaccardSimilarity,
            diceCoefficient: 0,
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

    similarities.sort((a, b) => b.jaccardSimilarity - a.jaccardSimilarity);
    this.printSimilarities(similarities, 'Jaccard');
  }

  private findDiceSimilarities(): void {
    console.log('\n🎲 DICE COEFFICIENT ANALYSIS');
    console.log('═'.repeat(60));
    
    const similarities: SimilarityResult[] = [];

    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        if (item1.className === item2.className) continue;

        const set1 = new Set(item1.normalizedClasses);
        const set2 = new Set(item2.normalizedClasses);
        
        // Calculate Dice coefficient
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const diceCoefficient = (2 * intersection.size) / (set1.size + set2.size);
        
        if (diceCoefficient >= this.config.similarityThreshold) {
          const commonClasses = this.getCommonClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique1 = this.getUniqueClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique2 = this.getUniqueClasses(item2.normalizedClasses, item1.normalizedClasses);

          similarities.push({
            similarity: diceCoefficient,
            levenshteinDistance: 0,
            jaccardSimilarity: 0,
            diceCoefficient,
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

    similarities.sort((a, b) => b.diceCoefficient - a.diceCoefficient);
    this.printSimilarities(similarities, 'Dice Coefficient');
  }

  private findStemmedSimilarities(): void {
    console.log('\n🌿 PORTER STEMMING SIMILARITY ANALYSIS (porter-stemmer library)');
    console.log('═'.repeat(60));
    
    const similarities: SimilarityResult[] = [];

    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        if (item1.className === item2.className) continue;

        const set1 = new Set(item1.stemmedClasses);
        const set2 = new Set(item2.stemmedClasses);
        
        // Calculate Jaccard similarity on stemmed classes
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        const similarity = intersection.size / union.size;
        
        if (similarity >= this.config.similarityThreshold) {
          const commonClasses = this.getCommonClasses(item1.stemmedClasses, item2.stemmedClasses);
          const unique1 = this.getUniqueClasses(item1.stemmedClasses, item2.stemmedClasses);
          const unique2 = this.getUniqueClasses(item2.stemmedClasses, item1.stemmedClasses);

          similarities.push({
            similarity,
            levenshteinDistance: 0,
            jaccardSimilarity: 0,
            diceCoefficient: 0,
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

    similarities.sort((a, b) => b.similarity - a.similarity);
    this.printSimilarities(similarities, 'Stemmed');
  }

  private findLevenshteinSimilarities(): void {
    console.log('\n📏 LEVENSHTEIN DISTANCE ANALYSIS (levenshtein library)');
    console.log('═'.repeat(60));
    
    const similarities: SimilarityResult[] = [];

    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];

        if (item1.className === item2.className) continue;

        const str1 = item1.normalizedClasses.join(' ');
        const str2 = item2.normalizedClasses.join(' ');
        
        // Use levenshtein library
        const distance = levenshtein(str1, str2);

        if (distance <= this.config.levenshteinThreshold) {
          const maxLength = Math.max(str1.length, str2.length);
          const similarity = 1 - (distance / maxLength);

          const commonClasses = this.getCommonClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique1 = this.getUniqueClasses(item1.normalizedClasses, item2.normalizedClasses);
          const unique2 = this.getUniqueClasses(item2.normalizedClasses, item1.normalizedClasses);

          similarities.push({
            similarity,
            levenshteinDistance: distance,
            jaccardSimilarity: 0,
            diceCoefficient: 0,
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
    console.log('\n💡 LIBRARY-POWERED RECOMMENDATIONS');
    console.log('═'.repeat(60));

    // Stemming analysis using porter-stemmer
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

    console.log('\nMost reusable stem patterns (porter-stemmer):');
    frequentStems.forEach(([stem, dataClasses]) => {
      const uniqueDataClasses = [...new Set(dataClasses)];
      console.log(`  • ${stem}: used in ${uniqueDataClasses.length} different contexts`);
      console.log(`    ${uniqueDataClasses.slice(0, 5).join(', ')}${uniqueDataClasses.length > 5 ? '...' : ''}`);
    });

    // Levenshtein clustering
    console.log('\nLevenshtein-based clustering suggestions:');
    const levenshteinClusters: Record<string, string[]> = {};
    
    for (let i = 0; i < this.mappings.length; i++) {
      for (let j = i + 1; j < this.mappings.length; j++) {
        const item1 = this.mappings[i];
        const item2 = this.mappings[j];
        
        if (item1.className === item2.className) continue;
        
        const distance = levenshtein(item1.className, item2.className);
        
        if (distance <= 2) { // Very close matches
          const key = `cluster_${Math.min(i, j)}`;
          if (!levenshteinClusters[key]) {
            levenshteinClusters[key] = [];
          }
          levenshteinClusters[key].push(item1.dataClass, item2.dataClass);
        }
      }
    }

    Object.entries(levenshteinClusters).slice(0, 5).forEach(([cluster, dataClasses], index) => {
      const uniqueClasses = [...new Set(dataClasses)];
      console.log(`  ${index + 1}. Potential merge: [${uniqueClasses.join(', ')}]`);
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

    console.log('\n📋 Library-Enhanced Summary:');
    console.log(`  • Total data-class mappings: ${this.mappings.length}`);
    console.log(`  • Unique data-class names: ${new Set(this.mappings.map(m => m.dataClass)).size}`);
    console.log(`  • Unique className combinations: ${new Set(this.mappings.map(m => m.className)).size}`);
    console.log(`  • Unique stem patterns: ${Object.keys(stemGroups).length}`);
    console.log(`  • Average classes per mapping: ${(this.mappings.reduce((sum, m) => sum + m.normalizedClasses.length, 0) / this.mappings.length).toFixed(1)}`);
    console.log(`  • Levenshtein clusters found: ${Object.keys(levenshteinClusters).length}`);
  }
}

// Run the analyzer
const analyzer = new DataClassAnalyzerLibs();

async function run() {
  try {
    await analyzer.analyzeAll();
  } catch (err) {
    console.error('❌ Error running library-powered data-class-analyzer:', err);
    process.exit(1);
  }
}

run(); 