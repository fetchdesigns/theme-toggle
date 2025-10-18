# @fetchdesigns/theme-toggle-react-router

A theme toggle that is both accessible and follows progressive enhancement best practices. React Router is currently supported.

## Features

- 🌓 Light/Dark theme switching
- 🔄 System theme detection with fallback
- 🚀 SSR-friendly (no flash of wrong theme)
- ⚡ Client-side optimistic updates
- ♿ Accessible
- 📈 Progressive enhancement (works with and without JavaScript)
- 🎨 Customizable icons and styling
- 📦 Small bundle size

## Installation

```bash
npm install @fetchdesigns/theme-toggle-react-router
# or
pnpm add @fetchdesigns/theme-toggle-react-router
```

## Quick Start

### 1. Add ThemeScript to your root layout
This sets your `data-theme="light/dark"` attribute in your `<html>` tag.

```tsx
// app/root.tsx
import { ThemeScript, getThemeFromCookie } from '@fetchdesigns/theme-toggle-react-router'; // ← Import
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = await getThemeFromCookie(request); // ← Get theme from cookie
  return { theme };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>();
  
  return (
    <html lang="en" data-theme={theme || undefined}> {/* ← Add data-theme attribute */}
      <head>
        <ThemeScript /> {/* ← Add before CSS loads */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

### 2. Add theme toggle to your UI
Add `<ThemeToggle>` anywhere you want it to appear in your site.

```tsx
// app/components/Header.tsx
import { ThemeToggle } from '@fetchdesigns/theme-toggle-react-router'; // ← Import
import { useLoaderData } from 'react-router';

export default function Header() {
  const { theme } = useLoaderData<typeof loader>();
  
  return (
    <header>
      <nav>
        {/* Your nav items */}
        <ThemeToggle currentTheme={theme} /> {/* ← Add toggle */}
      </nav>
    </header>
  );
}
```

### 3. Create theme action route

Create a route file for handling theme changes (required for progressive enhancement).

**Default route:** `/theme`

```tsx
// app/routes/theme.tsx
import { createThemeActionHandler } from '@fetchdesigns/theme-toggle-react-router'; // ← Import

export const action = createThemeActionHandler(); // ← One line setup!
```

That's it! The handler automatically:
- ✅ Validates theme values
- ✅ Sets the cookie
- ✅ Redirects back to the referring page
- ✅ Enables progressive enhancement (works without JavaScript)

**Custom route name:** You can use any route path you want:

```tsx
// app/routes/switch-theme.tsx  ← Custom route name
import { createThemeActionHandler } from '@fetchdesigns/theme-toggle-react-router';

export const action = createThemeActionHandler();
```

Then pass the custom route to the toggle:

```tsx
<ThemeToggle currentTheme={theme} action="/switch-theme" />
```

**Other options:**

```tsx
export const action = createThemeActionHandler({
  cookieName: 'myCustomTheme',  // Use custom cookie name
  defaultRedirect: '/home',      // Redirect here if no referrer
});
```

### 4. Configure Styling

The ThemeToggle component comes with default Tailwind styles. You have three options:

#### Option A: Use with Tailwind

Add the package to your Tailwind content paths so the classes are generated:

```js
// tailwind.config.js
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@fetchdesigns/theme-toggle-react-router/dist/**/*.{js,cjs}', // ← Add this
  ],
  // ... rest of config
}
```

**💡 Tip: Enable Tailwind's `dark:` utilities**

To use Tailwind's `dark:` utilities (like `dark:bg-gray-800`) with the `data-theme` attribute, configure the `darkMode` setting:

```js
// tailwind.config.js
export default {
  darkMode: ['variant', [  // ← Add this
    ':root[data-theme="dark"] &',
    '@media (prefers-color-scheme: dark) { :root:not([data-theme]) & }'
  ]],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@fetchdesigns/theme-toggle-react-router/dist/**/*.{js,cjs}',
  ],
  // ... rest of config
}
```

This enables dark mode in two scenarios:
- ✅ When `data-theme="dark"` is set (explicit user preference)
- ✅ When system prefers dark mode AND no `data-theme` is set (system preference fallback)

Now you can use `dark:` utilities throughout your app:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to theme
</div>

<ThemeToggle 
  currentTheme={theme}
  classes={{
    button: 'bg-slate-100 dark:bg-slate-800 border-gray-300 dark:border-gray-600',
    slidingCircle: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
  }}
/>
```

**Customize with your theme colors:**

```tsx
<ThemeToggle 
  currentTheme={theme}
  classes={{
    button: 'border-blue-300 hover:border-blue-500 bg-slate-100 text-slate-900',
    slidingCircle: 'bg-white text-gray-900'
  }}
/>
```

#### Option B: Use Without Tailwind

Disable default styles and provide your own:

```tsx
<ThemeToggle 
  currentTheme={theme}
  useDefaultStyles={false}
  classes={{
    button: 'my-theme-toggle-btn',
    slidingCircle: 'my-toggle-circle'
  }}
/>
```

Then style with your own CSS:

```css
.my-theme-toggle-btn {
  display: inline-flex;
  padding: 0;
  border-radius: 9999px;
  /* ... your styles */
}
```

#### Option C: Import Standalone CSS (Coming Soon)

A pre-compiled CSS file will be available for non-Tailwind projects:

```tsx
import '@fetchdesigns/theme-toggle-react-router/dist/styles.css'
```

### 5. Add Theme CSS Variables

Your CSS should use the `data-theme` attribute for theming:

```css
:root[data-theme="light"] {
  --bg: #ffffff;
  --text: #000000;
}

:root[data-theme="dark"] {
  --bg: #000000;
  --text: #ffffff;
}

/* System preference fallback */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --bg: #000000;
    --text: #ffffff;
  }
}
```

## API

### `<ThemeToggle>`

Main component for theme switching.

#### Props

```typescript
interface Props {
  currentTheme: Theme | null;  // Theme from server cookie
  icons?: {
    light?: React.ReactNode;   // Custom light theme icon
    dark?: React.ReactNode;    // Custom dark theme icon
  };
  className?: string;          // Custom CSS class for button (legacy, use classes.button)
  classes?: {                  // Granular class overrides for specific elements
    form?: string;
    button?: string;
    container?: string;
    neutralIconWrapper?: string;
    activeContainer?: string;
    slidingCircle?: string;
    iconInner?: string;
  };
  useDefaultStyles?: boolean;  // Use default Tailwind styles (default: true)
  cookieName?: string;         // Cookie name (default: 'theme')
  action?: string;             // API endpoint (default: '/theme')
}
```

#### Examples

**Custom Icons:**

```tsx
<ThemeToggle 
  currentTheme={theme}
  icons={{
    light: <MyCustomSunIcon />,
    dark: <MyCustomMoonIcon />,
  }}
/>
```

**Custom Route:**

```tsx
<ThemeToggle 
  currentTheme={theme}
  action="/switch-theme"  // Use custom route path
/>
```

**Custom Styling (Tailwind):**

```tsx
<ThemeToggle 
  currentTheme={theme}
  classes={{
    button: 'border-blue-300 hover:border-blue-500 bg-slate-100',
    slidingCircle: 'bg-white text-gray-900 shadow-lg'
  }}
/>
```

**Custom Styling (No Tailwind):**

```tsx
<ThemeToggle 
  currentTheme={theme}
  useDefaultStyles={false}
  classes={{
    button: 'my-theme-btn',
    slidingCircle: 'my-slider'
  }}
/>
```

**Granular Element Targeting:**

```tsx
<ThemeToggle 
  currentTheme={theme}
  classes={{
    form: 'inline-block',                    // Form wrapper
    button: 'custom-button-class',           // Button element
    container: 'custom-container',           // Neutral state container
    neutralIconWrapper: 'custom-icon-wrap',  // Icon wrappers (neutral)
    activeContainer: 'custom-active',        // Active state container
    slidingCircle: 'custom-circle',          // Sliding toggle circle
    iconInner: 'custom-icon-inner'           // Inner icon wrapper
  }}
/>
```

**All Options:**

```tsx
<ThemeToggle 
  currentTheme={theme}
  icons={{
    light: <MyCustomSunIcon />,
    dark: <MyCustomMoonIcon />,
  }}
  classes={{
    button: 'custom-button-class',
    slidingCircle: 'custom-circle-class'
  }}
  useDefaultStyles={true}
  cookieName="myTheme"
  action="/api/toggle-theme"
/>
```

### `<ThemeScript>`

Inline script to prevent flash of wrong theme. Place in `<head>`.

#### Props

```typescript
interface Props {
  cookieName?: string;  // Cookie name to read (default: 'theme')
}
```

### Route Handler

#### `createThemeActionHandler(options?)`

Creates an action handler for the theme route. This enables progressive enhancement - the theme toggle works even without JavaScript.

**Parameters:**

```typescript
interface ThemeActionOptions {
  cookieName?: string;       // Cookie name (default: 'theme')
  defaultRedirect?: string;  // Fallback redirect (default: '/')
}
```

**Example:**

```typescript
// app/routes/theme.tsx
import { createThemeActionHandler } from '@fetchdesigns/theme-toggle-react-router';

// Basic usage
export const action = createThemeActionHandler();

// With options
export const action = createThemeActionHandler({
  cookieName: 'myTheme',
  defaultRedirect: '/home',
});
```

### Server Utilities

#### `createThemeCookie(cookieName?)`

Create a theme cookie adapter with custom name.

```typescript
const themeCookie = createThemeCookie('my-theme');

// In loader
const theme = await themeCookie.getTheme(request);

// In action
const header = await themeCookie.setTheme('dark');
```

#### `getThemeFromCookie(request)`

Get theme from request (uses default cookie name).

```typescript
const theme = await getThemeFromCookie(request);
// Returns: 'light' | 'dark' | null
```

#### `createThemeCookieHeader(theme)`

Create Set-Cookie header (uses default cookie name).

```typescript
const header = await createThemeCookieHeader('dark');
```

## Styling Guide

The component uses Tailwind CSS classes by default. To customize:

### Option 1: Override with className

```tsx
<ThemeToggle 
  currentTheme={theme}
  className="my-custom-styles"
/>
```

### Option 2: Use CSS Variables

Define these in your CSS:

```css
.your-toggle {
  --input-border: #ccc;
  --input-bg: #fff;
  --input-color: #000;
  --button-bg: #000;
  --button-color: #fff;
}
```

## How It Works

1. **Server-Side:** `getThemeFromCookie()` reads the theme preference from cookie
2. **Head Script:** `<ThemeScript>` runs before CSS loads and sets `data-theme` attribute
3. **Component:** `<ThemeToggle>` shows neutral state (both icons) when no preference exists
4. **Client-Side:** After JS loads, detects actual theme and updates UI
5. **Interaction:** Clicking toggle updates immediately (optimistic) and saves to server

## TypeScript

Full TypeScript support included.

```typescript
import type { Theme } from '@fetchdesigns/theme-toggle-react-router';
```

## License

MIT © Fetch Designs

