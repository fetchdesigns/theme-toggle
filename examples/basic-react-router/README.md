# Basic React Router Example

A minimal example demonstrating how to use `@fetchdesigns/theme-toggle-react-router` in a React Router application.

## Getting Started

### Install Dependencies

```bash
cd examples/basic-react-router
pnpm install
```

### Run the Example

```bash
pnpm dev
```

Open the provided URL in your browser.

### Build for Production

```bash
pnpm build
pnpm preview
```

## Key Files for Theme Toggle

```
src/
├── root.tsx       # Add loader and <ThemeScript />
├── routes/
│   └── theme.tsx  # Create action handler
├── components/
│   └── Header.tsx # Add <ThemeToggle /> component
└── app.css        # Define theme CSS variables
```

## Key Implementation Details

### 1. Root Layout (`src/root.tsx`)

```tsx
import { ThemeScript, getThemeFromCookie } from '@fetchdesigns/theme-toggle-react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const theme = await getThemeFromCookie(request);
  return { theme };
}

export default function Root() {
  const { theme } = useLoaderData<typeof loader>();
  
  return (
    <html lang="en" data-theme={theme || undefined}>
      <head>
        <ThemeScript /> {/* Must be before styled content */}
        {/* ...other head elements */}
      </head>
      <body>
        <Header theme={theme} /> {/* Pass theme to components */}
        <Outlet />
      </body>
    </html>
  );
}
```

### 2. Theme Toggle (`src/components/Header.tsx`)

```tsx
import { ThemeToggle } from '@fetchdesigns/theme-toggle-react-router';

<ThemeToggle currentTheme={theme} />
```

### 3. Theme Action Handler (`src/routes/theme.tsx`)

```tsx
export const action = createThemeActionHandler();
```

### 4. Theme Styling (`src/app.css`)
Example uses Tailwind 4 although it's not a requirement.

```css
@import "tailwindcss";

/* Create dark variant for Tailwind utilities */
@variant dark (:root[data-theme="dark"] &);

/* CSS variables for each theme */
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-color: #1d4ed8;
}

:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent-color: #eac263;
}

/* Use variables in your styles */
body {
  background: var(--bg-gradient);
  color: var(--text-primary);
}
```

## Important Implementation Notes

1. **`<ThemeScript />` must be in `<head>`** before any styled content to prevent flash
2. **Pass `theme` from loader to Header** so the toggle knows the current state
3. **Create a `/theme` route** with the action handler to process theme changes
4. **Use `data-theme` attribute on `<html>`** to control theme via CSS

## License

MIT © Fetch Designs

