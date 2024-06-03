# eslint-plugin-chai-friendly

[![npm](https://img.shields.io/npm/v/eslint-plugin-chai-friendly.svg)](https://www.npmjs.com/package/eslint-plugin-chai-friendly) [![npm](https://img.shields.io/npm/dm/eslint-plugin-chai-friendly)](https://www.npmjs.com/package/eslint-plugin-chai-friendly)

This plugin overrides `no-unused-expressions` to make it friendly towards chai `expect` and `should` statements.

```javascript
// this
expect(foo).to.be.true;
foo.should.be.true;

// instead of this
expect(foo).to.be.true; // eslint-disable-line no-unused-expressions
foo.should.be.true; // eslint-disable-line no-unused-expressions
```

## Installation

You'll first need to install [ESLint](http://eslint.org):

```bash
npm i eslint --save-dev
```

Next, install `eslint-plugin-chai-friendly`:

```bash
npm install eslint-plugin-chai-friendly --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-chai-friendly` globally.

## Usage

Add `chai-friendly` to the plugins section of your  ESLint configuration file. Then disable original `no-unused-expressions` rule and configure chai-friendly replacement under the rules section.

ESLint 9 flat config format:

```js
import pluginChaiFriendly from 'eslint-plugin-chai-friendly';

export default {
    plugins: {'chai-friendly': pluginChaiFriendly},
    rules: {
        "no-unused-expressions": "off", // disable original rule
        "chai-friendly/no-unused-expressions": "error"
    },
};
```

Legacy `.eslintrc` format:

```json
{
    "plugins": [
        "chai-friendly" // you can omit the eslint-plugin- prefix
    ],
    "rules": {
        "no-unused-expressions": 0, // disable original rule
        "chai-friendly/no-unused-expressions": 2
    }
}
```

If you don't need to tweak the above rule settings, you can instead
extend the provided recommended configuration.

ESLint 9 flat config format:

```js
const pluginChaiFriendly = require("eslint-plugin-chai-friendly");

module.exports = [
    pluginChaiFriendly.configs.recommendedFlat,
    // other configurations
]
```

Legacy `.eslintrc` format:


```json
{
  "extends": ["plugin:chai-friendly/recommended"]
}
```

## Options

This rule, in its default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

- `allowShortCircuit` set to `true` will allow you to use short circuit evaluations in your expressions (Default: `false`).
- `allowTernary` set to `true` will enable you to use ternary operators in your expressions similarly to short circuit evaluations (Default: `false`).
- `allowTaggedTemplates` set to `true` will enable you to use tagged template literals in your expressions (Default: `false`).
- `enforceForJSX` set to `true` will flag unused JSX element expressions (Default: `false`).

These options allow unused expressions only if all of the code paths either directly change the state (for example, assignment statement) or could have side effects (for example, function call).

More info in the original rule's [docs](http://eslint.org/docs/rules/no-unused-expressions#options).

## Supported Rules

- `chai-friendly/no-unused-expressions`
