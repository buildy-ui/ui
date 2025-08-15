---
description: Whenever you see `ui8kit` or `core ui`, follow this rule.
alwaysApply: false
---
# ui9kit interface composition rule (@ui8kit.mdc)

- **Source of truth — `@ui8kit/core`**: Build UI only from `@ui8kit/core` primitives (`Block`, `Container`, `Grid`, `Stack`, `Text`, `Title`, `Button`, `Card`, `Icon`, etc.). Do not use `className`/`style` or external CSS classes. Exception: third‑party integrations (e.g., resizers) where `className` is unavoidable; such styles must stay neutral and must not bypass design tokens.

- **No decoration inside core**: Core forbids hover shadows, animations, gradients, custom colors, and any decorative effects. Visual polish belongs to templates/brand level only.

- **Architecture (Atomic)**:
  - `@ui` → atoms (primitives)
  - `@components` → molecules
  - `@factory` → organisms/composers
  - `@blocks` → prototypes
  - templates/brand → final assembly

- **Variants via CVA**: Define and extend variants only under `variants`. Components must not duplicate or conflict with these variants; components simply proxy props into CVA.
  - Variants export: [packages/@ui8kit/core/src/core/variants/index.ts](mdc:packages/@ui8kit/core/src/core/variants/index.ts)

- **Theme and tokens**: Use tokens from `@ui8kit/theme` for sizes, radii, shadows, etc. (e.g., `theme.rounded`, `theme.buttonSize`). Colors use shadcn names; any extension should live in a separate tokens file.
  - Theme: [packages/@ui8kit/theme/src/index.ts](mdc:packages/@ui8kit/theme/src/index.ts), example: [packages/@ui8kit/theme/src/themes/skyOS.ts](mdc:packages/@ui8kit/theme/src/themes/skyOS.ts)

- **Width and layout**: Control container width only via `Container` props. Compose layout with `Container`, `Grid`, `Stack`, `Box`, `Block` instead of utility classes.

- **Icons**: Use the `Icon` component with `lucideIcon`. Do not inline SVGs directly.

- **Responsiveness**: Use `@ui8kit/hooks` for responsive branching (e.g., `useMobile`), not custom media classes.
  - Export: [packages/@ui8kit/hooks/src/index.ts](mdc:packages/@ui8kit/hooks/src/index.ts)

- **Comments and code style**: All code comments must be in English. Naming and props should be descriptive and consistent.

## Quick checklist
- Uses only `@ui8kit/core` components without `className`/`style`? (unless an external integration requires it)
- All visual variants come from CVA `variants`, not hardcoded in the component?
- All sizes/radii/colors come from `@ui8kit/theme` tokens and allowed shadcn color names?
- Width is controlled by `Container` props and layout by `Grid`/`Stack`/`Box`?
- Icons via `Icon` + `lucideIcon`?
- Responsive branching via `@ui8kit/hooks`?

## Reference files
- Project memory: [memory.md](mdc:memory.md)
- Core exports: [packages/@ui8kit/core/src/index.ts](mdc:packages/@ui8kit/core/src/index.ts)
- Theme exports: [packages/@ui8kit/theme/src/index.ts](mdc:packages/@ui8kit/theme/src/index.ts)
- Hooks exports: [packages/@ui8kit/hooks/src/index.ts](mdc:packages/@ui8kit/hooks/src/index.ts)
- Compliant examples:
  - [apps/cab/src/page/Dashboard.tsx](mdc:apps/cab/src/page/Dashboard.tsx)
  - [apps/cab/src/components/Sidebar.tsx](mdc:apps/cab/src/components/Sidebar.tsx)
