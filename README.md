# @fetchdesigns/theme-toggle

A theme toggle that is both accessible and progressively enhanced to work with and without JavaScript. React Router is currently supported.

## Packages

- **[@fetchdesigns/theme-toggle-core](./packages/core)** - Framework-agnostic theme management core
- **[@fetchdesigns/theme-toggle-react-router](./packages/react-router)** - React Router integration

## Features

- 🌓 Light/Dark theme switching
- 🔄 System theme detection with fallback
- 🚀 SSR-friendly (no flash of wrong theme)
- ⚡ Client-side optimistic updates
- 🎨 Customizable icons and styling
- 📦 Small bundle size
- 🧪 Fully tested

## Development

This is a monorepo managed with pnpm workspaces.

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

### Publishing

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish to npm
pnpm release
```

## License

MIT © Fetch Designs
