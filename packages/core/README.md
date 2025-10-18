# @fetchdesigns/theme-toggle-core

Framework-agnostic theme management core for building theme toggle components.

## Installation

```bash
npm install @fetchdesigns/theme-toggle-core
# or
pnpm add @fetchdesigns/theme-toggle-core
```

## Usage

```typescript
import { ThemeManager, CookieStorage } from '@fetchdesigns/theme-toggle-core';

// Create a theme manager with cookie storage
const manager = new ThemeManager(new CookieStorage('theme'));

// Get current theme (from storage or system preference)
const currentTheme = manager.getCurrentTheme(); // 'light' | 'dark'

// Toggle theme
const newTheme = manager.toggleTheme();

// Set specific theme
manager.setTheme('dark');

// Clear saved preference (use system theme)
manager.clearTheme();

// Watch for system theme changes
const unsubscribe = manager.watchSystemTheme((theme) => {
  console.log('System theme changed to:', theme);
});

// Clean up listener
unsubscribe();
```

## API

### `ThemeManager`

Core theme management class.

#### Constructor

```typescript
new ThemeManager(storage: ThemeStorage)
```

#### Methods

- `getSystemTheme(): Theme` - Get system color scheme preference
- `getCurrentTheme(): Theme` - Get current theme (from storage or system)
- `setTheme(theme: Theme): void` - Set and apply theme
- `clearTheme(): void` - Remove stored preference
- `toggleTheme(): Theme` - Toggle between light/dark
- `applyTheme(theme: Theme): void` - Apply theme to DOM
- `watchSystemTheme(callback): () => void` - Watch system theme changes

### Storage Implementations

#### `CookieStorage`

Browser cookie storage adapter.

```typescript
new CookieStorage(cookieName?: string)
```

#### `LocalStorage`

Browser localStorage adapter.

```typescript
new LocalStorage(key?: string)
```

### Types

```typescript
export type Theme = 'light' | 'dark';

export interface ThemeStorage {
  get(): Theme | null;
  set(theme: Theme): void;
  remove(): void;
}
```

## License

MIT © Fetch Designs

