# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests (unit + integration)
npm test

# Run unit tests only (with coverage via nyc)
npm run test:unit

# Run unit tests for a specific file
npx mocha tests/lib/rules/no-unused-expressions.js

# Run integration tests
npm run integration-test:all

# Type-check TypeScript definitions
npm run test:types

# Lint
npm run lint
```

## Architecture

This is an ESLint plugin with a single rule: `chai-friendly/no-unused-expressions`.

**`lib/rules/no-unused-expressions.js`** — The rule itself. It's a modified version of ESLint's built-in `no-unused-expressions` rule that adds two chai-specific exemptions:
- `isChaiExpectCall`: Walks the AST upward to find an `expect(...)` call at the root of a member expression chain (e.g. `expect(foo).to.be.true`)
- `isChaiShouldCall`: Walks the AST upward to find a `.should` property access (e.g. `foo.should.be.true`)

Both functions use recursive traversal through `MemberExpression`, `CallExpression`, and `ChainExpression` nodes.

**`lib/index.js`** — Plugin entry point. Exports the plugin object with two configs:
- `recommendedFlat` — For ESLint 9 flat config format
- `recommended` — For legacy `.eslintrc` format

Both configs disable the original `no-unused-expressions` and `@typescript-eslint/no-unused-expressions` rules.

**`tests/lib/rules/no-unused-expressions.js`** — Mocha tests using ESLint's `RuleTester`.

**`examples/`** — Integration test fixtures. `eslint.config.js` configures the plugin; `test.js` and `test-ts-specific.ts` are linted as part of `npm test`.

**Important:** `npm run integration-test:all` intentionally exits with errors. Each example file contains a clearly commented section of lines that are *supposed* to be flagged by the rule (e.g. `foo.bar;`, bare comparisons). These serve as living documentation of invalid usage. A non-zero exit from the integration test command is expected and normal — do not treat it as a regression. Use `npm run test:unit` to verify rule correctness.
