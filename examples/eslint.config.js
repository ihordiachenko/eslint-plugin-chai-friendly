const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const chaiFriendlyPlugin = require('../lib/index');

module.exports = [
  {
    // Do not ignore any files
    ignores: []
  },
  // Base configuration for all files
  {
    files: ['**/*.js'],
    plugins: {
      'chai-friendly': chaiFriendlyPlugin
    },
    rules: {
      'no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': 'error'
    }
  },
  // TypeScript specific configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'chai-friendly': chaiFriendlyPlugin
    },
    rules: {
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': ['error', { allowShortCircuit: false, allowTernary: false }]
    }
  }
];
