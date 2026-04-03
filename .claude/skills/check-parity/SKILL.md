---
name: check-parity
description: Use this skill when the user asks to "check parity", "check feature parity", "sync with upstream", "compare with eslint", or "what's missing from eslint" in this repository. Checks eslint-plugin-chai-friendly for feature parity with the latest production ESLint no-unused-expressions rule.
disable-model-invocation: true
version: 1.0.0
effort: high
---

# Feature Parity Check: eslint-plugin-chai-friendly vs ESLint upstream

This skill systematically checks whether the fork's `no-unused-expressions` rule is up to date with the latest ESLint production release.

## Context

`eslint-plugin-chai-friendly` forks ESLint's `no-unused-expressions` rule and adds two chai-specific exemptions (`isChaiExpectCall`, `isChaiShouldCall`). The rest of the rule logic should track upstream ESLint. Parity gaps mean users of this plugin get different (usually worse) behavior than the base ESLint rule for non-chai code.

## Process

### Step 1 — Discover the latest ESLint release

Fetch `https://api.github.com/repos/eslint/eslint/releases/latest` and extract `tag_name`.

### Step 2 — Fetch upstream sources at that tag

Fetch both files verbatim (do not summarize):
- `https://raw.githubusercontent.com/eslint/eslint/{tag_name}/lib/rules/no-unused-expressions.js`
- `https://raw.githubusercontent.com/eslint/eslint/{tag_name}/tests/lib/rules/no-unused-expressions.js`

### Step 3 — Read local sources

Read both local files in full:
- `lib/rules/no-unused-expressions.js`
- `tests/lib/rules/no-unused-expressions.js`

### Step 4 — Diff the rule implementation

Compare these four areas systematically. For each, note what's in upstream but missing (or different) in the fork:

#### 4a. Schema options
List every option in `schema[0].properties` in both versions. Flag any option present upstream but absent in the fork, or any default that differs.

#### 4b. `defaultOptions`
Upstream uses a `meta.defaultOptions` array. The fork reads defaults manually with `config.x || false`. Note if `defaultOptions` is missing and what the effective defaults are in each version.

#### 4c. `Checker` node handlers
List every key in the `Checker` object in both versions side by side. Flag any node type present upstream but absent in the fork (especially TypeScript-specific types like `TSAsExpression`, `TSNonNullExpression`, `TSTypeAssertion`, `TSInstantiationExpression`).

#### 4d. `isDirective` / directive logic
Compare how each version determines if an `ExpressionStatement` is a directive prologue. Note any difference in: function signature, use of `node.parent` vs ancestors API, use of `astUtils` imports (which the fork cannot use — it must stay self-contained).

#### 4e. `ExpressionStatement` handler
Compare the final reporting logic. Note any structural differences beyond the chai-specific exemptions.

#### 4f. `meta` fields
Compare `meta.type`, `meta.docs`, `meta.dialects`, `meta.language`, `meta.messages`. Flag fields present upstream but absent in the fork.

### Step 5 — Diff the test suite

Compare test coverage. Report:
- Test cases in upstream `valid` array but absent from the fork's tests (group by feature: `ignoreDirectives`, TypeScript nodes, optional chaining, JSX, directives in static blocks, etc.)
- Test cases in upstream `invalid` array but absent from the fork's tests
- Any second `RuleTester` block (e.g. TypeScript-specific suite) present upstream but absent from the fork

Skip any test cases that test chai-specific behavior unique to this fork.

### Step 6 — Report

Output a structured gap report with four sections:

```
## Gap Report: eslint-plugin-chai-friendly vs ESLint {tag_name}

### Rule Implementation Gaps
For each gap: what it is, what upstream does, what the fork currently does, and the user-visible impact.

### Test Coverage Gaps
List missing test cases grouped by feature area (not line by line — summarize patterns).

### No Action Needed
Items that look different but are intentional (e.g. the fork cannot import `astUtils`, chai exemptions are intentional additions).

### Recommended Priority Order
Ordered list of gaps to address, with rationale.
```

Be precise: quote the relevant code snippets from both sides when describing gaps.
