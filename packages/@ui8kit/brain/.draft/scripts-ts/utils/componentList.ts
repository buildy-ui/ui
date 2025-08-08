import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import * as ts from 'typescript';
import { ComponentAnalyzer, ComponentInfo } from './componentAnalyzer';

export class ComponentList {
  private analyzer: ComponentAnalyzer;
  private outputDir: string;

  constructor(outputDir: string = 'component-lists') {
    this.analyzer = new ComponentAnalyzer();
    this.outputDir = path.resolve(process.cwd(), outputDir);
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // // Extract export statement from source code
  private extractExportStatement(sourceCode: string): string {
    // // Create source file
    const sourceFile = ts.createSourceFile(
      'temp.tsx',
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    let exportStatement = '';

    // // Visit each node in AST
    function visit(node: ts.Node) {
      if (ts.isExportAssignment(node) || 
          (ts.isVariableStatement(node) && 
           node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword))) {
        // // Get the full text of the export statement
        exportStatement = node.getText(sourceFile);
        return;
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    
    // // Clean up the extracted code
    return exportStatement
      .replace(/\s+/g, ' ')      // // Replace multiple spaces with single space
      .replace(/{\s+/g, '{')     // // Remove spaces after {
      .replace(/\s+}/g, '}')     // // Remove spaces before }
      .trim();
  }

  private extractImports(sourceCode: string | undefined): string[] {
    if (!sourceCode) {
      return [];
    }

    const sourceFile = ts.createSourceFile(
      'temp.tsx',
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    const imports: string[] = [];

    function visit(node: ts.Node) {
      if (ts.isImportDeclaration(node)) {
        // // Get the full import statement
        imports.push(node.getText(sourceFile));
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    
    // // Filter only shadcn/ui and icon imports
    return imports.filter(imp => 
      imp.includes('@/components/ui') || 
      imp.includes('lucide-react') ||
      imp.includes('@radix-ui')
    );
  }

  private formatComponentData(component: ComponentInfo) {
    return {
      name: component.name,
      path: component.path,
      imports: component.sourceCode ? this.extractImports(component.sourceCode) : [],
      export: component.sourceCode ? this.extractExportStatement(component.sourceCode) : ''
    };
  }

  private getCategoryFromPath(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const blocksIndex = parts.indexOf('blocks');
    
    return blocksIndex !== -1 && blocksIndex + 1 < parts.length 
      ? parts[blocksIndex + 1] 
      : 'uncategorized';
  }

  private categorizeComponents(components: ComponentInfo[]): Record<string, any[]> {
    const categories: Record<string, any[]> = {};
    
    components.forEach(component => {
      const category = this.getCategoryFromPath(component.path);
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(this.formatComponentData(component));
    });

    return categories;
  }

  async generateComponentList(): Promise<void> {
    try {
      const files = await this.analyzer.getComponentFiles('./src/blocks/**/*.tsx');
      const components = await Promise.all(
        files.map(file => this.analyzer.analyzeComponent(file))
      );

      const categorizedComponents = this.categorizeComponents(components);

      const componentList = {
        generated: new Date().toISOString(),
        totalComponents: components.length,
        categories: categorizedComponents
      };

      this.saveListToFile('uiblocks.json', componentList);
      console.log(`✅ UI blocks list generated with ${components.length} components`);
    } catch (error) {
      console.error('❌ Error generating UI blocks list:', error);
      if (error instanceof Error) {
        console.error('Details:', error.message);
      }
    }
  }

  private saveListToFile(filename: string, data: any): void {
    try {
      const filePath = path.join(this.outputDir, filename);
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`📝 Saved list to ${filePath}`);
    } catch (error) {
      console.error(`❌ Error saving file ${filename}:`, error);
    }
  }
} 