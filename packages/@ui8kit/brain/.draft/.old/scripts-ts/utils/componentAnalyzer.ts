import { readFileSync } from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { glob } from 'glob';
import * as t from '@babel/types';

export type ComponentInfo = {
  name: string;
  path: string;
  dependencies: {
    imports: string[];
    packages: string[];
  };
  content?: Record<string, any>;
  sourceCode?: string;
}

export class ComponentAnalyzer {
  // Get all component files
  async getComponentFiles(pattern: string): Promise<string[]> {
    return glob(pattern);
  }

  private extractJSXElement(node: t.JSXElement | t.JSXFragment): any {
    if (t.isJSXFragment(node)) {
      return { type: 'Fragment' };
    }

    const openingElement = node.openingElement;
    if (t.isJSXIdentifier(openingElement.name)) {
      const props: Record<string, any> = {};
      
      openingElement.attributes.forEach(attr => {
        if (t.isJSXAttribute(attr)) {
          if (t.isJSXIdentifier(attr.name)) {
            const name = attr.name.name;
            if (attr.value) {
              if (t.isStringLiteral(attr.value)) {
                props[name] = attr.value.value;
              } else if (t.isJSXExpressionContainer(attr.value)) {
                props[name] = this.extractValueFromNode(attr.value.expression);
              }
            } else {
              props[name] = true;
            }
          }
        }
      });

      return {
        type: 'Component',
        name: openingElement.name.name,
        ...(Object.keys(props).length > 0 && { props })
      };
    }

    return { type: 'Unknown' };
  }

  private extractValueFromNode(node: t.Node): any {
    if (t.isTSAsExpression(node)) {
      return this.extractValueFromNode(node.expression);
    }

    if (t.isObjectExpression(node)) {
      const obj: Record<string, any> = {};
      for (const prop of node.properties) {
        if (t.isObjectProperty(prop)) {
          const key = t.isIdentifier(prop.key) ? prop.key.name :
                     t.isStringLiteral(prop.key) ? prop.key.value :
                     `[${prop.key.type}]`;
          obj[key] = this.extractValueFromNode(prop.value);
        }
      }
      return obj;
    }

    if (t.isArrayExpression(node)) {
      return node.elements.map(element => 
        element ? this.extractValueFromNode(element) : null
      );
    }

    if (t.isStringLiteral(node)) {
      return node.value;
    }

    if (t.isNumericLiteral(node)) {
      return node.value;
    }

    if (t.isBooleanLiteral(node)) {
      return node.value;
    }

    if (t.isNullLiteral(node)) {
      return null;
    }

    if (t.isJSXElement(node)) {
      return this.extractJSXElement(node);
    }

    if (t.isJSXFragment(node)) {
      return this.extractJSXElement(node);
    }

    return `[${node.type}]`;
  }

  // Parse single component
  async analyzeComponent(filePath: string): Promise<ComponentInfo> {
    // Read file content
    const code = readFileSync(filePath, 'utf-8');
    
    // Parse AST
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    const componentInfo: ComponentInfo = {
      name: '',
      path: filePath,
      dependencies: {
        imports: [],
        packages: []
      },
      sourceCode: code
    };
    
    const extractValueFromNode = this.extractValueFromNode.bind(this);

    // Traverse AST
    traverse(ast, {
      // Get imports
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        if (importPath.startsWith('.')) {
          componentInfo.dependencies.imports.push(importPath);
        } else {
          componentInfo.dependencies.packages.push(importPath);
        }
      },

      // Get content variable
      VariableDeclarator(path) {
        const id = path.node.id;
        // Check if id is Identifier
        if ('name' in id && id.name === 'content') {
          try {
            componentInfo.content = path.node.init 
              ? extractValueFromNode(path.node.init)
              : undefined;
          } catch (error) {
            console.warn(`Could not parse content for ${filePath}`, error);
          }
        }
      },

      // Get component name
      ExportNamedDeclaration(path) {
        if (path.node.declaration?.type === 'VariableDeclaration') {
          const declaration = path.node.declaration.declarations[0];
          if (declaration.type === 'VariableDeclarator' && 
              'name' in declaration.id) {
            componentInfo.name = declaration.id.name;
          }
        }
      }
    });

    return componentInfo;
  }
} 