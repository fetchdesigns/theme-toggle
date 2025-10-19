# Changesets

Hello! 👋

This folder contains changeset files - these describe changes to packages in this monorepo.

## What are changesets?

A changeset is a piece of information about changes made in a branch or commit. It holds three key pieces of information:

1. What packages should be released
2. What version each package should be released at (major, minor, or patch)
3. A changelog entry for the released packages

## How do I create a changeset?

```bash
pnpm changeset
```

Follow the prompts to select packages and describe your changes.

## When should I create a changeset?

Create a changeset whenever you make a change that should be released to users:

- Bug fixes → patch
- New features → minor
- Breaking changes → major

## Learn more

- [Changesets documentation](https://github.com/changesets/changesets)

