# Theme Toggle by Fetch Designs

A theme toggle that is both accessible and progressively enhanced to work with and without JavaScript. React Router is currently supported.

## Packages

- **[@fetchdesigns/theme-toggle-core](./packages/core)** - Framework-agnostic theme management core
- **[@fetchdesigns/theme-toggle-react-router](./packages/react-router)** - React Router integration

## Examples

See working examples in the [examples/](./examples) directory:

- **[React Router Example](./examples/basic-react-router)** - Minimal setup demonstrating core features ([Live Demo](https://fetchdesigns-theme-toggle.vercel.app/))

## Features

- ♿ Accessible - Keyboard navigation, ARIA labels, semantic HTML
- ✨ Progressive Enhancement - Works with or without JavaScript
- 🚀 SSR-Friendly - No flash of wrong theme on page load
- 🌓 Light/Dark theme switching
- 🔄 System theme detection with fallback
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

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint. Commit messages must follow this format:

```
<type>(<scope>): <subject>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples**:
- `feat(core): add dark mode toggle functionality`
- `fix(react-router): resolve theme flashing on page load`
- `docs: update installation instructions`

See [`.husky/COMMIT_CONVENTION.md`](.husky/COMMIT_CONVENTION.md) for detailed guidelines.

### Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce quality standards:

- **Pre-commit**: Runs tests to ensure code quality
- **Commit-msg**: Validates commit message format
- **Pre-push**: Runs tests before pushing to remote

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
