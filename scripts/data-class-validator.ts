// bun scripts/data-class-validator.ts --compact
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import chalk from 'chalk';

interface MissingDataClass {
  file: string;
  line: number;
  column: number;
  elementName: string;
  className: string;
  context: string;
}

interface ValidationResult {
  file: string;
  totalElements: number;
  elementsWithClassName: number;
  elementsWithDataClass: number;
  missingDataClass: MissingDataClass[];
}

interface ValidatorConfig {
  inputDir: string;
  componentsGlob: string;
  excludePatterns: string[];
}

const DEFAULT_CONFIG: ValidatorConfig = {
  inputDir: './packages/@ui8kit/blocks/src',
  componentsGlob: '**/*.tsx',
  excludePatterns: ['node_modules', '.git', 'dist', 'build']
};

class DataClassValidator {
  private config: ValidatorConfig;
  private results: ValidationResult[] = [];

  constructor(config: Partial<ValidatorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async validateAll(): Promise<void> {
    console.log('🔍 Validating data-class attributes...\n');

    const pattern = `${this.config.inputDir.replace(/\\/g, '/')}/${this.config.componentsGlob}`;
    const componentFiles = await glob(pattern);

    console.log(`📁 Found ${componentFiles.length} component files\n`);

    this.results = [];

    for (const file of componentFiles) {
      const result = await this.validateFile(file);
      this.results.push(result);
    }

    this.printSummary();
    
    // Check the --compact flag for an even more compact output
    const args = process.argv.slice(2);
    const isCompact = args.includes('--compact');
    
    if (isCompact) {
      this.printCompactResults();
    } else {
      this.printDetailedResults();
    }
  }

  private async validateFile(filePath: string): Promise<ValidationResult> {
    try {
      const componentContent = fs.readFileSync(filePath, 'utf-8');
      const lines = componentContent.split('\n');

      const ast = parse(componentContent, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      const result: ValidationResult = {
        file: filePath,
        totalElements: 0,
        elementsWithClassName: 0,
        elementsWithDataClass: 0,
        missingDataClass: []
      };

      const self = this;
      traverse(ast, {
        JSXOpeningElement(path) {
          result.totalElements++;

          const elementName = self.getElementName(path.node);
          const hasClassName = self.hasAttribute(path.node, 'className');
          const hasDataClass = self.hasAttribute(path.node, 'data-class');

          if (hasClassName) {
            result.elementsWithClassName++;
          }

          if (hasDataClass) {
            result.elementsWithDataClass++;
          }

          // If there is a className, but no data-class
          if (hasClassName && !hasDataClass) {
            const classNameAttr = self.getAttribute(path.node, 'className');
            const classNameValue = self.getAttributeValue(classNameAttr);
            
            // Skip elements with empty or only variable className
            if (self.shouldIncludeElement(classNameValue)) {
              const loc = path.node.loc;
              const lineNumber = loc?.start.line || 0;
              const columnNumber = loc?.start.column || 0;
              
              // Get context (several lines around the element)
              const context = self.getContext(lines, lineNumber - 1, 2);

              result.missingDataClass.push({
                file: filePath,
                line: lineNumber,
                column: columnNumber,
                elementName,
                className: classNameValue,
                context
              });
            }
          }
        }
      });

      return result;
    } catch (err) {
      console.error(`❌ Error validating file ${filePath}:`, err);
      return {
        file: filePath,
        totalElements: 0,
        elementsWithClassName: 0,
        elementsWithDataClass: 0,
        missingDataClass: []
      };
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
        // Try to extract static strings for functions like cn(), clsx()
        return this.extractStaticClassesFromCall(expr);
      } else if (t.isTemplateLiteral(expr)) {
        return this.extractStaticClassesFromTemplate(expr);
      }
      // For other expressions, return their string representation
      return '[expression]';
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

  private shouldIncludeElement(className: string): boolean {
    // Skip empty strings
    if (!className || className.trim() === '') return false;
    
    // Skip expressions without static classes
    if (className === '[expression]') return false;
    
    // Skip classes that contain only variables or conditions
    if (className.match(/^[\s\{\}\$\(\)]*$/)) return false;
    
    return true;
  }

  private getContext(lines: string[], lineIndex: number, contextLines: number): string {
    const start = Math.max(0, lineIndex - contextLines);
    const end = Math.min(lines.length, lineIndex + contextLines + 1);
    
    return lines.slice(start, end)
      .map((line, index) => {
        const actualLineNumber = start + index + 1;
        const marker = actualLineNumber === lineIndex + 1 ? '→ ' : '  ';
        return `${marker}${actualLineNumber.toString().padStart(3, ' ')}: ${line}`;
      })
      .join('\n');
  }

  private printSummary(): void {
    const totalFiles = this.results.length;
    const totalElements = this.results.reduce((sum, r) => sum + r.totalElements, 0);
    const totalWithClassName = this.results.reduce((sum, r) => sum + r.elementsWithClassName, 0);
    const totalWithDataClass = this.results.reduce((sum, r) => sum + r.elementsWithDataClass, 0);
    const totalMissing = this.results.reduce((sum, r) => sum + r.missingDataClass.length, 0);

    console.log('📊 SUMMARY');
    console.log('═'.repeat(50));
    console.log(`📁 Files processed: ${totalFiles}`);
    console.log(`🏷️  Total JSX elements: ${totalElements}`);
    console.log(`🎨 Elements with className: ${totalWithClassName}`);
    console.log(`🏷️  Elements with data-class: ${totalWithDataClass}`);
    console.log(`❌ Missing data-class: ${totalMissing}`);
    
    if (totalWithClassName > 0) {
      const coverage = ((totalWithDataClass / totalWithClassName) * 100).toFixed(1);
      console.log(`📈 Coverage: ${coverage}%`);
    }
    
    console.log('═'.repeat(3));
    console.log('');
  }

  private printDetailedResults(): void {
    const filesWithMissing = this.results.filter(r => r.missingDataClass.length > 0);
    
    if (filesWithMissing.length === 0) {
      console.log('✅ All elements with className have data-class attributes!');
      return;
    }

    console.log('🔍 DETAILED RESULTS');
    console.log('═'.repeat(3));

    filesWithMissing.forEach((result, index) => {
      const relativePath = path.relative(process.cwd(), result.file);
      console.log(chalk.bgYellow.black(`\n📄 ${relativePath}`));
      console.log(chalk.blue(`   Missing: ${result.missingDataClass.length} elements`));
      console.log('─'.repeat(30));

      result.missingDataClass.forEach((missing, i) => {
        const smallFont = '\x1b[2m'; // Dim/faint text
        const resetFont = '\x1b[0m'; // Reset
        
        console.log(`${smallFont}\n${i + 1}. <${missing.elementName}> at line ${missing.line}:${missing.column}${resetFont}`);
        console.log(`${smallFont}   className: "${missing.className}"${resetFont}`);
        console.log(`${smallFont}   Suggested data-class: "${this.suggestDataClassName(missing.elementName, missing.className)}"${resetFont}`);
        console.log(`${smallFont}   Context:${resetFont}`);
        
        const contextLines = missing.context.split('\n');
        contextLines.forEach(line => {
          console.log(`${smallFont}${line}${resetFont}`);
        });
        
        if (i < result.missingDataClass.length - 1) {
          console.log('');
        }
      });
    });

    console.log('\n═'.repeat(3));
    console.log('💡 TIP: Add data-class attributes to elements with className for better semantic CSS generation');
  }

  private printCompactResults(): void {
    const filesWithMissing = this.results.filter(r => r.missingDataClass.length > 0);
    
    if (filesWithMissing.length === 0) {
      console.log('✅ All elements with className have data-class attributes!');
      return;
    }

    console.log('🔍 COMPACT RESULTS');
    console.log('═'.repeat(3));

    filesWithMissing.forEach((result, index) => {
      const relativePath = path.relative(process.cwd(), result.file);
      const smallFont = '\x1b[2m\x1b[90m'; // Dim + gray text
      const resetFont = '\x1b[0m'; // Reset
      
      console.log(chalk.bgYellow.black(`\n📄 ${relativePath}`));
      console.log(chalk.blue(`   Missing: ${result.missingDataClass.length} elements`));

      result.missingDataClass.forEach((missing, i) => {
        const shortClassName = missing.className.length > 40 
          ? missing.className.substring(0, 37) + '...' 
          : missing.className;
        
        console.log(`${smallFont}${i + 1}. <${missing.elementName}> L${missing.line} → data-class="${this.suggestDataClassName(missing.elementName, missing.className)}"${resetFont}`);
        console.log(`${smallFont}   className: "${shortClassName}"${resetFont}`);
      });
    });

    console.log('\n═'.repeat(3));
    console.log(`${'\x1b[2m'}💡 Use without --compact flag for detailed context${'\x1b[0m'}`);
  }

  private suggestDataClassName(elementName: string, className: string): string {
    // Simple heuristic for suggesting a data-class name
    const element = elementName.toLowerCase();
    const firstClass = className.split(' ')[0].toLowerCase();
    
    // If the first class is descriptive, use it
    if (firstClass.length > 2 && !['px', 'py', 'pt', 'pb', 'pl', 'pr', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'].includes(firstClass)) {
      return `${element}-${firstClass}`;
    }
    
    // Otherwise use a generic name
    return `${element}-container`;
  }
}

// Run the validator
const validator = new DataClassValidator();

async function run() {
  try {
    await validator.validateAll();
  } catch (err) {
    console.error('❌ Error running data-class-validator:', err);
    process.exit(1);
  }
}

run(); 