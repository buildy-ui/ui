import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Simple block cleaner using CVA whitelist
 */
class SimpleBlockCleaner {
  private cvaWhitelist: Set<string> = new Set();

  constructor(whitelistPath: string) {
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
   * Clean all blocks in directories
   */
  public cleanBlocks(blockDirectories: string[], dryRun: boolean = false): {
    totalFiles: number;
    changedFiles: number;
    totalClassesRemoved: number;
    totalClassesKept: number;
    changes: Array<{
      file: string;
      original: string;
      cleaned: string;
      removedCount: number;
    }>;
  } {
    console.log(`🧹 Starting ${dryRun ? 'DRY RUN' : 'CLEANUP'} of blocks...`);
    
    const allFiles: string[] = [];
    blockDirectories.forEach(dir => {
      console.log(`📁 Scanning: ${dir}`);
      allFiles.push(...this.getBlockFiles(dir));
    });

    console.log(`📄 Found ${allFiles.length} block files to process`);

    const changes: Array<{
      file: string;
      original: string;
      cleaned: string;
      removedCount: number;
    }> = [];

    let totalClassesRemoved = 0;
    let totalClassesKept = 0;

    allFiles.forEach(filePath => {
      const result = this.cleanFile(filePath, dryRun);
      if (result) {
        changes.push(result);
        totalClassesRemoved += result.removedCount;
        totalClassesKept += (result.original.split(/\s+/).length - result.removedCount);
      }
    });

    const summary = {
      totalFiles: allFiles.length,
      changedFiles: changes.length,
      totalClassesRemoved,
      totalClassesKept,
      changes
    };

    this.printSummary(summary, dryRun);
    return summary;
  }

  /**
   * Get all block files
   */
  private getBlockFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    try {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...this.getBlockFiles(fullPath));
        } else if (stat.isFile()) {
          const ext = extname(item);
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
   * Clean single file
   */
  private cleanFile(filePath: string, dryRun: boolean): {
    file: string;
    original: string;
    cleaned: string;
    removedCount: number;
  } | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const componentName = this.getComponentName(filePath);
      
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
                
                if (!dryRun) {
                  classNameNode.value = cleanedClasses;
                }
                hasChanges = true;
                
                const removedCount = originalClasses.split(/\s+/).length - cleanedClasses.split(/\s+/).filter((c: string) => c.length > 0).length;
                totalRemoved += removedCount;
                
                console.log(`  🔧 ${componentName}: "${originalClasses}" → "${cleanedClasses}"`);
              }
            }
          }
        }
      });

      if (hasChanges && !dryRun) {
        const newContent = generate(ast, {
          retainLines: true,
          compact: false
        }).code;
        
        writeFileSync(filePath, newContent, 'utf-8');
        console.log(`  💾 Updated: ${filePath}`);
      }

      if (hasChanges) {
        return {
          file: filePath,
          original: allChanges.map(c => c.original).join(' | '),
          cleaned: allChanges.map(c => c.cleaned).join(' | '),
          removedCount: totalRemoved
        };
      }

      return null;
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
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
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  /**
   * Print summary
   */
  private printSummary(summary: ReturnType<typeof this.cleanBlocks>, dryRun: boolean): void {
    console.log('\n📊 Cleanup Summary:');
    console.log(`   ${dryRun ? '[DRY RUN] ' : ''}• Total files: ${summary.totalFiles}`);
    console.log(`   • Files changed: ${summary.changedFiles}`);
    console.log(`   • Classes removed: ${summary.totalClassesRemoved}`);
    console.log(`   • Classes kept: ${summary.totalClassesKept}`);
    
    if (summary.totalClassesRemoved > 0) {
      const removalRate = Math.round((summary.totalClassesRemoved / (summary.totalClassesRemoved + summary.totalClassesKept)) * 100);
      console.log(`   • Removal rate: ${removalRate}%`);
    }

    if (summary.changedFiles > 0) {
      console.log('\n📝 Changed Files:');
      summary.changes.slice(0, 10).forEach(change => {
        const fileName = change.file.split(/[/\\]/).pop();
        console.log(`   • ${fileName}: -${change.removedCount} classes`);
      });
      
      if (summary.changes.length > 10) {
        console.log(`   ... and ${summary.changes.length - 10} more files`);
      }
    }

    if (dryRun) {
      console.log('\n💡 This was a dry run. Use --apply to make changes.');
    } else {
      console.log('\n✅ Cleanup completed!');
      console.log('💡 Only CVA-defined classes were kept. Tailwind will handle compatibility.');
    }
  }

  /**
   * Save detailed results
   */
  public saveResults(summary: ReturnType<typeof this.cleanBlocks>, outputPath: string): void {
    const output = {
      timestamp: new Date().toISOString(),
      method: 'simple-cva-whitelist',
      description: 'Filtered using only classes found in CVA definitions',
      summary: {
        totalFiles: summary.totalFiles,
        changedFiles: summary.changedFiles,
        totalClassesRemoved: summary.totalClassesRemoved,
        totalClassesKept: summary.totalClassesKept
      },
      changes: summary.changes
    };

    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Detailed results saved to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  
  const blockDirs = [
    join(__dirname, '../builddy/blocks/blog'),
    join(__dirname, '../builddy/blocks/features'),
    join(__dirname, '../builddy/blocks/hero'),
    join(__dirname, '../builddy/blocks/cta'),
    join(__dirname, '../builddy/blocks/footer'),
    join(__dirname, '../builddy/blocks/business'),
    join(__dirname, '../builddy/blocks/defcon')
  ];

  const whitelistPath = join(__dirname, 'cva-whitelist.json');
  const outputPath = join(__dirname, `simple-cleanup-${Date.now()}.json`);
  
  console.log('🚀 Starting Simple Block Cleanup...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN (preview)' : 'APPLY CHANGES'}`);
  console.log(`Block directories: ${blockDirs.length}`);
  console.log('');
  
  const cleaner = new SimpleBlockCleaner(whitelistPath);
  
  try {
    const results = cleaner.cleanBlocks(blockDirs, dryRun);
    cleaner.saveResults(results, outputPath);
    
    if (dryRun) {
      console.log('\n💡 To apply changes: bun run simple-block-cleaner.ts --apply');
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

export { SimpleBlockCleaner }; 