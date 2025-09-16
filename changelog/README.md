## Changesets in this monorepo: value and local automation

This repository uses Changesets to manage versions, changelogs, and publishing across many packages (e.g., `@ui8kit/core`, `@ui8kit/form`, `@ui8kit/chat`). We use independent versioning so each package can be released on its own cadence.

### What problems it solves
- **No manual version edits**: you don’t touch each `package.json`. Versions and changelogs are generated from small markdown files under `.changeset/`.
- **Scales to dozens of packages**: pick changed packages interactively, choose bump types, and Changesets updates only what’s needed.
- **Consistent changelogs**: per‑package `CHANGELOG.md` entries are generated from your summaries.
- **Safe internal deps**: with `updateInternalDependencies: "patch"`, dependents are bumped when internal dependencies change.

### Core ideas (mental model)
- **Changeset file**: one markdown file captures the packages being released and their bump types (patch/minor/major) + a summary.
- **Version step**: `changeset version` reads all changeset files, computes new versions from the current ones, updates `package.json` and writes changelogs.
- **Publish step**: `changeset publish` publishes changed packages (only those with new versions).
- **Independent mode**: each package versions independently (no forced lockstep). You can later group some via `linked` if needed.

## Day‑to‑day commands

- Create a changeset (interactive):
```bash
bunx changeset
```

- Apply versions and update changelogs (based on collected changesets):
```bash
bun run version:packages
```

- Build and publish to npm (scripted in this repo):
```bash
bun run release
# Equivalent: bun run version:packages && bun run build && bunx changeset publish
```

- Preview planned releases (dry‑run overview):
```bash
bunx changeset status --since=origin/main | cat
```

## Interactive flow (what you’ll see)

When you run `bunx changeset`, you’ll be prompted like:
```
🦋  Which packages would you like to include? ...
( ) changed packages
  ( ) @ui8kit/brain
  ( ) @ui8kit/hooks
  ( ) @ui8kit/theme
  ( ) @ui8kit/chat
  ( ) @ui8kit/core
  ( ) @ui8kit/flow
  ( ) @ui8kit/form
  ( ) @buildy/dash
  ( ) @buildy/dashboard
```
- Choose **changed packages** to auto‑select packages changed vs the base branch (`main`, set in `.changeset/config.json`).
- Pick **bump type** per package: patch / minor / major.
- Write a short **summary**. That becomes the changelog entry for each selected package.

This creates a file like `.changeset/abc-blue-fix.md`. You do not need to open or edit `package.json` files — `version` will do that for you.

## Local automation superpowers (managing many packages)
- **Centralized bumping**: one interactive flow to select many packages and assign different bump types at once.
- **Auto‑detect changed packages**: the “changed packages” option scans git changes vs `main` (configurable) so you don’t miss anything.
- **Dependent bumps**: internal dependents will be bumped (at least patch) thanks to `updateInternalDependencies`.
- **Dry runs**: `changeset status` shows what would publish — useful before tagging or merging.
- **Pre‑releases**: ship canaries without disturbing `latest`.
- **Composable with Turbo**: build only what changed, use caching, and filter targets when running builds.

## Pre‑releases and dist‑tags
Create a pre‑release channel (e.g., `next`), publish pre versions, then exit pre mode:
```bash
bunx changeset pre enter next
bun run release
bunx changeset pre exit
```
Consumers can install pre versions via the `next` dist‑tag without affecting `latest`.

## Scripts available in this repo
- `bunx changeset` — create a changeset interactively
- `bun run version:packages` — apply versions & write changelogs
- `bun run build` — build all packages via Turbo
- `bun run release` — version → build → publish (npm)

## FAQ
- **Does it read current versions automatically?** Yes. `changeset version` reads current `package.json` versions and writes new ones. No manual edits per package.
- **Do I have to tag each package myself?** No. `changeset publish` handles packages that received version bumps.
- **Can I include a package even if it didn’t change on disk?** Yes — manually select it in the interactive list and choose a bump.
- **Can I group some packages to version together later?** Yes — use `linked` groups in `.changeset/config.json` (we currently use independent mode for flexibility).

## References
- Changesets: https://github.com/changesets/changesets
- Our config: `.changeset/config.json` (baseBranch `main`, `updateInternalDependencies: "patch"`)


