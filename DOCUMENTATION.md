# password-genie-cli — Project Documentation

> Complete 5-page engineering documentation. Part of the Alivelyyy coding-history dossier (generated 2026-10-18).

## password-genie-cli

> **The only packaged-and-published library in the portfolio**: a zero-dependency password generator with a CLI binary, an XKCD-style passphrase generator, password nuance analysis, and Jest tests. Published to npm as `password-genie-cli@2.0.2`, CLI command `password-genie`. MIT.

| Fact | Value |
|---|---|
| GitHub URL | https://github.com/Alivelyyy/password-genie-cli |
| Visibility | Public (1 star, MIT) |
| Created / pushed | 2026-06-26 |
| Package | `password-genie-cli` v2.0.2 on npm (bin: `password-genie`) |
| Primary language | JavaScript (Node.js, CommonJS) |
| Total files | 5 (`index.js`, `test.js`, `README.md`, LICENSE, package.json) |
| Category | Developer tooling / npm library |

### 📄 Page 1 — Overview & Purpose

`password-genie-cli` is a small but *professional-shaped* project: the repository is structured like a real npm package (double-layered identity as both CLI and importable library), has semantic versioning (2.0.2), a focused README with API tables, Jest-based tests, and an MIT license. For a portfolio, its value is disproportional to its size — it proves the developer understands packaging, publishing, and public API design, not just app-building.

The problem solved is universal: generating random, unique passwords honoring user-defined length and complexity constraints, plus human-memorable passphrases. Where it goes beyond the typical tutorial generator: `excludeSimilar` (`0O1lI` ambiguity stripping), custom exclusion strings, multi-password batch generation, and an `analyze()` helper — a small security-awareness API surface.

Repo creation (2026-06-26) places it between the Vyrixe commerce sprint (May–June) and the FateSB/shadow client work (July) — a "quick win" tool the developer built and shipped as a **published library**, unusual for a self-taught portfolio of this era and a strong resume differentiator.

### 📄 Page 2 — Technology Stack & Architecture

**Dependencies**: none at runtime — pure Node.js standard crypto/string handling, meaning it runs anywhere Node runs (works in locked-down environments). The `package.json` shows a self-referential dependency `"password-genie-cli": "^2.0.1"` (an artifact of publishing/testing the package against itself) and `jest@^29` for dev. Engine-free code style favors CommonJS (`main: index.js`), maximizing compatibility with older Node consumers.

**Package layout**:

```
password-genie-cli/
├── index.js        # Library core: generate, generateMultiple, generatePassphrase, analyze
├── test.js         # Jest test suite
├── package.json    # name/bin/main/scripts; bin: { "password-genie": "./index.js" }
├── LICENSE         # MIT
└── README.md       # API documentation with tables
```

**Dual interface pattern**: `require('password-genie-cli')` exposes the library API; the same `index.js` doubles as the CLI executable via the `bin` mapping — a classic, clever node packaging trick; `npx password-genie-cli` works with no install. The README documents install (`npm i password-genie-cli`) and every function signature with parameter tables.

### 📄 Page 3 — Features & Functionality

**`generate(length, options)`** — returns one password string. Options: `uppercase` (include A–Z), `numbers` (0–9), `specialChars`, `excludeSimilar` (strips `0O1lI`-class lookalikes), `exclude` (arbitrary charset removal). Defaults documented in the README table: each flag `false`, `exclude: ''`.

**`generateMultiple(count, length, options)`** — returns an array of *unique* passwords for batch workflows (provisioning scripts, test fixtures).

**`generatePassphrase(options)`** — XKCD-1361-style word-based passphrases: `words` (default 4), `separator` (default `-`), `capitalize` (default true). Tradable memorability vs entropy for humans.

**`analyze(...)`** — an analysis helper (exported alongside the generators per the README API line `const { generate, generateMultiple, generatePassphrase, analyze } = require('password-genie-cli')`), enabling callers to inspect strength/properties of generated or user-supplied passwords.

**CLI usage** — via `password-genie` binary after install or `npx` for one-offs; the README's examples show both library and option-driven generation, e.g. `generate(16, { uppercase: true, numbers: true, specialChars: true })` and excluding custom symbols like `!@#`.

**Test coverage** — `test.js` with Jest (`npm test`), giving the package a regression net rare in personal projects of this size.

### 📄 Page 4 — Code Internals & Systems Design

Design principles visible despite only five files: (1) **Option-table API** — every parameter has documented type, default, and description, making the public surface predictable; (2) **Feature flags over modes** — complexity is composed from booleans rather than separate functions per combination, keeping the matrix small; (3) **Uniqueness enforcement** in `generateMultiple` (the promise of "unique passwords" implies collision checking against already-produced items); (4) **Charset algebra** — the generator builds its charset by adding class sets (upper/lower/digits/specials) then *subtracting* lookalikes and user exclusions, so `excludeSimilar` and `exclude` compose cleanly; (5) **Single-file core** — all four exports in `index.js` with the CLI entry sharing the file, eliminating drift between the library and CLI paths.

The `bin` + `main` unification means the CLI is literally "the library executed"; argument parsing maps flags onto the same options object the API uses — one code path, two interfaces. Publishing version 2.0.2 implies an earlier 1.x with a breaking change (likely the options-object refactor from positional args), evidence of maintaining semver discipline in the wild.

Operationally the package is dependency-free, side-effect-free, and synchronous — the ideal shape for a utility package: no postinstall scripts, no network, instantly auditable source (~one screen per function). For the dossier, the interesting fact is *distribution*: this is the developer's only npm-registry artifact, demonstrating he can ship to public registries, not only to Vercel.

### 📄 Page 5 — Development Timeline, Skills & Resume Highlights

**Timeline**: single-day-shaped repo (created and pushed 2026-06-26) at published version 2.0.2 — suggesting active iteration before/around publication, in the middle of the summer 2026 tooling streak (between Vyrixe's June 30 hardening sprint and FateSB/shadow in July). The choice to spend a day polishing and publishing a CLI generator shows portfolio maturity: a small, complete, public artifact balances the many private repos in the account.

**Skills demonstrated**: npm publishing workflow (semver, README-as-docs, LICENSE); Node.js library API design; CLI/library dual packaging; option-object pattern design; Jest unit testing; cryptographic randomness usage; technical documentation (parameter tables); charset/entropy reasoning (similar-character exclusion, passphrases).

**Resume bullets**:
- Designed, tested, and **published an npm package** (`password-genie-cli`) exposing a dual CLI/library API for password and XKCD passphrase generation with composable complexity options and character-exclusion controls.
- Wrote Jest tests and complete API documentation; achieved a zero-dependency, side-effect-free design compatible across Node versions.
- Applied security-UX thinking: similar-character exclusion (`0O1lI`), custom charset subtraction, batch-unique generation, and password analysis helpers.

**Limitations / future work**: the self-dependency entry in `package.json` should be cleaned; no TypeScript types (`index.d.ts`) shipped; analysis function scope is narrow; adding entropy estimates and zxcvbn-style scoring would be natural v3 features.
