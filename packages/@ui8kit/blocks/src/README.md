## UI8Kit Blocks — Model · Registry · Slots (Pilot)

This package provides higher-level content blocks built on top of `@ui8kit/core`. The new architecture separates the data model from the visual presentation and introduces a simple registry and a tree renderer. This makes blocks easy to discover, compose, render in DnD editors, and reuse across applications.

### Why this architecture
- **Discoverability**: A central registry exposes block types, variants, and presets (ready-made content configurations).
- **Composability**: Blocks render from a headless model (`BlockNode`) and can be nested via named slots.
- **Portability**: Apps and DnD editors render the same `BlockNode` trees without direct component imports.
- **Extensibility**: Add new blocks by registering a definition; no coupling to specific pages.

---

## Quick Start

### Render with the default registry
```tsx
import { createDefaultBlocksRegistry, BlockTreeRenderer } from "@ui8kit/blocks";

const registry = createDefaultBlocksRegistry();

const preset = registry.findPreset("preset:hero.split:gallery:funding");

const tree = [
  {
    type: "hero.split",
    variant: preset?.variant,
    props: preset?.props
  }
];

export function Page() {
  return <BlockTreeRenderer registry={registry} tree={tree} />;
}
```

### Compose via slots (nest blocks)
```tsx
import { createDefaultBlocksRegistry, BlockTreeRenderer } from "@ui8kit/blocks";

const registry = createDefaultBlocksRegistry();

const tree = [
  {
    type: "hero.split",
    variant: "media",
    props: {
      content: {
        badge: "Composable",
        title: "Compose blocks via slots",
        description: "Media slot below is another block rendered into the hero."
      }
    },
    slots: {
      // Current pilot supports `media` for SplitHero
      media: {
        type: "features.grid",
        variant: "gridMediaCards",
        props: {
          content: {
            badge: "Solutions",
            title: "Media grid",
            description: "Rendered inside hero's media slot.",
            items: [
              { id: "1", title: "Item A", description: "..." },
              { id: "2", title: "Item B", description: "..." }
            ]
          }
        }
      }
    }
  }
];

export function Page() {
  return <BlockTreeRenderer registry={registry} tree={tree} />;
}
```

---

## Concepts

### BlockDefinition
Defines a block type: its name, variants, how to render it, and its presets.

```ts
type BlockVariant = string;

interface BlockDefinition {
  type: "hero.split" | "features.grid"; // unique block type id
  name: string;                             // human name
  variants: BlockVariant[];                 // supported variants
  render: (node: BlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: BlockPreset[];                  // default content configurations
}
```

### BlockNode
Serializable description of a block instance (works great for DnD and dynamic content).

```ts
interface BlockNode {
  id?: string;
  type: "hero.split" | "features.grid";  // registered type
  variant?: BlockVariant;                   // optional variant override
  props?: Record<string, any>;              // component props and content
  slots?: Record<string, BlockNode[] | BlockNode | undefined>; // nested blocks
}
```

### BlockPreset
Named configuration you can list, select in the editor, and instantiate.

```ts
interface BlockPreset {
  id: string;                               // e.g. "preset:hero.split:gallery:funding"
  type: "hero.split" | "features.grid";
  variant?: BlockVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
}
```

### BlocksRegistry
Holds registered blocks and presets; provides discovery and rendering helpers.

```ts
interface BlocksRegistry {
  register(def: BlockDefinition): void;
  get(type: BlockDefinition["type"]): BlockDefinition | undefined;
  list(): BlockDefinition[];
  findPreset(presetId: string): BlockPreset | undefined;
  listPresets(type?: BlockDefinition["type"]): BlockPreset[];
}
```

### BlockTreeRenderer
Small helper that renders a list of `BlockNode` and resolves nested slots. It asks the registry how to render each node and passes pre-rendered slot content into `render` as `renderedSlots`.

---

## Default blocks in this pilot

### hero.split (SplitHero)
- Variants: `media`, `gallery`, `withTopButton`, `leftMedia`, `security`
- Slots (pilot): `media`
- Presets (example): `preset:hero.split:gallery:funding`
- Props shape (content excerpt):

```ts
interface HeroData {
  badge?: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  images?: Array<{ id: string; src: string; alt: string }>;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
  topButton?: { text: string; href?: string };
}
```

### features.grid (GridFeatures)
- Variants: `threeColumns`, `threeColumnsIcons`, `gridMediaCards`, `careerPositions`, `careerStats`
- Slots: none (rendered as a normal block)
- Presets (example): `preset:features.grid:gridMediaCards:solutions`
- Props shape (content excerpt):

```ts
interface GridFeaturesData {
  badge: string;
  title: string;
  description: string;
  items: Array<{
    id: string;
    title?: string;
    description: string;
    image?: { src: string; alt: string };
    lucideIcon?: any;
    stats?: { value: string; label: string };
    location?: string;
    department?: string;
  }>;
}
```

---

## Using presets

```tsx
import { createDefaultBlocksRegistry } from "@ui8kit/blocks";

const registry = createDefaultBlocksRegistry();

// List all presets
const all = registry.listPresets();

// Narrow to a block type
const heroPresets = registry.listPresets("hero.split");

// Find specific preset and instantiate a node
const preset = registry.findPreset("preset:hero.split:gallery:funding");
const node = {
  type: "hero.split",
  variant: preset?.variant,
  props: preset?.props
};
```

---

## DnD integration overview

1) Editor builds/edits a `BlockNode` tree. Each node has a `type`, optional `variant`, `props`, and optional `slots` for children.
2) Renderer traverses the tree and asks the registry how to render each node.
3) Slot values are rendered first, then injected into the block's `render` as `renderedSlots`.
4) You can serialize/deserialize `BlockNode` trees (e.g., to JSON) for storage and transport.

Note: In this pilot, `SplitHero` exposes the `media` slot. More named slots (e.g., `header`, `body`, `actions`) will be added incrementally.

---

## Extending: add your own block

```ts
import { createBlocksRegistry } from "@ui8kit/blocks";
import { createElement } from "react";
import { CenteredCTA } from "@ui8kit/blocks/cta";

const ctaDef = {
  type: "cta.centered" as const,
  name: "Centered CTA",
  variants: ["simple"],
  render: (node) => createElement(CenteredCTA as any, {
    variant: node.variant ?? "simple",
    ...node.props
  }),
  presets: [
    {
      id: "preset:cta.centered:simple",
      type: "cta.centered",
      variant: "simple",
      name: "Simple CTA",
      props: { content: { title: "Try it", description: "Get started in minutes" } }
    }
  ]
};

const registry = createBlocksRegistry();
registry.register(ctaDef);
```

Guidelines:
- Keep the render function purely compositional; use only `@ui8kit/core` primitives/components and approved tokens.
- Prefer presets for editor UX; they serve as examples and starting points.
- Use stable, descriptive type ids (e.g., `feature.grid`, `hero.split`, `cta.centered`).

---

## Migration (from direct imports)

1) Replace direct component imports with registry-based rendering for dynamic areas/pages.
2) For static pages, you can keep direct imports, or gradually move to `BlockNode` trees.
3) Move hardcoded sample content into block presets to improve discoverability.
4) Where you previously customized markup, prefer named slots (when available) or pass-thru props.

Example migration (simplified):

```tsx
// Before (direct import)
import { SplitHero } from "@ui8kit/blocks";

export function Page() {
  return <SplitHero variant="gallery" content={{ title: "...", description: "..." }} />;
}

// After (registry + node)
import { createDefaultBlocksRegistry, BlockTreeRenderer } from "@ui8kit/blocks";

const registry = createDefaultBlocksRegistry();
const node = { type: "hero.split", variant: "gallery", props: { content: { title: "...", description: "..." } } };

export function Page() {
  return <BlockTreeRenderer registry={registry} tree={[node]} />;
}
```

---

## API Reference

- **createDefaultBlocksRegistry()**: returns a registry preloaded with pilot blocks (`hero.split`, `features.grid`) and several presets.
- **BlocksRegistry**:
  - `register(def)` — add your block definition
  - `get(type)` — fetch definition by type id
  - `list()` — list all registered definitions
  - `findPreset(id)` — fetch a preset by id
  - `listPresets(type?)` — list presets, optionally filtered by type
- **BlockTreeRenderer**: React component that renders an array of `BlockNode`.

---

## Notes & limitations (pilot)

- Named slots: currently `SplitHero` supports the `media` slot. Additional slots (`header`, `body`, `actions`) will arrive next.
- The registry in this pilot uses `createElement` internally so it can live in a `.ts` module without JSX.
- Keep visual polish at the blocks/templates level; `@ui8kit/core` stays neutral and token-driven.

---

## Roadmap

- Add more named slots to `SplitBlock` (header/body/actions) and corresponding presenters.
- Expand the default registry with more block types (`cta`, `footer`, `team`, etc.).
- Typed schemas (Zod/TS) and content migrations for versioned blocks.
- CLI tooling for listing/creating/migrating blocks and presets.


