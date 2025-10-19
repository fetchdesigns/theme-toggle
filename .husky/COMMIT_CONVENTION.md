# Commit Message Convention

This repository uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent and readable commit history.

## Commit Message Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (optional)

The scope should specify the place of the commit change. For example:
- `feat(core)`: New feature in core package
- `fix(react-router)`: Bug fix in react-router package

### Subject

The subject contains a succinct description of the change:
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end

### Examples

```
feat(core): add dark mode toggle functionality
fix(react-router): resolve theme flashing on page load
docs: update installation instructions
test(core): add tests for storage manager
chore: update dependencies
```

## Git Hooks

This repository uses Husky to manage Git hooks:

### Pre-commit
- Runs tests across all packages to ensure code quality

### Commit-msg
- Validates commit message format using commitlint

### Pre-push
- Runs tests again before pushing to remote to ensure nothing breaks

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass hooks:
```bash
git commit --no-verify -m "your message"
```

However, this is **not recommended** as it bypasses important quality checks.

