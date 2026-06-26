# Publishing Guide

## Prerequisites

- Node.js 14+
- npm account ([sign up](https://www.npmjs.com/signup))

## Steps

### 1. Log in to npm

```sh
npm login
```

Enter your username, password, and email when prompted.

### 2. Update the version (optional)

```sh
# Patch (bug fixes) — 1.0.0 → 1.0.1
npm version patch

# Minor (new features, backward-compatible) — 1.0.0 → 1.1.0
npm version minor

# Major (breaking changes) — 1.0.0 → 2.0.0
npm version major
```

### 3. Publish

```sh
npm publish
```

### 4. Verify

Visit `https://www.npmjs.com/package/password-genie` or run:

```sh
npm view password-genie
```

## Updating

Make changes, bump the version, then publish again:

```sh
npm version patch
npm publish
```

## Scoped packages (optional)

If you want to publish under your username scope (e.g. `@yourusername/password-genie`):

1. Change `name` in `package.json` to `@yourusername/password-genie`
2. Run `npm publish --access public`

## Useful commands

| Command                        | Description                |
| ------------------------------ | -------------------------- |
| `npm whoami`                   | Check logged-in user       |
| `npm logout`                   | Log out                    |
| `npm unpublish <pkg>@<ver>`    | Remove a specific version  |
| `npm deprecate <pkg>@<ver> <msg>` | Deprecate a version    |
