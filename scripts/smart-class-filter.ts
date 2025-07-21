import { readFileSync } from 'fs';
import { join } from 'path';

interface CoreClassData {
  timestamp: string;
  uniqueClasses: string[];
  detailedMap: Array<{
    className: string;
    component: string;
    filePath: string;
    context: string;
  }>;
  summary: {
    totalFiles: number;
    totalClasses: number;
    componentBreakdown: Record<string, number>;
  };
}

/**
 * Smart filter that keeps only layout-critical classes and core component classes
 */
class SmartClassFilter {
  private coreClasses: Set<string> = new Set();
  private layoutWhitelist: RegExp[] = [];
  private stylingBlacklist: RegExp[] = [];

  constructor(coreClassesPath?: string) {
    this.initializeLayoutRules();
    
    if (coreClassesPath) {
      this.loadCoreClasses(coreClassesPath);
    }
  }

  /**
   * Load core classes from extracted JSON file
   */
  private loadCoreClasses(filePath: string): void {
    try {
      const data: CoreClassData = JSON.parse(readFileSync(filePath, 'utf-8'));
      
      data.uniqueClasses.forEach(className => {
        this.coreClasses.add(className);
      });
      
      console.log(`📚 Loaded ${this.coreClasses.size} core classes from ui8kit/core`);
    } catch (error) {
      console.warn(`⚠️ Could not load core classes from ${filePath}:`, error);
    }
  }

  /**
   * Initialize layout whitelist and styling blacklist patterns
   */
  private initializeLayoutRules(): void {
    // Layout-critical patterns (always keep)
    this.layoutWhitelist = [
      // Flexbox & Grid Layout
      /^(flex|grid)(-|$)/,
      /^(flex-col|flex-row|flex-wrap|flex-nowrap)$/,
      /^(grid-cols|grid-rows|col-span|row-span)-\d+$/,
      
      // Positioning & Display
      /^(relative|absolute|fixed|sticky)$/,
      /^(block|inline|hidden|table)(-|$)/,
      /^(top|bottom|left|right|inset)-/,
      
      // Spacing Layout (not styling)
      /^(gap|space-[xy])-\d+$/,
      /^(container|mx-auto)$/,
      
      // Alignment & Justification
      /^(items|justify|place|self)-/,
      /^text-(left|center|right|justify)$/,
      
      // Container & Sizing (structural)
      /^(w|h|min-w|min-h|max-w|max-h)-(full|screen|auto|fit|max|min|\d+)$/,
      /^(w|h)-\[.+\]$/, // arbitrary values for sizing
      
      // Responsive prefixes (keep structural ones)
      /^(sm|md|lg|xl|2xl):(flex|grid|hidden|block)/
    ];

    // Styling patterns (always remove)
    this.stylingBlacklist = [
      // Colors & Backgrounds
      /^(bg|text|border|ring|from|via|to|fill|stroke)-(?!transparent|current)/,
      /^(bg|text|border)-(primary|secondary|accent|muted|destructive|warning|success)/,
      
      // Visual Effects
      /^(shadow|drop-shadow|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)/,
      /^(opacity|backdrop)/,
      
      // Animations & Transforms
      /^(animate|transition|duration|delay|ease)/,
      /^(transform|scale|rotate|translate|skew)/,
      /^hover:(scale|rotate|translate|bg|text|border|shadow)/,
      /^focus:(bg|text|border|ring|shadow)/,
      
      // Typography Styling
      /^(font-(?!normal)|text-(?!left|center|right|justify)|leading-(?!none)|tracking|decoration)/,
      
      // Borders & Rounded (decorative)
      /^(rounded|border-(?!0|t|b|l|r|x|y))/,
      
      // Spacing (non-structural)
      /^[mp][tblrxy]?-\d+$/, // margins and paddings
      /^space-[xy]-\d+$/
    ];
  }

  /**
   * Filter classes keeping only layout-critical and core component classes
   */
  public filterClasses(classNames: string): {
    filtered: string;
    removed: string[];
    kept: string[];
    analysis: {
      total: number;
      removedCount: number;
      keptCount: number;
      coreMatches: number;
      layoutMatches: number;
      stylingRemoved: number;
    };
  } {
    if (!classNames || typeof classNames !== 'string') {
      return {
        filtered: '',
        removed: [],
        kept: [],
        analysis: {
          total: 0,
          removedCount: 0,
          keptCount: 0,
          coreMatches: 0,
          layoutMatches: 0,
          stylingRemoved: 0
        }
      };
    }

    const classes = classNames.split(/\s+/).filter(cls => cls.trim().length > 0);
    const kept: string[] = [];
    const removed: string[] = [];
    
    let coreMatches = 0;
    let layoutMatches = 0;
    let stylingRemoved = 0;

    classes.forEach(className => {
      const shouldKeep = this.shouldKeepClass(className);
      
      if (shouldKeep.keep) {
        kept.push(className);
        
        if (shouldKeep.reason === 'core') coreMatches++;
        if (shouldKeep.reason === 'layout') layoutMatches++;
      } else {
        removed.push(className);
        
        if (shouldKeep.reason === 'styling') stylingRemoved++;
      }
    });

    return {
      filtered: kept.join(' '),
      removed,
      kept,
      analysis: {
        total: classes.length,
        removedCount: removed.length,
        keptCount: kept.length,
        coreMatches,
        layoutMatches,
        stylingRemoved
      }
    };
  }

  /**
   * Determine if a class should be kept and why
   */
  private shouldKeepClass(className: string): {
    keep: boolean;
    reason: 'core' | 'layout' | 'styling' | 'unknown';
  } {
    // 1. Check if it's in core components (highest priority)
    if (this.coreClasses.has(className)) {
      return { keep: true, reason: 'core' };
    }

    // 2. Check against styling blacklist (remove styling)
    if (this.stylingBlacklist.some(pattern => pattern.test(className))) {
      return { keep: false, reason: 'styling' };
    }

    // 3. Check against layout whitelist (keep structural)
    if (this.layoutWhitelist.some(pattern => pattern.test(className))) {
      return { keep: true, reason: 'layout' };
    }

    // 4. Unknown classes - be conservative and keep them
    return { keep: true, reason: 'unknown' };
  }

  /**
   * Filter multiple class strings and return summary
   */
  public filterMultiple(classStrings: string[]): {
    results: Array<{
      original: string;
      filtered: string;
      analysis: any;
    }>;
    summary: {
      totalClasses: number;
      totalRemoved: number;
      totalKept: number;
      coreMatches: number;
      layoutMatches: number;
      stylingRemoved: number;
    };
  } {
    const results = classStrings.map(classNames => {
      const result = this.filterClasses(classNames);
      return {
        original: classNames,
        filtered: result.filtered,
        analysis: result.analysis
      };
    });

    // Calculate summary
    const summary = results.reduce(
      (acc, result) => ({
        totalClasses: acc.totalClasses + result.analysis.total,
        totalRemoved: acc.totalRemoved + result.analysis.removedCount,
        totalKept: acc.totalKept + result.analysis.keptCount,
        coreMatches: acc.coreMatches + result.analysis.coreMatches,
        layoutMatches: acc.layoutMatches + result.analysis.layoutMatches,
        stylingRemoved: acc.stylingRemoved + result.analysis.stylingRemoved
      }),
      {
        totalClasses: 0,
        totalRemoved: 0,
        totalKept: 0,
        coreMatches: 0,
        layoutMatches: 0,
        stylingRemoved: 0
      }
    );

    return { results, summary };
  }

  /**
   * Get statistics about loaded core classes
   */
  public getCoreClassesStats(): {
    totalCoreClasses: number;
    sampleCoreClasses: string[];
  } {
    const coreClassesArray = Array.from(this.coreClasses);
    return {
      totalCoreClasses: coreClassesArray.length,
      sampleCoreClasses: coreClassesArray.slice(0, 20)
    };
  }
}

// Usage example and testing
function testFilter() {
  const coreClassesPath = join(__dirname, 'core-tailwind-classes.json');
  const filter = new SmartClassFilter(coreClassesPath);

  console.log('🧪 Testing Smart Class Filter...\n');

  // Test cases
  const testCases = [
    'text-center mx-auto max-w-2xl bg-primary shadow-lg hover:scale-105',
    'flex flex-col sm:flex-row gap-4 bg-white rounded-lg border-2 border-gray-200',
    'grid grid-cols-1 md:grid-cols-3 p-6 bg-gradient-to-r from-blue-500 to-purple-600',
    'absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm',
    'h-4 w-4 ml-2 text-muted-foreground hover:text-primary transition-colors'
  ];

  testCases.forEach((testCase, index) => {
    console.log(`📝 Test Case ${index + 1}:`);
    console.log(`   Input:  "${testCase}"`);
    
    const result = filter.filterClasses(testCase);
    
    console.log(`   Output: "${result.filtered}"`);
    console.log(`   Analysis: ${result.analysis.keptCount}/${result.analysis.total} kept`);
    console.log(`   Core: ${result.analysis.coreMatches}, Layout: ${result.analysis.layoutMatches}, Styling removed: ${result.analysis.stylingRemoved}`);
    
    if (result.removed.length > 0) {
      console.log(`   Removed: ${result.removed.join(', ')}`);
    }
    console.log('');
  });

  // Core classes stats
  const stats = filter.getCoreClassesStats();
  console.log('📊 Core Classes Stats:');
  console.log(`   Total core classes loaded: ${stats.totalCoreClasses}`);
  console.log(`   Sample: ${stats.sampleCoreClasses.slice(0, 10).join(', ')}...`);
}

// Run test if called directly
if (require.main === module) {
  testFilter();
}

export { SmartClassFilter }; 