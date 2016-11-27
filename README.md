# eslint-plugin-chai-friendly

This plugin overrides `no-unused-expressions` to make it friendly towards chai expect statements.
```javascript
// this
expect(foo).to.be.true;

// instead of this
expect(foo).to.be.true; // eslint-disable-line no-unused-expressions
```

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-chai-friendly`:

```
$ npm install eslint-plugin-chai-friendly --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-chai-friendly` globally.

## Usage

Add `chai-friendly` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "chai-friendly"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "no-unused-expressions": 2
    }
}
```

## Supported Rules

* no-unused-expressions





