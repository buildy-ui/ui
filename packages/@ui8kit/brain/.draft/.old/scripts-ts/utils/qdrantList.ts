import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import * as ts from 'typescript';
import { ComponentAnalyzer, ComponentInfo } from './componentAnalyzer';

interface QdrantBlock {
  id: number;
  vector: number[];
  payload: {
    name: string;
    description: string;
    tags: string[];
    category: string;
    path: string;
    imports: string[];
    export: string;
  }
}

export class QdrantList {
  private analyzer: ComponentAnalyzer;
  private outputDir: string;

  constructor(outputDir: string = 'qdrant-example') {
    this.analyzer = new ComponentAnalyzer();
    this.outputDir = path.resolve(process.cwd(), outputDir);
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
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
        imports.push(node.getText(sourceFile));
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    
    return imports.filter(imp => 
      imp.includes('@/components/ui') || 
      imp.includes('lucide-react') ||
      imp.includes('@radix-ui')
    );
  }

  private extractExportStatement(sourceCode: string | undefined): string {
    if (!sourceCode) {
      return '';
    }

    const sourceFile = ts.createSourceFile(
      'temp.tsx',
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    let exportStatement = '';

    function visit(node: ts.Node) {
      if (ts.isExportAssignment(node) || 
          (ts.isVariableStatement(node) && 
           node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword))) {
        exportStatement = node.getText(sourceFile);
        return;
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    
    return exportStatement
      .replace(/\s+/g, ' ')
      .replace(/{\s+/g, '{')
      .replace(/\s+}/g, '}')
      .trim();
  }

  private getCategoryFromPath(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const blocksIndex = parts.indexOf('blocks');
    
    return blocksIndex !== -1 && blocksIndex + 1 < parts.length 
      ? parts[blocksIndex + 1] 
      : 'uncategorized';
  }

  private formatQdrantBlock(component: ComponentInfo, index: number): QdrantBlock {
    return {
      id: index,
      vector: [],
      payload: {
        name: component.name,
        description: "",
        tags: [],
        category: this.getCategoryFromPath(component.path),
        path: component.path,
        imports: component.sourceCode ? this.extractImports(component.sourceCode) : [],
        export: component.sourceCode ? this.extractExportStatement(component.sourceCode) : ''
      }
    };
  }

  async generateQdrantList(): Promise<void> {
    try {
      const files = await this.analyzer.getComponentFiles('./src/blocks/**/*.tsx');
      const components = await Promise.all(
        files.map(file => this.analyzer.analyzeComponent(file))
      );

      const qdrantBlocks = components.map((component, index) => 
        this.formatQdrantBlock(component, index)
      );

      this.saveListToFile('qdrantblocks.json', qdrantBlocks);
      console.log(`✅ Qdrant blocks list generated with ${components.length} components`);
    } catch (error) {
      console.error('❌ Error generating Qdrant blocks list:', error);
      if (error instanceof Error) {
        console.error('Details:', error.message);
      }
    }
  }

  private saveListToFile(filename: string, data: any): void {
    try {
      const filePath = path.join(this.outputDir, filename);
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`📝 Saved Qdrant list to ${filePath}`);
    } catch (error) {
      console.error(`❌ Error saving file ${filename}:`, error);
    }
  }
} 