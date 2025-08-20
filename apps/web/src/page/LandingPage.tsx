"use client";
import {
  createHeroRegistry,
  BlockTreeRenderer
} from "@ui8kit/blocks";

import { skyOSTheme } from "@ui8kit/theme";
import { Play, Rocket, Shield, Zap } from "lucide-react";

import { CenteredHeroPresetSchema } from "../../../../packages/@ui8kit/blocks/schemas/hero/CenteredHero.preset.schema";
import { z } from 'zod';

import heroCenteredJsonContent from "../../../../packages/@ui8kit/blocks/content/hero/CenteredHero.content";
// map schemas to their content arrays so validator can look them up by schema reference
const contentMap = new Map<any, any>([
  [CenteredHeroPresetSchema, heroCenteredJsonContent]
]);

function extractContentSchemaFromZodObject(obj: any) {
  if (!obj || !(obj as any)._def) return undefined;
  const def = (obj as any)._def;
  if (def.typeName !== 'ZodObject') return undefined;
  const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
  if (!shape) return undefined;
  const propsSchema = shape['props'];
  if (!propsSchema || !(propsSchema as any)._def) return undefined;
  const propsDef = (propsSchema as any)._def;
  if (propsDef.typeName !== 'ZodObject') return undefined;
  const propsShape = typeof propsDef.shape === 'function' ? propsDef.shape() : propsDef.shape;
  if (!propsShape) return undefined;
  const contentSchema = propsShape['content'];
  return contentSchema;
}

function validateBlocksContent(...schemas: any[]) {
  for (const schema of schemas) {
    const contents = contentMap.get(schema);
    if (!contents) {
      // eslint-disable-next-line no-console
      console.warn('[validateBlocksContent] No content mapped for schema', schema);
      continue;
    }

    // Validate the whole sample against the preset schema (z.union of variants).
    for (const sample of contents) {
      const result = schema && schema.safeParse ? schema.safeParse(sample) : { success: true };
      if (!result.success) {
        // eslint-disable-next-line no-console
        console.error(`[validateBlocksContent] Validation failed for ${sample.type} variant=${sample.variant}:`);
        const zerr = (result as any).error;
        if (zerr && Array.isArray(zerr.issues)) {
          for (const iss of zerr.issues) {
            const path = Array.isArray(iss.path) ? iss.path.join('.') : String(iss.path);
            // eslint-disable-next-line no-console
            console.error(`  - field: ${path || '<root>'} -> ${iss.message}`);
          }
        } else {
          // eslint-disable-next-line no-console
          console.error(result.error || result);
        }
      } else {
        // eslint-disable-next-line no-console
        console.log(`[validateBlocksContent] OK: ${sample.type} variant=${sample.variant}`);
      }
    }
  }
}

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  rounded: currentTheme.rounded,
  buttonSize: currentTheme.buttonSize,
  py: "xl" as const
}

export const LandingPage = () => {
  const heroRegistry = createHeroRegistry();
  const heroSplitPreset = heroRegistry.findPreset("preset:hero.split:gallery:funding");
  const heroCenteredPreset = heroRegistry.findPreset("preset:hero.centered:simple:launch");

  const blocksTree = [
    {
      type: "hero.centered",
      variant: "withTopButton",
      props: {
        content: heroCenteredJsonContent[1].props.content,
        useContainer: true,
        py: "xl"
      },
    },
    {
      type: "hero.split",
      variant: heroSplitPreset?.variant,
      props: heroSplitPreset?.props
    },
    {
      type: "hero.centered",
      variant: heroCenteredPreset?.variant,
      props: {
        ...(heroCenteredPreset?.props ?? {}),
        content: heroCenteredContent,
        py: theme.py,
        // etc props
      }
    },
    {
      type: "hero.split",
      variant: "security",
      props: {
        content: {
          badge: "Enterprise Security",
          title: "Protect your business with enterprise-grade security",
          description: "Our comprehensive security suite provides advanced threat protection, compliance management, and peace of mind for businesses of all sizes.",
          image: {
            src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            alt: "Security dashboard interface"
          },
          primaryButtonText: "Start Audit",
          secondaryButtonText: "View Features",
          primaryButtonIcon: Shield,
          secondaryButtonIcon: Zap
        },
        useContainer: true,
        py: "xl"
      }
    }
  ] as any;
  
  validateBlocksContent(CenteredHeroPresetSchema);

  return (
    <BlockTreeRenderer registry={heroRegistry as any} tree={blocksTree} />
  );
};

const heroCenteredContent = {
  badge: "Welcome",
  title: "The future of work is here",
  description: "Transform the way your team collaborates with our innovative platform. Built for modern teams who demand flexibility, security, and performance.",
  primaryButtonText: "Get Started Free",
  secondaryButtonText: "Watch Demo",
  primaryButtonIcon: Rocket,
  secondaryButtonIcon: Play
}