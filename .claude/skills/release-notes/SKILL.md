---
name: release-notes
description: Use this skill when the user asks to "generate release notes", "write release notes", or "what changed" for a new version of this package.
disable-model-invocation: true
version: 1.0.0
effort: medium
---

# Generate Release Notes: eslint-plugin-chai-friendly

Generates release notes for a new version, consistent with the repo's established style.

## Style Guide

Releases use a flat bullet list — no section headers like "Features" or "Bug Fixes". Each bullet is one concise sentence describing a user-visible change. Internal refactors, test additions, and doc updates are omitted unless they affect users directly.

Past releases for reference:
- "Added support for optional chaining"
- "Added `enforceForJSX` option"
- "Fixed TypeScript typing issue for `configs.recommendedFlat` and `configs.recommended`"
- "Added ESLint v9 compatibility"

## Process

### Step 1 — Determine the version range

Read `package.json` to get the current version. The release notes cover everything since that version was tagged. If the user specifies a version (e.g. "1.2.0"), use that as the new version number.

### Step 2 — Collect commits since the last release tag

Run:
```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

If no tag exists yet for the previous version, ask the user which commit or tag to diff from.

### Step 3 — Read changed files

For each commit, identify what changed. Focus on:
- `lib/rules/no-unused-expressions.js` — rule behavior changes
- `lib/index.js` — plugin config changes
- `index.d.ts` / type files — TypeScript definition changes
- `package.json` — dependency or engine changes

Read the relevant files to understand the user-visible impact of each change. Do not rely solely on commit messages.

### Step 4 — Fetch existing release titles from GitHub

Fetch `https://github.com/ihordiachenko/eslint-plugin-chai-friendly/releases` and note the existing release titles/styles for consistency.

### Step 5 — Draft release notes

Output in this format:

```
**{version}**

- {change 1}
- {change 2}
- {change 3}
```

Rules:
- Lead each bullet with a verb: "Added", "Fixed", "Improved", "Removed"
- Mention option names in backticks (e.g. `ignoreDirectives`)
- Mention node type names in backticks (e.g. `TSAsExpression`)
- For bug fixes, briefly describe the incorrect behavior that was fixed
- Omit internal changes (refactors, test additions, CI, docs) unless they have a user-visible effect
- Keep the total list to 5 bullets or fewer; combine related changes into one bullet if needed
