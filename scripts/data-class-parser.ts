// bun scripts/data-class-parser.ts
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

interface DataSlotParserConfig {
  inputDir: string;
  componentsGlob: string;
  stylesOutputDir: string;
  componentsOutputDir: string;
}

const DEFAULT_CONFIG: DataSlotParserConfig = {
  inputDir: './packages/@ui8kit/blocks/src',
  componentsGlob: '**/*.tsx',
  stylesOutputDir: './packages/@ui8kit/blocks',
  componentsOutputDir: './packages/@ui8kit/blocks/.updated'
};

class DataSlotParser {
  public config: DataSlotParserConfig;
  private cssFiles: string[] = [];
  public isWatching = false;

  constructor(config: Partial<DataSlotParserConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Check the --watch flag
    const args = process.argv.slice(2);
    this.isWatching = args.includes('--watch');
  }

  public async generateAll(): Promise<void> {
    // Use recursive search for all .tsx files in the specified directory
    const pattern = `${this.config.inputDir.replace(/\\/g, '/')}/${this.config.componentsGlob}`;
    console.log('Glob pattern:', pattern);

    const componentFiles = await glob(pattern);
    console.log(`Found component files: ${componentFiles.length}`);

    this.cssFiles = []; // Reset the list of CSS files before generation

    for (const file of componentFiles) {
      await this.processComponent(file);
    }

    this.generateIndexCss();
    this.generateComponentIndexFiles();
  }

  private async processComponent(componentPath: string): Promise<void> {
    try {
      console.log(`Processing component: ${componentPath}`);
      const componentName = this.getComponentName(componentPath);

      // Read the component file content
      const componentContent = fs.readFileSync(componentPath, 'utf-8');

      // Parse with Babel
      const ast = parse(componentContent, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      // Structure to store extracted styles
      const stylesMap: Record<string, string> = {};
      // Track if we have any data-class attributes with actual styles
      let hasDataSlotsWithStyles = false;

      // Traverse the AST and find data-class attributes and className
      const self = this;
      traverse(ast, {
        JSXAttribute(path) {
          // Find data-class attribute
          if (path.node.name.name === 'data-class' && t.isStringLiteral(path.node.value)) {
            const atrrName = path.node.value.value;

            // Find the parent JSX element
            const jsxElementPath = path.findParent(p => p.isJSXOpeningElement());
            if (!jsxElementPath || !t.isJSXOpeningElement(jsxElementPath.node)) return;

            // Now we have a correctly typed JSXOpeningElement
            const jsxElement = jsxElementPath.node;

            // Find className attribute in this element
            const classNameAttr = jsxElement.attributes.find(
              (attr): attr is t.JSXAttribute =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === 'className'
            );

            if (classNameAttr) {
              let extractedClasses = '';

              // Handle different types of className values
              if (t.isStringLiteral(classNameAttr.value)) {
                // Simple string literal: className="class1 class2"
                extractedClasses = classNameAttr.value.value.trim();
              } else if (t.isJSXExpressionContainer(classNameAttr.value)) {
                // Expression container: className={...}
                const expr = classNameAttr.value.expression;
                
                if (t.isStringLiteral(expr)) {
                  // className={"class1 class2"}
                  extractedClasses = expr.value.trim();
                } else if (t.isCallExpression(expr)) {
                  // Function call like cn(), clsx(), etc.
                  extractedClasses = self.extractClassesFromCallExpression(expr);
                } else if (t.isTemplateLiteral(expr)) {
                  // Template literal: className={`class1 ${variable} class2`}
                  extractedClasses = self.extractClassesFromTemplateLiteral(expr);
                } else {
                  // For other expressions, try to generate code and extract what we can
                  try {
                    const generated = generate(expr);
                    console.log(`Warning: Complex className expression in ${componentPath}: ${generated.code}`);
                    // Skip complex expressions for now
                    extractedClasses = '';
                  } catch (err) {
                    console.log(`Could not process className expression in ${componentPath}`);
                    extractedClasses = '';
                  }
                }
              }

              if (extractedClasses && extractedClasses.trim() !== '') {
                // Save styles for this class only if it has non-empty styles
                stylesMap[atrrName] = extractedClasses.trim();
                hasDataSlotsWithStyles = true;
              }
            }
          }
        }
      });

      // Generate component only if we found styles
      if (hasDataSlotsWithStyles) {
        this.generateCssFile(componentName, stylesMap);
        this.generateSemanticComponent(componentPath, stylesMap);
      } else {
        // Still copy the component without modifications if it has data-class attributes
        this.copyComponentWithoutChanges(componentPath);
      }
    } catch (err) {
      console.error(`Error processing component ${componentPath}:`, err);
    }
  }

  // New helper method to extract classes from function calls
  private extractClassesFromCallExpression(expr: t.CallExpression): string {
    const classes: string[] = [];
    
    // Process each argument of the function call
    expr.arguments.forEach(arg => {
      if (t.isStringLiteral(arg)) {
        classes.push(arg.value.trim());
      } else if (t.isTemplateLiteral(arg)) {
        // Handle template literals in function arguments
        const templateClasses = this.extractClassesFromTemplateLiteral(arg);
        if (templateClasses) {
          classes.push(templateClasses);
        }
      }
      // Skip other types of arguments (variables, conditional expressions, etc.)
    });
    
    return classes.join(' ');
  }

  // New helper method to extract classes from template literals
  private extractClassesFromTemplateLiteral(expr: t.TemplateLiteral): string {
    const classes: string[] = [];
    
    // Extract static parts (quasis)
    expr.quasis.forEach(quasi => {
      if (quasi.value.raw.trim()) {
        classes.push(quasi.value.raw.trim());
      }
    });
    
    // Note: We skip expressions in template literals as they are dynamic
    
    return classes.join(' ');
  }

  private generateCssFile(componentName: string, stylesMap: Record<string, string>): void {
    let cssContent = '';

    // Generate CSS for each data-class with non-empty styles
    Object.entries(stylesMap).forEach(([atrrName, styles]) => {
      if (styles.trim() === '') return; // Skip empty styles
      cssContent += `.${atrrName} {\n  @apply ${styles};\n}\n\n`;
    });

    if (cssContent.trim()) {
      // Create a directory for styles, preserving the original directory structure
      const stylesDirPath = path.join(this.config.stylesOutputDir, 'components');
      fs.mkdirSync(stylesDirPath, { recursive: true });

      // Path to the CSS file
      const outputFile = path.join(stylesDirPath, `${componentName}.css`);

      // Save the CSS file
      fs.writeFileSync(outputFile, cssContent.trim());
      this.cssFiles.push(outputFile);
      console.log(`Generated CSS: ${outputFile}`);
    } else {
      console.log(`Skipped empty CSS for: ${componentName}`);
    }
  }

  private copyComponentWithoutChanges(componentPath: string): void {
    try {
      // Read the original component
      const componentContent = fs.readFileSync(componentPath, 'utf-8');

      // Create directory for the component in output dir
      const relativePath = path.relative(this.config.inputDir, path.dirname(componentPath));
      const outputDir = path.join(this.config.componentsOutputDir, relativePath);
      fs.mkdirSync(outputDir, { recursive: true });

      // Save the component without changes
      const fileName = path.basename(componentPath);
      const outputFile = path.join(outputDir, fileName);
      fs.writeFileSync(outputFile, componentContent);
      console.log(`Copied component without changes: ${outputFile}`);

      // Call the index file generation for the folder
      this.generateIndexFileForDirectory(outputDir);
    } catch (err) {
      console.error(`Error copying component ${componentPath}:`, err);
    }
  }

  private generateSemanticComponent(componentPath: string, stylesMap: Record<string, string>): void {
    try {
      // Read the original component
      const componentContent = fs.readFileSync(componentPath, 'utf-8');

      // Parse with Babel
      const ast = parse(componentContent, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      // Modify the AST, replacing utility classes with semantic classes
      // and removing data-class attributes
      traverse(ast, {
        JSXAttribute(path) {
          // If this is a data-class attribute, we will handle it
          if (path.node.name.name === 'data-class' && t.isStringLiteral(path.node.value)) {
            const atrrName = path.node.value.value;

            // Find the parent JSX element
            const jsxElementPath = path.findParent(p => p.isJSXOpeningElement());
            if (!jsxElementPath || !t.isJSXOpeningElement(jsxElementPath.node)) return;

            // Now we have a correctly typed JSXOpeningElement
            const jsxElement = jsxElementPath.node;

            // Find className attribute
            const classNameAttr = jsxElement.attributes.find(
              (attr): attr is t.JSXAttribute =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === 'className'
            );

            // Only process elements that have non-empty styles
            if (stylesMap[atrrName] && stylesMap[atrrName].trim() !== '') {
              if (classNameAttr) {
                // Replace the entire className with just the semantic class name
                classNameAttr.value = t.stringLiteral(atrrName);
              }
            }

            // Remove the data-class attribute regardless of whether we modified the className
            path.remove();
          }
        }
      });

      // Generate code from the modified AST
      const output = generate(ast, { retainLines: true });

      // Create a directory for semantic components
      const relativePath = path.relative(this.config.inputDir, path.dirname(componentPath));
      const outputDir = path.join(this.config.componentsOutputDir, relativePath);
      fs.mkdirSync(outputDir, { recursive: true });

      // Save the modified component
      const fileName = path.basename(componentPath);
      const outputFile = path.join(outputDir, fileName);
      fs.writeFileSync(outputFile, output.code);
      console.log(`Generated semantic component: ${outputFile}`);

      // Call the index file generation for the folder after creating the component
      this.generateIndexFileForDirectory(outputDir);
    } catch (err) {
      console.error(`Error generating semantic component for ${componentPath}:`, err);
    }
  }

  private generateIndexCss(): void {
    if (this.cssFiles.length === 0) {
      console.log('No CSS files to include in index.css');
      return;
    }

    const stylesDirPath = path.join(this.config.stylesOutputDir, 'components');
    const indexPath = path.join(stylesDirPath, 'index.css');

    const imports = this.cssFiles.map(file =>
      `@import "./${path.basename(file)}";`
    ).join('\n');

    fs.writeFileSync(indexPath, imports);
    console.log(`Generated index CSS: ${indexPath}`);
  }

  private getComponentName(componentPath: string): string {
    // Get the component name from the file path
    const basename = path.basename(componentPath, path.extname(componentPath));

    // Convert CamelCase or PascalCase to kebab-case for CSS files
    return basename.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  public startWatching(): void {
    if (this.isWatching) {
      console.log('Watching for changes in component files...');

      const watchDir = path.resolve(this.config.inputDir);
      fs.watch(watchDir, { recursive: true }, async (_, filename) => {
        if (!filename) return;
        if (!filename.endsWith('.tsx')) return;

        const fullPath = path.join(watchDir, filename);
        console.log(`File changed: ${fullPath}`);

        // Small delay for file system stabilization
        setTimeout(async () => {
          try {
            // Process only the changed file
            await this.processComponent(fullPath);
            this.generateIndexCss();
            console.log('Regenerated files for the changed component');
          } catch (err) {
            console.error('Error regenerating files:', err);
          }
        }, 100);
      });
    }
  }

  // Add a new method for creating component index files
  private generateComponentIndexFiles(): void {
    console.log('Generating component index files...');

    // For tracking folders where components were created
    const componentDirs = new Set<string>();

    // Collect all directories where semantic components were created
    const pattern = `${this.config.componentsOutputDir.replace(/\\/g, '/')}/**/*.tsx`;
    const componentFiles = glob.sync(pattern);

    componentFiles.forEach(file => {
      const dir = path.dirname(file);
      componentDirs.add(dir);
    });

    // For each directory, create an index.ts file
    componentDirs.forEach(dir => {
      this.generateIndexFileForDirectory(dir);
    });
  }

  private generateIndexFileForDirectory(directory: string): void {
    try {
      // Get all .tsx files in the directory
      const files = fs.readdirSync(directory)
        .filter(file => file.endsWith('.tsx') && file !== 'index.tsx');

      if (files.length === 0) {
        console.log(`No component files found in ${directory}, skipping index generation`);
        return;
      }

      // Generate the content of the index file
      let indexContent = '// Auto-generated index file\n\n';

      files.forEach(file => {
        const componentName = path.basename(file, '.tsx');
        // Use re-export syntax
        indexContent += `export * from './${componentName}';\n`;
      });

      // Path to the index file
      const indexPath = path.join(directory, 'index.ts');

      // Write the content to the file
      fs.writeFileSync(indexPath, indexContent);
      console.log(`Generated index file at: ${indexPath}`);
    } catch (err) {
      console.error(`Error generating index file for directory ${directory}:`, err);
    }
  }
}

// Run the script
const parser = new DataSlotParser();

async function run() {
  try {
    await parser.generateAll();

    // Start watching mode if the --watch flag is specified
    if (parser.isWatching) {
      parser.startWatching();
    }
  } catch (err) {
    console.error('Error running data-class-parser:', err);
    process.exit(1);
  }
}

run(); 