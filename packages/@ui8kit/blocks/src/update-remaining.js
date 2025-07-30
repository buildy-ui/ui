const fs = require('fs').promises;
const path = require('path');

// Define the theming imports to add
const themingImports = `import { skyOSTheme } from "@ui8kit/theme";

export const currentTheme = skyOSTheme;

export const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}`;

// Remaining files to update
const filesToUpdate = [
  'blog/GridBlog.tsx',
  'blog/SplitBlog.tsx',
  'cta/SplitCTA.tsx',
  'cta/GridCTA.tsx',
  'business/SplitBusiness.tsx',
  'business/GridBusiness.tsx',
  'portfolio/SplitPortfolio.tsx',
  'portfolio/GridPortfolio.tsx',
  'post/SplitPost.tsx',
  'post/CenteredPost.tsx',
  'gallery/SplitGallery.tsx',
  'gallery/GridGallery.tsx',
  'faq/SplitFAQ.tsx',
  'faq/GridFAQ.tsx',
  'features/SplitFeatures.tsx',
  'features/GridFeatures.tsx',
  'team/SplitTeam.tsx',
  'team/GridTeam.tsx',
  'testimonial/SplitTestimonial.tsx',
  'testimonial/GridTestimonial.tsx',
  'footer/GridFooter.tsx',
  'footer/SplitFooter.tsx',
];

async function updateFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      console.log(`⚠️  ${filePath} not found, skipping`);
      return;
    }
    
    const content = await fs.readFile(fullPath, 'utf-8');
    
    // Check if theming is already added
    if (content.includes('skyOSTheme')) {
      console.log(`✅ ${filePath} already has theming`);
      return;
    }
    
    let updatedContent = content;
    
    // Add theming imports after other imports
    const importEndRegex = /} from "@ui8kit\/core";/;
    if (importEndRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        importEndRegex, 
        `} from "@ui8kit/core";\n${themingImports}`
      );
    }
    
    /*// Update Badge elements
    updatedContent = updatedContent.replace(
      /size="default" rounded="md"/g,
      'size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}'
    );
    
    // Update Button elements - size
    updatedContent = updatedContent.replace(
      /size="lg"/g,
      'size={theme?.themeButtonSize.default}'
    );
    
    updatedContent = updatedContent.replace(
      /size="sm"/g,
      'size={theme?.themeButtonSize.default}'
    );*/
    
    // Add rounded to Button elements that don't have it
    updatedContent = updatedContent.replace(
      /<Button([^>]*?)(?!.*rounded=)([^>]*?)>/g,
      '<Button$1 rounded={theme?.themeRounded.default}$2>'
    );
    
    // Update Text descriptions
    updatedContent = updatedContent.replace(
      /size="xl" c="secondary-foreground"/g,
      'c="secondary-foreground"'
    );
    
    updatedContent = updatedContent.replace(
      /size="lg" c="secondary-foreground"/g,
      'c="secondary-foreground"'
    );
    
    // Update default py and gap values
    updatedContent = updatedContent.replace(
      /py = "lg",/g,
      'py = "xl",'
    );
    
    updatedContent = updatedContent.replace(
      /gap = "xl",/g,
      'gap = "md",'
    );
    
    // Update gradients to shadcn format
    const gradientReplacements = [
      'from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950',
      'from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950',
      'from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950',
      'from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950',
      'from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-950'
    ];
    
    gradientReplacements.forEach(gradient => {
      const escapedGradient = gradient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      updatedContent = updatedContent.replace(
        new RegExp(escapedGradient, 'g'),
        'from-primary/5 to-secondary/10'
      );
    });
    
    /*// Update rounded props for images and other elements
    updatedContent = updatedContent.replace(
      /rounded="lg"/g,
      'rounded={theme?.themeRounded.default}'
    );
    
    updatedContent = updatedContent.replace(
      /rounded="md"(?! className)/g,
      'rounded={theme?.themeRounded.default}'
    );
    
    // Fix import paths
    updatedContent = updatedContent.replace(
      /@ui8kit\/core\/factory\/(SplitBlock|LayoutBlock)/g,
      '@ui8kit/core'
    );*/
    
    // Add c="primary-foreground" to default button icons
    updatedContent = updatedContent.replace(
      /(variant="default"[^>]*>[\s\S]*?<Icon[^>]*lucideIcon=\{[^}]*\}[^>]*?)>/g,
      (match, p1) => {
        if (!p1.includes('c=')) {
          return p1.replace('lucideIcon={', 'c="primary-foreground" lucideIcon={') + '>';
        }
        return match;
      }
    );
    
    await fs.writeFile(fullPath, updatedContent);
    console.log(`✅ Updated ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting remaining files theme update...\n');
  
  try {
    for (const file of filesToUpdate) {
      await updateFile(file);
    }
    
    console.log('\n✨ Remaining files theme update complete!');
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
main().catch(console.error); 