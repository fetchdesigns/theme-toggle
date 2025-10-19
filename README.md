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

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

#### Workflow

**When developing a feature/fix:**
```bash
# In your feature branch
# 1. Make your code changes
# 2. Create a changeset describing the change
pnpm changeset
# 3. Commit both your code AND the changeset file
git add .
git commit -m "feat: your feature"
```

**When ready to release:**
```bash
# After merging feature branches to main
# 1. Version packages (reads all pending changesets, bumps versions, updates CHANGELOGs)
pnpm version-packages

# 2. Commit the version changes
git add .
git commit -m "chore: release packages"

# 3. Publish to npm
pnpm release

# 4. Push to git
git push
```

## License

MIT © Fetch Designs
