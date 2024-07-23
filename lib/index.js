/**
 * @fileoverview This plugin makes `no-unused-expressions` rule friendly towards chai expect statements.
 * @author Ihor Diachenko
 */

const pjs = require('../package.json');

const plugin = {
    meta: {
        name: pjs.name,
        version: pjs.version,
    },
    rules: {
        'no-unused-expressions': require('./rules/no-unused-expressions')
    },
    processors: {},
    configs: {}
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
    // Compatible with ESLint v9 flat configs
    recommendedFlat: {
        name: 'chai-friendly/recommendedFlat',
        plugins: {
            'chai-friendly': plugin
        },
        rules: {
            'chai-friendly/no-unused-expressions': 'error',
            'no-unused-expressions': 'off'
        }
    },

    // Compatible with ESLint <9 eslintrc configs
    recommended: {
        plugins: [
            'chai-friendly'
        ],
        rules: {
            'no-unused-expressions': 0, // disable original rule
            'chai-friendly/no-unused-expressions': 2
        }
    }
},)

module.exports = plugin;
