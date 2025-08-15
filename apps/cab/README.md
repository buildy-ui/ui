## ui8kit App Starter (CAB)

AI-assisted UI development with the ui8kit stack. Build any interface (CRUD, Auth, Cards, Chats) from business briefs while the agent implements UI/UX and wiring using ui8kit primitives.

### Minimum requirements
- Node.js ≥ 18 (recommended LTS)
- Git
- One of: Bun ≥ 1.1 (recommended) or pnpm ≥ 8 or npm ≥ 9
- Modern browser (Chromium/Firefox/Safari/Edge)

### Stack
- Vite 5 + React 19 + TypeScript 5
- Tailwind CSS 3 (preconfigured via PostCSS)
- ui8kit: `@ui8kit/core`, `@ui8kit/form`, `@ui8kit/theme`, `@ui8kit/hooks`

### Install & run

```bash
# with Bun
bun install
bun run dev

# or with pnpm
pnpm install
pnpm dev

# or with npm
npm install
npm run dev
```

Dev server runs on port 5000 (configured in `vite.config.ts`).

### Tailwind 3 setup (already configured)
- Tailwind and Autoprefixer are enabled via `postcss.config.js`.
- Core styles live in `src/index.css` (Tailwind base/components/utilities imported there).
- Tailwind content paths are configured in `tailwind.config.js`. If you add new source folders, extend the `content` array accordingly.

---

## Typical briefs (short and universal)

1) CRUD (Posts)
- Goal: “I need a posts list with create/edit forms.”
- Entities/fields: Post { title, excerpt, content, tags[], category, slug }.
- Flows:
  - List posts (table), edit in side sheet
  - Create post (form with validation)
  - Save → redirect to list

2) Auth (Login/Register)
- Goal: “Users should sign in and create an account.”
- Flows:
  - Login: email+password (required, validation)
  - Register: name/email/password/agree (required, validation)

3) Cards (Home)
- Goal: “A responsive grid of feature cards with actions.”
- Flows:
  - View cards on desktop and mobile
  - Buttons trigger stub actions or navigation

4) Chats (Text / Image)
- Goal: “Assistant UI with sidebar history.”
- Flows:
  - Text: compose + send, Ctrl/Cmd+Enter submit
  - Image: prompt → generate → preview
  - History in sidebar: titles only (from first words)

See `ui8kit-prompt-app.md` for the universal prompt the agent follows or `ui8kit-chat-app.md` - detailed prompt for assembling AI chats.

---

## Quick start checklist (for users)
1. Describe your goal in 1–2 sentences and list 3–6 steps of the user flow.
2. Pick patterns you need: CRUD, Auth, Cards, Chat and more.
3. Name screens you want (e.g., List, Create, Home, Chat).
4. Define essential inputs/outputs for each step (fields, buttons, expected results).
5. Provide acceptance criteria (below) so the agent can validate by UI behavior.
6. Ensure that all dependencies and imports of base layouts are installed and prepared.
7. Run the app and review the generated UI. Iterate by refining the brief.

---

## Acceptance criteria templates

CRUD
- Create: submitting valid data persists and redirects to list.
- Read: list shows all items with key fields.
- Update: editing updates values and refreshes the row.
- Delete (if present): item removed and list refreshes.
- Validation: required fields show messages; submit disabled or fails with feedback.

Auth
- Login: required fields enforced; invalid shows message; valid logs in (stub or real).
- Register: required fields enforced; agree checkbox required.
- After submit: show success feedback or navigate as specified.

Cards (Home)
- Grid is responsive; cards fit container on mobile and desktop.
- Card action buttons are visible and clickable.

Chats
- New thread appears in sidebar after first send/generate/run, using first words as title.
- Composer: minimal selector on the left, primary action on the right.
- Shortcuts: Ctrl/Cmd+Enter sends where applicable.
- Image: generated preview renders in main area.

---

## ui8kit rules (summary)
- Build only from `@ui8kit/core` + `@ui8kit/form`; use `@ui8kit/theme` tokens; `@ui8kit/hooks` for responsiveness.
- Variants come from `core/variants`; no custom styling except neutral wrappers for 3rd-party.
- Layout with `Container`/`Grid`/`Stack`/`Group`/`Box`; icons via `Icon` + `lucideIcon`.

## Rules and prompt
- [ui8kit.mdc](./ui8kit.md): add your project to the folder `.cursor/rules/ui8kit.mdc`.
- [ui8kit-prompt-app.md](./ui8kit-prompt-app.md): common prompt for different applications.
- [ui8kit-chat-app.md](./ui8kit-chat-app.md): specialized prompt for ai chat applications.