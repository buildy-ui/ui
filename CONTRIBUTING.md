# Contributing

Thanks for your interest in contributing to buildy.tw. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

## About this repository

This repository is a simple bunjs monorepo.

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

## CLI

The `buildy-ui` [package](https://www.npmjs.com/package/buildy-ui) is a CLI for adding components to your project.

Any changes to the CLI should be made in the `packages/cli` directory. If you can, it would be great if you could add tests for your changes.

## CSS Styles via CDN

Components installed via CLI can also use semantic styles through CDN:

```html
<!-- Add semantic CSS styles to CLI-imported components -->
<link rel="stylesheet" href="https://unpkg.com/ui8kit@1.0.1/css/dist/semantic/index.css">
<!-- OR -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/index.css">
<!-- OR -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/button.css">
```

This allows you to:
- Use CLI for component logic and structure
- Apply semantic styling via CDN without additional CSS bundling
- Mix CLI workflow with CDN styling for faster development

```jsx
// CLI-imported component with CDN styling
import { Button } from '@/semantic/ui/button'

// Component will automatically use semantic CSS classes from CDN
<Button className="button button-secondary">Styled Button</Button>
```

**Best Practice**: Install components via CLI for development workflow, add CDN CSS link for instant semantic styling without build configuration.