# Examples

This directory contains working examples demonstrating how to use the `@fetchdesigns/theme-toggle` packages in real applications.

## Available Examples

### [Basic React Router](./basic-react-router/)

A minimal example showing the essential setup for React Router applications.

**What's included:**
- Basic theme toggle implementation
- SSR-friendly setup with no flash
- Cookie-based persistence
- Multiple pages/routes
- Theme-aware CSS with variables

**Run it:**
```bash
cd examples/basic-react-router
pnpm install
pnpm dev
```

### Advanced React Router (Coming Soon)

A more comprehensive example with:
- Custom icons and styling
- Multiple theme options
- Custom cookie configuration
- Advanced CSS techniques
- Analytics integration

## Using Examples in Your Project

Each example is a standalone project you can:

1. **Learn from:** Study the code to understand implementation patterns
2. **Copy:** Use as a starting point for your own project
3. **Test:** Run locally to see features in action

## General Setup Pattern

All examples follow this basic pattern:

1. **Root Layout** - Add `<ThemeScript />` and `data-theme` attribute
2. **Theme Toggle** - Add `<ThemeToggle />` where you want it
3. **Action Route** - Create a route with `createThemeActionHandler()`
4. **Styling** - Use `data-theme` attribute for theme-aware CSS

See individual example READMEs for detailed implementation steps.

## Contributing

Have an idea for a new example? Contributions are welcome! Consider examples for:
- Different styling approaches (Tailwind, styled-components, etc.)
- Different use cases (dashboard, blog, e-commerce, etc.)
- Integration with other tools (analytics, testing, etc.)

## Need Help?

- 📖 [React Router Package README](../packages/react-router/README.md)
- 💬 [Open an Issue](https://github.com/fetchdesigns/theme-toggle/issues)

