import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { SmartClassFilter } from './smart-class-filter';

interface CleanupResult {
  filePath: string;
  componentName: string;
  classNamesProcessed: number;
  totalClassesRemoved: number;
  totalClassesKept: number;
  changes: Array<{
    original: string;
    filtered: string;
    analysis: any;
  }>;
}

interface CleanupSummary {
  totalFiles: number;
  filesChanged: number;
  totalClassNamesProcessed: number;
  totalClassesRemoved: number;
  totalClassesKept: number;
  topRemovedClasses: Array<{ className: string; count: number }>;
}

/**
 * Automatic block cleanup using smart class filtering
 */
class AutoBlocksCleanup {
  private filter: SmartClassFilter;
  private dryRun: boolean;
  private removedClassesCount: Map<string, number> = new Map();

  constructor(coreClassesPath: string, dryRun: boolean = false) {
    this.filter = new SmartClassFilter(coreClassesPath);
    this.dryRun = dryRun;
  }

  /**
   * Clean all blocks in specified directories
   */
  public cleanupBlocks(blockDirectories: string[]): CleanupSummary {
    console.log(`🧹 Starting ${this.dryRun ? 'DRY RUN' : 'CLEANUP'} of blocks...`);
    
    const results: CleanupResult[] = [];
    
    blockDirectories.forEach(dir => {
      console.log(`📁 Processing directory: ${dir}`);
      const files = this.getBlockFiles(dir);
      
      files.forEach(filePath => {
        const result = this.cleanupFile(filePath);
        if (result) {
          results.push(result);
        }
      });
    });

    return this.generateSummary(results);
  }

  /**
   * Get all block files (.tsx) from directory
   */
  private getBlockFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    try {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          files.push(...this.getBlockFiles(fullPath));
        } else if (stat.isFile()) {
          const ext = extname(item);
          // Only process .tsx files, skip index.ts files
          if (ext === '.tsx' && !item.includes('index')) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${dirPath}:`, error);
    }
    
    return files;
  }

  /**
   * Clean up a single file
   */
  private cleanupFile(filePath: string): CleanupResult | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const componentName = this.getComponentName(filePath);
      
      console.log(`🔧 Processing: ${componentName}`);
      
      // Parse TypeScript/TSX with Babel
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      const changes: Array<{
        original: string;
        filtered: string;
        analysis: any;
      }> = [];
      
      let hasChanges = false;
      const self = this;

      traverse(ast, {
        JSXAttribute(path) {
          if (path.node.name.name === 'className') {
            const classNameNode = path.node.value;
            
            if (classNameNode && classNameNode.type === 'StringLiteral') {
              const originalClasses = classNameNode.value;
              const filterResult = self.filter.filterClasses(originalClasses);
              
              // Only update if there are actual changes
              if (filterResult.filtered !== originalClasses) {
                // Track removed classes for summary
                filterResult.removed.forEach(className => {
                  const count = self.removedClassesCount.get(className) || 0;
                  self.removedClassesCount.set(className, count + 1);
                });
                
                // Update AST node
                classNameNode.value = filterResult.filtered;
                hasChanges = true;
                
                changes.push({
                  original: originalClasses,
                  filtered: filterResult.filtered,
                  analysis: filterResult.analysis
                });
                
                console.log(`  ✂️  "${originalClasses}" → "${filterResult.filtered}"`);
                console.log(`     Removed ${filterResult.analysis.removedCount} styling classes`);
              }
            }
          }
        }
      });

      // Save file if changes were made and not in dry run mode
      if (hasChanges && !this.dryRun) {
        const newContent = generate(ast, {
          retainLines: true,
          compact: false
        }).code;
        
        writeFileSync(filePath, newContent, 'utf-8');
        console.log(`  💾 File updated: ${filePath}`);
      }

      // Calculate summary for this file
      const totalClassesRemoved = changes.reduce((sum, change) => sum + change.analysis.removedCount, 0);
      const totalClassesKept = changes.reduce((sum, change) => sum + change.analysis.keptCount, 0);

      return {
        filePath,
        componentName,
        classNamesProcessed: changes.length,
        totalClassesRemoved,
        totalClassesKept,
        changes
      };
      
    } catch (error) {
      console.error(`❌ Error processing file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  /**
   * Generate cleanup summary
   */
  private generateSummary(results: CleanupResult[]): CleanupSummary {
    const filesChanged = results.filter(r => r.classNamesProcessed > 0).length;
    const totalClassNamesProcessed = results.reduce((sum, r) => sum + r.classNamesProcessed, 0);
    const totalClassesRemoved = results.reduce((sum, r) => sum + r.totalClassesRemoved, 0);
    const totalClassesKept = results.reduce((sum, r) => sum + r.totalClassesKept, 0);

    // Get top removed classes
    const topRemovedClasses = Array.from(this.removedClassesCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([className, count]) => ({ className, count }));

    const summary: CleanupSummary = {
      totalFiles: results.length,
      filesChanged,
      totalClassNamesProcessed,
      totalClassesRemoved,
      totalClassesKept,
      topRemovedClasses
    };

    this.printSummary(summary, results);
    return summary;
  }

  /**
   * Print cleanup summary
   */
  private printSummary(summary: CleanupSummary, results: CleanupResult[]): void {
    console.log('\n📊 Cleanup Summary:');
    console.log(`   ${this.dryRun ? '[DRY RUN] ' : ''}• Total files processed: ${summary.totalFiles}`);
    console.log(`   • Files with changes: ${summary.filesChanged}`);
    console.log(`   • className attributes processed: ${summary.totalClassNamesProcessed}`);
    console.log(`   • Total classes removed: ${summary.totalClassesRemoved}`);
    console.log(`   • Total classes kept: ${summary.totalClassesKept}`);
    
    if (summary.totalClassesRemoved > 0) {
      const removalRate = Math.round((summary.totalClassesRemoved / (summary.totalClassesRemoved + summary.totalClassesKept)) * 100);
      console.log(`   • Removal rate: ${removalRate}%`);
    }

    if (summary.topRemovedClasses.length > 0) {
      console.log('\n🎯 Top Removed Classes:');
      summary.topRemovedClasses.slice(0, 10).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.className} (${item.count}x)`);
      });
    }

    if (summary.filesChanged > 0) {
      console.log('\n📝 Files with Changes:');
      results
        .filter(r => r.classNamesProcessed > 0)
        .slice(0, 10)
        .forEach(result => {
          console.log(`   • ${result.componentName}: -${result.totalClassesRemoved} classes`);
        });
    }

    if (this.dryRun) {
      console.log('\n💡 This was a dry run. Use --apply to actually modify files.');
    } else {
      console.log('\n✅ Cleanup completed successfully!');
    }
  }

  /**
   * Save detailed results to JSON file
   */
  public saveResults(results: CleanupSummary, outputPath: string): void {
    const output = {
      timestamp: new Date().toISOString(),
      dryRun: this.dryRun,
      ...results
    };

    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Detailed results saved to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  
  // Paths to block directories
  const blockDirs = [
    join(__dirname, '../builddy/blocks/blog'),
    join(__dirname, '../builddy/blocks/features'),
    join(__dirname, '../builddy/blocks/hero'),
    join(__dirname, '../builddy/blocks/cta'),
    join(__dirname, '../builddy/blocks/footer'),
    join(__dirname, '../builddy/blocks/business'),
    join(__dirname, '../builddy/blocks/defcon')
  ];

  const coreClassesPath = join(__dirname, 'core-tailwind-classes.json');
  const outputPath = join(__dirname, `cleanup-results-${Date.now()}.json`);
  
  console.log('🚀 Starting Automatic Blocks Cleanup...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN (preview only)' : 'APPLY CHANGES'}`);
  console.log(`Block directories: ${blockDirs.length}`);
  console.log('');
  
  const cleanup = new AutoBlocksCleanup(coreClassesPath, dryRun);
  
  try {
    const results = cleanup.cleanupBlocks(blockDirs);
    cleanup.saveResults(results, outputPath);
    
    if (dryRun) {
      console.log('\n💡 To apply these changes, run: bun run auto-cleanup-blocks.ts --apply');
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { AutoBlocksCleanup }; 