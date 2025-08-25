import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse/lib/index.js";
import * as t from "@babel/types";

// Import our universal mapping and schema
import { universalMapping, createPatternMatcher } from "./universal-blocks-mapping";
import type { QDrantBlockDocument, TagCategory } from "./qdrant-collection-schema";

// Type definitions
type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONValue[] | { [k: string]: JSONValue };
type JSONObject = { [k: string]: JSONValue };
type ConstTable = Map<string, JSONValue>;

// Configuration
const SRC_DIR = resolve("packages/@ui8kit/blocks/src");
const BABEL_OPTS = {
  sourceType: "module" as const,
  plugins: ["typescript", "jsx"] as any
};

// Utility functions
const isObject = (v: unknown): v is JSONObject => 
  typeof v === "object" && v !== null && !Array.isArray(v);

const safeString = (v: unknown): string | null => 
  typeof v === "string" ? v : null;

const safeBool = (v: unknown): boolean => 
  typeof v === "boolean" ? v : false;

const safeNumber = (v: unknown): number => 
  typeof v === "number" ? v : 0;

// AST evaluation functions
const keyOf = (key: t.Expression | t.Identifier | t.PrivateName): string => {
  if (t.isIdentifier(key)) return key.name;
  if (t.isStringLiteral(key)) return key.value;
  return "";
};

const evalLiteral = (node: t.Node, consts: ConstTable): JSONValue => {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node)) return null;

  if (t.isTemplateLiteral(node)) {
    return node.quasis
      .map((q, i) => q.value.cooked + (node.expressions[i] ? "${expr}" : ""))
      .join("");
  }

  if (t.isTSAsExpression(node) || t.isTSTypeAssertion(node)) {
    return evalLiteral(node.expression, consts);
  }

  if (t.isArrayExpression(node)) {
    return node.elements.map((el) => 
      el && t.isExpression(el) ? evalLiteral(el, consts) : null
    );
  }

  if (t.isObjectExpression(node)) {
    const out: JSONObject = {};
    for (const p of node.properties) {
      if (t.isObjectProperty(p)) {
        const k = keyOf(p.key);
        const vNode = p.value as t.Node;
        out[k] = evalLiteral(vNode, consts);
      } else if (t.isSpreadElement(p) && t.isIdentifier(p.argument)) {
        const spreadVal = consts.get(p.argument.name);
        if (isObject(spreadVal)) Object.assign(out, spreadVal);
      }
    }
    return out;
  }

  if (t.isIdentifier(node)) {
    if (consts.has(node.name)) return consts.get(node.name) as JSONValue;
    return node.name; // e.g., icon identifiers
  }

  return null;
};

const collectTopLevelConsts = (ast: t.File): ConstTable => {
  const table: ConstTable = new Map();
  traverse(ast, {
    VariableDeclarator(path) {
      const program = path.findParent((p) => p.isProgram());
      if (!program) return;
      if (!path.node.init) return;
      if (t.isIdentifier(path.node.id)) {
        const name = path.node.id.name;
        const value = evalLiteral(path.node.init, table);
        table.set(name, value);
      }
    }
  });
  return table;
};

const findExportedPresetArrays = (ast: t.File, consts: ConstTable) => {
  const results: Array<{ name: string; value: JSONValue }> = [];
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (!t.isVariableDeclaration(decl)) return;
      for (const d of decl.declarations) {
        if (t.isIdentifier(d.id) && d.init && t.isArrayExpression(d.init) && d.id.name.endsWith("Preset")) {
          results.push({ name: d.id.name, value: evalLiteral(d.init, consts) });
        }
      }
    }
  });
  return results;
};

// Universal analysis functions
class UniversalBlockAnalyzer {
  private patternMatcher = createPatternMatcher();

  analyzeStructure(type: string, props: JSONObject) {
    const layout = this.patternMatcher.detectLayout(type, props);
    const columns = safeString(props.cols);
    const leftMedia = safeBool(props.leftMedia);
    const useContainer = safeBool(props.useContainer);
    const className = safeString(props.className) || "";

    // Determine media position
    let mediaPosition: string | undefined;
    if (layout === "split") {
      mediaPosition = leftMedia ? "left" : "right";
    }

    // Determine density based on layout and type
    const density = this.inferDensity(layout, type, props);

    return {
      layout: layout as "grid" | "split" | "centered" | "stack",
      columns,
      media_position: mediaPosition,
      container: useContainer,
      responsive: true, // All UI8Kit blocks are responsive
      density,
      has_gradient: className.includes("gradient"),
      has_background: className.includes("bg-") || props.backgroundImage !== undefined
    };
  }

  analyzeContent(content: JSONObject) {
    const entities = this.patternMatcher.extractContentEntities(content);
    
    // Text elements
    const hasText = {
      has_badge: !!entities.badge,
      has_title: !!entities.title,
      has_description: !!entities.description,
      has_subtitle: !!entities.subtitle
    };

    // Interactive elements
    const ctaAnalysis = this.analyzeCTAs(content);
    
    // Media elements
    const mediaAnalysis = this.analyzeMedia(content);
    
    // Collections
    const collections = this.analyzeCollections(content);

    return {
      ...hasText,
      ...ctaAnalysis,
      ...mediaAnalysis,
      collections
    };
  }

  analyzeSemantics(type: string, variant: string, content: JSONObject) {
    const context = this.patternMatcher.inferSemantics(content);
    const variantClassifications = this.patternMatcher.classifyVariant(variant, content);
    
    // Enhanced industry detection
    const industries = this.inferIndustries(content);
    const personas = this.inferPersonas(content);
    const useCases = this.inferUseCases(type, variant);
    
    return {
      industries: [...new Set([...context.industries, ...industries])],
      personas,
      company_size: this.inferCompanySize(content),
      intents: context.intents,
      funnel_stages: context.funnel,
      use_cases: useCases,
      seasonality: this.inferSeasonality(content),
      urgency: this.inferUrgency(content),
      tone: this.inferTone(content)
    };
  }

  // Helper methods
  private inferDensity(layout: string, type: string, props: JSONObject): "low" | "medium" | "high" {
    if (layout === "grid") return "high";
    if (layout === "split") return "medium";
    if (layout === "centered" || type.includes("hero")) return "low";
    return "medium";
  }

  private analyzeCTAs(content: JSONObject) {
    let ctaCount = 0;
    const ctaTypes: string[] = [];
    
    // Check various CTA patterns
    if (content.buttonText) ctaCount++;
    if (content.primaryButtonText) ctaCount++;
    if (content.secondaryButtonText) ctaCount++;
    if (Array.isArray(content.buttons)) {
      ctaCount = content.buttons.length;
      content.buttons.forEach((btn: any) => {
        if (btn?.variant) ctaTypes.push(btn.variant);
      });
    }

    return {
      cta_count: ctaCount,
      cta_types: [...new Set(ctaTypes)],
      has_form: !!content.form || !!content.contactForm,
      has_links: !!content.links || !!content.topButton
    };
  }

  private analyzeMedia(content: JSONObject) {
    let mediaType: string = "none";
    let mediaCount = 0;

    if (content.image || content.imageUrl) {
      mediaType = "image";
      mediaCount = 1;
    } else if (Array.isArray(content.images)) {
      mediaType = "gallery";
      mediaCount = content.images.length;
    } else if (content.stats || content.metrics) {
      mediaType = "stats";
      mediaCount = Array.isArray(content.stats) ? content.stats.length : 
                   Array.isArray(content.metrics) ? content.metrics.length : 1;
    } else if (content.video) {
      mediaType = "video";
      mediaCount = 1;
    }

    return {
      media_type: mediaType as "none" | "image" | "video" | "icon" | "gallery" | "stats",
      media_count: mediaCount,
      has_background: !!(content.backgroundImage || content.gradient)
    };
  }

  private analyzeCollections(content: JSONObject) {
    const collections: Record<string, { count: number; item_fields: string[] }> = {};
    
    Object.keys(content).forEach(key => {
      if (Array.isArray(content[key]) && content[key].length > 0) {
        const items = content[key] as any[];
        const firstItem = items[0];
        const itemFields = isObject(firstItem) ? Object.keys(firstItem) : [];
        
        collections[key] = {
          count: items.length,
          item_fields: itemFields
        };
      }
    });

    return collections;
  }

  private inferIndustries(content: JSONObject): string[] {
    const text = JSON.stringify(content).toLowerCase();
    const industries: string[] = [];
    
    const patterns = universalMapping.semanticPatterns.industries;
    Object.entries(patterns).forEach(([industry, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        industries.push(industry);
      }
    });

    return industries;
  }

  private inferPersonas(content: JSONObject): string[] {
    const text = JSON.stringify(content).toLowerCase();
    const personas: string[] = [];
    
    // Basic persona inference
    if (/developer|api|technical|integration/.test(text)) personas.push("developer");
    if (/marketing|campaign|brand|growth/.test(text)) personas.push("marketer");
    if (/founder|ceo|startup|business/.test(text)) personas.push("founder");
    if (/sales|revenue|conversion|leads/.test(text)) personas.push("sales");
    if (/design|creative|visual|ui/.test(text)) personas.push("designer");

    return personas;
  }

  private inferUseCases(type: string, variant: string): string[] {
    const useCases: string[] = [];
    
    if (type.includes("hero")) useCases.push("landing_page", "home_page");
    if (variant.includes("pricing")) useCases.push("pricing_page", "saas_page");
    if (variant.includes("about")) useCases.push("about_page", "company_page");
    if (variant.includes("contact")) useCases.push("contact_page");
    if (variant.includes("feature")) useCases.push("product_page", "feature_page");
    if (variant.includes("testimonial")) useCases.push("social_proof", "landing_page");
    if (variant.includes("faq")) useCases.push("support_page", "help_center");

    return useCases;
  }

  private inferSeasonality(content: JSONObject): string[] {
    const text = JSON.stringify(content).toLowerCase();
    const seasonality: string[] = [];
    
    if (/new year|january|resolution/.test(text)) seasonality.push("new_year");
    if (/black friday|cyber monday|holiday|christmas/.test(text)) seasonality.push("holiday_season");
    if (/launch|new|introducing|announcing/.test(text)) seasonality.push("product_launch");
    if (/summer|vacation|travel/.test(text)) seasonality.push("summer");
    if (/back to school|september|education/.test(text)) seasonality.push("back_to_school");

    return seasonality;
  }

  private inferUrgency(content: JSONObject): "low" | "medium" | "high" {
    const text = JSON.stringify(content).toLowerCase();
    
    if (/limited time|urgent|now|today|expires/.test(text)) return "high";
    if (/soon|don't miss|act fast|hurry/.test(text)) return "medium";
    return "low";
  }

  private inferTone(content: JSONObject): string[] {
    const text = JSON.stringify(content).toLowerCase();
    const tones: string[] = [];
    
    if (/professional|enterprise|business|corporate/.test(text)) tones.push("professional");
    if (/friendly|welcome|hello|community/.test(text)) tones.push("friendly");
    if (/urgent|limited|now|act/.test(text)) tones.push("urgent");
    if (/innovative|cutting-edge|modern|future/.test(text)) tones.push("innovative");
    if (/trusted|secure|reliable|proven/.test(text)) tones.push("trustworthy");

    return tones;
  }
}

// Document generation
class QDrantDocumentGenerator {
  private analyzer = new UniversalBlockAnalyzer();

  generateDocument(
    type: string,
    variant: string,
    category: string,
    entry: JSONObject,
    filePath: string,
    exportName: string,
    presetIndex: number
  ): QDrantBlockDocument {
    const props = isObject(entry.props) ? entry.props : {};
    const content = isObject(props.content) ? props.content : {};

    // Analyze all aspects
    const structure = this.analyzer.analyzeStructure(type, props);
    const contentAnalysis = this.analyzer.analyzeContent(content);
    const semantics = this.analyzer.analyzeSemantics(type, variant, content);

    // Generate embedding text
    const embeddingText = this.generateEmbeddingText(type, variant, structure, content, semantics);
    
    // Generate tags
    const tags = this.generateTags(type, variant, category, structure, contentAnalysis, semantics);

    // Generate description
    const description = this.generateDescription(variant, structure, contentAnalysis);

    return {
      id: `${type}#${variant}#${presetIndex}`,
      type,
      variant,
      category,
      source: {
        path: filePath.replace(resolve(".") + "/", ""),
        export_name: exportName,
        preset_index: presetIndex
      },
      embedding: {
        model: "text-embedding-3-small",
        text: embeddingText,
        tokens_estimate: Math.ceil(embeddingText.length / 4) // Rough estimate
      },
      payload: {
        qdrant: {
          description,
          tags,
          category
        },
        structure,
        content: contentAnalysis,
        semantics,
        technical: {
          component_name: this.extractComponentName(exportName),
          schema_available: false, // TODO: Check for .schema.ts file
          ui_components: this.extractUIComponents(content),
          icons_used: this.extractIcons(content),
          themes_supported: ["skyOS", "modernUI"], // Default assumption
          has_gradient: structure.has_gradient || false,
          has_animation: false, // TODO: Detect animations
          complexity: this.inferComplexity(structure, contentAnalysis),
          customization_level: this.inferCustomizationLevel(content)
        },
        quality: {
          content_completeness: this.calculateContentCompleteness(content),
          text_quality: this.assessTextQuality(content),
          visual_hierarchy: this.assessVisualHierarchy(structure),
          accessibility_level: "enhanced", // UI8Kit standard
          reusability_score: this.calculateReusabilityScore(content),
          template_quality: this.assessTemplateQuality(content, structure)
        },
        usage: {
          popularity_score: 0.5, // Default
          last_updated: new Date().toISOString(),
          version: "1.0.0", // Default
          status: "active" as const
        }
      }
    };
  }

  private generateEmbeddingText(
    type: string,
    variant: string,
    structure: any,
    content: JSONObject,
    semantics: any
  ): string {
    const title = safeString(content.title) || "";
    const description = safeString(content.description) || "";
    
    // Media info
    const mediaInfo = structure.media_position ? 
      `${structure.media_position}-side media` : 
      structure.layout === "grid" ? "grid cards" : "";
    
    // CTA info
    const ctaInfo = structure.cta_count > 0 ? 
      `${structure.cta_count} CTA button${structure.cta_count > 1 ? 's' : ''}` : "";
    
    // Use case
    const useCase = semantics.use_cases[0] || `${variant} section`;

    return [
      title ? `${title}.` : '',
      `${structure.layout} layout${mediaInfo ? ` with ${mediaInfo}` : ''}.`,
      description ? `${description}` : '',
      ctaInfo ? `${ctaInfo}.` : '',
      `Ideal for ${useCase}.`
    ].filter(Boolean).join(' ').trim();
  }

  private generateTags(
    type: string,
    variant: string,
    category: string,
    structure: any,
    content: any,
    semantics: any
  ): string[] {
    const tags: string[] = [];

    // Core tags
    tags.push(`category:${category}`);
    tags.push(`layout:${structure.layout}`);
    tags.push(`variant:${variant}`);
    
    // Structure tags
    if (structure.columns) tags.push(`columns:${structure.columns}`);
    if (structure.media_position) tags.push(`media_position:${structure.media_position}`);
    if (content.cta_count > 0) tags.push(`cta_count:${content.cta_count}`);
    
    // Semantic tags
    semantics.industries.forEach((industry: string) => tags.push(`industry:${industry}`));
    semantics.intents.forEach((intent: string) => tags.push(`intent:${intent}`));
    semantics.funnel_stages.forEach((stage: string) => tags.push(`funnel:${stage}`));
    semantics.use_cases.forEach((useCase: string) => tags.push(`use_case:${useCase}`));
    
    // Quality tags
    tags.push(`complexity:${structure.complexity || 'medium'}`);
    tags.push(`density:${structure.density}`);

    return tags;
  }

  private generateDescription(variant: string, structure: any, content: any): string {
    const layoutDesc = structure.layout === "grid" ? 
      `Grid layout${structure.columns ? ` ${structure.columns} columns` : ''}` :
      structure.layout === "split" ? 
      `Split layout with ${structure.media_position || 'side'} media` :
      "Centered section";
    
    const ctaDesc = content.cta_count > 0 ? 
      ` with ${content.cta_count} CTA button${content.cta_count > 1 ? 's' : ''}` : '';
    
    const purposeDesc = variant.includes('pricing') ? ' for pricing comparison' :
                       variant.includes('testimonial') ? ' featuring testimonials' :
                       variant.includes('features') ? ' showcasing features' :
                       variant.includes('faq') ? ' for FAQ content' : '';

    return `${layoutDesc}${ctaDesc}${purposeDesc}. Responsive and accessible.`;
  }

  // Helper methods for technical analysis
  private extractComponentName(exportName: string): string {
    return exportName.replace(/Preset$/, '');
  }

  private extractUIComponents(content: JSONObject): string[] {
    const components = new Set<string>();
    
    // Infer components from content structure
    if (content.badge) components.add("Badge");
    if (content.title) components.add("Title");
    if (content.description) components.add("Text");
    if (content.buttons || content.buttonText) components.add("Button");
    if (content.image || content.images) components.add("Image");
    
    return Array.from(components);
  }

  private extractIcons(content: JSONObject): string[] {
    const icons: string[] = [];
    
    // Extract icon names from content
    const findIcons = (obj: any): void => {
      if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(value => {
          if (typeof value === 'string' && /^[A-Z][a-zA-Z]*$/.test(value)) {
            // Likely an icon name
            icons.push(value);
          } else if (typeof value === 'object') {
            findIcons(value);
          }
        });
      }
    };

    findIcons(content);
    return [...new Set(icons)];
  }

  private inferComplexity(structure: any, content: any): "simple" | "moderate" | "complex" {
    let score = 0;
    
    if (structure.layout === "grid") score += 1;
    if (structure.layout === "split") score += 0.5;
    if (content.cta_count > 1) score += 1;
    if (Object.keys(content.collections || {}).length > 2) score += 1;
    if (structure.has_gradient) score += 0.5;
    
    if (score >= 2) return "complex";
    if (score >= 1) return "moderate";
    return "simple";
  }

  private inferCustomizationLevel(content: JSONObject): "low" | "medium" | "high" {
    const fields = Object.keys(content).length;
    const collections = Object.values(content).filter(v => Array.isArray(v)).length;
    
    if (fields > 10 || collections > 2) return "high";
    if (fields > 5 || collections > 1) return "medium";
    return "low";
  }

  private calculateContentCompleteness(content: JSONObject): number {
    const requiredFields = ['title', 'description'];
    const optionalFields = ['badge', 'buttonText', 'image'];
    
    const requiredCount = requiredFields.filter(field => content[field]).length;
    const optionalCount = optionalFields.filter(field => content[field]).length;
    
    return (requiredCount * 0.7 + optionalCount * 0.3) / (requiredFields.length * 0.7 + optionalFields.length * 0.3);
  }

  private assessTextQuality(content: JSONObject): "basic" | "good" | "excellent" {
    const title = safeString(content.title) || "";
    const description = safeString(content.description) || "";
    
    if (title.length > 30 && description.length > 100) return "excellent";
    if (title.length > 20 && description.length > 50) return "good";
    return "basic";
  }

  private assessVisualHierarchy(structure: any): "flat" | "structured" | "rich" {
    if (structure.layout === "grid" && structure.density === "high") return "rich";
    if (structure.layout === "split") return "structured";
    return "flat";
  }

  private calculateReusabilityScore(content: JSONObject): number {
    // Higher score for more generic, reusable content
    const genericTerms = ['solution', 'service', 'platform', 'business', 'company'];
    const text = JSON.stringify(content).toLowerCase();
    
    const genericCount = genericTerms.filter(term => text.includes(term)).length;
    return Math.min(genericCount / genericTerms.length, 1);
  }

  private assessTemplateQuality(content: JSONObject, structure: any): "basic" | "production" | "showcase" {
    const completeness = this.calculateContentCompleteness(content);
    const textQuality = this.assessTextQuality(content);
    
    if (completeness > 0.8 && textQuality === "excellent" && structure.layout !== "stack") {
      return "showcase";
    }
    if (completeness > 0.6 && textQuality !== "basic") {
      return "production";
    }
    return "basic";
  }
}

// Main processing functions
const processPresetFile = (absPath: string): QDrantBlockDocument[] => {
  const code = readFileSync(absPath, "utf8");
  const ast = parse(code, BABEL_OPTS);
  const consts = collectTopLevelConsts(ast);
  const exported = findExportedPresetArrays(ast, consts);
  const generator = new QDrantDocumentGenerator();
  const documents: QDrantBlockDocument[] = [];
  const category = basename(dirname(absPath));

  for (const exp of exported) {
    const arr = Array.isArray(exp.value) ? (exp.value as JSONObject[]) : [];
    arr.forEach((entry, i) => {
      if (!isObject(entry)) return;
      
      const type = safeString(entry.type) || "";
      const variant = safeString(entry.variant) || "default";
      
      if (!type) return;

      const document = generator.generateDocument(
        type,
        variant,
        category,
        entry,
        absPath,
        exp.name,
        i
      );
      
      documents.push(document);
    });
  }

  return documents;
};

const walk = (dir: string, fileFilter: (f: string) => boolean, files: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, fileFilter, files);
    else if (fileFilter(name)) files.push(full);
  }
  return files;
};

// Main execution
const main = () => {
  console.log("🚀 Starting universal blocks parser...");
  
  const presetFiles = walk(SRC_DIR, (f) => f.endsWith(".preset.ts"));
  console.log(`📁 Found ${presetFiles.length} preset files`);
  
  const byCategory: Record<string, QDrantBlockDocument[]> = {};
  let totalDocuments = 0;

  for (const file of presetFiles) {
    console.log(`📄 Processing: ${file}`);
    
    try {
      const docs = processPresetFile(file);
      totalDocuments += docs.length;
      
      for (const doc of docs) {
        byCategory[doc.category] = byCategory[doc.category] || [];
        byCategory[doc.category].push(doc);
      }
      
      console.log(`  ✅ Generated ${docs.length} documents`);
    } catch (error) {
      console.error(`  ❌ Error processing ${file}:`, error);
    }
  }

  // Write category files
  for (const [category, docs] of Object.entries(byCategory)) {
    const outFile = join(SRC_DIR, category, `qdrant-${category}.json`);
    writeFileSync(outFile, JSON.stringify(docs, null, 2), "utf8");
    console.log(`💾 Saved ${docs.length} documents to: ${outFile}`);
  }

  // Write combined file
  const allDocs = Object.values(byCategory).flat();
  const allFile = join(SRC_DIR, "qdrant-all.json");
  writeFileSync(allFile, JSON.stringify(allDocs, null, 2), "utf8");
  
  console.log(`🎉 Complete! Generated ${totalDocuments} documents across ${Object.keys(byCategory).length} categories`);
  console.log(`📊 Categories: ${Object.keys(byCategory).join(", ")}`);
  console.log(`💾 Combined file: ${allFile}`);
};

// Execute if run directly  
main();

export { main as generateQDrantDocuments, QDrantDocumentGenerator, UniversalBlockAnalyzer };
