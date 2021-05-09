'use strict';

module.exports = {
    extends: ['eslint:recommended'],
    env: {
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        strict: ['error'],
        indent: ['error', 4]
    }
};
