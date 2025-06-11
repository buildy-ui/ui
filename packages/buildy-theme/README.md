# @buildy-ui/theme

React theme state management library for utility and semantic CSS approaches.

## Features

- 🎨 **Theme State Management** - Switch between semantic and ui8kit themes
- 💾 **Persistent State** - Theme preferences saved to localStorage
- 🔄 **URL Parameters** - Theme switching via URL parameters
- 🎯 **TypeScript Support** - Full type safety
- 📦 **ESM Ready** - Modern ES modules
- ⚛️ **React Integration** - Context API and hooks
- 🚀 **SSR Support** - Server-side rendering compatible

## Installation

```bash
npm install @buildy-ui/theme
```

## Quick Start

### 1. Wrap Your App

```tsx
import { ThemeProvider } from '@buildy-ui/theme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use Theme State

```tsx
import { useTheme } from '@buildy-ui/theme';

function ThemeToggle() {
  const { current, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {current}</p>
      <button onClick={toggleTheme}>
        Switch to {current === 'semantic' ? 'UI8KIT' : 'Semantic'}
      </button>
    </div>
  );
}
```

### 3. Server-Side Usage

```tsx
import { setTheme, getTheme } from '@buildy-ui/theme';

// Set theme on server
setTheme('semantic');

// Get current theme
const currentTheme = getTheme(); // 'semantic' | 'ui8kit'
```

## API Reference

### React Hooks

```tsx
import { useTheme } from '@buildy-ui/theme';

const { 
  current,      // Current theme: 'semantic' | 'ui8kit'
  isLoading,    // Loading state
  setTheme,     // Set specific theme
  toggleTheme   // Toggle between themes
} = useTheme();
```

### Theme Management

```typescript
import { getTheme, setTheme } from '@buildy-ui/theme';

// Get current theme
const theme = getTheme(); // 'semantic' | 'ui8kit'

// Set theme
setTheme('semantic');
setTheme('ui8kit');
```

### Storage Utilities

```typescript
import { 
  getStoredTheme, 
  storeTheme, 
  getThemeFromUrl, 
  getInitialTheme 
} from '@buildy-ui/theme';

// Get theme from localStorage
const stored = getStoredTheme(); // ThemeType | null

// Store theme in localStorage
storeTheme('semantic');

// Get theme from URL parameter (?theme=semantic)
const urlTheme = getThemeFromUrl(); // ThemeType | null

// Get initial theme (URL > localStorage > default)
const initial = getInitialTheme(); // ThemeType
```

### Constants & Types

```typescript
import { THEME_TYPES, DEFAULT_THEME } from '@buildy-ui/theme';
import type { ThemeType, ThemeState } from '@buildy-ui/theme';

// Available themes
THEME_TYPES.SEMANTIC // 'semantic'
THEME_TYPES.UI8KIT   // 'ui8kit'

// Default theme
DEFAULT_THEME // 'ui8kit'
```

## Server-Side Rendering

For SSR frameworks like Next.js, Remix, or Elysia:

```tsx
import { ThemeProvider, setTheme, getTheme } from '@buildy-ui/theme';

// Set theme from URL parameter
app.use((req, res, next) => {
  const theme = req.query.theme;
  if (theme === 'semantic' || theme === 'ui8kit') {
    setTheme(theme);
  }
  next();
});

// Render with theme
function renderPage() {
  const currentTheme = getTheme();
  
  return (
    <ThemeProvider initialTheme={currentTheme}>
      <App />
    </ThemeProvider>
  );
}
```

## Client-Side Initialization

Include the client script for automatic theme handling:

```html
<script src="node_modules/@buildy-ui/theme/dist/client.js"></script>
```

Or import in your bundle:

```typescript
import '@buildy-ui/theme/dist/client.js';
```

## Theme Switching

### Via URL Parameters
```
https://yoursite.com/?theme=semantic
https://yoursite.com/?theme=ui8kit
```

### Programmatically
```tsx
import { useTheme } from '@buildy-ui/theme';

function MyComponent() {
  const { setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setTheme('semantic')}>
        Semantic Theme
      </button>
      <button onClick={() => setTheme('ui8kit')}>
        UI8KIT Theme
      </button>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## TypeScript

Full TypeScript support with proper type definitions:

```typescript
import type { ThemeType, ThemeState, ThemeAction } from '@buildy-ui/theme';

// Theme type is strictly typed
const theme: ThemeType = 'semantic'; // ✅
const invalid: ThemeType = 'custom'; // ❌ Type error

// State interface
const state: ThemeState = {
  current: 'ui8kit',
  isLoading: false
};
```

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines.
