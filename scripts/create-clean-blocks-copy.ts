import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'fs';
import { join, extname, dirname, relative } from 'path';
import { SimpleBlockCleaner } from './simple-block-cleaner';

/**
 * Creates a clean copy of blocks folder with CVA-filtered classes
 */
class CleanBlocksCopier {
  private cvaWhitelist: Set<string> = new Set();
  private sourceDir: string;
  private targetDir: string;

  constructor(sourceDir: string, targetDir: string, whitelistPath: string) {
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.loadWhitelist(whitelistPath);
  }

  /**
   * Load CVA whitelist
   */
  private loadWhitelist(whitelistPath: string): void {
    try {
      const data = JSON.parse(readFileSync(whitelistPath, 'utf-8'));
      data.classes.forEach((cls: string) => {
        this.cvaWhitelist.add(cls);
      });
      console.log(`📚 Loaded ${this.cvaWhitelist.size} CVA classes from whitelist`);
    } catch (error) {
      console.error('❌ Failed to load whitelist:', error);
      process.exit(1);
    }
  }

  /**
   * Create clean copy of entire blocks structure
   */
  public createCleanCopy(): {
    totalDirectories: number;
    totalFiles: number;
    processedFiles: number;
    totalClassesRemoved: number;
    totalClassesKept: number;
    changes: Array<{
      file: string;
      original: string;
      cleaned: string;
      removedCount: number;
    }>;
  } {
    console.log(`🚀 Creating clean copy of blocks...`);
    console.log(`   Source: ${this.sourceDir}`);
    console.log(`   Target: ${this.targetDir}`);

    // Create target directory
    this.ensureDirectoryExists(this.targetDir);

    const stats = {
      totalDirectories: 0,
      totalFiles: 0,
      processedFiles: 0,
      totalClassesRemoved: 0,
      totalClassesKept: 0,
      changes: [] as Array<{
        file: string;
        original: string;
        cleaned: string;
        removedCount: number;
      }>
    };

    // Recursively copy and process
    this.copyAndProcessDirectory(this.sourceDir, this.targetDir, stats);

    this.printSummary(stats);
    return stats;
  }

  /**
   * Recursively copy directory structure and process files
   */
  private copyAndProcessDirectory(
    sourceDir: string, 
    targetDir: string, 
    stats: any
  ): void {
    const items = readdirSync(sourceDir);
    stats.totalDirectories++;

    items.forEach(item => {
      const sourcePath = join(sourceDir, item);
      const targetPath = join(targetDir, item);
      const stat = statSync(sourcePath);

      if (stat.isDirectory()) {
        // Create directory and recurse
        this.ensureDirectoryExists(targetPath);
        this.copyAndProcessDirectory(sourcePath, targetPath, stats);
      } else if (stat.isFile()) {
        stats.totalFiles++;
        
        const ext = extname(item);
        if (ext === '.tsx' && !item.includes('index')) {
          // Process .tsx files (except index files)
          const result = this.processAndCopyFile(sourcePath, targetPath);
          if (result) {
            stats.changes.push(result);
            stats.totalClassesRemoved += result.removedCount;
            stats.totalClassesKept += (result.original.split(/\s+/).length - result.removedCount);
          }
          stats.processedFiles++;
        } else {
          // Copy other files as-is (index.ts, etc.)
          copyFileSync(sourcePath, targetPath);
          console.log(`  📄 Copied: ${relative(this.sourceDir, sourcePath)}`);
        }
      }
    });
  }

  /**
   * Process single TSX file and copy with clean classes
   */
  private processAndCopyFile(sourcePath: string, targetPath: string): {
    file: string;
    original: string;
    cleaned: string;
    removedCount: number;
  } | null {
    try {
      const content = readFileSync(sourcePath, 'utf-8');
      const componentName = this.getComponentName(sourcePath);
      
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      let hasChanges = false;
      let totalRemoved = 0;
      const allChanges: Array<{ original: string; cleaned: string }> = [];
      const self = this;

      traverse(ast, {
        JSXAttribute(path) {
          if (path.node.name.name === 'className') {
            const classNameNode = path.node.value;
            
            if (classNameNode && classNameNode.type === 'StringLiteral') {
              const originalClasses = classNameNode.value;
              const cleanedClasses = self.filterClasses(originalClasses);
              
              if (cleanedClasses !== originalClasses) {
                allChanges.push({ original: originalClasses, cleaned: cleanedClasses });
                classNameNode.value = cleanedClasses;
                hasChanges = true;
                
                const removedCount = originalClasses.split(/\s+/).length - cleanedClasses.split(/\s+/).filter((c: string) => c.length > 0).length;
                totalRemoved += removedCount;
              }
            }
          }
        }
      });

      // Generate and save cleaned content
      const newContent = generate(ast, {
        retainLines: true,
        compact: false
      }).code;
      
      writeFileSync(targetPath, newContent, 'utf-8');

      if (hasChanges) {
        console.log(`  🧹 Processed: ${componentName} (-${totalRemoved} classes)`);
        return {
          file: relative(this.sourceDir, sourcePath),
          original: allChanges.map(c => c.original).join(' | '),
          cleaned: allChanges.map(c => c.cleaned).join(' | '),
          removedCount: totalRemoved
        };
      } else {
        console.log(`  ✅ Copied: ${componentName} (no changes)`);
        return null;
      }

    } catch (error) {
      console.error(`❌ Error processing ${sourcePath}:`, error);
      // Copy original file as fallback
      copyFileSync(sourcePath, targetPath);
      return null;
    }
  }

  /**
   * Filter classes using CVA whitelist
   */
  private filterClasses(classNames: string): string {
    if (!classNames || typeof classNames !== 'string') return '';
    
    const classes = classNames.split(/\s+/).filter(cls => cls.trim().length > 0);
    const keptClasses = classes.filter(cls => this.cvaWhitelist.has(cls));
    
    return keptClasses.join(' ');
  }

  /**
   * Ensure directory exists
   */
  private ensureDirectoryExists(dirPath: string): void {
    try {
      mkdirSync(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  /**
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  /**
   * Print summary
   */
  private printSummary(stats: any): void {
    console.log('\n📊 Clean Copy Summary:');
    console.log(`   • Total directories: ${stats.totalDirectories}`);
    console.log(`   • Total files: ${stats.totalFiles}`);
    console.log(`   • Processed .tsx files: ${stats.processedFiles}`);
    console.log(`   • Files with changes: ${stats.changes.length}`);
    console.log(`   • Classes removed: ${stats.totalClassesRemoved}`);
    console.log(`   • Classes kept: ${stats.totalClassesKept}`);
    
    if (stats.totalClassesRemoved > 0) {
      const removalRate = Math.round((stats.totalClassesRemoved / (stats.totalClassesRemoved + stats.totalClassesKept)) * 100);
      console.log(`   • Removal rate: ${removalRate}%`);
    }

    if (stats.changes.length > 0) {
      console.log('\n📝 Top Processed Files:');
      stats.changes
        .sort((a: any, b: any) => b.removedCount - a.removedCount)
        .slice(0, 10)
        .forEach((change: any) => {
          console.log(`   • ${change.file}: -${change.removedCount} classes`);
        });
    }

    console.log('\n✅ Clean copy created successfully!');
    console.log(`📁 Clean blocks available at: ${this.targetDir}`);
  }

  /**
   * Save detailed results
   */
  public saveResults(stats: any, outputPath: string): void {
    const output = {
      timestamp: new Date().toISOString(),
      method: 'clean-blocks-copy',
      description: 'Created clean copy of blocks with CVA-filtered classes',
      sourceDir: this.sourceDir,
      targetDir: this.targetDir,
      ...stats
    };

    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Detailed results saved to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const sourceDir = join(__dirname, '../builddy/blocks');
  const targetDir = join(__dirname, '../builddy/blocks-clean');
  const whitelistPath = join(__dirname, 'cva-whitelist.json');
  const outputPath = join(__dirname, `clean-copy-results-${Date.now()}.json`);
  
  console.log('🚀 Starting Clean Blocks Copy Creation...\n');
  
  const copier = new CleanBlocksCopier(sourceDir, targetDir, whitelistPath);
  
  try {
    const results = copier.createCleanCopy();
    copier.saveResults(results, outputPath);
    
    console.log('\n💡 Usage:');
    console.log('   • Original blocks: builddy/blocks/');
    console.log('   • Clean blocks: builddy/blocks-clean/');
    console.log('   • Import from blocks-clean for production use');
    
  } catch (error) {
    console.error('❌ Clean copy creation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { CleanBlocksCopier }; 