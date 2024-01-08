module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
            babelrc: false,
            configFile: false,
        },
    },
    extends: ['eslint:recommended'],
    env: {
        node: true
    },
    rules: {
        strict: ['error'],
        indent: ['error', 4]
    }
};
