## Goal

Create a new AI-assisted chat app where non-technical users focus on business logic and user flow, while the AI agent focuses on the technical implementation using ui8kit (a.k.a. ui9kit) packages, UI/UX, and the FE stack.

The app must be composed only from `@ui8kit/core` primitives with `@ui8kit/form`, themed by `@ui8kit/theme`, and responsive via `@ui8kit/hooks`. Variants come from `core/variants`. History persists as titles (first words of the first message) in localStorage; message content can remain in-memory.

---

## A) Business brief template (for non-technical users)

Use this as your single prompt to drive the build. Keep it short, business-focused, and outcome-driven.

- Context: Describe the product, audience, and primary goal in 2–3 sentences.
- Chat mode: Choose one per flow
  - Text chat: Q&A or assistant conversation
  - Image generation: prompt-to-image
  - Code interpreter: run simple JS snippets and show output
- User journey: Bullet the 3–5 key steps for a user to complete the task
  - What the user types/selects
  - What result they expect to see
- History behavior: Confirm you only need titles in sidebar (first words of the first message), not full transcripts
- Inputs/controls: List essential controls (e.g., message box, “Generate”, model selector minimal width on the left, submit button on the right)
- Output: What success looks like on screen (message list, image preview, output block)
- Acceptance criteria (business): One sentence each, measurable if possible
  - Example: “A new title appears in the sidebar after the first message.”
  - Example: “Image preview renders within 2 seconds for a small prompt.”
- Constraints and tone: Voice, language, and any compliance constraints

Keep all requests UX-first and domain-driven. Do not request technologies or libraries in this section.

---

## B) Agent operating instructions (for the AI agent)

Follow [ui8kit.mdc](./ui8kit.md) strictly.

- Source of truth: Use only `@ui8kit/core` primitives (`Block`, `Container`, `Grid`, `Stack`, `Group`, `Box`, `Text`, `Title`, `Button`, `Card`, `Icon`, etc.).
- No decoration inside core: Do not add custom hover shadows, gradients, or animations. Visual polish belongs to templates/brand.
- Variants: Only via `core/variants` CVA. Do not reimplement style logic in components.
- Theme tokens: Use `@ui8kit/theme` tokens for sizes/radii and shadcn color names. Icons via `Icon` + `lucideIcon`.
- Responsiveness: Use `@ui8kit/hooks` (`useMobile`) for responsive branching.
- Width/layout: Use `Container`, `Grid`, `Stack`, `Group`, and `Box` props. Avoid ad-hoc `className`/`style` unless required by third-party (e.g., resizable-panels). Keep such classes neutral.

### Shared chat layout
- Use `Chatboard` layout: left resizable sidebar (desktop), right main panel.
- `ChatSidebar`: list of threads; store only titles in localStorage; keys `chat:threads` and `chat:selected`.
- New thread: created on the first send if none selected.

### Context and state
- Use a single chat context provider with APIs:
  - `sendMessage(text)` for text chat
  - `sendImage(prompt, imageUrl)` for image chat
  - `sendCode(code, output)` for code interpreter
  - `createThread`, `selectThread`, `removeThread`, `renewChat`
- Persist only `threads` (id, title, timestamps) in localStorage; keep messages in-memory.

### Text chat
- Messages render as stacked `Block`s, user as `primary`/`primary-foreground`, assistant as `secondary`/`secondary-foreground`.
- Composer: `Textarea` + actions group. Use `Group justify="between"` for modern layout: minimal-width selector on the left, submit on the right.
- Keyboard: `Ctrl/Cmd + Enter` to send.

### Image generation chat
- Integrate via Vite proxy: `/api/pollinations` → `https://image.pollinations.ai` (configured in `vite.config.ts`).
- Composer: `Textarea` + model selector (minimal width on the left) + “Generate” on the right.
- On success, render the image (responsive, rounded) and record to history with `sendImage`.

### Code interpreter chat
- Scope: demo-level JavaScript only
  - Execute with `new Function` in a sandboxed manner for demo (no external deps).
  - Intercept `console.log` to capture output.
- Composer: language selector (left, minimal) + “Run” on the right, code editor as `Textarea`.
- Output: `Block` with title row and result text. Record to history via `sendCode`.

### UI patterns to keep consistent
- Sidebar item: `Box` with border, `Button variant="ghost"` to select, small “Delete” action.
- Composer actions: `Group`, left selector minimal width, right action button `variant="secondary"`, rounded from theme token.
- Select: `SelectTrigger` + `SelectValue` (+ optional chevron) + `SelectContent` with `SelectItem`s, positioned under trigger.

### Routing
- Mount pages under `Chatboard` so sidebar/history are shared:
  - `/chat` → text chat
  - `/chat/image` → image generation
  - `/chat/code` → code interpreter

---

## C) Frontend developer checklist (to maximize agent autonomy)

Prepare the environment so the agent can implement without asking:

- Packages in app aliases:
  - `@ui8kit/core`, `@ui8kit/form`, `@ui8kit/theme`, `@ui8kit/hooks` mapped in `vite.config.ts` to the monorepo sources.
- Theme tokens:
  - Ensure `rounded.default`, `rounded.button`, and `buttonSize.default` exist and are aligned with design.
- Layout:
  - `Chatboard` layout available and exported from `layouts/index.ts`.
  - Sidebar component mounted inside `Chatboard`.
- Routing:
  - Export all pages from `apps/cab/src/page/index.ts`.
  - Add routes in `App.tsx` using `<Chatboard page={Page} />` pattern.
- Dev server proxy:
  - In `apps/cab/vite.config.ts`, add `server.proxy['/api/pollinations']` → `https://image.pollinations.ai` with `rewrite`.
- Context:
  - Provide a shared `ChatProvider` with methods: `sendMessage`, `sendImage`, `sendCode`, `createThread`, `selectThread`, `removeThread`, `renewChat`.
  - Persist only thread titles (first words) in localStorage; avoid persisting messages.
- Forms and controls:
  - `Textarea`, `Input`, minimal `Select` primitives are available.
- Icons:
  - `lucide-react` installed; use via `Icon`.
- QA/acceptance:
  - Business acceptance tests (from section A) documented as a checklist the agent can validate by UI behavior.
  - Optional: add example data/prompts for first-run experiences.

---

## D) Example business prompt (ready-to-use)

“Build a simple onboarding image generator for marketing:
- Mode: Image generation
- Journey: (1) user enters short product description, (2) picks model from a small selector, (3) clicks Generate, (4) sees image preview and a new title in the sidebar.
- History: only the first words of the prompt as a title, stored locally.
- Controls: model selector (minimal width, left), Generate button (right), prompt textarea above.
- Output: responsive image preview inside the main card.
- Tone: friendly and concise English.
- Acceptance: a new sidebar title appears after first Generate; image preview fits in container; UI stays responsive on mobile.”

”The AI agent should implement UI with ui8kit primitives and variants, add routing under Chatboard, wire context methods, and keep decoration minimal per [ui8kit.mdc](./ui8kit.md).”


